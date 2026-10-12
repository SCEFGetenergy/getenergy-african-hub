CREATE TABLE public.electricity_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_reference text NOT NULL UNIQUE,
  request_id text NOT NULL UNIQUE,
  user_id uuid,
  service_id text NOT NULL,
  disco_label text NOT NULL,
  meter_type text NOT NULL CHECK (meter_type IN ('prepaid','postpaid')),
  meter_number text NOT NULL,
  customer_name text,
  customer_address text,
  amount_ngn integer NOT NULL,
  min_amount_ngn integer NOT NULL DEFAULT 1000,
  phone text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'awaiting_payment' CHECK (status IN ('awaiting_payment','paid','vending','delivered','pending','failed','refunded','needs_review','vend_blocked')),
  gateway text NOT NULL,
  gateway_reference text UNIQUE,
  paid_amount_ngn integer,
  paid_at timestamptz,
  vend_attempted_at timestamptz,
  pending_since timestamptz,
  vtpass_code text,
  vtpass_transaction_id text,
  token text,
  units text,
  customer_message text,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.electricity_orders TO authenticated;
GRANT ALL ON public.electricity_orders TO service_role;
ALTER TABLE public.electricity_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own orders" ON public.electricity_orders FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE INDEX ON public.electricity_orders(status, pending_since);

CREATE TABLE public.electricity_order_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.electricity_orders(id) ON DELETE CASCADE,
  source text NOT NULL,
  event text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.electricity_order_events TO authenticated;
GRANT ALL ON public.electricity_order_events TO service_role;
ALTER TABLE public.electricity_order_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin events" ON public.electricity_order_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.electricity_refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL UNIQUE REFERENCES public.electricity_orders(id) ON DELETE CASCADE,
  amount_ngn integer NOT NULL,
  reason text NOT NULL,
  gateway_refund_reference text,
  status text NOT NULL DEFAULT 'requested',
  raw jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.electricity_refunds TO authenticated;
GRANT ALL ON public.electricity_refunds TO service_role;
ALTER TABLE public.electricity_refunds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin refunds" ON public.electricity_refunds FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.electricity_rate_limits (
  bucket text NOT NULL,
  window_start timestamptz NOT NULL,
  hits integer NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket, window_start)
);
GRANT ALL ON public.electricity_rate_limits TO service_role;
ALTER TABLE public.electricity_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.electricity_disco_live (
  service_id text PRIMARY KEY,
  label text NOT NULL,
  confirmed_live boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.electricity_disco_live TO anon, authenticated;
GRANT UPDATE ON public.electricity_disco_live TO authenticated;
GRANT ALL ON public.electricity_disco_live TO service_role;
ALTER TABLE public.electricity_disco_live ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON public.electricity_disco_live FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin update" ON public.electricity_disco_live FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER electricity_disco_live_audit AFTER UPDATE ON public.electricity_disco_live FOR EACH ROW EXECUTE FUNCTION public.write_audit();
INSERT INTO public.electricity_disco_live(service_id,label) VALUES
('abuja-electric','AEDC — Abuja'),('benin-electric','BEDC — Benin'),('eko-electric','EKEDC — Eko'),('enugu-electric','EEDC — Enugu'),('ibadan-electric','IBEDC — Ibadan'),('ikeja-electric','Ikeja Electric'),('jos-electric','JED — Jos'),('kaduna-electric','KAEDCO — Kaduna'),('kano-electric','KEDCO — Kano'),('portharcourt-electric','PHED — Port Harcourt'),('yola-electric','YEDC — Yola'),('aba-electric','Aba Power');

-- Atomic rate limiter (server only)
CREATE OR REPLACE FUNCTION public.electricity_hit_rate_limit(p_bucket text, p_limit integer, p_window_seconds integer)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_start timestamptz := to_timestamp(floor(extract(epoch FROM now()) / p_window_seconds) * p_window_seconds); v_hits integer;
BEGIN
  INSERT INTO public.electricity_rate_limits(bucket, window_start, hits) VALUES (p_bucket, v_start, 1)
  ON CONFLICT (bucket, window_start) DO UPDATE SET hits = electricity_rate_limits.hits + 1 RETURNING hits INTO v_hits;
  DELETE FROM public.electricity_rate_limits WHERE window_start < now() - interval '1 day';
  RETURN v_hits <= p_limit;
END $$;
REVOKE ALL ON FUNCTION public.electricity_hit_rate_limit(text,integer,integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.electricity_hit_rate_limit(text,integer,integer) TO service_role;

-- Atomic claim: lock the order for a single vend
CREATE OR REPLACE FUNCTION public.electricity_claim_vend(p_order_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_ok boolean;
BEGIN
  UPDATE public.electricity_orders SET status = 'vending', vend_attempted_at = now(), updated_at = now()
  WHERE id = p_order_id AND status = 'paid' AND vend_attempted_at IS NULL RETURNING true INTO v_ok;
  RETURN coalesce(v_ok, false);
END $$;
REVOKE ALL ON FUNCTION public.electricity_claim_vend(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.electricity_claim_vend(uuid) TO service_role;
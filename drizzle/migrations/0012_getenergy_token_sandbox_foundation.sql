CREATE SEQUENCE public.electricity_request_reference_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE public.electricity_transaction_reference_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE public.electricity_token_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_reference text NOT NULL UNIQUE,
  user_id uuid,
  full_name text NOT NULL,
  disco text NOT NULL,
  meter_type text NOT NULL,
  meter_number text NOT NULL,
  amount_ngn integer NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  state text NOT NULL,
  city_lga text NOT NULL,
  preferred_contact_method text NOT NULL,
  consent_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'New',
  admin_notes text,
  assigned_to uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT electricity_token_requests_disco_check CHECK (disco IN ('Eko Electricity Distribution Company','Ikeja Electric','Ibadan Electricity Distribution Company','Abuja Electricity Distribution Company','Benin Electricity Distribution Company','Port Harcourt Electricity Distribution Company','Enugu Electricity Distribution Company','Jos Electricity Distribution Company','Kaduna Electric','Kano Electricity Distribution Company','Yola Electricity Distribution Company','Aba Power')),
  CONSTRAINT electricity_token_requests_meter_type_check CHECK (meter_type IN ('Prepaid','Postpaid')),
  CONSTRAINT electricity_token_requests_status_check CHECK (status IN ('New','Contacted','In Review','Pending Partner Integration','Waiting for Customer','Closed','Converted to Customer')),
  CONSTRAINT electricity_token_requests_contact_check CHECK (preferred_contact_method IN ('Phone','WhatsApp','Email')),
  CONSTRAINT electricity_token_requests_amount_check CHECK (amount_ngn BETWEEN 1000 AND 10000000)
);
GRANT SELECT, UPDATE ON public.electricity_token_requests TO authenticated;
GRANT ALL ON public.electricity_token_requests TO service_role;
ALTER TABLE public.electricity_token_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners and admins read electricity requests" ON public.electricity_token_requests FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage electricity requests" ON public.electricity_token_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
GRANT UPDATE (status, admin_notes, assigned_to, updated_at) ON public.electricity_token_requests TO authenticated;
CREATE INDEX electricity_token_requests_created_idx ON public.electricity_token_requests (created_at DESC);
CREATE INDEX electricity_token_requests_status_idx ON public.electricity_token_requests (status);

CREATE TABLE public.electricity_saved_meters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  label text NOT NULL CHECK (length(trim(label)) BETWEEN 1 AND 80),
  disco text NOT NULL,
  meter_number text NOT NULL,
  meter_type text NOT NULL CHECK (meter_type IN ('Prepaid','Postpaid')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, disco, meter_number),
  CONSTRAINT electricity_saved_meters_disco_check CHECK (disco IN ('Eko Electricity Distribution Company','Ikeja Electric','Ibadan Electricity Distribution Company','Abuja Electricity Distribution Company','Benin Electricity Distribution Company','Port Harcourt Electricity Distribution Company','Enugu Electricity Distribution Company','Jos Electricity Distribution Company','Kaduna Electric','Kano Electricity Distribution Company','Yola Electricity Distribution Company','Aba Power'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.electricity_saved_meters TO authenticated;
GRANT ALL ON public.electricity_saved_meters TO service_role;
ALTER TABLE public.electricity_saved_meters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners read saved electricity meters" ON public.electricity_saved_meters FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners add saved electricity meters" ON public.electricity_saved_meters FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Owners update saved electricity meters" ON public.electricity_saved_meters FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Owners delete saved electricity meters" ON public.electricity_saved_meters FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.electricity_meter_verification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  disco text NOT NULL,
  meter_number text NOT NULL,
  meter_type text NOT NULL CHECK (meter_type IN ('Prepaid','Postpaid')),
  api_provider text NOT NULL DEFAULT 'sandbox_mock',
  customer_name text NOT NULL,
  customer_address text,
  tariff_class text,
  minimum_amount_ngn integer NOT NULL DEFAULT 1000,
  verification_status text NOT NULL DEFAULT 'simulated',
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT electricity_verification_disco_check CHECK (disco IN ('Eko Electricity Distribution Company','Ikeja Electric','Ibadan Electricity Distribution Company','Abuja Electricity Distribution Company','Benin Electricity Distribution Company','Port Harcourt Electricity Distribution Company','Enugu Electricity Distribution Company','Jos Electricity Distribution Company','Kaduna Electric','Kano Electricity Distribution Company','Yola Electricity Distribution Company','Aba Power')),
  CONSTRAINT electricity_verification_status_check CHECK (verification_status IN ('simulated','failed'))
);
GRANT SELECT ON public.electricity_meter_verification_logs TO authenticated;
GRANT ALL ON public.electricity_meter_verification_logs TO service_role;
ALTER TABLE public.electricity_meter_verification_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners and admins read meter checks" ON public.electricity_meter_verification_logs FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.electricity_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  disco text NOT NULL,
  meter_number text NOT NULL,
  customer_name text NOT NULL,
  meter_type text NOT NULL CHECK (meter_type IN ('Prepaid','Postpaid')),
  amount_ngn integer NOT NULL,
  convenience_fee_ngn integer NOT NULL DEFAULT 0,
  total_amount_ngn integer NOT NULL,
  payment_method text NOT NULL,
  payment_status text NOT NULL DEFAULT 'simulated',
  token_status text NOT NULL,
  token_value text,
  units numeric,
  transaction_reference text NOT NULL UNIQUE,
  api_reference text,
  api_provider text NOT NULL DEFAULT 'sandbox_mock',
  mode text NOT NULL DEFAULT 'sandbox' CHECK (mode = 'sandbox'),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT electricity_transactions_disco_check CHECK (disco IN ('Eko Electricity Distribution Company','Ikeja Electric','Ibadan Electricity Distribution Company','Abuja Electricity Distribution Company','Benin Electricity Distribution Company','Port Harcourt Electricity Distribution Company','Enugu Electricity Distribution Company','Jos Electricity Distribution Company','Kaduna Electric','Kano Electricity Distribution Company','Yola Electricity Distribution Company','Aba Power')),
  CONSTRAINT electricity_transactions_amount_check CHECK (amount_ngn BETWEEN 1000 AND 10000000 AND convenience_fee_ngn = 0 AND total_amount_ngn = amount_ngn),
  CONSTRAINT electricity_transactions_payment_method_check CHECK (payment_method IN ('Card','Bank transfer','Wallet','Virtual account','USSD','Agent payment')),
  CONSTRAINT electricity_transactions_payment_status_check CHECK (payment_status = 'simulated'),
  CONSTRAINT electricity_transactions_token_status_check CHECK (token_status IN ('sandbox_generated','token_pending','token_delayed','failed','reversal_required')),
  CONSTRAINT electricity_transactions_token_check CHECK (token_value IS NULL OR token_value LIKE 'SIM-%')
);
GRANT SELECT ON public.electricity_transactions TO authenticated;
GRANT ALL ON public.electricity_transactions TO service_role;
ALTER TABLE public.electricity_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners and admins read electricity transactions" ON public.electricity_transactions FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE INDEX electricity_transactions_user_created_idx ON public.electricity_transactions (user_id, created_at DESC);
CREATE INDEX electricity_transactions_status_idx ON public.electricity_transactions (token_status);

CREATE TABLE public.electricity_support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  transaction_id uuid REFERENCES public.electricity_transactions(id) ON DELETE SET NULL,
  issue_type text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'Open',
  assigned_to uuid,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT electricity_support_type_check CHECK (issue_type IN ('Token not received','Wrong meter number','Payment issue','Delayed transaction','Failed transaction','Wallet issue','Meter verification issue','Agent transaction issue','Corporate account issue','General enquiry')),
  CONSTRAINT electricity_support_status_check CHECK (status IN ('Open','In Review','Waiting for Customer','Resolved','Closed')),
  CONSTRAINT electricity_support_message_check CHECK (length(trim(message)) BETWEEN 1 AND 2000)
);
GRANT SELECT, INSERT, UPDATE ON public.electricity_support_tickets TO authenticated;
GRANT ALL ON public.electricity_support_tickets TO service_role;
ALTER TABLE public.electricity_support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners and admins read electricity tickets" ON public.electricity_support_tickets FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners open electricity tickets" ON public.electricity_support_tickets FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins update electricity tickets" ON public.electricity_support_tickets FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.electricity_user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('customer','agent','corporate')),
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Approved','Suspended','Rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.electricity_user_roles TO authenticated;
GRANT INSERT, UPDATE ON public.electricity_user_roles TO authenticated;
GRANT ALL ON public.electricity_user_roles TO service_role;
ALTER TABLE public.electricity_user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own electricity roles" ON public.electricity_user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins assign electricity roles" ON public.electricity_user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update electricity roles" ON public.electricity_user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.electricity_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  business_name text NOT NULL,
  business_address text,
  state text,
  city_lga text,
  commission_rate numeric NOT NULL DEFAULT 0 CHECK (commission_rate >= 0 AND commission_rate <= 100),
  commission_type text NOT NULL DEFAULT 'percentage' CHECK (commission_type IN ('fixed','percentage')),
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Approved','Suspended','Rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.electricity_agents TO authenticated;
GRANT ALL ON public.electricity_agents TO service_role;
ALTER TABLE public.electricity_agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agents and admins read agent profiles" ON public.electricity_agents FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users apply as agents" ON public.electricity_agents FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'Pending');
CREATE POLICY "Admins manage agent profiles" ON public.electricity_agents FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.electricity_corporate_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  organisation_name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text,
  number_of_meters integer NOT NULL DEFAULT 0 CHECK (number_of_meters >= 0),
  main_disco text,
  monthly_electricity_spend_ngn integer,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Approved','Suspended','Rejected')),
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.electricity_corporate_accounts TO authenticated;
GRANT ALL ON public.electricity_corporate_accounts TO service_role;
ALTER TABLE public.electricity_corporate_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Corporate users and admins read accounts" ON public.electricity_corporate_accounts FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create corporate applications" ON public.electricity_corporate_accounts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'Pending');
CREATE POLICY "Admins update corporate accounts" ON public.electricity_corporate_accounts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.electricity_corporate_meters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  corporate_account_id uuid NOT NULL REFERENCES public.electricity_corporate_accounts(id) ON DELETE CASCADE,
  disco text NOT NULL,
  meter_number text NOT NULL,
  meter_type text NOT NULL CHECK (meter_type IN ('Prepaid','Postpaid')),
  location_name text,
  department text,
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active','Inactive')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.electricity_corporate_meters TO authenticated;
GRANT ALL ON public.electricity_corporate_meters TO service_role;
ALTER TABLE public.electricity_corporate_meters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Corporate owners manage their meters" ON public.electricity_corporate_meters FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.electricity_corporate_accounts ca WHERE ca.id = corporate_account_id AND ca.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.electricity_corporate_accounts ca WHERE ca.id = corporate_account_id AND ca.user_id = auth.uid()));
CREATE POLICY "Admins read corporate meters" ON public.electricity_corporate_meters FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.electricity_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  balance_ngn integer NOT NULL DEFAULT 0 CHECK (balance_ngn >= 0),
  status text NOT NULL DEFAULT 'pending_configuration' CHECK (status IN ('pending_configuration','active','suspended')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.electricity_wallets TO authenticated;
GRANT ALL ON public.electricity_wallets TO service_role;
ALTER TABLE public.electricity_wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners and admins read electricity wallets" ON public.electricity_wallets FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.electricity_wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES public.electricity_wallets(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('credit','debit','commission','reversal')),
  amount_ngn integer NOT NULL CHECK (amount_ngn > 0),
  reference text NOT NULL,
  status text NOT NULL DEFAULT 'pending_configuration' CHECK (status IN ('pending_configuration','simulated','confirmed','failed')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.electricity_wallet_transactions TO authenticated;
GRANT ALL ON public.electricity_wallet_transactions TO service_role;
ALTER TABLE public.electricity_wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners and admins read wallet entries" ON public.electricity_wallet_transactions FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.electricity_wallets w WHERE w.id = wallet_id AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

CREATE TABLE public.electricity_api_connectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name text NOT NULL CHECK (length(trim(provider_name)) BETWEEN 1 AND 160),
  provider_type text NOT NULL CHECK (provider_type IN ('disco','aggregator','meter_verification')),
  supported_discos text[] NOT NULL DEFAULT '{}',
  base_url text,
  auth_type text,
  sandbox_status text NOT NULL DEFAULT 'Testing' CHECK (sandbox_status IN ('Sandbox','Testing','Disabled')),
  live_status text NOT NULL DEFAULT 'Disabled' CHECK (live_status IN ('Sandbox','Testing','Live','Disabled')),
  priority_order integer NOT NULL DEFAULT 1,
  fallback_provider uuid REFERENCES public.electricity_api_connectors(id) ON DELETE SET NULL,
  contact_person text,
  support_email text,
  support_phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.electricity_api_connectors TO authenticated;
GRANT ALL ON public.electricity_api_connectors TO service_role;
ALTER TABLE public.electricity_api_connectors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage API connectors" ON public.electricity_api_connectors FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.electricity_disco_api_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  disco_name text NOT NULL UNIQUE,
  disco_code text NOT NULL UNIQUE,
  preferred_connector_id uuid REFERENCES public.electricity_api_connectors(id) ON DELETE SET NULL,
  backup_connector_id uuid REFERENCES public.electricity_api_connectors(id) ON DELETE SET NULL,
  supports_prepaid boolean NOT NULL DEFAULT true,
  supports_postpaid boolean NOT NULL DEFAULT true,
  supports_meter_verification boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'Sandbox' CHECK (status IN ('Sandbox','Testing','Live','Disabled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.electricity_disco_api_routes TO authenticated;
GRANT ALL ON public.electricity_disco_api_routes TO service_role;
ALTER TABLE public.electricity_disco_api_routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage DisCo routes" ON public.electricity_disco_api_routes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.electricity_payment_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name text NOT NULL,
  provider_type text NOT NULL,
  status text NOT NULL DEFAULT 'Disabled' CHECK (status IN ('Sandbox','Testing','Live','Disabled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.electricity_payment_providers TO authenticated;
GRANT ALL ON public.electricity_payment_providers TO service_role;
ALTER TABLE public.electricity_payment_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage payment providers" ON public.electricity_payment_providers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.electricity_api_connector_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id uuid REFERENCES public.electricity_api_connectors(id) ON DELETE SET NULL,
  transaction_id uuid REFERENCES public.electricity_transactions(id) ON DELETE SET NULL,
  request_type text NOT NULL,
  request_payload jsonb NOT NULL DEFAULT '{}',
  response_payload jsonb NOT NULL DEFAULT '{}',
  response_status text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.electricity_api_connector_logs TO authenticated;
GRANT ALL ON public.electricity_api_connector_logs TO service_role;
ALTER TABLE public.electricity_api_connector_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read API logs" ON public.electricity_api_connector_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.electricity_payment_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES public.electricity_transactions(id) ON DELETE SET NULL,
  provider_name text NOT NULL DEFAULT 'sandbox_mock',
  payment_reference text NOT NULL,
  amount_ngn integer NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'simulated' CHECK (payment_status IN ('simulated','pending_configuration','failed')),
  response_payload jsonb NOT NULL DEFAULT '{}',
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.electricity_payment_logs TO authenticated;
GRANT ALL ON public.electricity_payment_logs TO service_role;
ALTER TABLE public.electricity_payment_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read payment logs" ON public.electricity_payment_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.electricity_platform_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  mode text NOT NULL DEFAULT 'sandbox' CHECK (mode = 'sandbox'),
  live_mode_enabled boolean NOT NULL DEFAULT false CHECK (live_mode_enabled = false),
  convenience_fee_ngn integer NOT NULL DEFAULT 0 CHECK (convenience_fee_ngn = 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.electricity_platform_settings TO authenticated;
GRANT ALL ON public.electricity_platform_settings TO service_role;
ALTER TABLE public.electricity_platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users read sandbox settings" ON public.electricity_platform_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins may edit sandbox configuration" ON public.electricity_platform_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.submit_electricity_token_request(
  p_full_name text,
  p_disco text,
  p_meter_type text,
  p_meter_number text,
  p_amount_ngn integer,
  p_phone text,
  p_email text,
  p_state text,
  p_city_lga text,
  p_preferred_contact_method text,
  p_consent boolean
) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_reference text; v_user uuid := auth.uid();
BEGIN
  IF p_consent IS DISTINCT FROM true THEN RAISE EXCEPTION 'Consent is required'; END IF;
  IF length(trim(coalesce(p_full_name,''))) NOT BETWEEN 2 AND 120 THEN RAISE EXCEPTION 'Enter a valid full name'; END IF;
  IF p_disco NOT IN ('Eko Electricity Distribution Company','Ikeja Electric','Ibadan Electricity Distribution Company','Abuja Electricity Distribution Company','Benin Electricity Distribution Company','Port Harcourt Electricity Distribution Company','Enugu Electricity Distribution Company','Jos Electricity Distribution Company','Kaduna Electric','Kano Electricity Distribution Company','Yola Electricity Distribution Company','Aba Power') THEN RAISE EXCEPTION 'Choose a supported electricity company'; END IF;
  IF p_meter_type NOT IN ('Prepaid','Postpaid') THEN RAISE EXCEPTION 'Choose a valid meter type'; END IF;
  IF coalesce(p_meter_number,'') !~ '^[0-9]{5,20}$' THEN RAISE EXCEPTION 'Enter a valid meter number'; END IF;
  IF p_amount_ngn IS NULL OR p_amount_ngn NOT BETWEEN 1000 AND 10000000 THEN RAISE EXCEPTION 'Amount must be between ₦1,000 and ₦10,000,000'; END IF;
  IF length(regexp_replace(coalesce(p_phone,''),'[^0-9]','','g')) NOT BETWEEN 10 AND 15 THEN RAISE EXCEPTION 'Enter a valid phone number'; END IF;
  IF length(p_email) > 255 OR p_email !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$' THEN RAISE EXCEPTION 'Enter a valid email address'; END IF;
  IF length(trim(coalesce(p_state,''))) NOT BETWEEN 2 AND 100 OR length(trim(coalesce(p_city_lga,''))) NOT BETWEEN 2 AND 120 THEN RAISE EXCEPTION 'Enter your state and city or LGA'; END IF;
  IF p_preferred_contact_method NOT IN ('Phone','WhatsApp','Email') THEN RAISE EXCEPTION 'Choose a preferred contact method'; END IF;
  v_reference := 'GETELEC-' || to_char(now() AT TIME ZONE 'UTC','YYYYMMDD') || '-' || lpad(nextval('public.electricity_request_reference_seq')::text,4,'0');
  INSERT INTO public.electricity_token_requests (request_reference,user_id,full_name,disco,meter_type,meter_number,amount_ngn,phone,email,state,city_lga,preferred_contact_method,consent_at)
  VALUES (v_reference,v_user,trim(p_full_name),p_disco,p_meter_type,p_meter_number,p_amount_ngn,trim(p_phone),lower(trim(p_email)),trim(p_state),trim(p_city_lga),p_preferred_contact_method,now());
  RETURN v_reference;
END $$;
REVOKE ALL ON FUNCTION public.submit_electricity_token_request(text,text,text,text,integer,text,text,text,text,text,boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_electricity_token_request(text,text,text,text,integer,text,text,text,text,text,boolean) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.verify_electricity_meter_sandbox(
  p_disco text, p_meter_number text, p_meter_type text
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_id uuid; v_name text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in to use the sandbox workspace'; END IF;
  IF p_disco NOT IN ('Eko Electricity Distribution Company','Ikeja Electric','Ibadan Electricity Distribution Company','Abuja Electricity Distribution Company','Benin Electricity Distribution Company','Port Harcourt Electricity Distribution Company','Enugu Electricity Distribution Company','Jos Electricity Distribution Company','Kaduna Electric','Kano Electricity Distribution Company','Yola Electricity Distribution Company','Aba Power') OR p_meter_type NOT IN ('Prepaid','Postpaid') OR coalesce(p_meter_number,'') !~ '^[0-9]{5,20}$' THEN RAISE EXCEPTION 'Check the DisCo and meter details'; END IF;
  v_name := 'SIMULATED CUSTOMER ' || right(p_meter_number,4);
  INSERT INTO public.electricity_meter_verification_logs (user_id,disco,meter_number,meter_type,customer_name,customer_address,tariff_class,verification_status)
  VALUES (auth.uid(),p_disco,p_meter_number,p_meter_type,v_name,'Simulated address — not verified','Sandbox tariff (illustrative)','simulated') RETURNING id INTO v_id;
  RETURN jsonb_build_object('id',v_id,'customer_name',v_name,'customer_address','Simulated address — not verified','disco',p_disco,'meter_number',p_meter_number,'meter_type',p_meter_type,'tariff_class','Sandbox tariff (illustrative)','minimum_amount',1000,'status','simulated','mode','sandbox');
END $$;
REVOKE ALL ON FUNCTION public.verify_electricity_meter_sandbox(text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_electricity_meter_sandbox(text,text,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.run_electricity_sandbox_transaction(
  p_disco text, p_meter_number text, p_meter_type text, p_amount_ngn integer,
  p_payment_method text, p_customer_name text
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_reference text; v_id uuid; v_suffix text; v_status text; v_token text; v_payment_ref text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in to use sandbox transactions'; END IF;
  IF p_disco NOT IN ('Eko Electricity Distribution Company','Ikeja Electric','Ibadan Electricity Distribution Company','Abuja Electricity Distribution Company','Benin Electricity Distribution Company','Port Harcourt Electricity Distribution Company','Enugu Electricity Distribution Company','Jos Electricity Distribution Company','Kaduna Electric','Kano Electricity Distribution Company','Yola Electricity Distribution Company','Aba Power') OR p_meter_type NOT IN ('Prepaid','Postpaid') OR coalesce(p_meter_number,'') !~ '^[0-9]{5,20}$' OR p_amount_ngn NOT BETWEEN 1000 AND 10000000 OR p_payment_method NOT IN ('Card','Bank transfer','Wallet','Virtual account','USSD','Agent payment') OR length(trim(coalesce(p_customer_name,''))) NOT BETWEEN 2 AND 120 THEN RAISE EXCEPTION 'Check your meter and purchase details'; END IF;
  v_suffix := right(p_meter_number,1);
  v_status := CASE v_suffix WHEN '0' THEN 'failed' WHEN '1' THEN 'failed' WHEN '2' THEN 'token_pending' WHEN '3' THEN 'token_delayed' WHEN '4' THEN 'reversal_required' ELSE 'sandbox_generated' END;
  v_reference := 'GETTOK-' || to_char(now() AT TIME ZONE 'UTC','YYYYMMDD') || '-' || lpad(nextval('public.electricity_transaction_reference_seq')::text,4,'0');
  v_payment_ref := 'SIM-PAY-' || right(replace(v_reference,'-',''),8);
  v_token := CASE WHEN v_status = 'sandbox_generated' THEN 'SIM-' || lpad(nextval('public.electricity_transaction_reference_seq')::text,8,'0') ELSE NULL END;
  INSERT INTO public.electricity_transactions (user_id,disco,meter_number,customer_name,meter_type,amount_ngn,convenience_fee_ngn,total_amount_ngn,payment_method,payment_status,token_status,token_value,units,transaction_reference,api_reference,api_provider,mode)
  VALUES (auth.uid(),p_disco,p_meter_number,trim(p_customer_name),p_meter_type,p_amount_ngn,0,p_amount_ngn,p_payment_method,'simulated',v_status,v_token,NULL,v_reference,v_payment_ref,'sandbox_mock','sandbox') RETURNING id INTO v_id;
  INSERT INTO public.electricity_payment_logs (transaction_id,provider_name,payment_reference,amount_ngn,payment_status,response_payload)
  VALUES (v_id,'sandbox_mock',v_payment_ref,p_amount_ngn,'simulated',jsonb_build_object('message','Simulation only; no money was moved'));
  RETURN jsonb_build_object('id',v_id,'transaction_reference',v_reference,'api_reference',v_payment_ref,'payment_status','simulated','token_status',v_status,'token_value',v_token,'units',NULL,'amount_ngn',p_amount_ngn,'convenience_fee_ngn',0,'total_amount_ngn',p_amount_ngn,'disco',p_disco,'meter_number',p_meter_number,'meter_type',p_meter_type,'customer_name',trim(p_customer_name),'payment_method',p_payment_method,'created_at',now(),'mode','sandbox');
END $$;
REVOKE ALL ON FUNCTION public.run_electricity_sandbox_transaction(text,text,text,integer,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.run_electricity_sandbox_transaction(text,text,text,integer,text,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.write_electricity_audit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_id text; v_old jsonb; v_new jsonb; v_action text := lower(TG_OP);
BEGIN
  v_old := CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) END;
  v_new := CASE WHEN TG_OP IN ('UPDATE','INSERT') THEN to_jsonb(NEW) END;
  v_id := coalesce(v_new->>'id',v_old->>'id',v_new->>'request_reference',v_old->>'request_reference',v_new->>'transaction_reference',v_old->>'transaction_reference');
  INSERT INTO public.audit_log (actor_id,actor_email,action,entity_type,entity_id,old_value,new_value)
  VALUES (auth.uid(),(SELECT email FROM auth.users WHERE id=auth.uid()),v_action,TG_TABLE_NAME,v_id,v_old,v_new);
  RETURN coalesce(NEW,OLD);
END $$;

CREATE TRIGGER electricity_requests_audit AFTER INSERT OR UPDATE ON public.electricity_token_requests FOR EACH ROW EXECUTE FUNCTION public.write_electricity_audit();
CREATE TRIGGER electricity_meters_audit AFTER INSERT OR UPDATE OR DELETE ON public.electricity_saved_meters FOR EACH ROW EXECUTE FUNCTION public.write_electricity_audit();
CREATE TRIGGER electricity_verifications_audit AFTER INSERT ON public.electricity_meter_verification_logs FOR EACH ROW EXECUTE FUNCTION public.write_electricity_audit();
CREATE TRIGGER electricity_transactions_audit AFTER INSERT ON public.electricity_transactions FOR EACH ROW EXECUTE FUNCTION public.write_electricity_audit();
CREATE TRIGGER electricity_tickets_audit AFTER INSERT OR UPDATE ON public.electricity_support_tickets FOR EACH ROW EXECUTE FUNCTION public.write_electricity_audit();
CREATE TRIGGER electricity_roles_audit AFTER INSERT OR UPDATE ON public.electricity_user_roles FOR EACH ROW EXECUTE FUNCTION public.write_electricity_audit();
CREATE TRIGGER electricity_agents_audit AFTER INSERT OR UPDATE ON public.electricity_agents FOR EACH ROW EXECUTE FUNCTION public.write_electricity_audit();
CREATE TRIGGER electricity_corporate_audit AFTER INSERT OR UPDATE ON public.electricity_corporate_accounts FOR EACH ROW EXECUTE FUNCTION public.write_electricity_audit();
CREATE TRIGGER electricity_corporate_meters_audit AFTER INSERT OR UPDATE OR DELETE ON public.electricity_corporate_meters FOR EACH ROW EXECUTE FUNCTION public.write_electricity_audit();
CREATE TRIGGER electricity_wallets_audit AFTER INSERT OR UPDATE ON public.electricity_wallets FOR EACH ROW EXECUTE FUNCTION public.write_electricity_audit();
CREATE TRIGGER electricity_wallet_entries_audit AFTER INSERT ON public.electricity_wallet_transactions FOR EACH ROW EXECUTE FUNCTION public.write_electricity_audit();
CREATE TRIGGER electricity_api_connectors_audit AFTER INSERT OR UPDATE OR DELETE ON public.electricity_api_connectors FOR EACH ROW EXECUTE FUNCTION public.write_electricity_audit();
CREATE TRIGGER electricity_disco_routes_audit AFTER INSERT OR UPDATE OR DELETE ON public.electricity_disco_api_routes FOR EACH ROW EXECUTE FUNCTION public.write_electricity_audit();
CREATE TRIGGER electricity_payment_providers_audit AFTER INSERT OR UPDATE OR DELETE ON public.electricity_payment_providers FOR EACH ROW EXECUTE FUNCTION public.write_electricity_audit();
CREATE TRIGGER electricity_settings_audit AFTER UPDATE ON public.electricity_platform_settings FOR EACH ROW EXECUTE FUNCTION public.write_electricity_audit();
DROP POLICY IF EXISTS "Anyone can submit a request" ON public.service_requests;
REVOKE INSERT ON public.service_requests FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.request_ip_allowed(p_scope text, p_limit integer, p_window_seconds integer)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_headers json; v_ip text;
BEGIN
  IF coalesce(auth.role(), '') = 'service_role' THEN RETURN true; END IF;
  BEGIN v_headers := nullif(current_setting('request.headers', true), '')::json;
  EXCEPTION WHEN others THEN v_headers := NULL; END;
  v_ip := nullif(trim(v_headers->>'cf-connecting-ip'), '');
  IF v_ip IS NULL THEN v_ip := nullif(trim(split_part(coalesce(v_headers->>'x-forwarded-for', ''), ',', 1)), ''); END IF;
  IF v_ip IS NULL THEN RETURN true; END IF;
  RETURN public.electricity_hit_rate_limit(p_scope || ':ip:' || left(v_ip, 64), p_limit, p_window_seconds);
END $$;
REVOKE ALL ON FUNCTION public.request_ip_allowed(text,integer,integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.request_ip_allowed(text,integer,integer) TO service_role;

DO $do$
DECLARE v_types text[];
BEGIN
  SELECT array_agg(DISTINCT t ORDER BY t) INTO v_types FROM (
    SELECT unnest(ARRAY[
      'bills','careers','cngbook','community','contact','eea','equipment','ev','fuel','invest','paas','training','whatsapp',
      'quote','fleet-transition','host-site','cng-maintenance','cng-refuelling','ev-hybrid-services',
      'academy-waitlist','academy-corporate','academy-certification','academy-application','academy-support','sophia'
    ]) AS t
    UNION SELECT DISTINCT request_type FROM public.service_requests WHERE request_type IS NOT NULL
  ) s;

  EXECUTE format($f$
CREATE OR REPLACE FUNCTION public.submit_service_request(
  p_request_type text, p_service_name text, p_contact_name text, p_contact_email text,
  p_contact_phone text DEFAULT NULL, p_company_name text DEFAULT NULL, p_location text DEFAULT NULL,
  p_details jsonb DEFAULT '{}'::jsonb
) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_reference text;
  v_type text := lower(trim(coalesce(p_request_type, '')));
  v_name text := trim(coalesce(p_contact_name, ''));
  v_email text := lower(trim(coalesce(p_contact_email, '')));
  v_phone text := nullif(trim(coalesce(p_contact_phone, '')), '');
  v_digits int := length(regexp_replace(coalesce(p_contact_phone, ''), '[^0-9]', '', 'g'));
BEGIN
  IF NOT public.request_ip_allowed('lead', 5, 600) THEN RETURN 'RATE_LIMITED'; END IF;
  IF NOT (v_type = ANY (%L::text[])) THEN RAISE EXCEPTION 'This form type is not recognised. Please refresh the page and try again.'; END IF;
  IF length(v_name) = 0 THEN RAISE EXCEPTION 'Please enter your name.'; END IF;
  IF length(v_name) > 200 THEN RAISE EXCEPTION 'Your name is too long.'; END IF;
  IF v_email <> '' AND (length(v_email) > 255 OR v_email !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$') THEN
    RAISE EXCEPTION 'Enter a valid email address.';
  END IF;
  IF v_email = '' AND (v_digits NOT BETWEEN 10 AND 15) THEN RAISE EXCEPTION 'Enter a valid email address or phone number.'; END IF;
  IF octet_length(coalesce(p_details, '{}'::jsonb)::text) > 10240 THEN
    RAISE EXCEPTION 'Your message is too long. Please shorten it and try again.';
  END IF;
  INSERT INTO public.service_requests (user_id, request_type, service_name, contact_name, contact_email,
    contact_phone, company_name, location, details)
  VALUES (auth.uid(), left(v_type, 80), left(trim(coalesce(p_service_name, v_type)), 160), v_name, v_email,
    left(v_phone, 40), left(nullif(trim(coalesce(p_company_name, '')), ''), 200),
    left(nullif(trim(coalesce(p_location, '')), ''), 200), coalesce(p_details, '{}'::jsonb))
  RETURNING reference INTO v_reference;
  RETURN v_reference;
END $fn$;
$f$, v_types);
END $do$;
REVOKE ALL ON FUNCTION public.submit_service_request(text,text,text,text,text,text,text,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_service_request(text,text,text,text,text,text,text,jsonb) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.submit_electricity_token_request(
  p_full_name text, p_disco text, p_meter_type text, p_meter_number text, p_amount_ngn integer,
  p_phone text, p_email text, p_state text, p_city_lga text, p_preferred_contact_method text, p_consent boolean
) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_reference text; v_user uuid := auth.uid();
BEGIN
  IF NOT public.request_ip_allowed('electricity-request', 5, 600) THEN RETURN 'RATE_LIMITED'; END IF;
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
GRANT EXECUTE ON FUNCTION public.submit_electricity_token_request(text,text,text,text,integer,text,text,text,text,text,boolean) TO anon, authenticated, service_role;

CREATE EXTENSION IF NOT EXISTS pg_net;
INSERT INTO public.electricity_private_config(key, value)
VALUES ('lead_alert_token', encode(extensions.gen_random_bytes(32),'hex')),
       ('lead_alert_url', 'https://getenergy-african-hub.lovable.app/api/public/lead-alert')
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.check_lead_alert_token(p_token text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce(p_token,'') <> '' AND EXISTS (SELECT 1 FROM public.electricity_private_config WHERE key = 'lead_alert_token' AND value = p_token)
$$;
REVOKE ALL ON FUNCTION public.check_lead_alert_token(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_lead_alert_token(text) TO service_role;

CREATE OR REPLACE FUNCTION public.notify_new_lead()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_url text; v_token text;
BEGIN
  IF TG_TABLE_NAME = 'service_requests' AND NEW.is_test THEN RETURN NEW; END IF;
  BEGIN
    SELECT value INTO v_url FROM public.electricity_private_config WHERE key = 'lead_alert_url';
    SELECT value INTO v_token FROM public.electricity_private_config WHERE key = 'lead_alert_token';
    IF v_url IS NOT NULL AND v_token IS NOT NULL THEN
      PERFORM net.http_post(
        url := v_url,
        body := jsonb_build_object('table', TG_TABLE_NAME, 'id', NEW.id),
        headers := jsonb_build_object('Content-Type', 'application/json', 'x-alert-token', v_token)
      );
    END IF;
  EXCEPTION WHEN others THEN
    RAISE WARNING 'lead alert skipped: %', SQLERRM;
  END;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.notify_new_lead() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS notify_new_lead ON public.service_requests;
CREATE TRIGGER notify_new_lead AFTER INSERT ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.notify_new_lead();
DROP TRIGGER IF EXISTS notify_new_lead ON public.electricity_token_requests;
CREATE TRIGGER notify_new_lead AFTER INSERT ON public.electricity_token_requests FOR EACH ROW EXECUTE FUNCTION public.notify_new_lead();
CREATE OR REPLACE FUNCTION public.submit_service_request(
  p_request_type text,
  p_service_name text,
  p_contact_name text,
  p_contact_email text,
  p_contact_phone text DEFAULT NULL,
  p_company_name text DEFAULT NULL,
  p_location text DEFAULT NULL,
  p_details jsonb DEFAULT '{}'::jsonb
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reference text;
BEGIN
  IF length(coalesce(p_contact_name, '')) = 0 OR length(coalesce(p_contact_email, '')) = 0 THEN
    RAISE EXCEPTION 'Contact name and email are required';
  END IF;
  IF length(p_contact_name) > 200 OR length(p_contact_email) > 320 THEN
    RAISE EXCEPTION 'Contact details too long';
  END IF;

  INSERT INTO public.service_requests (
    user_id, request_type, service_name, contact_name, contact_email,
    contact_phone, company_name, location, details
  ) VALUES (
    auth.uid(), left(p_request_type, 80), left(p_service_name, 160),
    left(p_contact_name, 200), left(p_contact_email, 320),
    left(p_contact_phone, 40), left(p_company_name, 200), left(p_location, 200),
    coalesce(p_details, '{}'::jsonb)
  )
  RETURNING reference INTO v_reference;

  RETURN v_reference;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_service_request(text, text, text, text, text, text, text, jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_service_request(text, text, text, text, text, text, text, jsonb) TO anon, authenticated;
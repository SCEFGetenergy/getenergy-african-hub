CREATE UNIQUE INDEX IF NOT EXISTS academy_one_active_course_per_user
ON public.service_requests (user_id, (details->>'course_key'))
WHERE user_id IS NOT NULL AND deleted_at IS NULL
  AND request_type IN ('academy-application','academy-waitlist','academy-certification')
  AND details ? 'course_key';

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT (auth.role() = 'service_role' OR _user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT (auth.role() = 'service_role' OR _user_id = auth.uid()) AND (
    public.has_role(_user_id,'admin') OR EXISTS (
      SELECT 1 FROM public.admin_permissions p
      JOIN public.user_roles r ON r.user_id = p.user_id AND r.role = 'staff'
      WHERE p.user_id = _user_id AND p.permission = _permission
    )
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid,public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_permission(uuid,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid,public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_permission(uuid,text) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.first_admin_available() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.first_admin_available() TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.run_electricity_sandbox_transaction(text,text,text,integer,text,text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.verify_electricity_meter_sandbox(text,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.run_electricity_sandbox_transaction(text,text,text,integer,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_electricity_meter_sandbox(text,text,text) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.write_audit() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.write_electricity_audit() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_new_lead() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.flag_test_request() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_lead_alert_token(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.electricity_check_cron_token(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.electricity_claim_vend(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.electricity_hit_rate_limit(text,integer,integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.request_ip_allowed(text,integer,integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_lead_alert_token(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.electricity_check_cron_token(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.electricity_claim_vend(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.electricity_hit_rate_limit(text,integer,integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.request_ip_allowed(text,integer,integer) TO service_role;

REVOKE TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE MAINTAIN ON ALL TABLES IN SCHEMA public FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.register_academy_course(
  p_course_key text,
  p_contact_name text,
  p_contact_phone text,
  p_company_name text DEFAULT NULL,
  p_location text DEFAULT NULL,
  p_details jsonb DEFAULT '{}'::jsonb,
  p_consent boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_user uuid := auth.uid();
  v_email text;
  v_key text := lower(trim(coalesce(p_course_key,'')));
  v_name text := trim(coalesce(p_contact_name,''));
  v_phone text := nullif(trim(coalesce(p_contact_phone,'')),'') ;
  v_title text;
  v_type text;
  v_reference text;
  v_details jsonb := coalesce(p_details,'{}'::jsonb);
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Sign in to register for a course'; END IF;
  v_title := CASE v_key
    WHEN 'solar-pv-installation-supervision' THEN 'Solar PV Installation & Supervision'
    WHEN 'solar-plus-storage-design-operations' THEN 'Solar-Plus-Storage Design & Operations'
    WHEN 'battery-energy-storage-systems-bess' THEN 'Battery Energy Storage Systems — BESS'
    WHEN 'distributed-renewable-energy-systems' THEN 'Distributed Renewable Energy Systems'
    WHEN 'generator-distributed-power-operations' THEN 'Generator & Distributed Power Operations'
    WHEN 'power-systems-operations-maintenance' THEN 'Power Systems Operations & Maintenance'
    WHEN 'mini-grid-design-development' THEN 'Mini-Grid Design & Development'
    WHEN 'mini-grid-commercial-operations' THEN 'Mini-Grid Commercial Operations'
    WHEN 'power-as-a-service-electricity-as-a-service' THEN 'Power-As-A-Service & Electricity-As-A-Service'
    WHEN 'captive-embedded-power-development' THEN 'Captive & Embedded Power Development'
    WHEN 'smart-metering-digital-energy-management' THEN 'Smart Metering & Digital Energy Management'
    WHEN 'energy-management-systems-iot' THEN 'Energy Management Systems & IoT'
    WHEN 'energy-audit-energy-management' THEN 'Energy Audit & Energy Management'
    WHEN 'energy-efficiency-in-buildings' THEN 'Energy Efficiency in Buildings'
    WHEN 'health-safety-environment-hse' THEN 'Health, Safety & Environment — HSE'
    WHEN 'electrical-safety-statutory-regulations' THEN 'Electrical Safety & Statutory Regulations'
    WHEN 'fire-safety-emergency-response' THEN 'Fire Safety & Emergency Response'
    WHEN 'nemsa-competency-preparation' THEN 'NEMSA Competency Preparation'
    WHEN 'green-economy-fundamentals' THEN 'Green Economy Fundamentals'
    WHEN 'esg-impact-measurement' THEN 'ESG & Impact Measurement'
    WHEN 'productive-use-of-renewable-energy' THEN 'Productive Use of Renewable Energy'
    WHEN 'climate-carbon-awareness' THEN 'Climate & Carbon Awareness'
    WHEN 'circular-economy-sustainability' THEN 'Circular Economy & Sustainability'
    WHEN 'ev-charging-infrastructure' THEN 'EV Charging Infrastructure'
    WHEN 'ev-hybrid-vehicle-fundamentals' THEN 'EV & Hybrid Vehicle Fundamentals'
    WHEN 'green-mobility-infrastructure' THEN 'Green Mobility Infrastructure'
    WHEN 'cng-technical-fundamentals' THEN 'CNG Technical Fundamentals'
    WHEN 'cng-vehicle-fleet-transition' THEN 'CNG Vehicle & Fleet Transition'
    WHEN 'cng-refuelling-infrastructure' THEN 'CNG Refuelling Infrastructure'
    WHEN 'renewable-energy-project-development' THEN 'Renewable Energy Project Development'
    WHEN 'energy-project-finance-unit-economics' THEN 'Energy Project Finance & Unit Economics'
    WHEN 'climate-finance-fundraising' THEN 'Climate Finance & Fundraising'
    WHEN 'green-procurement-energy-supply-chains' THEN 'Green Procurement & Energy Supply Chains'
    WHEN 'project-management-for-energy-professionals' THEN 'Project Management for Energy Professionals'
    WHEN 'energy-business-development' THEN 'Energy Business Development'
    WHEN 'get-energy-greentech-launchpad' THEN 'GET Energy GreenTech Launchpad'
    WHEN 'greentech-entrepreneurship' THEN 'GreenTech Entrepreneurship'
    WHEN 'green-energy-entrepreneurship' THEN 'Green Energy Entrepreneurship'
    WHEN 'leadership-team-management' THEN 'Leadership & Team Management'
    WHEN 'business-development' THEN 'Business Development'
    WHEN 'customer-service' THEN 'Customer Service'
    WHEN 'sales-technical-sales' THEN 'Sales & Technical Sales'
    WHEN 'project-coordination' THEN 'Project Coordination'
    WHEN 'workplace-communication' THEN 'Workplace Communication'
    WHEN 'digital-productivity' THEN 'Digital Productivity'
    WHEN 'procurement' THEN 'Procurement'
    WHEN 'operations-management' THEN 'Operations Management'
    WHEN 'proposal-development' THEN 'Proposal Development'
    WHEN 'technical-documentation' THEN 'Technical Documentation'
    WHEN 'data-reporting' THEN 'Data & Reporting'
    WHEN 'cold-chain-energy-systems' THEN 'Cold-Chain Energy Systems'
    WHEN 'agricultural-productive-energy-systems' THEN 'Agricultural Productive Energy Systems'
    WHEN 'green-jobs-career-readiness' THEN 'Green Jobs & Career Readiness'
    WHEN 'energy-sales-customer-service' THEN 'Energy Sales & Customer Service'
    WHEN 'workplace-entrepreneurship-innovation' THEN 'Workplace Entrepreneurship & Innovation'
    WHEN 'train-the-trainer-for-technical-energy-programmes' THEN 'Train-The-Trainer for Technical & Energy Programmes'
    WHEN 'technical-vocational-instructor-development' THEN 'Technical & Vocational Instructor Development'
    WHEN 'corporate-energy-management-for-executives' THEN 'Corporate Energy Management for Executives'
    WHEN 'solar-technician-pathway' THEN 'Solar Technician Pathway'
    WHEN 'ev-charging-technician-pathway' THEN 'EV Charging Technician Pathway'
    WHEN 'cng-technician-pathway' THEN 'CNG Technician Pathway'
    WHEN 'mini-grid-professional-pathway' THEN 'Mini-Grid Professional Pathway'
    WHEN 'energy-manager-pathway' THEN 'Energy Manager Pathway'
    WHEN 'greentech-founder-pathway' THEN 'GreenTech Founder Pathway'
    WHEN 'ceowp' THEN 'GETS Certified Energy Operations & Workplace Productivity Professional'
    WHEN 'cdesp' THEN 'GETS Certified Distributed Energy Systems Professional'
    WHEN 'csbmp' THEN 'GETS Certified Solar, BESS & Mini-Grid Professional'
    WHEN 'csemp' THEN 'GETS Certified Smart Energy & Metering Professional'
    WHEN 'cgmap' THEN 'GETS Certified Green Mobility & Alternative Fuels Professional'
    WHEN 'cepcm' THEN 'GETS Certified Energy Project & Commercial Manager'
    WHEN 'cgevb' THEN 'GETS Certified GreenTech Entrepreneur & Venture Builder'
    WHEN 'cipoep' THEN 'GETS Certified Industrial Productivity & Operational Excellence Professional'
    WHEN 'cehrcp' THEN 'GETS Certified Energy HSE, Reliability & Compliance Professional'
    WHEN 'cttls' THEN 'GETS Certified Technical Team Leader & Workforce Supervisor'
    ELSE NULL
  END;
  IF v_title IS NULL THEN RAISE EXCEPTION 'Choose a valid Academy programme or certification'; END IF;
  v_type := CASE WHEN v_key IN ('ceowp','cdesp','csbmp','csemp','cgmap','cepcm','cgevb','cipoep','cehrcp','cttls') THEN 'academy-certification' ELSE 'academy-waitlist' END;
  IF length(v_name) NOT BETWEEN 2 AND 200 THEN RAISE EXCEPTION 'Enter your full name'; END IF;
  IF length(regexp_replace(coalesce(v_phone,''),'[^0-9]','','g')) NOT BETWEEN 10 AND 15 THEN RAISE EXCEPTION 'Enter a valid phone number'; END IF;
  IF length(coalesce(p_company_name,'')) > 200 OR length(coalesce(p_location,'')) > 200 THEN RAISE EXCEPTION 'Company or location is too long'; END IF;
  IF octet_length(v_details::text) > 10240 THEN RAISE EXCEPTION 'Your registration details are too long'; END IF;
  IF p_consent IS DISTINCT FROM true THEN RAISE EXCEPTION 'Consent is required'; END IF;

  SELECT reference INTO v_reference FROM public.service_requests
  WHERE user_id = v_user AND deleted_at IS NULL
    AND request_type IN ('academy-application','academy-waitlist','academy-certification')
    AND details->>'course_key' = v_key
  ORDER BY created_at DESC LIMIT 1;
  IF v_reference IS NOT NULL THEN
    RETURN jsonb_build_object('status','duplicate','reference',v_reference,'course_key',v_key,'course_title',v_title,'request_type',v_type);
  END IF;

  IF NOT public.electricity_hit_rate_limit('academy-course:user:' || v_user::text,10,600)
     OR NOT public.request_ip_allowed('academy-course',5,600) THEN
    RETURN jsonb_build_object('status','rate_limited');
  END IF;
  SELECT email INTO v_email FROM auth.users WHERE id = v_user;

  BEGIN
    INSERT INTO public.service_requests(
      user_id,request_type,service_name,contact_name,contact_email,contact_phone,company_name,location,details,status
    ) VALUES (
      v_user,v_type,left('GET Energy Academy — ' || v_title,160),v_name,lower(v_email),left(v_phone,40),
      left(nullif(trim(coalesce(p_company_name,'')),''),200),left(nullif(trim(coalesce(p_location,'')),''),200),
      v_details || jsonb_build_object('course_key',v_key,'course_title',v_title,'course_registration',true,'payment_status','no_payment_taken'),
      'submitted'
    ) RETURNING reference INTO v_reference;
  EXCEPTION WHEN unique_violation THEN
    SELECT reference INTO v_reference FROM public.service_requests
    WHERE user_id = v_user AND deleted_at IS NULL AND details->>'course_key' = v_key
    ORDER BY created_at DESC LIMIT 1;
    RETURN jsonb_build_object('status','duplicate','reference',v_reference,'course_key',v_key,'course_title',v_title,'request_type',v_type);
  END;

  RETURN jsonb_build_object('status','registered','reference',v_reference,'course_key',v_key,'course_title',v_title,'request_type',v_type);
END
$function$;

REVOKE EXECUTE ON FUNCTION public.register_academy_course(text,text,text,text,text,jsonb,boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.register_academy_course(text,text,text,text,text,jsonb,boolean) TO authenticated, service_role;
COMMENT ON FUNCTION public.register_academy_course(text,text,text,text,text,jsonb,boolean) IS 'Authenticated, validated and duplicate-safe Academy course registration. Returns the existing reference for repeat registrations; staff alerts use notify_new_lead.';
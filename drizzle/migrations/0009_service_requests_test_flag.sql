ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS is_test boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.flag_test_request()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF lower(NEW.contact_email) LIKE '%@getenergytest.dev'
     OR NEW.contact_name ILIKE '%qa test%'
     OR coalesce(NEW.details->>'test','') = 'true' THEN
    NEW.is_test := true;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS flag_test_request ON public.service_requests;
CREATE TRIGGER flag_test_request BEFORE INSERT ON public.service_requests
FOR EACH ROW EXECUTE FUNCTION public.flag_test_request();

UPDATE public.service_requests SET is_test = true
WHERE lower(contact_email) LIKE '%@getenergytest.dev' OR contact_name ILIKE '%qa test%';
CREATE OR REPLACE FUNCTION public.notify_new_lead()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_url text; v_token text;
BEGIN
  BEGIN
    IF coalesce((to_jsonb(NEW)->>'is_test')::boolean, false) THEN RETURN NEW; END IF;
    SELECT value INTO v_url FROM public.electricity_private_config WHERE key = 'lead_alert_url';
    SELECT value INTO v_token FROM public.electricity_private_config WHERE key = 'lead_alert_token';
    IF v_url IS NOT NULL AND v_token IS NOT NULL THEN
      PERFORM net.http_post(url := v_url, body := jsonb_build_object('table', TG_TABLE_NAME, 'id', NEW.id),
        headers := jsonb_build_object('Content-Type', 'application/json', 'x-alert-token', v_token));
    END IF;
  EXCEPTION WHEN others THEN
    RAISE WARNING 'lead alert skipped: %', SQLERRM;
  END;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.notify_new_lead() FROM PUBLIC, anon, authenticated;

UPDATE public.electricity_private_config SET value = 'https://getenergy.ng/api/public/lead-alert' WHERE key = 'lead_alert_url';
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE TABLE public.electricity_private_config (
  key text PRIMARY KEY,
  value text NOT NULL
);
GRANT ALL ON public.electricity_private_config TO service_role;
ALTER TABLE public.electricity_private_config ENABLE ROW LEVEL SECURITY;
INSERT INTO public.electricity_private_config(key, value)
VALUES ('cron_token', encode(extensions.gen_random_bytes(32),'hex')) ON CONFLICT DO NOTHING;
CREATE OR REPLACE FUNCTION public.electricity_check_cron_token(p_token text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce(p_token,'') <> '' AND EXISTS (SELECT 1 FROM public.electricity_private_config WHERE key = 'cron_token' AND value = p_token)
$$;
REVOKE ALL ON FUNCTION public.electricity_check_cron_token(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.electricity_check_cron_token(text) TO service_role;
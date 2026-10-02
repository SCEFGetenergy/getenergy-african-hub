CREATE TABLE public.admin_bootstrap (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  code_hash text NOT NULL,
  attempts int NOT NULL DEFAULT 0,
  used_at timestamptz,
  used_by uuid
);
GRANT ALL ON public.admin_bootstrap TO service_role;
ALTER TABLE public.admin_bootstrap ENABLE ROW LEVEL SECURITY;
INSERT INTO public.admin_bootstrap(id, code_hash) VALUES (1, encode(extensions.digest('23cd19895834c0f7df06a2f8','sha256'),'hex')) ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.first_admin_available()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
     AND EXISTS (SELECT 1 FROM public.admin_bootstrap WHERE used_at IS NULL AND attempts < 10)
$$;

CREATE OR REPLACE FUNCTION public.claim_first_admin(p_code text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'extensions' AS $$
DECLARE v public.admin_bootstrap;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in first'; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN RAISE EXCEPTION 'An administrator already exists. Ask them for an invitation.'; END IF;
  SELECT * INTO v FROM public.admin_bootstrap WHERE id = 1 FOR UPDATE;
  IF v.id IS NULL OR v.used_at IS NOT NULL THEN RAISE EXCEPTION 'First-admin setup is closed'; END IF;
  IF v.attempts >= 10 THEN RAISE EXCEPTION 'Too many incorrect attempts. Setup is locked.'; END IF;
  IF v.code_hash <> encode(extensions.digest(coalesce(p_code,''),'sha256'),'hex') THEN
    UPDATE public.admin_bootstrap SET attempts = attempts + 1 WHERE id = 1;
    RETURN 'invalid';
  END IF;
  INSERT INTO public.user_roles(user_id, role) VALUES (auth.uid(), 'admin') ON CONFLICT DO NOTHING;
  UPDATE public.admin_bootstrap SET used_at = now(), used_by = auth.uid() WHERE id = 1;
  RETURN 'ok';
END $$;

REVOKE ALL ON FUNCTION public.claim_first_admin(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.claim_first_admin(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.first_admin_available() TO anon, authenticated;
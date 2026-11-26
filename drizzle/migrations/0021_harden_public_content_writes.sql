REVOKE ALL ON TABLE public.certification_employers FROM anon, authenticated;
REVOKE ALL ON TABLE public.certification_settings FROM anon, authenticated;
REVOKE ALL ON TABLE public.electricity_disco_live FROM anon, authenticated;
REVOKE ALL ON TABLE public.service_statuses FROM anon, authenticated;
REVOKE ALL ON TABLE public.site_notices FROM anon, authenticated;

GRANT SELECT ON TABLE public.certification_employers TO anon, authenticated;
GRANT SELECT ON TABLE public.certification_settings TO anon, authenticated;
GRANT SELECT ON TABLE public.electricity_disco_live TO anon, authenticated;
GRANT SELECT ON TABLE public.service_statuses TO anon, authenticated;
GRANT SELECT ON TABLE public.site_notices TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE ON TABLE public.certification_employers TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.certification_settings TO authenticated;
GRANT UPDATE ON TABLE public.electricity_disco_live TO authenticated;
GRANT INSERT, UPDATE ON TABLE public.service_statuses TO authenticated;
GRANT UPDATE ON TABLE public.site_notices TO authenticated;

GRANT ALL ON TABLE public.certification_employers TO service_role;
GRANT ALL ON TABLE public.certification_settings TO service_role;
GRANT ALL ON TABLE public.electricity_disco_live TO service_role;
GRANT ALL ON TABLE public.service_statuses TO service_role;
GRANT ALL ON TABLE public.site_notices TO service_role;

DROP POLICY IF EXISTS "Admins manage employers" ON public.certification_employers;
CREATE POLICY "Admins insert employers" ON public.certification_employers
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update employers" ON public.certification_employers
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete employers" ON public.certification_employers
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage cert settings" ON public.certification_settings;
CREATE POLICY "Admins insert cert settings" ON public.certification_settings
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update cert settings" ON public.certification_settings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete cert settings" ON public.certification_settings
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
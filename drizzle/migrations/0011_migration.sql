DROP POLICY IF EXISTS "Anyone can read cert settings" ON public.certification_settings;
CREATE POLICY "Public can read approved cert fees" ON public.certification_settings
  FOR SELECT TO anon, authenticated USING (fee_approved = true);
CREATE POLICY "Admins can read all cert settings" ON public.certification_settings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Public can read notice" ON public.site_notices;
CREATE POLICY "Public can read active notice" ON public.site_notices FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Content editors read notices" ON public.site_notices FOR SELECT TO authenticated USING (public.has_permission(auth.uid(), 'edit_content'));
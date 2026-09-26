DROP POLICY IF EXISTS "Anyone can submit a request" ON public.service_requests;
DROP POLICY IF EXISTS "Signed-in users can submit their own request" ON public.service_requests;

CREATE POLICY "Anyone can submit a request" ON public.service_requests
  FOR INSERT TO public
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

GRANT INSERT ON public.service_requests TO anon, authenticated;
GRANT SELECT ON public.service_requests TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.service_request_ref_seq TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_request_reference() TO anon, authenticated;
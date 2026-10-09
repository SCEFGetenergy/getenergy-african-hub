CREATE TABLE public.service_statuses (
  slug text PRIMARY KEY,
  label text NOT NULL,
  path text NOT NULL,
  status text NOT NULL DEFAULT 'live' CHECK (status IN ('live','launching_soon','enquiry_only','paused')),
  public_note text CHECK (char_length(public_note) <= 300),
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);
GRANT SELECT ON public.service_statuses TO anon, authenticated;
GRANT INSERT, UPDATE ON public.service_statuses TO authenticated;
GRANT ALL ON public.service_statuses TO service_role;
ALTER TABLE public.service_statuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read service status" ON public.service_statuses FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins update service status" ON public.service_statuses FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins add service status" ON public.service_statuses FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.site_notices (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  message text NOT NULL DEFAULT '' CHECK (char_length(message) <= 280),
  link_url text CHECK (link_url IS NULL OR link_url ~ '^/[A-Za-z0-9/_#?=&.-]*$'),
  link_label text CHECK (char_length(link_label) <= 60),
  active boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);
GRANT SELECT ON public.site_notices TO anon, authenticated;
GRANT UPDATE ON public.site_notices TO authenticated;
GRANT ALL ON public.site_notices TO service_role;
ALTER TABLE public.site_notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read notice" ON public.site_notices FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins update notice" ON public.site_notices FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.site_notices (id) VALUES (1);
INSERT INTO public.service_statuses (slug,label,path,status,public_note,sort_order) VALUES
 ('electricity','Electricity tokens & bills','/get-electricity','launching_soon','Online payment is launching soon. Requests are handled by our team.',1),
 ('diesel','Diesel / AGO supply','/get-fuel','enquiry_only',NULL,2),
 ('cng','CNG refuelling','/cng','enquiry_only',NULL,3),
 ('cng-conversion','CNG conversion','/cng-conversion','launching_soon',NULL,4),
 ('ev','EV & mobility','/ev','enquiry_only',NULL,5),
 ('paas','Power-as-a-Service & solar','/power-as-a-service','enquiry_only',NULL,6),
 ('equipment','Energy-saving equipment','/energy-saving-equipment','enquiry_only',NULL,7),
 ('academy','GET Energy Academy','/training-certification','enquiry_only',NULL,8),
 ('invest','Investment enquiries','/invest','enquiry_only',NULL,9);

CREATE TRIGGER service_statuses_audit AFTER UPDATE ON public.service_statuses FOR EACH ROW EXECUTE FUNCTION public.write_audit();
CREATE TRIGGER site_notices_audit AFTER UPDATE ON public.site_notices FOR EACH ROW EXECUTE FUNCTION public.write_audit();

CREATE POLICY "Admins update any request" ON public.service_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
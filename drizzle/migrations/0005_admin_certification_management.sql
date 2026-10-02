CREATE TYPE public.app_role AS ENUM ('admin', 'staff');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.certification_settings (
  code text PRIMARY KEY,
  fee_ngn integer CHECK (fee_ngn IS NULL OR fee_ngn >= 0),
  fee_approved boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.certification_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.certification_settings TO authenticated;
GRANT ALL ON public.certification_settings TO service_role;
ALTER TABLE public.certification_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read cert settings" ON public.certification_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage cert settings" ON public.certification_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.certification_employers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_code text NOT NULL,
  employer_name text NOT NULL CHECK (length(employer_name) BETWEEN 1 AND 200),
  recognised_on date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.certification_employers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.certification_employers TO authenticated;
GRANT ALL ON public.certification_employers TO service_role;
ALTER TABLE public.certification_employers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read recognised employers" ON public.certification_employers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage employers" ON public.certification_employers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT UPDATE (status, updated_at) ON public.service_requests TO authenticated;
CREATE POLICY "Admins view all requests" ON public.service_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update request status" ON public.service_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE SEQUENCE IF NOT EXISTS public.academy_student_seq;

CREATE TABLE public.academy_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id text NOT NULL UNIQUE DEFAULT ('GEA-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.academy_student_seq')::text, 5, '0')),
  first_name text NOT NULL DEFAULT '',
  middle_name text,
  last_name text NOT NULL DEFAULT '',
  phone text,
  country text,
  state text,
  city text,
  gender text,
  date_of_birth date,
  nationality text,
  occupation text,
  organisation text,
  qualification text,
  years_experience integer,
  interest text,
  consent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.academy_profiles TO authenticated;
GRANT ALL ON public.academy_profiles TO service_role;
GRANT USAGE ON SEQUENCE public.academy_student_seq TO authenticated;
ALTER TABLE public.academy_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own academy profile read" ON public.academy_profiles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Own academy profile insert" ON public.academy_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Own academy profile update" ON public.academy_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.academy_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doc_type text NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  size_bytes integer NOT NULL DEFAULT 0,
  mime_type text,
  status text NOT NULL DEFAULT 'uploaded',
  reviewer_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_documents TO authenticated;
GRANT ALL ON public.academy_documents TO service_role;
ALTER TABLE public.academy_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own docs read" ON public.academy_documents FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Own docs insert" ON public.academy_documents FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'uploaded' AND file_path LIKE auth.uid()::text || '/%');
CREATE POLICY "Own docs delete while unreviewed" ON public.academy_documents FOR DELETE TO authenticated USING (user_id = auth.uid() AND status = 'uploaded');
CREATE POLICY "Admins review docs" ON public.academy_documents FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.academy_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_reference text,
  purpose text NOT NULL,
  amount_ngn integer,
  provider text NOT NULL DEFAULT 'gfa_wzip',
  status text NOT NULL DEFAULT 'pending_configuration',
  provider_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.academy_payments TO authenticated;
GRANT ALL ON public.academy_payments TO service_role;
ALTER TABLE public.academy_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own payments read" ON public.academy_payments FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Own payment intent" ON public.academy_payments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'pending_configuration' AND provider_reference IS NULL);
CREATE POLICY "Admins update payments" ON public.academy_payments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit" ON public.audit_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.write_audit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_id text; v_old jsonb; v_new jsonb;
BEGIN
  IF TG_OP = 'UPDATE' AND TG_TABLE_NAME = 'service_requests' AND OLD.status IS NOT DISTINCT FROM NEW.status THEN
    RETURN NEW;
  END IF;
  v_old := CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) END;
  v_new := CASE WHEN TG_OP IN ('UPDATE','INSERT') THEN to_jsonb(NEW) END;
  IF TG_TABLE_NAME = 'admin_invitations' THEN
    v_old := v_old - 'token_hash'; v_new := v_new - 'token_hash';
  END IF;
  v_id := coalesce(v_new->>'id', v_old->>'id', v_new->>'code', v_old->>'code');
  INSERT INTO public.audit_log(actor_id, actor_email, action, entity_type, entity_id, old_value, new_value)
  VALUES (auth.uid(), (SELECT email FROM auth.users WHERE id = auth.uid()), lower(TG_OP), TG_TABLE_NAME, v_id, v_old, v_new);
  RETURN coalesce(NEW, OLD);
END $$;

CREATE TRIGGER audit_cert_settings AFTER INSERT OR UPDATE OR DELETE ON public.certification_settings FOR EACH ROW EXECUTE FUNCTION public.write_audit();
CREATE TRIGGER audit_cert_employers AFTER INSERT OR UPDATE OR DELETE ON public.certification_employers FOR EACH ROW EXECUTE FUNCTION public.write_audit();
CREATE TRIGGER audit_request_status AFTER UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.write_audit();
CREATE TRIGGER audit_user_roles AFTER INSERT OR UPDATE OR DELETE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.write_audit();
CREATE TRIGGER audit_documents AFTER UPDATE OR DELETE ON public.academy_documents FOR EACH ROW EXECUTE FUNCTION public.write_audit();
CREATE TRIGGER audit_payments AFTER UPDATE ON public.academy_payments FOR EACH ROW EXECUTE FUNCTION public.write_audit();

CREATE TABLE public.admin_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  role public.app_role NOT NULL,
  token_hash text NOT NULL UNIQUE,
  invited_by uuid,
  expires_at timestamptz NOT NULL DEFAULT now() + interval '72 hours',
  accepted_at timestamptz,
  accepted_by uuid,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_invitations TO authenticated;
GRANT ALL ON public.admin_invitations TO service_role;
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read invitations" ON public.admin_invitations FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER audit_invitations AFTER INSERT OR UPDATE ON public.admin_invitations FOR EACH ROW EXECUTE FUNCTION public.write_audit();

CREATE OR REPLACE FUNCTION public.create_admin_invitation(p_email text, p_role public.app_role)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE v_token text;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Only administrators can invite team members'; END IF;
  IF p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(p_email) > 320 THEN RAISE EXCEPTION 'Enter a valid email address'; END IF;
  v_token := encode(extensions.gen_random_bytes(32), 'hex');
  INSERT INTO public.admin_invitations(email, role, token_hash, invited_by)
  VALUES (lower(trim(p_email)), p_role, encode(extensions.digest(v_token,'sha256'),'hex'), auth.uid());
  RETURN v_token;
END $$;

CREATE OR REPLACE FUNCTION public.revoke_admin_invitation(p_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Not allowed'; END IF;
  UPDATE public.admin_invitations SET revoked_at = now() WHERE id = p_id AND accepted_at IS NULL AND revoked_at IS NULL;
END $$;

CREATE OR REPLACE FUNCTION public.accept_admin_invitation(p_token text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE v_inv public.admin_invitations; v_email text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in first'; END IF;
  SELECT email INTO v_email FROM auth.users WHERE id = auth.uid();
  SELECT * INTO v_inv FROM public.admin_invitations WHERE token_hash = encode(extensions.digest(p_token,'sha256'),'hex');
  IF v_inv.id IS NULL THEN RAISE EXCEPTION 'Invitation not found'; END IF;
  IF v_inv.revoked_at IS NOT NULL THEN RAISE EXCEPTION 'This invitation was revoked'; END IF;
  IF v_inv.accepted_at IS NOT NULL THEN RAISE EXCEPTION 'This invitation was already used'; END IF;
  IF v_inv.expires_at < now() THEN RAISE EXCEPTION 'This invitation has expired'; END IF;
  IF lower(v_email) <> v_inv.email THEN RAISE EXCEPTION 'This invitation was sent to a different email address'; END IF;
  INSERT INTO public.user_roles(user_id, role) VALUES (auth.uid(), v_inv.role) ON CONFLICT DO NOTHING;
  UPDATE public.admin_invitations SET accepted_at = now(), accepted_by = auth.uid() WHERE id = v_inv.id;
  RETURN v_inv.role::text;
END $$;

REVOKE EXECUTE ON FUNCTION public.create_admin_invitation(text, public.app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.revoke_admin_invitation(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.accept_admin_invitation(text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.create_admin_invitation(text, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_admin_invitation(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_admin_invitation(text) TO authenticated;
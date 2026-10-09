CREATE TABLE public.admin_permissions (
  user_id uuid NOT NULL,
  permission text NOT NULL CHECK (permission IN ('view_requests','edit_content','manage_availability','manage_team')),
  granted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, permission)
);
GRANT SELECT ON public.admin_permissions TO authenticated;
GRANT ALL ON public.admin_permissions TO service_role;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id,'admin')
      OR EXISTS (SELECT 1 FROM public.admin_permissions p JOIN public.user_roles r ON r.user_id = p.user_id AND r.role = 'staff'
                 WHERE p.user_id = _user_id AND p.permission = _permission)
$$;

CREATE POLICY "Own or admin read permissions" ON public.admin_permissions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_permission(auth.uid(),'manage_team'));

CREATE OR REPLACE FUNCTION public.set_admin_permission(p_user_id uuid, p_permission text, p_granted boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Only full administrators can change permissions'; END IF;
  IF p_permission NOT IN ('view_requests','edit_content','manage_availability','manage_team') THEN RAISE EXCEPTION 'Unknown permission'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = p_user_id AND role = 'staff') THEN RAISE EXCEPTION 'Permissions can only be given to staff members'; END IF;
  IF p_granted THEN
    INSERT INTO public.admin_permissions(user_id, permission, granted_by) VALUES (p_user_id, p_permission, auth.uid()) ON CONFLICT DO NOTHING;
  ELSE
    DELETE FROM public.admin_permissions WHERE user_id = p_user_id AND permission = p_permission;
  END IF;
END $$;
REVOKE EXECUTE ON FUNCTION public.set_admin_permission(uuid,text,boolean) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.set_admin_permission(uuid,text,boolean) TO authenticated;

CREATE OR REPLACE FUNCTION public.list_team_members()
RETURNS TABLE(user_id uuid, email text, role text, permissions text[]) LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_permission(auth.uid(),'manage_team') THEN RAISE EXCEPTION 'Not allowed'; END IF;
  RETURN QUERY
    SELECT r.user_id, u.email::text, r.role::text,
           coalesce(array_agg(p.permission) FILTER (WHERE p.permission IS NOT NULL), '{}')
    FROM public.user_roles r JOIN auth.users u ON u.id = r.user_id
    LEFT JOIN public.admin_permissions p ON p.user_id = r.user_id
    GROUP BY r.user_id, u.email, r.role ORDER BY r.role, u.email;
END $$;
REVOKE EXECUTE ON FUNCTION public.list_team_members() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.list_team_members() TO authenticated;

CREATE TRIGGER audit_admin_permissions AFTER INSERT OR DELETE ON public.admin_permissions FOR EACH ROW EXECUTE FUNCTION public.write_audit();

CREATE POLICY "Staff with request access view requests" ON public.service_requests FOR SELECT TO authenticated USING (public.has_permission(auth.uid(),'view_requests'));
CREATE POLICY "Staff with request access update requests" ON public.service_requests FOR UPDATE TO authenticated USING (public.has_permission(auth.uid(),'view_requests')) WITH CHECK (public.has_permission(auth.uid(),'view_requests'));
CREATE POLICY "Staff with request access read electricity requests" ON public.electricity_token_requests FOR SELECT TO authenticated USING (public.has_permission(auth.uid(),'view_requests'));
CREATE POLICY "Staff with request access update electricity requests" ON public.electricity_token_requests FOR UPDATE TO authenticated USING (public.has_permission(auth.uid(),'view_requests')) WITH CHECK (public.has_permission(auth.uid(),'view_requests'));

DROP POLICY "Admins update notice" ON public.site_notices;
CREATE POLICY "Content editors update notice" ON public.site_notices FOR UPDATE TO authenticated USING (public.has_permission(auth.uid(),'edit_content')) WITH CHECK (public.has_permission(auth.uid(),'edit_content'));
DROP POLICY "Admins update service status" ON public.service_statuses;
CREATE POLICY "Availability managers update status" ON public.service_statuses FOR UPDATE TO authenticated USING (public.has_permission(auth.uid(),'manage_availability')) WITH CHECK (public.has_permission(auth.uid(),'manage_availability'));

CREATE POLICY "Team managers read invitations" ON public.admin_invitations FOR SELECT TO authenticated USING (public.has_permission(auth.uid(),'manage_team'));
CREATE POLICY "Team managers read audit" ON public.audit_log FOR SELECT TO authenticated USING (public.has_permission(auth.uid(),'manage_team'));

CREATE OR REPLACE FUNCTION public.create_admin_invitation(p_email text, p_role app_role)
 RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'extensions'
AS $function$
DECLARE v_token text;
BEGIN
  IF NOT public.has_permission(auth.uid(),'manage_team') THEN RAISE EXCEPTION 'You do not have permission to invite team members'; END IF;
  IF p_role = 'admin' AND NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Only full administrators can invite another administrator'; END IF;
  IF p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(p_email) > 320 THEN RAISE EXCEPTION 'Enter a valid email address'; END IF;
  v_token := encode(extensions.gen_random_bytes(32), 'hex');
  INSERT INTO public.admin_invitations(email, role, token_hash, invited_by)
  VALUES (lower(trim(p_email)), p_role, encode(extensions.digest(v_token,'sha256'),'hex'), auth.uid());
  RETURN v_token;
END $function$;

CREATE OR REPLACE FUNCTION public.revoke_admin_invitation(p_id uuid)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_permission(auth.uid(),'manage_team') THEN RAISE EXCEPTION 'Not allowed'; END IF;
  UPDATE public.admin_invitations SET revoked_at = now() WHERE id = p_id AND accepted_at IS NULL AND revoked_at IS NULL;
END $function$;
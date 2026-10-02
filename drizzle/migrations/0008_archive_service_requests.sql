ALTER TABLE public.service_requests
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_by uuid,
  ADD COLUMN IF NOT EXISTS delete_reason text;

CREATE OR REPLACE FUNCTION public.archive_service_request(p_id uuid, p_reason text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Not allowed'; END IF;
  UPDATE public.service_requests SET deleted_at = now(), deleted_by = auth.uid(), delete_reason = left(p_reason, 500), updated_at = now()
  WHERE id = p_id AND deleted_at IS NULL;
END $$;

CREATE OR REPLACE FUNCTION public.restore_service_request(p_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Not allowed'; END IF;
  UPDATE public.service_requests SET deleted_at = NULL, deleted_by = NULL, delete_reason = NULL, updated_at = now()
  WHERE id = p_id AND deleted_at IS NOT NULL;
END $$;

REVOKE EXECUTE ON FUNCTION public.archive_service_request(uuid, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.restore_service_request(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.archive_service_request(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.restore_service_request(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.write_audit()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_id text; v_old jsonb; v_new jsonb; v_action text := lower(TG_OP);
BEGIN
  IF TG_OP = 'UPDATE' AND TG_TABLE_NAME = 'service_requests' THEN
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN v_action := 'archive';
    ELSIF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN v_action := 'restore';
    ELSIF OLD.status IS NOT DISTINCT FROM NEW.status THEN RETURN NEW;
    END IF;
  END IF;
  v_old := CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) END;
  v_new := CASE WHEN TG_OP IN ('UPDATE','INSERT') THEN to_jsonb(NEW) END;
  IF TG_TABLE_NAME = 'admin_invitations' THEN
    v_old := v_old - 'token_hash'; v_new := v_new - 'token_hash';
  END IF;
  v_id := coalesce(v_new->>'id', v_old->>'id', v_new->>'code', v_old->>'code');
  INSERT INTO public.audit_log(actor_id, actor_email, action, entity_type, entity_id, old_value, new_value)
  VALUES (auth.uid(), (SELECT email FROM auth.users WHERE id = auth.uid()), v_action, TG_TABLE_NAME, v_id, v_old, v_new);
  RETURN coalesce(NEW, OLD);
END $function$;

DROP POLICY IF EXISTS "Users can view own requests" ON public.service_requests;
CREATE POLICY "Users can view own requests" ON public.service_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);
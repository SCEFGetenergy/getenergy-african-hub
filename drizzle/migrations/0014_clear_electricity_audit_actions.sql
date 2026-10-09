CREATE OR REPLACE FUNCTION public.write_electricity_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE v_id text; v_old jsonb; v_new jsonb; v_action text := lower(TG_OP);
BEGIN
  v_old := CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) END;
  v_new := CASE WHEN TG_OP IN ('UPDATE','INSERT') THEN to_jsonb(NEW) END;
  IF TG_OP = 'UPDATE' THEN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      v_action := 'status_change';
    ELSIF NEW.admin_notes IS DISTINCT FROM OLD.admin_notes
      AND NEW.full_name IS NOT DISTINCT FROM OLD.full_name
      AND NEW.disco IS NOT DISTINCT FROM OLD.disco
      AND NEW.meter_number IS NOT DISTINCT FROM OLD.meter_number
      AND NEW.amount_ngn IS NOT DISTINCT FROM OLD.amount_ngn
      AND NEW.assigned_to IS NOT DISTINCT FROM OLD.assigned_to THEN
      v_action := 'note_update';
    END IF;
  END IF;
  v_id := coalesce(v_new->>'request_reference', v_old->>'request_reference', v_new->>'transaction_reference', v_old->>'transaction_reference', v_new->>'id', v_old->>'id');
  INSERT INTO public.audit_log (actor_id,actor_email,action,entity_type,entity_id,old_value,new_value)
  VALUES (auth.uid(),(SELECT email FROM auth.users WHERE id=auth.uid()),v_action,TG_TABLE_NAME,v_id,v_old,v_new);
  RETURN coalesce(NEW,OLD);
END
$function$;
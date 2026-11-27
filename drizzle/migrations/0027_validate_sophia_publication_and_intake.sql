CREATE OR REPLACE FUNCTION public.submit_sophia_intake(p_thread_id uuid,p_visitor_token text,p_service_key text,p_contact jsonb,p_answers jsonb,p_bucket text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE ref text; token text; saved integer; k text=nullif(p_service_key,''); BEGIN
IF NOT EXISTS(SELECT 1 FROM public.sophia_threads WHERE id=p_thread_id AND visitor_token=p_visitor_token) THEN RAISE EXCEPTION 'Conversation not found'; END IF;
IF NOT public.electricity_hit_rate_limit('sophia-intake:'||left(p_bucket,100),5,600) THEN RAISE EXCEPTION 'Too many submissions'; END IF;
IF k IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.intake_question_sets WHERE service_key=k) THEN RAISE EXCEPTION 'Unknown service'; END IF;
IF p_contact IS NULL OR jsonb_typeof(p_contact)<>'object' OR length(coalesce(p_contact->>'summary',''))>4000 THEN RAISE EXCEPTION 'Invalid enquiry'; END IF;
IF EXISTS(SELECT 1 FROM public.service_requests WHERE request_type='sophia' AND details->>'thread_id'=p_thread_id::text AND deleted_at IS NULL) THEN RAISE EXCEPTION 'An enquiry is already saved for this conversation'; END IF;
ref=public.submit_service_request('sophia',left(p_contact->>'service',160),p_contact->>'contact_name',coalesce(p_contact->>'contact_email',''),coalesce(p_contact->>'contact_phone',''),coalesce(p_contact->>'company',''),coalesce(p_contact->>'location',''),jsonb_build_object('source','SOPHIA','thread_id',p_thread_id,'summary',p_contact->>'summary','intake_service_key',k));
IF ref='RATE_LIMITED' OR ref IS NULL THEN RAISE EXCEPTION 'Request could not be saved'; END IF;
token=public.issue_intake_token(ref); saved=public.save_intake_answers(ref,token,NULL,p_bucket,p_answers,'sophia');
RETURN jsonb_build_object('reference',ref,'saved',saved); END $$;
CREATE FUNCTION public.validate_kb_publish() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
IF NEW.status='published' AND trim(NEW.answer)='To confirm with the team' THEN RAISE EXCEPTION 'Confirm this answer before publishing'; END IF;
IF cardinality(NEW.keywords)>50 THEN RAISE EXCEPTION 'Use at most 50 keywords'; END IF;
IF NEW.topic_id='payments' AND NEW.status='published' AND position('GET Energy never asks for payment by email or chat; only pay through a method our team confirms in writing.' IN NEW.answer)=0 THEN RAISE EXCEPTION 'Payments answers must include the payment safety warning'; END IF;
RETURN NEW; END $$;
CREATE TRIGGER validate_kb_publish BEFORE INSERT OR UPDATE ON public.kb_entries FOR EACH ROW EXECUTE FUNCTION public.validate_kb_publish();
CREATE FUNCTION public.validate_intake_questions() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ DECLARE q jsonb; seen text[]='{}'; BEGIN
FOR q IN SELECT value FROM jsonb_array_elements(NEW.questions) LOOP
IF jsonb_typeof(q)<>'object' OR jsonb_typeof(q->'key')<>'string' OR jsonb_typeof(q->'text')<>'string' OR jsonb_typeof(q->'required')<>'boolean' OR length(q->>'key') NOT BETWEEN 1 AND 80 OR length(q->>'text') NOT BETWEEN 2 AND 1000 OR (q->>'key')=ANY(seen) THEN RAISE EXCEPTION 'Questions need unique keys, text and a required flag'; END IF;
seen=array_append(seen,q->>'key'); END LOOP; RETURN NEW; END $$;
CREATE TRIGGER validate_intake_questions BEFORE INSERT OR UPDATE ON public.intake_question_sets FOR EACH ROW EXECUTE FUNCTION public.validate_intake_questions();
REVOKE UPDATE ON public.unanswered_questions FROM authenticated;
GRANT UPDATE(status) ON public.unanswered_questions TO authenticated;
CREATE FUNCTION public.guard_unanswered_status() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
IF NEW.status='answered' AND NEW.answer_entry_id IS NULL THEN RAISE EXCEPTION 'Use Answer & publish to resolve the question'; END IF;
RETURN NEW; END $$;
CREATE TRIGGER guard_unanswered_status BEFORE UPDATE ON public.unanswered_questions FOR EACH ROW EXECUTE FUNCTION public.guard_unanswered_status();
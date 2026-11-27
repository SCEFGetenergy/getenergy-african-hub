ALTER TABLE public.unanswered_questions ADD COLUMN alert_status text NOT NULL DEFAULT 'pending', ADD COLUMN alert_provider_status integer, ADD COLUMN reply_status text NOT NULL DEFAULT 'not_requested', ADD COLUMN reply_provider_status integer;
CREATE OR REPLACE FUNCTION public.validate_intake_questions() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ DECLARE q jsonb; seen text[]='{}'; BEGIN
FOR q IN SELECT value FROM jsonb_array_elements(NEW.questions) LOOP
IF coalesce(jsonb_typeof(q),'')<>'object' OR coalesce(jsonb_typeof(q->'key'),'')<>'string' OR coalesce(jsonb_typeof(q->'text'),'')<>'string' OR coalesce(jsonb_typeof(q->'required'),'')<>'boolean' OR coalesce(length(q->>'key'),0) NOT BETWEEN 1 AND 80 OR coalesce(length(q->>'text'),0) NOT BETWEEN 2 AND 1000 OR (q->>'key')=ANY(seen) THEN RAISE EXCEPTION 'Questions need unique keys, text and a required flag'; END IF;
seen=array_append(seen,q->>'key'); END LOOP; RETURN NEW; END $$;
CREATE OR REPLACE FUNCTION public.save_intake_answers(p_reference text,p_token text,p_user_id uuid,p_bucket text,p_answers jsonb,p_via text DEFAULT 'web') RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE v_form jsonb; item jsonb; v_question jsonb; v_count integer=0; v_inserted integer; BEGIN
v_form=public.get_intake_form(p_reference,p_token,p_user_id,p_bucket);
IF NOT public.electricity_hit_rate_limit('intake-save:ip:'||left(p_bucket,100),10,600) OR NOT public.electricity_hit_rate_limit('intake-save:ref:'||p_reference,10,600) THEN RAISE EXCEPTION 'Too many answers. Please try later.'; END IF;
IF p_answers IS NULL OR jsonb_typeof(p_answers)<>'array' OR jsonb_array_length(p_answers)>30 OR p_via IS NULL OR p_via NOT IN ('sophia','web','email') THEN RAISE EXCEPTION 'Invalid answers'; END IF;
FOR item IN SELECT value FROM jsonb_array_elements(p_answers) LOOP
IF coalesce(jsonb_typeof(item->'answer'),'')<>'string' OR coalesce(jsonb_typeof(item->'key'),'')<>'string' OR coalesce(length(trim(item->>'answer')),0) NOT BETWEEN 1 AND 2000 THEN RAISE EXCEPTION 'Answer must contain 1 to 2000 characters'; END IF;
SELECT q INTO v_question FROM public.intake_requests r JOIN public.intake_question_sets s ON s.service_key=r.service_key, jsonb_array_elements(s.questions) q WHERE r.reference=p_reference AND s.status='published' AND q->>'key'=item->>'key';
IF v_question IS NULL THEN RAISE EXCEPTION 'Unknown question'; END IF;
INSERT INTO public.intake_answers(request_reference,question_key,question_text,answer,answered_via) VALUES(p_reference,item->>'key',v_question->>'text',trim(item->>'answer'),p_via) ON CONFLICT(request_reference,question_key) DO NOTHING;
GET DIAGNOSTICS v_inserted=ROW_COUNT; v_count=v_count+v_inserted;
END LOOP; RETURN v_count; END $$;
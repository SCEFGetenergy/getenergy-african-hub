DROP POLICY topics_read ON public.kb_topics;
CREATE POLICY topics_public_read ON public.kb_topics FOR SELECT TO anon USING(status='published');
CREATE POLICY topics_authenticated_read ON public.kb_topics FOR SELECT TO authenticated USING(status='published' OR public.has_permission(auth.uid(),'edit_content'));
DROP POLICY entries_read ON public.kb_entries;
CREATE POLICY entries_public_read ON public.kb_entries FOR SELECT TO anon USING(status='published' AND EXISTS(SELECT 1 FROM public.kb_topics t WHERE t.id=topic_id AND t.status='published'));
CREATE POLICY entries_authenticated_read ON public.kb_entries FOR SELECT TO authenticated USING((status='published' AND EXISTS(SELECT 1 FROM public.kb_topics t WHERE t.id=topic_id AND t.status='published')) OR public.has_permission(auth.uid(),'edit_content'));
DROP POLICY sets_read ON public.intake_question_sets;
CREATE POLICY sets_public_read ON public.intake_question_sets FOR SELECT TO anon USING(status='published');
CREATE POLICY sets_authenticated_read ON public.intake_question_sets FOR SELECT TO authenticated USING(status='published' OR public.has_permission(auth.uid(),'edit_content'));
CREATE OR REPLACE FUNCTION public.get_intake_form(p_reference text,p_token text,p_user_id uuid,p_bucket text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE r public.intake_requests; q jsonb; BEGIN
IF NOT public.electricity_hit_rate_limit('intake-read:'||left(p_bucket,100),60,600) THEN RAISE EXCEPTION 'Too many requests'; END IF;
SELECT * INTO r FROM public.intake_requests WHERE reference=p_reference;
IF r.reference IS NULL OR NOT (coalesce(r.user_id=p_user_id,false) OR EXISTS(SELECT 1 FROM public.intake_access_tokens WHERE request_reference=p_reference AND token_hash=encode(extensions.digest(coalesce(p_token,''),'sha256'),'hex') AND expires_at>now())) THEN RAISE EXCEPTION 'This link is invalid or expired. Use the link in your email or sign in to your own account.'; END IF;
IF r.request_table='service_requests' AND NOT EXISTS(SELECT 1 FROM public.service_requests WHERE id=r.request_id AND deleted_at IS NULL) THEN RAISE EXCEPTION 'Request not found'; END IF;
SELECT coalesce(jsonb_agg(item),'[]'::jsonb) INTO q FROM public.intake_question_sets s, jsonb_array_elements(s.questions) item WHERE s.service_key=r.service_key AND s.status='published' AND NOT EXISTS(SELECT 1 FROM public.intake_answers a WHERE a.request_reference=p_reference AND a.question_key=item->>'key');
RETURN jsonb_build_object('reference',r.reference,'service_key',r.service_key,'questions',coalesce(q,'[]'::jsonb)); END $$;
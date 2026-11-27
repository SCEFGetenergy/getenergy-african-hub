import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { KNOWLEDGE } from './knowledge';
import { createIndex } from './search';
import { publishedEntries } from './intake';

const url=process.env['SUPABASE_URL']; const pub=process.env['SUPABASE_PUBLISHABLE_KEY']; const key=process.env['SUPABASE_SERVICE_ROLE_KEY'];
const enabled=!!(url&&pub&&key);
function client(secret:string) {
  if(!url) throw new Error('Backend unavailable');
  return createClient<Database>(url,secret,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{const headers=new Headers(init?.headers);if(secret.startsWith('sb_')&&headers.get('Authorization')===`Bearer ${secret}`) headers.delete('Authorization');headers.set('apikey',secret);return fetch(input,{...init,headers});}}});
}
describe.skipIf(!enabled)('SOPHIA live database boundaries',()=>{
  let service:SupabaseClient<Database>; let anonymous:SupabaseClient<Database>; let editor:SupabaseClient<Database>; let staff:SupabaseClient<Database>;
  const users:string[]=[]; const threads:string[]=[]; const refs:string[]=[];
  let reference=''; let token=''; let threadId=''; let visitorToken=''; let entryId=''; let unknownId=''; let editorId=''; let staffId='';
  const stamp=`qa-sophia-${Date.now()}`;
  const nil='00000000-0000-0000-0000-000000000000';
  beforeAll(async()=>{
    if(!key||!pub) throw new Error('Backend unavailable');service=client(key);anonymous=client(pub);
    for(const kind of ['editor','staff']) {
      const email=`${stamp}-${kind}@getenergytest.dev`;const password=`T${crypto.randomUUID()}a1!`;
      const user=await service.auth.admin.createUser({email,password,email_confirm:true});if(user.error||!user.data.user) throw user.error||new Error('User not created');
      const id=user.data.user.id;users.push(id);
      const role=await service.from('user_roles').insert({user_id:id,role:'staff'});if(role.error) throw role.error;
      if(kind==='editor'){editorId=id;const permission=await service.from('admin_permissions').insert({user_id:id,permission:'edit_content'});if(permission.error) throw permission.error;} else staffId=id;
      const account=client(pub);const session=await account.auth.signInWithPassword({email,password});if(session.error) throw session.error;
      if(kind==='editor') editor=account;else staff=account;
    }
    visitorToken=`${crypto.randomUUID()}${crypto.randomUUID()}`;
    const thread=await service.from('sophia_threads').insert({visitor_token:visitorToken,title:stamp}).select('id').single();if(thread.error) throw thread.error;threadId=thread.data.id;threads.push(threadId);
    const registration=await service.rpc('submit_sophia_intake',{p_thread_id:threadId,p_visitor_token:visitorToken,p_service_key:'academy',p_contact:{service:'Academy Solar training',contact_name:'QA Test Learner',contact_email:`${stamp}@getenergytest.dev`,contact_phone:'+2348180000000',summary:'QA Academy intake'},p_answers:[{key:'q1',answer:'Electrical engineering diploma'}],p_bucket:stamp});
    if(registration.error) throw registration.error;
    const data=registration.data as {reference?:string}; if(!data.reference) throw new Error('No reference'); reference=data.reference;refs.push(reference);
    const issued=await service.rpc('issue_intake_token',{p_reference:reference});if(issued.error||!issued.data) throw issued.error||new Error('No token');token=issued.data;
  },30000);
  afterAll(async()=>{
    if(!service) return;
    for(const ref of refs){await service.from('intake_requests').delete().eq('reference',ref);await service.from('service_requests').delete().eq('reference',ref);}
    for(const id of threads) await service.from('sophia_threads').delete().eq('id',id);
    for(const id of [entryId,`${stamp}-bad`,`${stamp}-unauth`]) if(id) await service.from('kb_entries').delete().eq('id',id);
    for(const id of users) await service.auth.admin.deleteUser(id);
  },30000);
  it('imports all 51 existing entries verbatim and searches the published database',async()=>{
    const result=await anonymous.from('kb_entries').select('id,topic_id,question,answer,keywords,link_label,link_href,status').eq('status','published');expect(result.error).toBeNull();
    for(const fixture of KNOWLEDGE){const row=result.data?.find(row=>row.id===fixture.id);expect(row?.answer).toBe(fixture.answer);expect(row?.question).toBe(fixture.question);expect(row?.keywords).toEqual(fixture.keywords??[]);expect(row?.link_href??undefined).toBe(fixture.link?.href);expect(row?.link_label??undefined).toBe(fixture.link?.label);}
    const search=createIndex(publishedEntries(result.data??[]));expect(search('how long to charge my car').map(hit=>hit.entry.id)).toContain('chg-time');
  });
  it('does not expose draft rows to anonymous visitors or unprivileged staff',async()=>{
    for(const actor of [anonymous,staff]) {const result=await actor.from('kb_entries').select('id').eq('status','draft');expect(result.error).toBeNull();expect(result.data).toEqual([]);}
  });
  it('allows content editors to create a draft and publish it',async()=>{
    const inserted=await editor.from('kb_entries').insert({id:stamp,topic_id:'contact',question:'QA known routing question',answer:'Please contact the team for QA.',status:'draft'}).select('id').single();expect(inserted.error).toBeNull();entryId=inserted.data?.id??'';
    const updated=await editor.from('kb_entries').update({status:'published'}).eq('id',entryId).select('id');expect(updated.error).toBeNull();expect(updated.data).toHaveLength(1);
  });
  it('denies knowledge writes without edit_content',async()=>{
    for(const actor of [anonymous,staff]){const inserted=await actor.from('kb_entries').insert({id:`${stamp}-unauth`,topic_id:'contact',question:'Bad entry',answer:'Unauthorised'});expect(inserted.error).not.toBeNull();const updated=await actor.from('kb_entries').update({answer:'Unauthorised'}).eq('id',entryId).select('id');expect(updated.error!==null||(updated.data??[]).length===0).toBe(true);const removed=await actor.from('kb_entries').delete().eq('id',entryId).select('id');expect(removed.error!==null||(removed.data??[]).length===0).toBe(true);}
  });
  it('denies publishing an unconfirmed answer',async()=>{const result=await editor.from('kb_entries').insert({id:`${stamp}-bad`,topic_id:'contact',question:'An unconfirmed fact?',answer:'To confirm with the team',status:'published'});expect(result.error?.message).toContain('Confirm');});
  it('requires payment safety wording on published payment answers',async()=>{const result=await editor.from('kb_entries').insert({id:`${stamp}-bad`,topic_id:'payments',question:'Payment method?',answer:'A payment answer without the safety warning',status:'published'});expect(result.error?.message).toContain('payment safety');});
  it('logs unknown questions and deduplicates email follow-up',async()=>{
    const input={p_thread_id:threadId,p_visitor_token:visitorToken,p_question:`${stamp} unknown question`,p_page:'/sophia',p_email:'',p_bucket:stamp};
    const first=await service.rpc('log_sophia_unanswered',input);expect(first.error).toBeNull();unknownId=first.data??'';
    const second=await service.rpc('log_sophia_unanswered',{...input,p_email:'ccgetenergy@gmail.com'});expect(second.error).toBeNull();expect(second.data).toBe(unknownId);
    const saved=await service.from('unanswered_questions').select('visitor_email').eq('id',unknownId).single();expect(saved.data?.visitor_email).toBe('ccgetenergy@gmail.com');
  });
  it('denies logging into another visitor conversation',async()=>{const result=await service.rpc('log_sophia_unanswered',{p_thread_id:threadId,p_visitor_token:'wrong-token',p_question:'Unknown question',p_page:'/sophia',p_email:'',p_bucket:stamp});expect(result.error?.message).toContain('Conversation not found');});
  it('denies anonymous access to private answers and unanswered questions',async()=>{
    for(const actor of [anonymous,staff]){const answers=await actor.from('intake_answers').select('id');expect(answers.error!==null||(answers.data??[]).length===0).toBe(true);const queue=await actor.from('unanswered_questions').select('id');expect(queue.error!==null||(queue.data??[]).length===0).toBe(true);}
  });
  it('content editors can answer and publish atomically',async()=>{
    const answered=await editor.rpc('answer_publish_unanswered',{p_id:unknownId,p_topic:'contact',p_answer:'A confirmed test answer.'});expect(answered.error).toBeNull();
    if(answered.data){const result=await service.from('unanswered_questions').select('status,answer_entry_id').eq('id',unknownId).single();expect(result.data?.status).toBe('answered');expect(result.data?.answer_entry_id).toBe(answered.data);await service.from('unanswered_questions').delete().eq('id',unknownId);await service.from('kb_entries').delete().eq('id',answered.data);}
  });
  it('a reference alone or an unrelated signed-in account cannot read intake',async()=>{
    for(const userId of [nil,staffId]) {const result=await service.rpc('get_intake_form',{p_reference:reference,p_token:'',p_user_id:userId,p_bucket:stamp});expect(result.error?.message).toContain('invalid or expired');}
    const publicRpc=await anonymous.rpc('get_intake_form',{p_reference:reference,p_token:token,p_user_id:nil,p_bucket:stamp});expect(publicRpc.error).not.toBeNull();
  });
  it('omits already answered questions from the secure web form',async()=>{
    const form=await service.rpc('get_intake_form',{p_reference:reference,p_token:token,p_user_id:nil,p_bucket:stamp});expect(form.error).toBeNull();const payload=form.data as {questions:{key:string}[]};expect(payload.questions).toHaveLength(7);expect(payload.questions.some(question=>question.key==='q1')).toBe(false);
  });
  it('validates question keys, answer length and existing references',async()=>{
    const base={p_reference:reference,p_token:token,p_user_id:nil,p_bucket:stamp,p_via:'web'};
    const invalid=await service.rpc('save_intake_answers',{...base,p_answers:[{key:'not-a-question',answer:'bad'}]});expect(invalid.error?.message).toContain('Unknown question');
    const long=await service.rpc('save_intake_answers',{...base,p_answers:[{key:'q2',answer:'a'.repeat(2001)}]});expect(long.error?.message).toContain('2000');
    const missing=await service.rpc('save_intake_answers',{...base,p_reference:'GE-MISSING-REF',p_answers:[]});expect(missing.error).not.toBeNull();
  });
  it('saves web answers without replacing chat answers',async()=>{
    const result=await service.rpc('save_intake_answers',{p_reference:reference,p_token:token,p_user_id:nil,p_bucket:stamp,p_via:'web',p_answers:[{key:'q1',answer:'Overwrite attempt'},{key:'q2',answer:'Two years of solar experience'}]});expect(result.error).toBeNull();expect(result.data).toBe(1);
    const saved=await service.from('intake_answers').select('answer,answered_via').eq('request_reference',reference).eq('question_key','q1').single();expect(saved.data).toEqual({answer:'Electrical engineering diploma',answered_via:'sophia'});
  });
  it('blocks expired answer tokens',async()=>{
    await service.from('intake_access_tokens').update({expires_at:'2020-01-01T00:00:00Z'}).eq('request_reference',reference);
    const result=await service.rpc('get_intake_form',{p_reference:reference,p_token:token,p_user_id:nil,p_bucket:stamp});expect(result.error).not.toBeNull();
    await service.from('intake_access_tokens').update({expires_at:new Date(Date.now()+86400000).toISOString()}).eq('request_reference',reference);
  });
  it('rate-limits intake writes after ten saves per ten minutes',async()=>{
    const bucket=`${stamp}-rate`;let accepted=0;let denied=false;
    // Earlier successful saves count against this reference, so the limit is no higher than ten.
    for(let index=0;index<11;index++){const result=await service.rpc('save_intake_answers',{p_reference:reference,p_token:token,p_user_id:nil,p_bucket:bucket,p_via:'web',p_answers:[]});if(result.error){expect(result.error.message).toContain('Too many answers');denied=true;break;}accepted++;}
    expect(denied).toBe(true);expect(accepted).toBeLessThanOrEqual(10);
  });
});
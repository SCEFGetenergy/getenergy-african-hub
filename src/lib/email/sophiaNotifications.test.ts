import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendQuestionNotification } from './sophiaNotifications.server';
const row={id:'test-unknown',question:'Where is the confirmed charging station?',page:'/ev',status:'new',visitor_email:null,answer_entry_id:null};
const config={key:'test-only',ownerFrom:'GetEnergy Website <onboarding@resend.dev>',visitorFrom:''};
afterEach(()=>vi.unstubAllGlobals());
describe('SOPHIA unanswered notifications',()=>{
  it('alerts the team for a new unanswered question',async()=>{
    let payload:Record<string,unknown>={};vi.stubGlobal('fetch',async(_input:unknown,init:RequestInit)=>{payload=JSON.parse(String(init.body));return new Response('{}',{status:200});});
    const response=await sendQuestionNotification(row,null,config);expect(response.status).toBe(200);expect(payload['to']).toEqual(['ccgetenergy@gmail.com']);expect(payload['subject']).toBe("SOPHIA couldn't answer: Where is the confirmed charging station?");
  });
  it('skips visitor answers without a configured sender',async()=>{
    const fetch=vi.fn();vi.stubGlobal('fetch',fetch);const response=await sendQuestionNotification({...row,status:'answered',visitor_email:'person@example.com'},'Confirmed answer',config);expect((await response.json()).status).toBe('visitor_reply_skipped');expect(fetch).not.toHaveBeenCalled();
  });
  it('sends confirmed answers to visitors after sender configuration',async()=>{
    let payload:Record<string,unknown>={};vi.stubGlobal('fetch',async(_input:unknown,init:RequestInit)=>{payload=JSON.parse(String(init.body));return new Response('{}',{status:200});});
    await sendQuestionNotification({...row,status:'answered',visitor_email:'person@example.com'},'Confirmed answer',{...config,visitorFrom:'GET Energy <hello@notify.getenergy.ng>'});expect(payload['to']).toEqual(['person@example.com']);expect(payload['reply_to']).toBe('ccgetenergy@gmail.com');
  });
  it('reports a provider failure without throwing into the chat submission',async()=>{
    vi.stubGlobal('fetch',async()=>new Response('Invalid key',{status:400}));const response=await sendQuestionNotification(row,null,config);expect(response.status).toBe(502);expect(await response.json()).toEqual({status:'failed',provider_status:400});
  });
});
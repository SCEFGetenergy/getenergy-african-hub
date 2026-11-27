import { visitorReplyAllowed, REPLY_INBOX } from './visitorReplies';
type QuestionNotification = { id: string; question: string; page: string; status: string; visitor_email: string | null; answer_entry_id: string | null };
export async function sendQuestionNotification(row: QuestionNotification, answer: string | null, config: { key: string; ownerFrom: string; visitorFrom: string }) {
  const isAnswer = row.status === 'answered' && answer;
  const to = isAnswer ? row.visitor_email : REPLY_INBOX;
  if (!to || (isAnswer && !visitorReplyAllowed(to,config.visitorFrom))) {
    console.info('visitor reply skipped: no verified sender'); return Response.json({status:'visitor_reply_skipped'});
  }
  const subject = isAnswer ? `GET Energy's answer: ${row.question.slice(0,60)}` : `SOPHIA couldn't answer: ${row.question.slice(0,60)}`;
  const text = isAnswer ? `You asked: ${row.question}\n\n${answer}\n\nRead more: https://getenergy.ng/answers\n\nQuestions? WhatsApp +234 818 074 2835 or reply to this email. GET Energy never asks for payment by email.` : `${row.question}\n\nPage: ${row.page}\nVisitor email: ${row.visitor_email || 'Not supplied'}\nReview in the admin Unanswered tab.`;
  try {
    const response = await fetch('https://api.resend.com/emails',{method:'POST',signal:AbortSignal.timeout(8000),headers:{Authorization:`Bearer ${config.key}`,'Content-Type':'application/json','Idempotency-Key':`sophia-${isAnswer ? 'answer' : 'unknown'}-${row.id}`},body:JSON.stringify({from:isAnswer ? config.visitorFrom || 'GET Energy <onboarding@resend.dev>' : config.ownerFrom,to:[to],reply_to:REPLY_INBOX,subject,text,...(isAnswer ? {html:`<p>${text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')}</p>`} : {})})});
    const body = await response.text();
    if(!response.ok) console.error(`SOPHIA notification failed [${response.status}]: ${body.slice(0,500)}`);
    else console.info(`SOPHIA notification accepted [${response.status}] ${row.id}`);
    return Response.json({status:response.ok?'sent':'failed',provider_status:response.status},{status:response.ok?200:502});
  } catch(error) {console.error('SOPHIA notification network failure',error instanceof Error ? error.name : 'Unknown');return Response.json({status:'failed'},{status:502});}
}
import { createFileRoute } from "@tanstack/react-router";

// Called by the database after each new lead (notify_new_lead trigger).
// The caller is verified with a private token stored in the database.
const STAFF_INBOX = "ccgetenergy@gmail.com";

type Lead = Record<string, unknown>;

function compose(table: string, row: Lead) {
  const isElec = table === "electricity_token_requests";
  const ref = String(isElec ? row["request_reference"] : row["reference"]);
  const lines = isElec
    ? [
        `Reference: ${ref}`, "Type: Electricity token request",
        `Name: ${row["full_name"]}`, `Email: ${row["email"]}`, `Phone: ${row["phone"]}`,
        `Location: ${row["city_lga"]}, ${row["state"]}`,
        `DISCO: ${row["disco"]}`, `Meter: ${row["meter_type"]} ${row["meter_number"]}`, `Amount: ₦${row["amount_ngn"]}`,
      ]
    : [
        `Reference: ${ref}`, `Type: ${row["request_type"]} — ${row["service_name"]}`,
        `Name: ${row["contact_name"]}`, `Email: ${row["contact_email"] || "-"}`, `Phone: ${row["contact_phone"] || "-"}`,
        `Company: ${row["company_name"] || "-"}`, `Location: ${row["location"] || "-"}`,
        ...Object.entries((row["details"] as Record<string, unknown>) ?? {}).map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`),
      ];
  const leadEmail = String((isElec ? row["email"] : row["contact_email"]) ?? "").trim();
  const replyTo = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(leadEmail) ? leadEmail : undefined;
  return { to: STAFF_INBOX, subject: `New GetEnergy request ${ref}`, text: lines.join("\n"), replyTo };
}

export const Route = createFileRoute("/api/public/lead-alert")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("x-alert-token") ?? "";
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: ok } = await supabaseAdmin.rpc("check_lead_alert_token", { p_token: token });
        if (ok !== true) return new Response("Forbidden", { status: 403 });
        const body = (await request.json().catch(() => null)) as { table?: string; id?: string } | null;
        const table = body?.table;
        if ((table !== "service_requests" && table !== "electricity_token_requests" && table !== 'unanswered_questions') || !body?.id) {
          return new Response("Bad request", { status: 400 });
        }
        const { data: row } = await supabaseAdmin.from(table).select("*").eq("id", body.id).maybeSingle();
        if (!row) return new Response("Not found", { status: 404 });
        if (table === 'unanswered_questions') {
          const key = process.env['RESEND_API_KEY'];
          const question = row as {id:string;question:string;page:string;status:string;visitor_email:string|null;answer_entry_id:string|null};
          if(question.status==='dismissed') return Response.json({status:'skipped'});
          const answered = question.status === 'answered';
          if (!key) {
            await supabaseAdmin.from('unanswered_questions').update(answered ? {reply_status:'email_not_configured'} : {alert_status:'email_not_configured'}).eq('id',question.id);
            return Response.json({status:'email_not_configured'});
          }
          let answer: string | null = null;
          if(question.status==='answered' && question.answer_entry_id) {
            const entry = await supabaseAdmin.from('kb_entries').select('answer').eq('id',question.answer_entry_id).eq('status','published').maybeSingle();
            answer=entry.data?.answer ?? null;
            if(!answer) return Response.json({status:'skipped'});
          }
          const {sendQuestionNotification} = await import('@/lib/email/sophiaNotifications.server');
          const response = await sendQuestionNotification(question,answer,{key,ownerFrom:process.env['LEAD_ALERT_FROM'] || 'GetEnergy Website <onboarding@resend.dev>',visitorFrom:process.env['VISITOR_REPLY_FROM']?.trim() || ''});
          const outcome = await response.clone().json() as {status:string;provider_status?:number};
          await supabaseAdmin.from('unanswered_questions').update(answered ? {reply_status:outcome.status,reply_provider_status:outcome.provider_status??null} : {alert_status:outcome.status,alert_provider_status:outcome.provider_status??null}).eq('id',question.id);
          return response;
        }
        if (table === "service_requests" && (row as Lead)["is_test"]) return Response.json({ skipped: "test" });
        const email = compose(table, row as Lead);
        const key = process.env["RESEND_API_KEY"];
        if (!key) {
          console.info("Lead alert pending email setup:", email.subject);
          return Response.json({ status: "email_not_configured", subject: email.subject });
        }
        const { renderVisitorReply, visitorReplyAllowed, REPLY_INBOX } = await import("@/lib/email/visitorReplies");
        const replySender = process.env["VISITOR_REPLY_FROM"]?.trim();
        let reply = renderVisitorReply(table, row as Lead);
        // Both sends run in this asynchronous database notification, never in the form's submit path.
        // The owner alert retains its original response semantics even if the visitor send fails.
        const sendVisitor = async () => {
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(reply.to)) {
            console.info("visitor reply skipped: no visitor email");
            return;
          }
          if (!visitorReplyAllowed(reply.to, replySender)) {
            console.info("visitor reply skipped: no verified sender");
            return;
          }
          // Generate access only inside the asynchronous notification. A reference alone cannot read answers.
          try {
            const reference = String((row as Lead)[table === 'electricity_token_requests' ? 'request_reference' : 'reference']);
            const issued = await supabaseAdmin.rpc('issue_intake_token', {p_reference:reference});
            if (issued.error || typeof issued.data !== 'string') throw new Error('Could not issue answer link');
            const form = await supabaseAdmin.rpc('get_intake_form', {p_reference:reference,p_token:issued.data,p_user_id:'00000000-0000-0000-0000-000000000000',p_bucket:`email:${body.id}`});
            const payload = form.data as {questions?:{text:string}[]} | null;
            reply = renderVisitorReply(table,row as Lead,{onlineUrl:`https://getenergy.ng/r/${encodeURIComponent(reference)}?token=${encodeURIComponent(issued.data)}`,...(payload?.questions ? {questions:payload.questions.map(question=>question.text)} : {})});
          } catch (error) { console.error('visitor online answer link unavailable',error instanceof Error ? error.message : 'Unknown error'); }
          try {
            const res = await fetch("https://api.resend.com/emails", {
              method: "POST",
              signal: AbortSignal.timeout(8000),
              headers: {
                Authorization: `Bearer ${key}`, "Content-Type": "application/json",
                "Idempotency-Key": `visitor-reply-${table}-${body.id}`,
              },
              body: JSON.stringify({
                from: replySender || "GET Energy <onboarding@resend.dev>",
                to: [reply.to], reply_to: REPLY_INBOX,
                subject: reply.subject, text: reply.text, html: reply.html,
              }),
            });
            const responseBody = (await res.text().catch(() => "")).slice(0, 500);
            if (!res.ok) console.error(`visitor reply failed [${res.status}]: ${responseBody}`);
            else console.info(`visitor reply accepted [${res.status}] ${reply.kind} ${body.id}`);
          } catch (error) {
            console.error("visitor reply network failure", error instanceof Error ? error.name : "Unknown error");
          }
        };
        const sendOwner = async () => { try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: process.env["LEAD_ALERT_FROM"] || "GetEnergy Website <onboarding@resend.dev>",
              to: [email.to],
              subject: email.subject,
              text: email.text,
              ...(email.replyTo ? { reply_to: email.replyTo } : {}),
            }),
          });
          if (!res.ok) {
            const errBody = (await res.text().catch(() => "")).slice(0, 500);
            console.error(`Lead alert email failed [${res.status}]: ${errBody}`);
            return Response.json({ status: "failed" }, { status: 502 });
          }
          console.info(`Lead alert accepted [${res.status}] ${body.id}`);
          return Response.json({ status: "sent" });
        } catch (e) {
          console.error("Lead alert email error", e);
          return Response.json({ status: "failed" }, { status: 502 });
        } };
        const [ownerResponse] = await Promise.all([sendOwner(), sendVisitor()]);
        return ownerResponse;
      },
    },
  },
});

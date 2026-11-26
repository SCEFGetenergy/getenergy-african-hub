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
        if ((table !== "service_requests" && table !== "electricity_token_requests") || !body?.id) {
          return new Response("Bad request", { status: 400 });
        }
        const { data: row } = await supabaseAdmin.from(table).select("*").eq("id", body.id).maybeSingle();
        if (!row) return new Response("Not found", { status: 404 });
        if (table === "service_requests" && (row as Lead)["is_test"]) return Response.json({ skipped: "test" });
        const email = compose(table, row as Lead);
        const key = process.env["RESEND_API_KEY"];
        if (!key) {
          console.info("Lead alert pending email setup:", email.subject);
          return Response.json({ status: "email_not_configured", subject: email.subject });
        }
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: process.env["LEAD_ALERT_FROM"] || "GetEnergy Leads <onboarding@resend.dev>",
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
          return Response.json({ status: "sent" });
        } catch (e) {
          console.error("Lead alert email error", e);
          return Response.json({ status: "failed" }, { status: 502 });
        }
      },
    },
  },
});

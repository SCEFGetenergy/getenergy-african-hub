import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";
import brief from "@/server/sophia-brief.md?raw";
import { createRunIdFetch, getRequestRunId, withRunIdHeader } from "@/server/sophia-gateway";

const SYSTEM = `You are SOPHIA, GET Energy Trading Services' Intelligent Energy Assistant on the company website.
Follow the full brief below. Key rules that always apply:
- Professional international English, warm and concise. No slang. Keep replies short; ask at most 2 questions at a time.
- Be honest about status. Diesel/AGO supply is operating; electricity token vending operates via implementation partners; CNG, EV, solar, BESS, mini-grid, Power-as-a-Service, training programmes and smart metering are in development or planned. Never present plans as achievements. Never quote prices, guarantee availability, savings or delivery times, or claim programmes are scheduled/accredited.
- Never fake payments: online payment for electricity tokens and bills is launching soon; capture a request instead.
- EEA54.Africa (https://eea54.africa) is a separate pan-African energy marketplace, not a GET Energy brand.
- Do not give unsafe technical instructions (live electrical work, gas handling, conversions); direct to qualified personnel.
- When you have enough details (at minimum name and email or phone, plus the need), call submit_enquiry with a structured summary, then give the visitor the returned reference. Only say a request was submitted if the tool returned a reference.
- Human handoff: WhatsApp +234 818 074 2835 (https://wa.me/2348180742835), email ccgetenergy@gmail.com.
- Link to site pages with markdown links using relative paths: /get-fuel, /cng, /ev, /green-energy, /solar-power, /get-electricity, /pay-bills, /power-as-a-service, /company/solutions/mini-grids, /smart-metering, /technology, /training, /partners, /industries, /projects, /about, /contact, /energy-ecommerce.

FULL BRIEF:
${brief}`;

type Body = { messages: UIMessage[]; threadId: string; visitorToken: string; page?: string };

export const Route = createFileRoute("/api/sophia")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Body;
        if (!body?.threadId || !body?.visitorToken || !Array.isArray(body.messages)) {
          return new Response("Bad request", { status: 400 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: thread } = await supabaseAdmin
          .from("sophia_threads")
          .select("id, title")
          .eq("id", body.threadId)
          .eq("visitor_token", body.visitorToken)
          .maybeSingle();
        if (!thread) return new Response("Conversation not found", { status: 404 });

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return new Response("AI is not configured", { status: 500 });

        const runIdFetch = createRunIdFetch(getRequestRunId(request));
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: runIdFetch.fetch,
        });

        const threadId = thread.id;
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          system: `${SYSTEM}\n\nThe visitor is currently on page: ${body.page ?? "unknown"}.`,
          messages: await convertToModelMessages(body.messages),
          abortSignal: request.signal,
          stopWhen: stepCountIs(5),
          providerOptions: {
            openai: {
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              store: false,
              include: ["reasoning.encrypted_content"],
            },
          },
          tools: {
            submit_enquiry: tool({
              description:
                "Submit a qualified enquiry, training registration, customer-service case, complaint, partnership or callback request to the GET Energy team. Returns a request reference.",
              inputSchema: z.object({
                category: z.string().describe("Lead category, e.g. Fuel Lead, Mini-Grid Lead, Corporate Training Lead, Complaint, Callback Request"),
                service: z.string().describe("Service or topic"),
                contact_name: z.string(),
                contact_email: z.string().describe("Email; use empty string if not given"),
                contact_phone: z.string().describe("Phone/WhatsApp; empty string if not given"),
                company: z.string().describe("Company/organisation; empty string if none"),
                location: z.string().describe("Location; empty string if unknown"),
                urgency: z.string().describe("Urgent, High, Normal or Low"),
                summary: z.string().describe("Structured summary of the requirement"),
              }),
              execute: async (i) => {
                if (!i.contact_name || (!i.contact_email && !i.contact_phone)) {
                  return { ok: false, error: "A name and an email or phone number are required." };
                }
                const { data, error } = await supabaseAdmin
                  .from("service_requests")
                  .insert({
                    request_type: "sophia",
                    service_name: `${i.category} — ${i.service}`.slice(0, 160),
                    contact_name: i.contact_name.slice(0, 200),
                    contact_email: (i.contact_email || "not-provided").slice(0, 320),
                    contact_phone: i.contact_phone ? i.contact_phone.slice(0, 40) : null,
                    company_name: i.company ? i.company.slice(0, 200) : null,
                    location: i.location ? i.location.slice(0, 200) : null,
                    details: { source: "SOPHIA", thread_id: threadId, urgency: i.urgency, summary: i.summary, category: i.category },
                  })
                  .select("reference")
                  .single();
                if (error) {
                  console.error("SOPHIA enquiry insert failed", error);
                  return { ok: false, error: "The request could not be saved. Please use WhatsApp or email." };
                }
                return { ok: true, reference: data.reference };
              },
            }),
          },
        });

        const response = result.toUIMessageStreamResponse({
          originalMessages: body.messages,
          sendReasoning: true,
          onFinish: async ({ messages }) => {
            const rows = messages.map((m) => ({
              thread_id: threadId,
              message_id: m.id,
              role: m.role,
              message: m as unknown as Record<string, unknown>,
            }));
            const { error } = await supabaseAdmin
              .from("sophia_messages")
              .upsert(rows as never, { onConflict: "thread_id,message_id" });
            if (error) console.error("SOPHIA message save failed", error);
            const firstUser = messages.find((m) => m.role === "user");
            const text = firstUser?.parts.find((p) => p.type === "text") as { text?: string } | undefined;
            const update: { updated_at: string; title?: string } = { updated_at: new Date().toISOString() };
            if (thread.title === "New conversation" && text?.text) update.title = text.text.slice(0, 60);
            const { error: tErr } = await supabaseAdmin.from("sophia_threads").update(update).eq("id", threadId);
            if (tErr) console.error("SOPHIA thread update failed", tErr);
          },
        });
        return withRunIdHeader(response, runIdFetch);
      },
    },
  },
});

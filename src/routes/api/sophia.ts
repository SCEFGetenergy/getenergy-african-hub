import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";
import sitemap from "../../../public/sitemap.xml?raw";

const KNOWN_PATHS = new Set(
  Array.from(sitemap.matchAll(/<loc>https:\/\/getenergy\.ng([^<]*)<\/loc>/g), (m) => m[1] || "/"),
);
const MAX_CHARS = 2000;
const MAX_TURNS = 40;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function clientIp(req: Request) {
  return req.headers.get("cf-connecting-ip")?.trim() || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
}

const systemPrompt = (brief: string) => `You are SOPHIA, GET Energy Trading Services' Intelligent Energy Assistant on the company website.
Follow the full brief below. Key rules that always apply:
- Professional international English, warm and concise. No slang. Keep replies short; ask at most 2 questions at a time.
- Be honest about status. Diesel/AGO supply is operating; electricity token vending operates via implementation partners; CNG, EV, solar, BESS, mini-grid, Power-as-a-Service, training programmes and smart metering are in development or planned. Never present plans as achievements. Never quote prices, guarantee availability, savings or delivery times, or claim programmes are scheduled/accredited.
- Never fake payments: online payment for electricity tokens and bills is launching soon; capture a request instead.
- EEA54.Africa (https://eea54.africa) is a separate pan-African energy marketplace, not a GET Energy brand.
- Do not give unsafe technical instructions (live electrical work, gas handling, conversions); direct to qualified personnel.
- When you have enough details (at minimum name and email or phone, plus the need), call submit_enquiry with a structured summary, then give the visitor the returned reference. Only say a request was submitted if the tool returned a reference.
- Human handoff: WhatsApp +234 818 074 2835 (https://wa.me/2348180742835), email ccgetenergy@gmail.com.
- Link to site pages with markdown links using relative paths: /get-fuel, /cng, /ev, /green-energy, /get-electricity, /get-electricity#smart-metering, /power-as-a-service, /power-as-a-service#renewables-bess, /power-as-a-service#mini-grids, /technology, /training-certification, /invest, /careers, /partners, /industries, /projects, /about, /contact, /energy-ecommerce.

FULL BRIEF:
${brief}`;

type Body = { message: UIMessage; threadId: string; visitorToken: string; page?: string };

export const Route = createFileRoute("/api/sophia")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Body;
        try { body = (await request.json()) as Body; } catch { return new Response("Bad request", { status: 400 }); }
        const msg = body?.message;
        if (!UUID_RE.test(body?.threadId ?? "") || typeof body?.visitorToken !== "string" || body.visitorToken.length < 20 || body.visitorToken.length > 100
          || !msg || msg.role !== "user" || typeof msg.id !== "string" || !Array.isArray(msg.parts)) {
          return new Response("Bad request", { status: 400 });
        }
        const userText = msg.parts.filter((p) => p.type === "text").map((p) => (p as { text: string }).text).join("");
        if (!userText.trim()) return new Response("Bad request", { status: 400 });
        if (userText.length > MAX_CHARS) return new Response("Please keep messages under 2,000 characters.", { status: 413 });
        // Only plain text from the visitor is accepted.
        const userMessage: UIMessage = { id: msg.id.slice(0, 100), role: "user", parts: [{ type: "text", text: userText }] };

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { createRunIdFetch, getRequestRunId, withRunIdHeader } = await import("@/lib/sophia/gateway.server");
        const brief = (await import("@/lib/sophia/brief.md?raw")).default;

        const hit = async (bucket: string, limit: number) => {
          const { data, error } = await supabaseAdmin.rpc("electricity_hit_rate_limit", { p_bucket: bucket, p_limit: limit, p_window_seconds: 600 });
          return !error && data === true;
        };
        const ip = clientIp(request);
        const okToken = await hit(`sophia-msg:token:${body.visitorToken}`, 30);
        const okIp = ip ? await hit(`sophia-msg:ip:${ip.slice(0, 64)}`, 60) : true;
        if (!okToken || !okIp) return new Response("Too many messages. Please wait a few minutes.", { status: 429 });

        const { data: thread } = await supabaseAdmin
          .from("sophia_threads")
          .select("id, title")
          .eq("id", body.threadId)
          .eq("visitor_token", body.visitorToken)
          .maybeSingle();
        if (!thread) return new Response("Conversation not found", { status: 404 });

        const { data: stored, error: histErr } = await supabaseAdmin
          .from("sophia_messages")
          .select("message")
          .eq("thread_id", thread.id)
          .order("created_at", { ascending: true });
        if (histErr) return new Response("SOPHIA couldn't load this conversation.", { status: 500 });
        const history = (stored ?? []).map((r) => r.message as unknown as UIMessage).filter((m) => m.id !== userMessage.id);
        if (history.filter((m) => m.role === "user").length >= MAX_TURNS) {
          return new Response("This conversation has reached its turn limit. Please start a new chat.", { status: 409 });
        }
        const allMessages = [...history, userMessage];
        const page = typeof body.page === "string" && KNOWN_PATHS.has(body.page) ? body.page : "unknown";

        const apiKey = process.env['LOVABLE_API_KEY'];
        if (!apiKey) return new Response("AI is not configured", { status: 500 });

        const runIdFetch = createRunIdFetch(getRequestRunId(request));
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: runIdFetch.fetch,
        });

        const threadId = thread.id;
        let submitted = false;
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          system: `${systemPrompt(brief)}\n\nThe visitor is currently on page: ${page}.`,
          messages: await convertToModelMessages(allMessages),
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
                if (submitted) return { ok: false, error: "A request was already submitted in this reply." };
                const name = i.contact_name.trim();
                const email = i.contact_email.trim().toLowerCase();
                const phone = i.contact_phone.trim();
                const digits = phone.replace(/\D/g, "").length;
                const emailOk = email !== "" && email.length <= 255 && EMAIL_RE.test(email);
                const phoneOk = digits >= 10 && digits <= 15;
                if (!name) return { ok: false, error: "The visitor's name is required." };
                if (email && !emailOk) return { ok: false, error: "That email address looks invalid; please confirm it." };
                if (phone && !phoneOk) return { ok: false, error: "That phone number looks invalid (10-15 digits); please confirm it." };
                if (!emailOk && !phoneOk) return { ok: false, error: "A valid email or phone number is required." };
                const { data, error } = await supabaseAdmin.rpc("submit_service_request", {
                  p_request_type: "sophia",
                  p_service_name: `${i.category} — ${i.service}`.slice(0, 160),
                  p_contact_name: name.slice(0, 200),
                  p_contact_email: emailOk ? email : "",
                  p_contact_phone: phoneOk ? phone.slice(0, 40) : "",
                  p_company_name: i.company.slice(0, 200),
                  p_location: i.location.slice(0, 200),
                  p_details: { source: "SOPHIA", thread_id: threadId, urgency: i.urgency.slice(0, 20), summary: i.summary.slice(0, 4000), category: i.category.slice(0, 120) },
                });
                if (error || typeof data !== "string" || data === "RATE_LIMITED") {
                  console.error("SOPHIA enquiry save failed", error);
                  return { ok: false, error: "The request could not be saved. Please use WhatsApp or email." };
                }
                submitted = true;
                return { ok: true, reference: data };
              },
            }),
          },
        });

        const response = result.toUIMessageStreamResponse({
          originalMessages: allMessages,
          sendReasoning: false,
          onFinish: async ({ messages: finished }) => {
            const known = new Set(history.map((m) => m.id));
            const messages = finished.filter((m) => !known.has(m.id));
            const base = Date.now() - messages.length;
            const rows = messages.map((m, i) => ({
              created_at: new Date(base + i).toISOString(),
              thread_id: threadId,
              message_id: m.id,
              role: m.role,
              message: m as unknown as Record<string, unknown>,
            }));
            const { error } = await supabaseAdmin
              .from("sophia_messages")
              .upsert(rows as never, { onConflict: "thread_id,message_id" });
            if (error) console.error("SOPHIA message save failed", error);
            const firstUser = finished.find((m) => m.role === "user");
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

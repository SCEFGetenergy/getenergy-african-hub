import { getGateway } from "./gateway/index.server";
import { applyVendResult, confirmPayment, logEvent, type Order } from "./engine.server";
import * as vt from "./vtpass.server";

async function db() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}

/** Gateway webhook: signature first, then idempotent server-side verification. */
export async function handleGatewayWebhook(rawBody: string, headers: Headers) {
  const g = getGateway();
  const w = await g.handleWebhook(rawBody, headers);
  if (!w.valid || !w.gatewayReference) return { status: 401 };
  const d = await db();
  if (w.eventId) {
    const { data: seen } = await d.from("electricity_order_events").select("id").eq("source", "gateway_webhook").eq("payload->>eventId", w.eventId).limit(1);
    if (seen?.length) return { status: 200 }; // duplicate
  }
  const { data: o } = await d.from("electricity_orders").select("*").eq("gateway_reference", w.gatewayReference).maybeSingle();
  await logEvent(o as Order | null, "gateway_webhook", "received", { eventId: w.eventId ?? null, gatewayReference: w.gatewayReference });
  if (o) await confirmPayment(o as Order); // re-verifies with the gateway; only moves awaiting_payment
  return { status: 200 };
}

/** VTpass transaction-update. The payload is a hint only: we requery VTpass for the truth. */
export async function processVtpassWebhook(body: unknown) {
  const b = body as { type?: string; data?: Record<string, unknown> } | null;
  const requestId = String(b?.data?.["requestId"] ?? b?.data?.["request_id"] ?? "");
  if (!requestId) return;
  const d = await db();
  const { data: o } = await d.from("electricity_orders").select("*").eq("request_id", requestId).maybeSingle();
  if (!o) return;
  await logEvent(o as Order, "vtpass", "webhook_received", { status: (b?.data?.["content"] as { transactions?: { status?: string } } | undefined)?.transactions?.status ?? null });
  if (!(o as Order).vend_attempted_at) return;
  const truth = await vt.requery(requestId);
  await applyVendResult(o as Order, truth, "webhook_requery");
}

// Mock gateway: lets the whole flow be tested end to end with no money moving.
// Its "payments" are rows in electricity_order_events (source = mock_gateway).
import { createHmac, timingSafeEqual } from "node:crypto";
import type { PaymentGateway } from "./types";
import { randomSuffix } from "../rules";

async function admin() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}

function secret() {
  const s = process.env["MOCK_GATEWAY_SECRET"];
  if (!s) throw new Error("MOCK_GATEWAY_SECRET is not set");
  return s;
}

export function mockSign(body: string) {
  return createHmac("sha256", secret()).update(body).digest("hex");
}

async function lastEvent(ref: string) {
  const db = await admin();
  const { data } = await db
    .from("electricity_order_events")
    .select("event, payload, created_at")
    .eq("source", "mock_gateway")
    .eq("payload->>gatewayReference", ref)
    .in("event", ["mock_paid", "mock_failed", "mock_refunded"])
    .order("created_at", { ascending: false })
    .limit(1);
  return data?.[0] ?? null;
}

export const mockGateway: PaymentGateway = {
  name: "mock",
  async createPayment(i) {
    const gatewayReference = `MOCK-${randomSuffix(14)}`;
    return { gatewayReference, checkoutUrl: `/get-electricity?mockpay=${encodeURIComponent(gatewayReference)}&order=${encodeURIComponent(i.orderReference)}` };
  },
  async verifyPayment(ref) {
    const e = await lastEvent(ref);
    if (!e || e.event === "mock_refunded") return { status: e ? "paid" : "pending", amountNgn: e ? Number((e.payload as { amountNgn?: number }).amountNgn) : null, raw: e };
    const amt = Number((e.payload as { amountNgn?: number }).amountNgn);
    return { status: e.event === "mock_paid" ? "paid" : "failed", amountNgn: Number.isFinite(amt) ? amt : null, raw: e };
  },
  async handleWebhook(rawBody, headers) {
    const sig = headers.get("x-mock-signature") ?? "";
    const expected = mockSign(rawBody);
    const ok = sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    if (!ok) return { valid: false };
    const b = JSON.parse(rawBody) as { eventId?: string; gatewayReference?: string };
    return { valid: true, eventId: b.eventId, gatewayReference: b.gatewayReference, raw: b };
  },
  async refund(i) {
    const db = await admin();
    const refundReference = `MOCKRF-${randomSuffix(10)}`;
    await db.from("electricity_order_events").insert({ source: "mock_gateway", event: "mock_refund_issued", payload: { gatewayReference: i.gatewayReference, amountNgn: i.amountNgn, refundReference, reason: i.reason } });
    return { refundReference, status: "succeeded", raw: { simulated: true } };
  },
  async listPayments(day) {
    const db = await admin();
    const start = new Date(`${day}T00:00:00+01:00`).toISOString();
    const end = new Date(new Date(start).getTime() + 86400000).toISOString();
    const { data } = await db.from("electricity_order_events").select("payload, created_at").eq("source", "mock_gateway").eq("event", "mock_paid").gte("created_at", start).lt("created_at", end);
    return (data ?? []).map((r) => {
      const p = r.payload as { gatewayReference: string; amountNgn: number };
      return { gatewayReference: p.gatewayReference, amountNgn: Number(p.amountNgn), status: "paid", at: r.created_at };
    });
  },
};

// Order state machine for live token purchase. Server-only; uses the admin client after callers are verified.
import * as vt from "./vtpass.server";
import { getGateway } from "./gateway/index.server";
import { BLOCKED_MESSAGE, PENDING_LIMIT_MIN, VEND_BLOCKED_REFUND_MIN, amountMatches, classifyVend, extractToken, maskMeter, type OrderStatus } from "./rules";
import type { Database } from "@/integrations/supabase/types";

export type Order = Database["public"]["Tables"]["electricity_orders"]["Row"];

async function db() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}

function scrub(v: unknown, meter?: string): unknown {
  let s = JSON.stringify(v ?? null);
  if (meter && meter.length > 4) s = s.split(meter).join(maskMeter(meter));
  return JSON.parse(s);
}

export async function logEvent(order: Pick<Order, "id" | "meter_number"> | null, source: string, event: string, payload: unknown) {
  const d = await db();
  await d.from("electricity_order_events").insert({ order_id: order?.id ?? null, source, event, payload: scrub(payload, order?.meter_number) as never });
  if (event.startsWith("admin_alert")) console.warn(`[electricity] ${event}`, order?.id ?? "");
}

async function setStatus(order: Order, patch: Partial<Order>, from?: OrderStatus[]) {
  const d = await db();
  let q = d.from("electricity_orders").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", order.id);
  if (from) q = q.in("status", from);
  const { data } = await q.select().maybeSingle();
  return (data as Order | null) ?? null;
}

export async function getOrderById(id: string) {
  const d = await db();
  return ((await d.from("electricity_orders").select("*").eq("id", id).maybeSingle()).data as Order | null) ?? null;
}

async function notify(order: Order) {
  // Email/SMS providers plug in here. Until configured, receipts are recorded for the team.
  const body = order.meter_type === "prepaid"
    ? `GetEnergy: token for meter ${maskMeter(order.meter_number)} is ${order.token}. Ref ${order.order_reference}.`
    : `GetEnergy: payment of N${order.amount_ngn} received for meter ${maskMeter(order.meter_number)}. VTpass ref ${order.vtpass_transaction_id}. Ref ${order.order_reference}.`;
  await logEvent(order, "notify", "receipt_queued", { email: order.email, phone: order.phone.replace(/\d(?=\d{3})/g, "*"), length: body.length });
}

export async function refundOrder(order: Order, reason: string) {
  if (!order.paid_at || !order.gateway_reference) return;
  const d = await db();
  // UNIQUE(order_id) makes refunds idempotent: one refund row per order, ever.
  const { error } = await d.from("electricity_refunds").insert({ order_id: order.id, amount_ngn: order.paid_amount_ngn ?? order.amount_ngn, reason });
  if (error) return; // already refunded/started
  try {
    const r = await getGateway().refund({ gatewayReference: order.gateway_reference, amountNgn: order.paid_amount_ngn ?? order.amount_ngn, reason });
    await d.from("electricity_refunds").update({ status: r.status, gateway_refund_reference: r.refundReference, raw: r.raw as never }).eq("order_id", order.id);
    if (r.status !== "failed") await setStatus(order, { status: "refunded", customer_message: "Your payment has been refunded." });
    else await logEvent(order, "engine", "admin_alert_refund_failed", r.raw);
  } catch (e) {
    await d.from("electricity_refunds").update({ status: "failed" }).eq("order_id", order.id);
    await logEvent(order, "engine", "admin_alert_refund_failed", { message: String(e) });
  }
}

/** Apply a VTpass /pay, /requery or webhook result. Never re-vends. */
export async function applyVendResult(order: Order, resp: Record<string, unknown> | null, source: string) {
  await logEvent(order, "vtpass", source, resp ?? { noResponse: true });
  const outcome = classifyVend(resp);
  const code = resp ? String(resp["code"] ?? "") : null;
  const txId = ((resp?.["content"] as { transactions?: { transactionId?: unknown } } | undefined)?.transactions?.transactionId ?? null) as string | null;
  const base = { vtpass_code: code, vtpass_transaction_id: txId ?? order.vtpass_transaction_id };
  const active: OrderStatus[] = ["vending", "pending", "vend_blocked", "needs_review"];

  if (outcome === "delivered") {
    const token = order.meter_type === "prepaid" ? extractToken(resp) : null;
    const units = String((resp?.["units"] ?? resp?.["mainTokenUnits"] ?? "") || "") || null;
    const updated = await setStatus(order, { ...base, status: "delivered", token, units, customer_message: null }, active);
    if (updated) await notify(updated);
    return;
  }
  if (outcome === "failed") {
    const u = await setStatus(order, { ...base, status: "failed", customer_message: "Purchase failed — your refund has started." }, active);
    if (u) await refundOrder(u, `VTpass code ${code}`);
    return;
  }
  if (outcome === "reversed") {
    const u = await setStatus(order, { ...base, status: "failed", customer_message: "The DISCO reversed this purchase — your refund has started." }, [...active, "delivered"]);
    if (u) await refundOrder(u, "VTpass reversed");
    return;
  }
  if (outcome === "blocked") {
    const u = await setStatus(order, { ...base, status: "vend_blocked", customer_message: BLOCKED_MESSAGE, last_error: `VTpass code ${code}` }, active);
    if (u) await logEvent(u, "engine", "admin_alert_vend_blocked", { code });
    return;
  }
  // pending / requery_original / unclear
  await setStatus(order, { ...base, status: "pending", pending_since: order.pending_since ?? new Date().toISOString(), customer_message: "Processing, we'll message you." }, active);
}

export async function vendOrder(orderId: string) {
  const d = await db();
  const { data: claimed } = await d.rpc("electricity_claim_vend", { p_order_id: orderId });
  if (!claimed) return; // someone else is vending or it already happened
  const order = await getOrderById(orderId);
  if (!order) return;
  const resp = await vt.pay({ request_id: order.request_id, serviceID: order.service_id, billersCode: order.meter_number, variation_code: order.meter_type as "prepaid" | "postpaid", amount: order.amount_ngn, phone: order.phone });
  await applyVendResult(order, resp, "pay_response");
  const after = await getOrderById(orderId);
  // 019/014 or unclear: immediately requery the original request_id once.
  if (after?.status === "pending") await requeryOrder(after);
}

export async function requeryOrder(order: Order) {
  const resp = await vt.requery(order.request_id);
  await applyVendResult(order, resp, "requery_response");
}

/** Confirm payment server-side (never from the browser redirect) and vend once. */
export async function confirmPayment(order: Order) {
  if (order.status !== "awaiting_payment" || !order.gateway_reference) return order;
  const g = getGateway();
  const v = await g.verifyPayment(order.gateway_reference);
  await logEvent(order, g.name, "verify_payment", v.raw);
  if (v.status === "failed") return await setStatus(order, { status: "failed", customer_message: "Payment was not completed." }, ["awaiting_payment"]);
  if (v.status !== "paid") return order;
  if (!amountMatches(v.amountNgn, order.amount_ngn)) {
    const u = await setStatus(order, { status: "needs_review", paid_amount_ngn: v.amountNgn, paid_at: new Date().toISOString(), last_error: "Paid amount does not match order amount", customer_message: BLOCKED_MESSAGE }, ["awaiting_payment"]);
    if (u) {
      await logEvent(u, "engine", "admin_alert_amount_mismatch", { paid: v.amountNgn, ordered: order.amount_ngn });
      await refundOrder(u, "Paid amount did not match order");
    }
    return u;
  }
  const paid = await setStatus(order, { status: "paid", paid_amount_ngn: v.amountNgn, paid_at: new Date().toISOString() }, ["awaiting_payment"]);
  if (!paid) return order;
  const balance = await vt.walletBalance();
  if (balance !== null && balance < paid.amount_ngn) {
    const u = await setStatus(paid, { status: "vend_blocked", customer_message: BLOCKED_MESSAGE, last_error: "VTpass wallet balance too low" }, ["paid"]);
    if (u) await logEvent(u, "engine", "admin_alert_low_wallet", { balance });
    return u;
  }
  await vendOrder(paid.id);
  return await getOrderById(paid.id);
}

/** Every 2 minutes: catch missed webhooks, requery pending, escalate, refund stuck orders. */
export async function sweep() {
  const d = await db();
  const now = Date.now();
  const ago = (min: number) => new Date(now - min * 60000).toISOString();
  const report = { confirmed: 0, requeried: 0, escalated: 0, refunded: 0, revended: 0 };

  const { data: awaiting } = await d.from("electricity_orders").select("*").eq("status", "awaiting_payment").gte("created_at", ago(120)).limit(50);
  for (const o of (awaiting ?? []) as Order[]) { await confirmPayment(o); report.confirmed++; }

  const { data: stuckPaid } = await d.from("electricity_orders").select("*").eq("status", "paid").is("vend_attempted_at", null).lt("paid_at", ago(2)).limit(20);
  for (const o of (stuckPaid ?? []) as Order[]) { await vendOrder(o.id); report.revended++; }

  // A crash mid-vend leaves "vending"; treat as unclear and requery the same request_id.
  const { data: vending } = await d.from("electricity_orders").select("*").eq("status", "vending").lt("vend_attempted_at", ago(2)).limit(20);
  for (const o of (vending ?? []) as Order[]) { await requeryOrder(o); report.requeried++; }

  const { data: pending } = await d.from("electricity_orders").select("*").eq("status", "pending").limit(100);
  for (const o of (pending ?? []) as Order[]) {
    if (o.pending_since && o.pending_since < ago(PENDING_LIMIT_MIN)) {
      const u = await setStatus(o, { status: "needs_review", customer_message: "Processing, we'll message you." }, ["pending"]);
      if (u) await logEvent(u, "engine", "admin_alert_needs_review", { minutes: PENDING_LIMIT_MIN });
      report.escalated++;
    } else { await requeryOrder(o); report.requeried++; }
  }

  const { data: blocked } = await d.from("electricity_orders").select("*").eq("status", "vend_blocked").lt("updated_at", ago(VEND_BLOCKED_REFUND_MIN)).limit(20);
  for (const o of (blocked ?? []) as Order[]) { await refundOrder(o, `Not vended within ${VEND_BLOCKED_REFUND_MIN} minutes`); report.refunded++; }
  return report;
}

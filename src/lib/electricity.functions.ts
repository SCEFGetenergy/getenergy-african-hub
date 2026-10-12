import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DISCOS, MAX_NGN, SERVICE_IDS, SITE_MIN_NGN, customerLabel, effectiveMinimum, makeOrderReference, makeRequestId, maskMeter, type OrderStatus } from "./electricity/rules";

const isLive = () => (process.env["ELECTRICITY_LIVE"] ?? "").toLowerCase() === "true";

async function admin() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}

async function limit(bucket: string, max: number, windowSec: number) {
  const d = await admin();
  const { data } = await d.rpc("electricity_hit_rate_limit", { p_bucket: bucket, p_limit: max, p_window_seconds: windowSec });
  return data !== false;
}

function clientIp() {
  return getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** Public: is live purchase on, and which DISCOs are confirmed for "Buy a token". */
export const getElectricityLiveConfig = createServerFn({ method: "GET" }).handler(async () => {
  if (!isLive()) return { live: false, discos: [] as { serviceId: string; label: string; confirmed: boolean }[] };
  const { vtpassConfigured } = await import("./electricity/vtpass.server");
  if (!vtpassConfigured()) return { live: false, discos: [] };
  const d = await admin();
  const { data } = await d.from("electricity_disco_live").select("service_id, confirmed_live");
  const ok = new Set((data ?? []).filter((r) => r.confirmed_live).map((r) => r.service_id));
  return { live: true, discos: DISCOS.map((x) => ({ serviceId: x.serviceId, label: x.label, confirmed: ok.has(x.serviceId) })) };
});

const meterSchema = z.object({
  serviceId: z.enum(SERVICE_IDS),
  meterType: z.enum(["prepaid", "postpaid"]),
  meterNumber: z.string().regex(/^\d{6,15}$/, "Enter a valid meter number"),
});

type VerifyOut = { ok: true; customerName: string; address: string; minAmount: number } | { ok: false; message: string };

async function doVerify(i: z.infer<typeof meterSchema>): Promise<VerifyOut> {
  const vt = await import("./electricity/vtpass.server");
  const r = await vt.merchantVerify(i.serviceId, i.meterNumber, i.meterType);
  const code = String(r?.["code"] ?? "");
  if (!r) return { ok: false, message: "We couldn't reach the electricity company right now. Please try again shortly, or send a token request below." };
  if (code === "030") return { ok: false, message: "This electricity company isn't responding right now. Please try again later, or send a token request below." };
  const c = (r["content"] ?? {}) as Record<string, unknown>;
  const name = String(c["Customer_Name"] ?? "").trim();
  if (code !== "000" || c["error"] || c["WrongBillersCode"] === true || !name)
    return { ok: false, message: "We couldn't verify that meter number. Please check it and the meter type." };
  return {
    ok: true,
    customerName: name,
    address: String(c["Address"] ?? c["Customer_Address"] ?? "").trim(),
    minAmount: effectiveMinimum(c["Min_Purchase_Amount"] ?? c["Minimum_Amount"] ?? c["minimum_amount"]),
  };
}

export const verifyMeter = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => meterSchema.parse(d))
  .handler(async ({ data }): Promise<VerifyOut> => {
    if (!isLive()) return { ok: false, message: "Online purchase isn't available yet." };
    if (!(await limit(`verify:ip:${clientIp()}`, 20, 600)) || !(await limit(`verify:meter:${data.meterNumber}`, 8, 600)))
      return { ok: false, message: "Too many attempts. Please wait a few minutes and try again." };
    return doVerify(data);
  });

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    meterSchema.extend({
      amount: z.number().int().min(SITE_MIN_NGN).max(MAX_NGN),
      phone: z.string().trim().regex(/^\+?\d{10,15}$/, "Enter a valid phone number"),
      email: z.string().trim().email().max(255),
      accept: z.literal(true),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    if (!isLive()) return { ok: false as const, message: "Online purchase isn't available yet." };
    if (!(await limit(`buy:ip:${clientIp()}`, 10, 600)) || !(await limit(`buy:meter:${data.meterNumber}`, 5, 600)))
      return { ok: false as const, message: "Too many attempts. Please wait a few minutes and try again." };
    const d = await admin();
    const { data: disco } = await d.from("electricity_disco_live").select("confirmed_live, label").eq("service_id", data.serviceId).maybeSingle();
    if (!disco?.confirmed_live) return { ok: false as const, message: "Online purchase isn't available for this DISCO yet. Please send a token request instead." };
    // Re-verify server-side; never trust the browser's copy of the name or minimum.
    const v = await doVerify(data);
    if (!v.ok) return { ok: false as const, message: v.message };
    if (data.amount < v.minAmount) return { ok: false as const, message: `The minimum for this meter is ₦${v.minAmount.toLocaleString("en-NG")}.` };
    const vt = await import("./electricity/vtpass.server");
    const bal = await vt.walletBalance();
    if (bal !== null && bal < data.amount)
      return { ok: false as const, message: "Online purchase is briefly unavailable for this amount. Please try a smaller amount or send a token request below." };

    const { getGateway } = await import("./electricity/gateway/index.server");
    const g = getGateway();
    const now = new Date();
    const { data: order, error } = await d.from("electricity_orders").insert({
      order_reference: makeOrderReference(now),
      request_id: makeRequestId(now),
      service_id: data.serviceId,
      disco_label: disco.label,
      meter_type: data.meterType,
      meter_number: data.meterNumber,
      customer_name: v.customerName,
      customer_address: v.address,
      amount_ngn: data.amount,
      min_amount_ngn: v.minAmount,
      phone: data.phone,
      email: data.email.toLowerCase(),
      gateway: g.name,
    }).select().single();
    if (error || !order) return { ok: false as const, message: "Please try again in a moment." };
    const origin = getRequestHeader("origin") ?? "";
    const p = await g.createPayment({ orderReference: order.order_reference, amountNgn: order.amount_ngn, email: order.email, phone: order.phone, returnUrl: `${origin}/get-electricity?order=${order.order_reference}` });
    await d.from("electricity_orders").update({ gateway_reference: p.gatewayReference }).eq("id", order.id);
    const { logEvent } = await import("./electricity/engine.server");
    await logEvent(order, g.name, "payment_created", { gatewayReference: p.gatewayReference, amountNgn: order.amount_ngn });
    return { ok: true as const, orderReference: order.order_reference, checkoutUrl: p.checkoutUrl };
  });

const lookupSchema = z.object({ orderReference: z.string().trim().regex(/^GETELEC-\d{8}-[A-Z0-9]{6}$/), contact: z.string().trim().min(5).max(255) });

/** Public status lookup — needs the order reference AND the email or phone used. */
export const getOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => lookupSchema.parse(d))
  .handler(async ({ data }) => {
    if (!(await limit(`lookup:ip:${clientIp()}`, 60, 600))) return { found: false as const };
    const d = await admin();
    const { data: o } = await d.from("electricity_orders").select("*").eq("order_reference", data.orderReference.toUpperCase()).maybeSingle();
    const c = data.contact.toLowerCase().replace(/\s/g, "");
    if (!o || (o.email !== c && o.phone.replace(/\s/g, "") !== c)) return { found: false as const };
    let order = o;
    const eng = await import("./electricity/engine.server");
    if (order.status === "awaiting_payment") order = (await eng.confirmPayment(order)) ?? order;
    const status = order.status as OrderStatus;
    return {
      found: true as const,
      orderReference: order.order_reference,
      status,
      label: order.customer_message && status !== "delivered" ? order.customer_message : customerLabel(status),
      meterType: order.meter_type,
      meter: maskMeter(order.meter_number),
      disco: order.disco_label,
      customerName: order.customer_name,
      amount: order.amount_ngn,
      token: status === "delivered" ? order.token : null,
      units: status === "delivered" ? order.units : null,
      vtpassReference: status === "delivered" ? order.vtpass_transaction_id : null,
      gatewayReference: order.gateway === "mock" && status === "awaiting_payment" ? order.gateway_reference : null,
    };
  });

/** Mock checkout only (sandbox): simulate the customer paying, failing, or paying the wrong amount. */
export const mockCheckout = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ orderReference: lookupSchema.shape.orderReference, outcome: z.enum(["pay", "fail", "wrong_amount"]) }).parse(d))
  .handler(async ({ data }) => {
    const { getGateway } = await import("./electricity/gateway/index.server");
    if (getGateway().name !== "mock") throw new Error("Not available");
    const d = await admin();
    const { data: o } = await d.from("electricity_orders").select("*").eq("order_reference", data.orderReference).maybeSingle();
    if (!o || o.status !== "awaiting_payment" || !o.gateway_reference) return { ok: false };
    const amountNgn = data.outcome === "wrong_amount" ? o.amount_ngn - 100 : o.amount_ngn;
    const eng = await import("./electricity/engine.server");
    await eng.logEvent(o, "mock_gateway", data.outcome === "fail" ? "mock_failed" : "mock_paid", { gatewayReference: o.gateway_reference, amountNgn });
    // Deliver the signed webhook exactly as a real gateway would.
    const { mockSign } = await import("./electricity/gateway/mock.server");
    const body = JSON.stringify({ eventId: `${o.gateway_reference}:${data.outcome}`, gatewayReference: o.gateway_reference });
    const { handleGatewayWebhook } = await import("./electricity/webhooks.server");
    await handleGatewayWebhook(body, new Headers({ "x-mock-signature": mockSign(body) }));
    return { ok: true };
  });

// ---------- Admin ----------

async function assertAdmin(ctx: { supabase: { rpc: (...a: never[]) => unknown }; userId: string }) {
  const { data } = await (ctx.supabase as unknown as { rpc: (n: string, a: object) => Promise<{ data: boolean | null }> }).rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (!data) throw new Error("Forbidden");
}

export const adminTokenSales = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const d = await admin();
    const start = new Date(`${data.day}T00:00:00+01:00`).toISOString();
    const end = new Date(new Date(start).getTime() + 86400000).toISOString();
    const vt = await import("./electricity/vtpass.server");
    const { getGateway } = await import("./electricity/gateway/index.server");
    const [ordersRes, alertsRes, refundsRes, balance, gwPayments] = await Promise.all([
      d.from("electricity_orders").select("*").gte("created_at", start).lt("created_at", end).order("created_at", { ascending: false }),
      d.from("electricity_order_events").select("id, order_id, event, payload, created_at").like("event", "admin_alert%").order("created_at", { ascending: false }).limit(50),
      d.from("electricity_refunds").select("*").gte("created_at", start).lt("created_at", end),
      vt.vtpassConfigured() ? vt.walletBalance() : Promise.resolve(null),
      getGateway().listPayments(data.day).catch(() => []),
    ]);
    const orders = ordersRes.data ?? [];
    const { data: vtEvents } = orders.length
      ? await d.from("electricity_order_events").select("order_id, event, payload").eq("source", "vtpass").in("order_id", orders.map((o) => o.id))
      : { data: [] as { order_id: string | null; event: string; payload: unknown }[] };
    const gwByRef = new Map(gwPayments.map((p) => [p.gatewayReference, p]));
    const refundByOrder = new Map((refundsRes.data ?? []).map((r) => [r.order_id, r]));
    const recon = orders.map((o) => {
      const gw = o.gateway_reference ? gwByRef.get(o.gateway_reference) : undefined;
      const vtLast = (vtEvents ?? []).filter((e) => e.order_id === o.id).pop();
      const vtStatus = (vtLast?.payload as { content?: { transactions?: { status?: string } } } | null)?.content?.transactions?.status ?? null;
      const refund = refundByOrder.get(o.id);
      const flags: string[] = [];
      if (gw && gw.amountNgn !== o.amount_ngn) flags.push("Amount mismatch");
      if (gw && !["delivered", "refunded", "pending", "vending", "needs_review", "vend_blocked", "failed"].includes(o.status)) flags.push("Paid but not processed");
      if (o.status === "delivered" && !gw && o.gateway === "mock") flags.push("Delivered without gateway payment");
      if (vtStatus === "delivered" && o.status !== "delivered") flags.push("VTpass delivered, order not");
      if (o.status === "delivered" && vtStatus && vtStatus !== "delivered") flags.push("Order delivered, VTpass not");
      if (["failed", "vend_blocked"].includes(o.status) && o.paid_at && !refund) flags.push("Refund due");
      return { id: o.id, ref: o.order_reference, status: o.status, amount: o.amount_ngn, gatewayPaid: gw?.amountNgn ?? null, vtpassStatus: vtStatus, refund: refund?.status ?? null, flags };
    });
    const orderRefs = new Set(orders.map((o) => o.gateway_reference));
    const orphanPayments = gwPayments.filter((p) => !orderRefs.has(p.gatewayReference));
    return {
      balance,
      lowBalance: balance !== null && balance < 20000,
      orders: orders.map((o) => ({ ...o, meter_number: maskMeter(o.meter_number), token: o.token ? "••••" + o.token.slice(-4) : null })),
      alerts: alertsRes.data ?? [],
      recon,
      orphanPayments,
      live: isLive(),
      gateway: getGateway().name,
      vtpassMode: vt.vtpassConfigured() ? (vt.vtpassIsLive() ? "live" : "sandbox") : "not configured",
    };
  });

export const adminOrderAction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ orderId: z.string().uuid(), action: z.enum(["requery", "refund", "confirm"]) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const eng = await import("./electricity/engine.server");
    const o = await eng.getOrderById(data.orderId);
    if (!o) throw new Error("Order not found");
    await eng.logEvent(o, "admin", `admin_${data.action}`, { by: context.userId });
    if (data.action === "requery") {
      if (!o.vend_attempted_at) throw new Error("This order was never sent to VTpass");
      await eng.requeryOrder(o);
    } else if (data.action === "confirm") await eng.confirmPayment(o);
    else {
      if (o.status === "delivered") throw new Error("Delivered orders can't be refunded here");
      await eng.refundOrder(o, "Refunded by admin");
    }
    return { status: (await eng.getOrderById(o.id))?.status ?? o.status };
  });

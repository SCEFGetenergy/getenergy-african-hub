// VTpass client. Keys are read from server secrets per call; never exposed to the browser.
// VTPASS_BASE_URL selects sandbox (https://sandbox.vtpass.com), live (https://vtpass.com) or a static-IP relay.

type Json = Record<string, unknown>;

function cfg() {
  const base = (process.env["VTPASS_BASE_URL"] ?? "").replace(/\/+$/, "");
  const apiKey = process.env["VTPASS_API_KEY"] ?? "";
  const secretKey = process.env["VTPASS_SECRET_KEY"] ?? "";
  const publicKey = process.env["VTPASS_PUBLIC_KEY"] ?? "";
  return { base, apiKey, secretKey, publicKey, configured: !!(base && apiKey && secretKey && publicKey) };
}

export function vtpassConfigured() {
  return cfg().configured;
}

export function vtpassIsLive() {
  const b = cfg().base;
  return !!b && !b.includes("sandbox");
}

/** Returns parsed JSON, or null on timeout / network error / non-JSON body. */
async function call(method: "GET" | "POST", path: string, body?: Json, timeoutMs = 30000): Promise<Json | null> {
  const c = cfg();
  if (!c.configured) throw new Error("VTpass is not configured");
  const headers: Record<string, string> = { "api-key": c.apiKey, "Content-Type": "application/json" };
  if (method === "POST") headers["secret-key"] = c.secretKey;
  else headers["public-key"] = c.publicKey;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${c.base}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined, signal: ctrl.signal });
    const text = await res.text();
    try {
      return JSON.parse(text) as Json;
    } catch {
      return null;
    }
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

export function merchantVerify(serviceID: string, billersCode: string, type: "prepaid" | "postpaid") {
  return call("POST", "/api/merchant-verify", { serviceID, billersCode, type }, 20000);
}

export function pay(p: { request_id: string; serviceID: string; billersCode: string; variation_code: "prepaid" | "postpaid"; amount: number; phone: string }) {
  return call("POST", "/api/pay", p, 45000);
}

export function requery(request_id: string) {
  return call("POST", "/api/requery", { request_id }, 20000);
}

export async function walletBalance(): Promise<number | null> {
  const r = await call("GET", "/api/balance", undefined, 15000);
  const b = (r?.["contents"] as Json | undefined)?.["balance"];
  const n = Number(b);
  return Number.isFinite(n) ? n : null;
}

// Pure, testable rules for live electricity token purchase (VTpass).

export const DISCOS = [
  { serviceId: "abuja-electric", short: "AEDC", label: "Abuja Electricity (AEDC)" },
  { serviceId: "benin-electric", short: "BEDC", label: "Benin Electricity (BEDC)" },
  { serviceId: "eko-electric", short: "EKEDC", label: "Eko Electricity (EKEDC)" },
  { serviceId: "enugu-electric", short: "EEDC", label: "Enugu Electricity (EEDC)" },
  { serviceId: "ibadan-electric", short: "IBEDC", label: "Ibadan Electricity (IBEDC)" },
  { serviceId: "ikeja-electric", short: "IE", label: "Ikeja Electric (IE)" },
  { serviceId: "jos-electric", short: "JED", label: "Jos Electricity (JED)" },
  { serviceId: "kaduna-electric", short: "KAEDCO", label: "Kaduna Electric (KAEDCO)" },
  { serviceId: "kano-electric", short: "KEDCO", label: "Kano Electricity (KEDCO)" },
  { serviceId: "portharcourt-electric", short: "PHED", label: "Port Harcourt Electricity (PHED)" },
  { serviceId: "yola-electric", short: "YEDC", label: "Yola Electricity (YEDC)" },
  { serviceId: "aba-electric", short: "Aba", label: "Aba Power" },
] as const;

export const SERVICE_IDS = DISCOS.map((d) => d.serviceId) as unknown as [string, ...string[]];
export const SITE_MIN_NGN = 1000;
export const MAX_NGN = 500000;
export const PENDING_LIMIT_MIN = 30;
export const VEND_BLOCKED_REFUND_MIN = 60;

export const ORDER_STATUSES = ["awaiting_payment", "paid", "vending", "delivered", "pending", "failed", "refunded", "needs_review", "vend_blocked"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

const ALNUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function randomSuffix(n: number, rand: () => number = Math.random): string {
  let s = "";
  for (let i = 0; i < n; i++) s += ALNUM[Math.floor(rand() * ALNUM.length)];
  return s;
}

/** Africa/Lagos is UTC+1 with no daylight saving. */
export function lagosStamp(now: Date): string {
  const d = new Date(now.getTime() + 60 * 60 * 1000);
  const p = (x: number) => String(x).padStart(2, "0");
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}${p(d.getUTCHours())}${p(d.getUTCMinutes())}`;
}

/** VTpass request_id: Lagos YYYYMMDDHHmm + unique alphanumeric suffix (>= 12 chars total). */
export function makeRequestId(now: Date, rand?: () => number): string {
  return lagosStamp(now) + randomSuffix(10, rand);
}

export function makeOrderReference(now: Date, rand?: () => number): string {
  return `GETELEC-${lagosStamp(now).slice(0, 8)}-${randomSuffix(6, rand)}`;
}

export function maskMeter(m: string): string {
  const s = String(m ?? "");
  return s.length <= 4 ? "****" : `${"*".repeat(s.length - 4)}${s.slice(-4)}`;
}

/** Minimum is the higher of the site floor and VTpass's returned minimum (arrears can raise it). */
export function effectiveMinimum(vtpassMin: unknown): number {
  const n = Math.ceil(Number(vtpassMin));
  return Number.isFinite(n) && n > SITE_MIN_NGN ? n : SITE_MIN_NGN;
}

export function amountMatches(paid: number | null | undefined, ordered: number): boolean {
  return typeof paid === "number" && Math.round(paid) === Math.round(ordered);
}

export type VendOutcome = "delivered" | "pending" | "failed" | "reversed" | "blocked" | "requery_original";

export const BLOCKED_CODES = ["018", "027", "028", "023", "087"];

/** Classify a VTpass /pay or /requery response. `null` = timeout / no response / unparseable. */
export function classifyVend(resp: unknown): VendOutcome {
  if (!resp || typeof resp !== "object") return "pending";
  const r = resp as { code?: unknown; content?: { transactions?: { status?: unknown } } };
  const code = String(r.code ?? "");
  const status = String(r.content?.transactions?.status ?? "").toLowerCase();
  if (status === "reversed" || code === "040") return "reversed";
  if (code === "000" && status === "delivered") return "delivered";
  if (code === "016" || code === "091") return "failed";
  if (BLOCKED_CODES.includes(code)) return "blocked";
  if (code === "019" || code === "014") return "requery_original";
  // 099, pending, initiated, empty or any unexpected shape: never re-vend; requery.
  return "pending";
}

export function extractToken(resp: unknown): string | null {
  if (!resp || typeof resp !== "object") return null;
  const r = resp as Record<string, unknown>;
  const raw = (r["mainToken"] ?? r["token"] ?? r["purchased_code"] ?? "") as string;
  const s = String(raw).replace(/^.*?token\s*:?\s*/i, "").trim();
  const digits = s.replace(/[^0-9]/g, "");
  return digits.length >= 12 ? digits : s || null;
}

export function groupToken(t: string): string {
  const d = t.replace(/\s/g, "");
  return /^\d+$/.test(d) ? d.replace(/(\d{4})(?=\d)/g, "$1 ") : t;
}

export const BLOCKED_MESSAGE = "We couldn't complete this right now. Your payment is safe and will be refunded or completed shortly.";

export function customerLabel(status: OrderStatus): string {
  switch (status) {
    case "awaiting_payment": return "Awaiting payment";
    case "paid":
    case "vending": return "Processing";
    case "delivered": return "Delivered";
    case "pending":
    case "needs_review": return "Processing, we'll message you.";
    case "vend_blocked": return BLOCKED_MESSAGE;
    case "failed": return "Purchase failed — your refund has started.";
    case "refunded": return "Refunded";
  }
}

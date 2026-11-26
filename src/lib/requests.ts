// Shared client helpers for the lead-capture RPCs.
export const RATE_LIMITED = "RATE_LIMITED";
export const RATE_LIMIT_MESSAGE = "You've sent several requests in a short time. Please wait a few minutes and try again.";

/** Honeypot input name. Real visitors never see or fill it; bots usually do. */
export const HONEYPOT_NAME = "website_url";

/** Turn an RPC reply into either a reference or a friendly error. */
export function readReference(data: unknown): { reference: string } | { error: string } {
  if (data === RATE_LIMITED) return { error: RATE_LIMIT_MESSAGE };
  if (typeof data === "string" && data) return { reference: data };
  return { error: "Please try again in a moment." };
}

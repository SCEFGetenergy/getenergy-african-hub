export type AuthErrorContext = "login" | "register" | "reset" | "generic";

/** Only same-origin absolute paths may be used for post-authentication navigation. */
export function safeReturnTo(value: unknown, fallback = "/account"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\r\n]/.test(value)) return fallback;
  try {
    const url = new URL(value, "https://getenergy.ng");
    if (url.origin !== "https://getenergy.ng") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function returnToFromLocation(fallback: string): string {
  return safeReturnTo(new URLSearchParams(window.location.search).get("returnTo"), fallback);
}

export function currentPageReturnTo(): string {
  return safeReturnTo(`${window.location.pathname}${window.location.search}${window.location.hash}`, "/academy");
}

export function withReturnTo(path: string, returnTo: string): string {
  const url = new URL(path, "https://getenergy.ng");
  url.searchParams.set("returnTo", safeReturnTo(returnTo, "/account"));
  return `${url.pathname}${url.search}${url.hash}`;
}

/** Stable, human-safe authentication messages without leaking backend details. */
export function authErrorMessage(error: unknown, context: AuthErrorContext = "generic"): string {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error ?? "").toLowerCase();
  if (message.includes("email not confirmed")) return "Please confirm your email first — check your inbox for the confirmation link.";
  if (message.includes("invalid login credentials") || message.includes("invalid email or password")) return "Email or password is incorrect.";
  if (message.includes("already registered") || message.includes("already exists")) return "An account already exists for this email. Sign in instead, or reset your password.";
  if (message.includes("weak password") || message.includes("password should") || message.includes("at least")) return "Choose a stronger password with at least 8 characters.";
  if (message.includes("rate limit") || message.includes("rate_limit") || message.includes("too many") || message.includes("429")) return "Too many attempts. Please wait a few minutes and try again.";
  if (message.includes("invalid email")) return "Enter a valid email address.";
  if (context === "register") return "We couldn't create your account. Check your details and try again.";
  if (context === "reset") return "We couldn't send the reset link right now. Please try again shortly.";
  if (context === "login") return "We couldn't sign you in. Check your details and try again.";
  return "Something went wrong. Please try again.";
}

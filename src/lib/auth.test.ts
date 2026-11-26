import { describe, expect, it } from "vitest";
import { authErrorMessage, safeReturnTo, withReturnTo } from "./auth";

describe("authentication navigation and errors", () => {
  it("preserves an internal course return path", () => {
    expect(safeReturnTo("/training-certification/waitlist?programme=solar-pv-installation-supervision#register", "/academy")).toBe("/training-certification/waitlist?programme=solar-pv-installation-supervision#register");
  });
  it.each(["https://example.com/phish", "//example.com/phish", "/\\example.com", "javascript:alert(1)"])("rejects unsafe return path %s", (value) => {
    expect(safeReturnTo(value, "/academy")).toBe("/academy");
  });
  it("carries returnTo between login and registration", () => {
    expect(withReturnTo("/academy/register", "/academy/programmes?item=CEOWP")).toBe("/academy/register?returnTo=%2Facademy%2Fprogrammes%3Fitem%3DCEOWP");
  });
  it("explains wrong passwords", () => {
    expect(authErrorMessage(new Error("Invalid login credentials"), "login")).toBe("Email or password is incorrect.");
  });
  it("explains unconfirmed email", () => {
    expect(authErrorMessage(new Error("Email not confirmed"), "login")).toContain("confirm your email");
  });
  it("explains an existing registration", () => {
    expect(authErrorMessage(new Error("User already registered"), "register")).toContain("already exists");
  });
  it("explains weak passwords", () => {
    expect(authErrorMessage(new Error("Password should be at least 8 characters"), "register")).toContain("stronger password");
  });
  it("explains rate limits", () => {
    expect(authErrorMessage(new Error("over_email_send_rate_limit"), "reset")).toContain("Too many attempts");
  });
});

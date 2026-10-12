import { describe, it, expect } from "vitest";
import { amountMatches, classifyVend, effectiveMinimum, extractToken, makeRequestId, maskMeter } from "./rules";

describe("VTpass request_id", () => {
  it("starts with Africa/Lagos YYYYMMDDHHmm and is at least 12 chars", () => {
    const id = makeRequestId(new Date("2026-10-12T23:30:00Z"));
    expect(id.slice(0, 12)).toBe("202610130030");
    expect(id.length).toBeGreaterThanOrEqual(12);
    expect(id).toMatch(/^\d{12}[A-Z0-9]+$/);
  });
});

describe("vend outcomes", () => {
  it("000 + delivered is success", () => expect(classifyVend({ code: "000", content: { transactions: { status: "delivered" } } })).toBe("delivered"));
  it("099 is pending", () => expect(classifyVend({ code: "099" })).toBe("pending"));
  it("inner pending is pending", () => expect(classifyVend({ code: "000", content: { transactions: { status: "pending" } } })).toBe("pending"));
  it("no response is pending", () => expect(classifyVend(null)).toBe("pending"));
  it("016 fails", () => expect(classifyVend({ code: "016" })).toBe("failed"));
  it("091 fails", () => expect(classifyVend({ code: "091" })).toBe("failed"));
  it("040 is reversed", () => expect(classifyVend({ code: "040" })).toBe("reversed"));
  it("reversed status is reversed", () => expect(classifyVend({ code: "000", content: { transactions: { status: "reversed" } } })).toBe("reversed"));
  for (const c of ["018", "027", "028", "023", "087"]) it(`${c} is blocked`, () => expect(classifyVend({ code: c })).toBe("blocked"));
  it("019 requeries the original", () => expect(classifyVend({ code: "019" })).toBe("requery_original"));
  it("014 requeries the original", () => expect(classifyVend({ code: "014" })).toBe("requery_original"));
});

describe("money rules", () => {
  it("minimum never drops below N1,000", () => expect(effectiveMinimum(500)).toBe(1000));
  it("arrears minimum above N1,000 is enforced", () => expect(effectiveMinimum("3500")).toBe(3500));
  it("paid amount must equal order amount", () => {
    expect(amountMatches(5000, 5000)).toBe(true);
    expect(amountMatches(4999, 5000)).toBe(false);
    expect(amountMatches(null, 5000)).toBe(false);
  });
  it("masks meter numbers", () => expect(maskMeter("1111111111111")).toBe("*********1111"));
  it("reads the token from purchased_code", () => expect(extractToken({ purchased_code: "Token : 4217 6123 0987 1234 5678" })).toBe("42176123098712345678"));
});

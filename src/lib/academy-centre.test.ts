import { describe, expect, it } from "vitest";
import { ACADEMY_CENTRE } from "./academy";

describe("Academy facility status", () => {
  it("keeps B16 a proposed facility rather than an operating centre", () => {
    expect(ACADEMY_CENTRE.name).toBe("B16 Training Centre");
    expect(ACADEMY_CENTRE.status).toBe("Proposed facility");
  });
});
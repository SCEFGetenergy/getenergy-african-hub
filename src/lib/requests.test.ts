import { describe, expect, it } from "vitest";
import { RATE_LIMITED, readReference } from "./requests";

describe("readReference", () => {
  it("turns the rate-limit reply into a friendly error, never a reference", () => {
    expect(readReference(RATE_LIMITED)).toEqual({ error: expect.stringContaining("wait a few minutes") });
  });
  it("returns a real reference", () => {
    expect(readReference("GE-2611-00012")).toEqual({ reference: "GE-2611-00012" });
  });
});

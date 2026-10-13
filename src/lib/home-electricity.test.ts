import { describe, expect, it } from "vitest";
import { canPurchase, electricityDestination, QUICK_AMOUNTS, stickyVisible, validateQuickStart } from "./home-electricity";

const live = { live: true, discos: [{ serviceId: "eko-electric", confirmed: true }, { serviceId: "abuja-electric", confirmed: false }] };
describe("homepage electricity safety", () => {
  it("flag OFF always uses the request form even with a confirmed DISCO", () => {
    expect(electricityDestination({ ...live, live: false }, "eko-electric")).toBe("/get-electricity#elecform");
  });
  it("an unconfirmed DISCO cannot use purchase", () => {
    expect(canPurchase(live, "abuja-electric")).toBe(false);
    expect(electricityDestination(live, "abuja-electric")).toBe("/get-electricity#elecform");
  });
  it("a confirmed live DISCO continues to purchase", () => {
    expect(electricityDestination(live, "eko-electric")).toBe("/get-electricity#elec-live-root");
  });
  it("enforces the ₦1,000 quick-start floor", () => {
    expect(validateQuickStart({ serviceId: "eko-electric", meter: "11111111111", amount: "999" })).not.toBe("");
    expect(validateQuickStart({ serviceId: "eko-electric", meter: "11111111111", amount: "1000" })).toBe("");
  });
  it("offers the four specified amount picks", () => { expect(QUICK_AMOUNTS).toEqual([1000, 2000, 5000, 10000]); });
  it("hides sticky actions while the panel is visible", () => { expect(stickyVisible(true, false, false)).toBe(false); });
  it("hides sticky actions while an input is focused", () => { expect(stickyVisible(false, true, false)).toBe(false); });
  it("hides sticky actions while the menu is open", () => { expect(stickyVisible(false, false, true)).toBe(false); });
  it("restores sticky actions after leaving the panel", () => { expect(stickyVisible(false, false, false)).toBe(true); });
});
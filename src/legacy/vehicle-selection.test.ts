import { describe, expect, it } from "vitest";
import { canPrefillVehicle, catalogueModels, vehicleQuoteSelection } from "./vehicle-selection";

describe("vehicle quote handoff", () => {
  it("carries a supported selected model", () => {
    expect(vehicleQuoteSelection("BYD", "Atto 3, Dolphin, Seal, Song Plus DM-i", "Seal")).toBe("BYD — Seal");
  });
  it("does not invent a model from URL input", () => {
    expect(vehicleQuoteSelection("BYD", "Atto 3, Dolphin", "Model Y")).toBe("BYD");
  });
  it("keeps the brand when no model is selected", () => {
    expect(vehicleQuoteSelection("Tesla", "Model 3, Model Y", null)).toBe("Tesla");
  });
  it("preserves visitor-edited vehicle text", () => {
    expect(canPrefillVehicle("My custom fleet requirement", "BYD")).toBe(false);
    expect(canPrefillVehicle("BYD", "BYD")).toBe(true);
    expect(canPrefillVehicle("", undefined)).toBe(true);
  });
  it("retains the existing model descriptions", () => {
    expect(catalogueModels("Tiggo 7 Pro, Tiggo 8 Pro (hybrid versions)")).toEqual(["Tiggo 7 Pro", "Tiggo 8 Pro (hybrid versions)"]);
  });
});
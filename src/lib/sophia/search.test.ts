import { describe, expect, it } from "vitest";
import { KNOWLEDGE } from "./knowledge";
import { createIndex, tokenize } from "./search";
const searchKnowledge = createIndex(KNOWLEDGE);

describe("knowledge base", () => {
  it("has unique ids and non-empty answers", () => {
    expect(new Set(KNOWLEDGE.map((k) => k.id)).size).toBe(KNOWLEDGE.length);
    for (const k of KNOWLEDGE) expect(k.answer.length).toBeGreaterThan(40);
  });
});

describe("searchKnowledge", () => {
  it.each([
    ["how long to charge my car", "chg-time"],
    ["charging station near me in lekki", "chg-where"],
    ["I want to host a charger at my filling station", "chg-host"],
    ["difference between ac and dc", "chg-ac-dc"],
    ["what happens when there is no light nepa", "chg-power-outage"],
    ["which plug type 2 or gbt", "chg-connectors"],
    ["install charger in my house", "chg-home"],
    ["vision 400", "chg-vision-400"],
    ["difference between hybrid and plug-in hybrid", "car-types"],
    ["do you sell electric cars", "car-buy"],
    ["how far can an ev go", "car-range"],
    ["is ev battery warranty long", "car-battery-life"],
    ["repair my hybrid", "car-service"],
    ["cng or electric which is better", "car-cng-vs-ev"],
    ["when is the next training", "acad-status"],
    ["how much is the ev charging course", "acad-ev-fees"],
    ["will i get certificate", "acad-certificate"],
    ["train my company staff", "acad-corporate"],
    ["solar installation training", "acad-solar"],
    ["chargng statoin", "chg-where"],
  ])("%s → %s", (q, id) => {
    const ids = searchKnowledge(q, { limit: 3 }).map((r) => r.entry.id);
    expect(ids).toContain(id);
  });

  it("filters by topic", () => {
    expect(searchKnowledge("cost", { topic: "academy" }).every((r) => r.entry.topic === "academy")).toBe(true);
  });

  it("returns nothing for empty or stop-word queries", () => {
    expect(searchKnowledge("")).toEqual([]);
    expect(searchKnowledge("what is the")).toEqual([]);
  });

  it("maps local terms", () => {
    expect(tokenize("NEPA light")).toEqual(["power", "power"]);
  });
});

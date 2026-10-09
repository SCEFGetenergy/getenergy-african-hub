import { describe, it, expect } from "vitest";
import { toCsv, ELEC_STATUSES } from "./ElectricityQueue";
describe("GETELEC queue", () => {
  it("offers the seven brief statuses", () => { expect(ELEC_STATUSES).toHaveLength(7); expect(ELEC_STATUSES).toContain("Pending Partner Integration"); });
  it("neutralises spreadsheet formulas in CSV", () => { expect(toCsv([{ full_name: "=HACK()" }]).split("\n")[1]).toContain(`"'=HACK()"`); });
});

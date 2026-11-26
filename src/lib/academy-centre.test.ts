import { describe, expect, it } from "vitest";
import { ACADEMY_CENTRE, getProgramme } from "./academy";

describe("Academy facility status", () => {
  it("keeps B16 a proposed facility rather than an operating centre", () => {
    expect(ACADEMY_CENTRE.name).toBe("B16 Training Centre");
    expect(ACADEMY_CENTRE.status).toBe("Proposed facility");
  });
  it("uses the owner's 6.50 by 6.90 metre room dimensions and area", () => {
    expect(ACADEMY_CENTRE.room.widthMetres).toBe(6.5);
    expect(ACADEMY_CENTRE.room.depthMetres).toBe(6.9);
    expect(ACADEMY_CENTRE.room.widthMetres * ACADEMY_CENTRE.room.depthMetres).toBeCloseTo(44.85);
    expect(ACADEMY_CENTRE.room.areaSquareMetres).toBe(44.85);
    expect(ACADEMY_CENTRE.room.approximateSquareFeet).toBe(483);
  });
  it("limits the proposed seating capacity to 24 learners plus one instructor", () => {
    expect(ACADEMY_CENTRE.capacity.learnersPerSession).toBe(24);
    expect(ACADEMY_CENTRE.capacity.instructorsPerSession).toBe(1);
    expect(ACADEMY_CENTRE.furniture.studentTables * ACADEMY_CENTRE.furniture.seatsPerTable).toBe(24);
    expect(ACADEMY_CENTRE.furniture.studentChairs).toBe(24);
  });
  it("provides two proposed sessions with at most 48 learners daily", () => {
    expect(ACADEMY_CENTRE.capacity.sessionsPerDay).toBe(2);
    expect(ACADEMY_CENTRE.capacity.learnersPerSession * ACADEMY_CENTRE.capacity.sessionsPerDay).toBe(48);
  });
  it("keeps seating unfinalised and all three practical areas planned", () => {
    expect(ACADEMY_CENTRE.layoutStatus).toBe("being_finalised");
    expect(ACADEMY_CENTRE.practicalAreas).toHaveLength(3);
    for (const area of ACADEMY_CENTRE.practicalAreas) expect(area.status).toBe("Planned");
  });
  it("links each practical area to its existing matching programme", () => {
    expect(ACADEMY_CENTRE.practicalAreas.map((area) => area.slug)).toEqual(["solar-pv-installation-supervision", "ev-charging-infrastructure", "cng-technical-fundamentals"]);
    for (const area of ACADEMY_CENTRE.practicalAreas) expect(getProgramme(area.slug)?.slug).toBe(area.slug);
  });
  it("retains the owner's table dimensions and dedicated presenter and media desks", () => {
    expect(ACADEMY_CENTRE.furniture.tableWidthMetres).toBe(1.2);
    expect(ACADEMY_CENTRE.furniture.tableDepthMinMetres).toBe(0.45);
    expect(ACADEMY_CENTRE.furniture.tableDepthMaxMetres).toBe(0.6);
    expect(ACADEMY_CENTRE.furniture.tableHeightMetres).toBe(0.75);
    expect(ACADEMY_CENTRE.furniture.instructorTables).toBe(1);
    expect(ACADEMY_CENTRE.furniture.multimediaDesks).toBe(1);
  });
});
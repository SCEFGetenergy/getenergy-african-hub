import { describe, expect, it } from "vitest";
import { visibleSections, type AdminAccess } from "./adminAccess";

const none: AdminAccess = { admin: false, view_requests: false, edit_content: false, manage_availability: false, manage_team: false };

describe("admin section access", () => {
  it("staff with no permissions see nothing", () => {
    expect(visibleSections(none)).toEqual([]);
  });
  it("view_requests shows only request areas", () => {
    expect(visibleSections({ ...none, view_requests: true })).toEqual(["overview", "requests", "electricity"]);
  });
  it("edit_content shows only the site notice", () => {
    expect(visibleSections({ ...none, edit_content: true })).toEqual(["notice"]);
  });
  it("manage_availability shows only service availability", () => {
    expect(visibleSections({ ...none, manage_availability: true })).toEqual(["availability"]);
  });
  it("manage_team shows team settings but not permission editing", () => {
    const s = visibleSections({ ...none, manage_team: true });
    expect(s).toEqual(["team"]);
    expect(s).not.toContain("permissions");
  });
  it("staff never see Academy settings, even with every permission", () => {
    const s = visibleSections({ ...none, view_requests: true, edit_content: true, manage_availability: true, manage_team: true });
    expect(s).not.toContain("academy");
    expect(s).not.toContain("permissions");
  });
  it("full administrators see every section", () => {
    expect(visibleSections({ ...none, admin: true })).toEqual(["overview", "requests", "electricity", "notice", "availability", "academy", "team", "permissions"]);
  });
});

export type AdminAccess = {
  admin: boolean;
  view_requests: boolean;
  edit_content: boolean;
  manage_availability: boolean;
  manage_team: boolean;
};

export type AdminSection =
  | "overview" | "requests" | "electricity" | "notice" | "availability" | "academy" | "team" | "permissions";

/** Which admin sections a user may see. Mirrors the server-side has_permission() rules. */
export function visibleSections(a: AdminAccess): AdminSection[] {
  const full = a.admin;
  const s: AdminSection[] = [];
  if (full || a.view_requests) s.push("overview", "requests", "electricity");
  if (full || a.edit_content) s.push("notice");
  if (full || a.manage_availability) s.push("availability");
  if (full) s.push("academy");
  if (full || a.manage_team) s.push("team");
  if (full) s.push("permissions");
  return s;
}

/**
 * Integration test against the real backend: a temporary staff account is created,
 * signed in, and checked against the database's own access rules. Skipped when the
 * backend credentials are not available. The temporary account is always removed.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env["SUPABASE_URL"];
const PUB = process.env["SUPABASE_PUBLISHABLE_KEY"];
const SERVICE = process.env["SUPABASE_SERVICE_ROLE_KEY"];
const enabled = !!(URL && PUB && SERVICE);

function client(key: string) {
  return createClient(URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

describe.skipIf(!enabled)("server-side staff permissions", () => {
  let admin: SupabaseClient;
  let staff: SupabaseClient;
  let userId = "";
  const email = `perm-test-${Date.now()}@getenergytest.dev`;
  const password = `T${crypto.randomUUID()}!a1`;

  beforeAll(async () => {
    admin = client(SERVICE!);
    const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) throw error;
    userId = data.user.id;
    const r = await admin.from("user_roles").insert({ user_id: userId, role: "staff" });
    if (r.error) throw r.error;
    staff = client(PUB!);
    const s = await staff.auth.signInWithPassword({ email, password });
    if (s.error) throw s.error;
  }, 30_000);

  afterAll(async () => {
    if (!userId) return;
    await admin.from("admin_permissions").delete().eq("user_id", userId);
    await admin.auth.admin.deleteUser(userId);
  });

  describe("staff with no permissions", () => {
    it("cannot read service requests", async () => {
      const { data } = await staff.from("service_requests").select("id").limit(5);
      expect(data ?? []).toHaveLength(0);
    });
    it("cannot read electricity token requests", async () => {
      const { data } = await staff.from("electricity_token_requests").select("id").limit(5);
      expect(data ?? []).toHaveLength(0);
    });
    it("cannot update request status", async () => {
      const { data } = await staff.from("service_requests").update({ status: "closed" }).neq("id", "00000000-0000-0000-0000-000000000000").select("id");
      expect(data ?? []).toHaveLength(0);
    });
    it("cannot edit the site-wide notice", async () => {
      const { data } = await staff.from("site_notices").update({ message: "hacked" }).eq("id", 1).select("id");
      expect(data ?? []).toHaveLength(0);
    });
    it("cannot change service availability", async () => {
      const { data } = await staff.from("service_statuses").update({ status: "live" }).eq("slug", "electricity").select("slug");
      expect(data ?? []).toHaveLength(0);
    });
    it("cannot list team members", async () => {
      const { error } = await staff.rpc("list_team_members");
      expect(error).not.toBeNull();
    });
    it("cannot invite team members", async () => {
      const { error } = await staff.rpc("create_admin_invitation", { p_email: "x@getenergytest.dev", p_role: "staff" });
      expect(error).not.toBeNull();
    });
    it("cannot read the audit log", async () => {
      const { data } = await staff.from("audit_log").select("id").limit(5);
      expect(data ?? []).toHaveLength(0);
    });
    it("cannot grant itself permissions", async () => {
      const { error } = await staff.rpc("set_admin_permission", { p_user_id: userId, p_permission: "manage_team", p_granted: true });
      expect(error).not.toBeNull();
    });
  });

  describe("staff with only view_requests", () => {
    beforeAll(async () => {
      const r = await admin.from("admin_permissions").insert({ user_id: userId, permission: "view_requests" });
      if (r.error) throw r.error;
    });
    it("can now read service requests", async () => {
      const { data, error } = await staff.from("service_requests").select("id").limit(1);
      expect(error).toBeNull();
      expect((data ?? []).length).toBeGreaterThan(0);
    });
    it("still cannot edit content, availability or team settings", async () => {
      const n = await staff.from("site_notices").update({ message: "hacked" }).eq("id", 1).select("id");
      const s = await staff.from("service_statuses").update({ status: "live" }).eq("slug", "electricity").select("slug");
      const t = await staff.rpc("list_team_members");
      expect(n.data ?? []).toHaveLength(0);
      expect(s.data ?? []).toHaveLength(0);
      expect(t.error).not.toBeNull();
    });
  });
});

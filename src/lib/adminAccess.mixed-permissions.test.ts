/**
 * Integration test against the real backend: a temporary staff account is given every
 * combination of the four admin permissions and each server-side action is checked.
 * An action must succeed only when its matching permission is granted.
 * Positive checks write back the current value, so no live data changes.
 * Skipped when backend credentials are unavailable. The temporary account is always removed.
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

const PERMS = ["view_requests", "edit_content", "manage_availability", "manage_team"] as const;
type Perm = (typeof PERMS)[number];

// Every non-empty mixed combination (single permissions and all pairs/triples/full set).
const combos: Perm[][] = [];
for (let mask = 1; mask < 1 << PERMS.length; mask++) combos.push(PERMS.filter((_, i) => mask & (1 << i)));

describe.skipIf(!enabled)("mixed staff permissions unlock only matching server actions", () => {
  let admin: SupabaseClient;
  let staff: SupabaseClient;
  let userId = "";
  const email = `perm-mix-${Date.now()}@getenergytest.dev`;
  const password = `T${crypto.randomUUID()}!a1`;

  const probes: Record<Perm, () => Promise<boolean>> = {
    view_requests: async () => {
      const { data } = await staff.from("service_requests").select("id").limit(1);
      return (data ?? []).length > 0;
    },
    edit_content: async () => {
      const cur = await admin.from("site_notices").select("message").eq("id", 1).single();
      const { data } = await staff.from("site_notices").update({ message: cur.data!.message }).eq("id", 1).select("id");
      return (data ?? []).length > 0;
    },
    manage_availability: async () => {
      const cur = await admin.from("service_statuses").select("status").eq("slug", "electricity").single();
      const { data } = await staff.from("service_statuses").update({ status: cur.data!.status }).eq("slug", "electricity").select("slug");
      return (data ?? []).length > 0;
    },
    manage_team: async () => {
      const { error } = await staff.rpc("list_team_members");
      return error === null;
    },
  };

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

  for (const granted of combos) {
    describe(`granted: ${granted.join(" + ")}`, () => {
      beforeAll(async () => {
        await admin.from("admin_permissions").delete().eq("user_id", userId);
        const r = await admin.from("admin_permissions").insert(granted.map((permission) => ({ user_id: userId, permission })));
        if (r.error) throw r.error;
      });

      for (const perm of PERMS) {
        const allowed = granted.includes(perm);
        it(`${allowed ? "can" : "cannot"} perform ${perm} actions`, async () => {
          expect(await probes[perm]()).toBe(allowed);
        });
      }

      it("still cannot grant itself permissions or invite a full administrator", async () => {
        const g = await staff.rpc("set_admin_permission", { p_user_id: userId, p_permission: "manage_team", p_granted: true });
        const i = await staff.rpc("create_admin_invitation", { p_email: "x@getenergytest.dev", p_role: "admin" });
        expect(g.error).not.toBeNull();
        expect(i.error).not.toBeNull();
      });
    });
  }
});

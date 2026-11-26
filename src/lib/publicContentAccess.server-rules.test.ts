/**
 * Verifies the real backend rules for every publicly readable content table.
 * Anonymous visitors and staff without permissions must not create, edit or delete
 * records. Full administrators retain their intended management access.
 * Skipped when backend credentials are unavailable; all test records/users are removed.
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

describe.skipIf(!enabled)("public content write protection", () => {
  let service: SupabaseClient;
  let anonymous: SupabaseClient;
  let staff: SupabaseClient;
  let fullAdmin: SupabaseClient;
  let staffId = "";
  let adminId = "";
  let employerId = "";
  const stamp = Date.now();
  const code = `QA-PUBLIC-${stamp}`;
  const disco = `qa-disco-${stamp}`;
  const status = `qa-status-${stamp}`;
  const password = `T${crypto.randomUUID()}!a1`;

  beforeAll(async () => {
    service = client(SERVICE!);
    anonymous = client(PUB!);
    for (const [kind, role] of [["staff", "staff"], ["admin", "admin"]] as const) {
      const email = `public-access-${kind}-${stamp}@getenergytest.dev`;
      const { data, error } = await service.auth.admin.createUser({ email, password, email_confirm: true });
      if (error) throw error;
      const id = data.user.id;
      if (kind === "staff") staffId = id;
      else adminId = id;
      const r = await service.from("user_roles").insert({ user_id: id, role });
      if (r.error) throw r.error;
      const c = client(PUB!);
      const s = await c.auth.signInWithPassword({ email, password });
      if (s.error) throw s.error;
      if (kind === "staff") staff = c;
      else fullAdmin = c;
    }

    const setting = await service.from("certification_settings").insert({ code, fee_ngn: 1000, fee_approved: false });
    if (setting.error) throw setting.error;
    const employer = await service.from("certification_employers").insert({ certification_code: code, employer_name: "QA Employer" }).select("id").single();
    if (employer.error) throw employer.error;
    employerId = employer.data.id;
    const d = await service.from("electricity_disco_live").insert({ service_id: disco, label: "QA DISCO", confirmed_live: false });
    if (d.error) throw d.error;
    const s = await service.from("service_statuses").insert({ slug: status, label: "QA status", path: "/qa", status: "paused", sort_order: 999 });
    if (s.error) throw s.error;
  }, 30_000);

  afterAll(async () => {
    if (!service) return;
    await service.from("certification_employers").delete().eq("certification_code", code);
    await service.from("certification_settings").delete().like("code", `${code}%`);
    await service.from("electricity_disco_live").delete().eq("service_id", disco);
    await service.from("service_statuses").delete().like("slug", `${status}%`);
    if (staffId) await service.auth.admin.deleteUser(staffId);
    if (adminId) await service.auth.admin.deleteUser(adminId);
  });

  it("keeps all five public read paths available", async () => {
    const results = await Promise.all([
      anonymous.from("certification_employers").select("id").limit(1),
      anonymous.from("certification_settings").select("code").limit(1),
      anonymous.from("electricity_disco_live").select("service_id").limit(1),
      anonymous.from("service_statuses").select("slug").limit(1),
      anonymous.from("site_notices").select("id").limit(1),
    ]);
    for (const result of results) expect(result.error).toBeNull();
  });

  for (const [label, actor] of [["anonymous visitors", () => anonymous], ["staff without permissions", () => staff]] as const) {
    describe(label, () => {
      it("cannot create, edit or delete certification fees", async () => {
        const c = actor();
        const results = [
          await c.from("certification_settings").insert({ code: `${code}-X`, fee_ngn: 2000, fee_approved: false }).select("code"),
          await c.from("certification_settings").update({ fee_ngn: 2000 }).eq("code", code).select("code"),
          await c.from("certification_settings").delete().eq("code", code).select("code"),
        ];
        for (const result of results) expect(result.error !== null || (result.data ?? []).length === 0).toBe(true);
      });

      it("cannot create, edit or delete recognised employers", async () => {
        const c = actor();
        const results = [
          await c.from("certification_employers").insert({ certification_code: code, employer_name: "Unauthorised" }).select("id"),
          await c.from("certification_employers").update({ employer_name: "Unauthorised" }).eq("id", employerId).select("id"),
          await c.from("certification_employers").delete().eq("id", employerId).select("id"),
        ];
        for (const result of results) expect(result.error !== null || (result.data ?? []).length === 0).toBe(true);
      });

      it("cannot create, edit or delete live DISCO records", async () => {
        const c = actor();
        const results = [
          await c.from("electricity_disco_live").insert({ service_id: `${disco}-x`, label: "Unauthorised", confirmed_live: true }).select("service_id"),
          await c.from("electricity_disco_live").update({ confirmed_live: true }).eq("service_id", disco).select("service_id"),
          await c.from("electricity_disco_live").delete().eq("service_id", disco).select("service_id"),
        ];
        for (const result of results) expect(result.error !== null || (result.data ?? []).length === 0).toBe(true);
      });

      it("cannot create, edit or delete service availability", async () => {
        const c = actor();
        const results = [
          await c.from("service_statuses").insert({ slug: `${status}-x`, label: "Unauthorised", path: "/qa-x", status: "live" }).select("slug"),
          await c.from("service_statuses").update({ status: "live" }).eq("slug", status).select("slug"),
          await c.from("service_statuses").delete().eq("slug", status).select("slug"),
        ];
        for (const result of results) expect(result.error !== null || (result.data ?? []).length === 0).toBe(true);
      });

      it("cannot create, edit or delete site notices", async () => {
        const c = actor();
        const results = [
          await c.from("site_notices").insert({ id: 1, message: "Unauthorised" }).select("id"),
          await c.from("site_notices").update({ message: "Unauthorised" }).eq("id", 1).select("id"),
          await c.from("site_notices").delete().eq("id", 1).select("id"),
        ];
        for (const result of results) expect(result.error !== null || (result.data ?? []).length === 0).toBe(true);
      });
    });
  }

  it("allows full administrators to manage certification fees", async () => {
    const adminCode = `${code}-ADMIN`;
    const inserted = await fullAdmin.from("certification_settings").insert({ code: adminCode, fee_ngn: 1000, fee_approved: false }).select("code");
    expect(inserted.error).toBeNull();
    const updated = await fullAdmin.from("certification_settings").update({ fee_ngn: 1500 }).eq("code", adminCode).select("code");
    expect(updated.error).toBeNull();
    expect(updated.data).toHaveLength(1);
    const removed = await fullAdmin.from("certification_settings").delete().eq("code", adminCode).select("code");
    expect(removed.error).toBeNull();
    expect(removed.data).toHaveLength(1);
  });

  it("allows full administrators to manage recognised employers", async () => {
    const inserted = await fullAdmin.from("certification_employers").insert({ certification_code: code, employer_name: "QA Admin Employer" }).select("id").single();
    expect(inserted.error).toBeNull();
    const id = inserted.data!.id;
    const updated = await fullAdmin.from("certification_employers").update({ employer_name: "QA Admin Employer Updated" }).eq("id", id).select("id");
    expect(updated.error).toBeNull();
    expect(updated.data).toHaveLength(1);
    const removed = await fullAdmin.from("certification_employers").delete().eq("id", id).select("id");
    expect(removed.error).toBeNull();
    expect(removed.data).toHaveLength(1);
  });

  it("allows full administrators to update live DISCO availability", async () => {
    const result = await fullAdmin.from("electricity_disco_live").update({ confirmed_live: true }).eq("service_id", disco).select("service_id");
    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(1);
  });

  it("allows full administrators to create and update service availability", async () => {
    const adminStatus = `${status}-admin`;
    const inserted = await fullAdmin.from("service_statuses").insert({ slug: adminStatus, label: "QA admin status", path: "/qa-admin", status: "paused" }).select("slug");
    expect(inserted.error).toBeNull();
    const updated = await fullAdmin.from("service_statuses").update({ status: "enquiry_only" }).eq("slug", adminStatus).select("slug");
    expect(updated.error).toBeNull();
    expect(updated.data).toHaveLength(1);
  });

  it("allows full administrators to edit the existing site notice without changing its text", async () => {
    const current = await service.from("site_notices").select("message").eq("id", 1).single();
    expect(current.error).toBeNull();
    const result = await fullAdmin.from("site_notices").update({ message: current.data!.message }).eq("id", 1).select("id");
    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(1);
  });
});

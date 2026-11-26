/** Live-backend checks for duplicate-safe, authenticated Academy course registration. */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env["SUPABASE_URL"];
const PUB = process.env["SUPABASE_PUBLISHABLE_KEY"];
const SERVICE = process.env["SUPABASE_SERVICE_ROLE_KEY"];
const enabled = !!(URL && PUB && SERVICE);
const COURSE = "solar-pv-installation-supervision";

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

type Registration = { status: string; reference?: string; course_key?: string };

describe.skipIf(!enabled)("Academy course registration RPC", () => {
  let service: SupabaseClient;
  let learner: SupabaseClient;
  let userId = "";
  let reference = "";
  const email = `course-rpc-${Date.now()}@getenergytest.dev`;
  const password = `T${crypto.randomUUID()}!a1`;
  const input = {
    p_course_key: COURSE,
    p_contact_name: "QA Test Learner",
    p_contact_phone: "+2348180000000",
    p_company_name: null,
    p_location: "Lagos, Nigeria",
    p_details: { source: "vitest" },
    p_consent: true,
  };

  beforeAll(async () => {
    service = client(SERVICE!);
    const { data, error } = await service.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "QA Test Learner", phone: "+2348180000000", account_type: "individual" },
    });
    if (error) throw error;
    userId = data.user.id;
    learner = client(PUB!);
    const session = await learner.auth.signInWithPassword({ email, password });
    if (session.error) throw session.error;
  }, 30_000);

  afterAll(async () => {
    if (!service) return;
    if (userId) await service.from("service_requests").delete().eq("user_id", userId);
    if (userId) await service.auth.admin.deleteUser(userId);
  });

  it("registers a valid course with a reference linked to the learner", async () => {
    const { data, error } = await learner.rpc("register_academy_course", input);
    expect(error).toBeNull();
    const result = data as Registration;
    expect(result.status).toBe("registered");
    expect(result.course_key).toBe(COURSE);
    expect(result.reference).toMatch(/^GE-\d{4}-\d{5}$/);
    reference = result.reference!;

    const { data: rows, error: readError } = await learner.from("service_requests").select("reference,user_id,request_type,details,is_test").eq("reference", reference);
    expect(readError).toBeNull();
    expect(rows).not.toBeNull();
    expect(rows ?? []).toHaveLength(1);
    expect(rows?.[0]?.user_id).toBe(userId);
    expect(rows?.[0]?.request_type).toBe("academy-waitlist");
    expect(rows?.[0]?.details).toMatchObject({ course_key: COURSE, course_registration: true, payment_status: "no_payment_taken" });
    expect(rows?.[0]?.is_test).toBe(true);

    const { data: profile, error: profileError } = await learner
      .from("profiles")
      .select("id,full_name,phone,account_type")
      .eq("id", userId)
      .single();
    expect(profileError).toBeNull();
    expect(profile).toMatchObject({
      id: userId,
      full_name: "QA Test Learner",
      phone: "+2348180000000",
      account_type: "individual",
    });
    const { error: updateError } = await learner.from("profiles").update({ phone: "+2348180000001" }).eq("id", userId);
    expect(updateError).toBeNull();
  });

  it("returns the existing reference for a duplicate and stores only one row", async () => {
    const { data, error } = await learner.rpc("register_academy_course", input);
    expect(error).toBeNull();
    const result = data as Registration;
    expect(result.status).toBe("duplicate");
    expect(result.reference).toBe(reference);
    const { count } = await service.from("service_requests").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("details->>course_key", COURSE);
    expect(count).toBe(1);
  });

  it("rejects a course outside the approved catalogue", async () => {
    const { error } = await learner.rpc("register_academy_course", { ...input, p_course_key: "invented-course" });
    expect(error).not.toBeNull();
    expect(error?.message).toContain("valid Academy programme");
  });

  it("rejects invalid contact details", async () => {
    const { error } = await learner.rpc("register_academy_course", { ...input, p_contact_phone: "123" });
    expect(error).not.toBeNull();
    expect(error?.message).toContain("valid phone");
  });

  it("rejects missing consent", async () => {
    const { error } = await learner.rpc("register_academy_course", { ...input, p_consent: false });
    expect(error).not.toBeNull();
    expect(error?.message).toContain("Consent");
  });

  it("rejects anonymous callers", async () => {
    const anonymous = client(PUB!);
    const { error } = await anonymous.rpc("register_academy_course", input);
    expect(error).not.toBeNull();
  });
});

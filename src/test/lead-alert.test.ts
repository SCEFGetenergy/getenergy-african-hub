import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/integrations/supabase/client.server", () => ({
  supabaseAdmin: {
    rpc: async (_: string, a: { p_token: string }) => ({ data: a.p_token === "good" }),
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: {
      reference: "GE-TEST-1", request_type: "contact", service_name: "Contact", contact_name: "Ada",
      contact_email: "ada@example.com", is_test: false, details: {} } }) }) }) }),
  },
}));

const call = async () => {
  const { Route } = await import("@/routes/api/public/lead-alert");
  const post = (Route.options as any).server.handlers.POST;
  return post({ request: new Request("http://x/api/public/lead-alert", {
    method: "POST", headers: { "x-alert-token": "good", "content-type": "application/json" },
    body: JSON.stringify({ table: "service_requests", id: "1" }) }) }) as Promise<Response>;
};

describe("lead alert email", () => {
  beforeEach(() => { delete process.env["RESEND_API_KEY"]; });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("reports email_not_configured without a key", async () => {
    const r = await call();
    expect(r.status).toBe(200);
    expect((await r.json()).status).toBe("email_not_configured");
  });

  it("sends to the staff inbox with reply_to", async () => {
    process.env["RESEND_API_KEY"] = "re_test";
    const f = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", f);
    const r = await call();
    expect(await r.json()).toEqual({ status: "sent" });
    const body = JSON.parse((f.mock.calls[0] as any)[1].body);
    expect(body.to).toEqual(["ccgetenergy@gmail.com"]);
    expect(body.reply_to).toBe("ada@example.com");
  });

  it("returns 502 failed when Resend rejects", async () => {
    process.env["RESEND_API_KEY"] = "re_test";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("bad from", { status: 422 })));
    const r = await call();
    expect(r.status).toBe(502);
    expect((await r.json()).status).toBe("failed");
  });
});

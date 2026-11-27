import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fixture = vi.hoisted(() => ({ email: "ada@example.com" }));

vi.mock("@/integrations/supabase/client.server", () => ({
  supabaseAdmin: {
    rpc: async (_: string, a: { p_token: string }) => ({ data: a.p_token === "good" }),
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: {
      reference: "GE-TEST-1", request_type: "contact", service_name: "Contact", contact_name: "Ada",
      contact_email: fixture.email, is_test: false, details: {} } }) }) }) }),
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
  beforeEach(() => { vi.stubEnv("RESEND_API_KEY", ""); vi.stubEnv("VISITOR_REPLY_FROM", ""); fixture.email = "ada@example.com"; });
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

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

  it("skips visitor delivery outside test-mode inbox while preserving the owner alert", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const f = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", f);
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    expect(await (await call()).json()).toEqual({ status: "sent" });
    expect(f).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith("visitor reply skipped: no verified sender");
    log.mockRestore();
  });

  it("sends a test reply with matching reference, plain text, HTML and owner reply-to", async () => {
    fixture.email = "ccgetenergy@gmail.com";
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const f = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", f);
    expect(await (await call()).json()).toEqual({ status: "sent" });
    expect(f).toHaveBeenCalledTimes(2);
    const request = (f.mock.calls[1] as any)[1];
    const reply = JSON.parse(request.body);
    expect(reply.from).toBe("GET Energy <onboarding@resend.dev>");
    expect(reply.to).toEqual(["ccgetenergy@gmail.com"]);
    expect(reply.reply_to).toBe("ccgetenergy@gmail.com");
    expect(reply.subject).toContain("GE-TEST-1");
    expect(reply.text).toContain("GE-TEST-1");
    expect(reply.html).toContain("GE-TEST-1");
    expect(request.headers["Idempotency-Key"]).toBe("visitor-reply-service_requests-1");
  });

  it("configured sender sends replies to visitors", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("VISITOR_REPLY_FROM", "GET Energy <hello@notify.getenergy.ng>");
    const f = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", f);
    await call();
    expect(f).toHaveBeenCalledTimes(2);
    expect(JSON.parse((f.mock.calls[1] as any)[1].body).to).toEqual(["ada@example.com"]);
  });

  it.each(["provider", "network"])("visitor %s failure never changes successful owner alert response", async (failure) => {
    fixture.email = "ccgetenergy@gmail.com";
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const f = vi.fn().mockResolvedValueOnce(new Response("{}", { status: 200 }));
    if (failure === "provider") f.mockResolvedValueOnce(new Response("sender rejected", { status: 403 }));
    else f.mockRejectedValueOnce(new Error("network failure"));
    vi.stubGlobal("fetch", f);
    expect(await (await call()).json()).toEqual({ status: "sent" });
  });

  it("visitor reply is attempted even when owner alert fails", async () => {
    fixture.email = "ccgetenergy@gmail.com";
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const f = vi.fn().mockResolvedValueOnce(new Response("rejected", { status: 422 })).mockResolvedValueOnce(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", f);
    expect((await call()).status).toBe(502);
    expect(f).toHaveBeenCalledTimes(2);
  });
});

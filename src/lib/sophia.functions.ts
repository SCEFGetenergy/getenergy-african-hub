import { createServerFn } from "@tanstack/react-start";
import type { UIMessage } from "ai";

// Anonymous visitors own their SOPHIA threads through a random browser token.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const GENERIC = "Something went wrong. Please try again.";
const tokenOk = (t: unknown): t is string => typeof t === "string" && t.length >= 20 && t.length <= 100;

export const listSophiaThreads = createServerFn({ method: "POST" })
  .inputValidator((i: { token: string }) => {
    if (!tokenOk(i?.token)) throw new Error("Invalid token");
    return i;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("sophia_threads")
      .select("id, title, updated_at")
      .eq("visitor_token", data.token)
      .order("updated_at", { ascending: false })
      .limit(50);
    if (error) { console.error("SOPHIA thread error", error); throw new Error(GENERIC); }
    return rows ?? [];
  });

export const createSophiaThread = createServerFn({ method: "POST" })
  .inputValidator((i: { token: string }) => {
    if (!tokenOk(i?.token)) throw new Error("Invalid token");
    return i;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const ip = (getRequestHeader("cf-connecting-ip") || getRequestHeader("x-forwarded-for")?.split(",")[0] || "").trim();
    if (ip) {
      const { data: ok } = await supabaseAdmin.rpc("electricity_hit_rate_limit", { p_bucket: `sophia-thread:ip:${ip.slice(0, 64)}`, p_limit: 10, p_window_seconds: 3600 });
      if (ok !== true) throw new Error("Too many new chats. Please try again later.");
    }
    const { data: row, error } = await supabaseAdmin
      .from("sophia_threads")
      .insert({ visitor_token: data.token })
      .select("id")
      .single();
    if (error) { console.error("SOPHIA thread error", error); throw new Error(GENERIC); }
    return row.id as string;
  });

export const getSophiaThread = createServerFn({ method: "POST" })
  .inputValidator((i: { token: string; threadId: string }) => {
    if (!tokenOk(i?.token) || !UUID.test(i?.threadId ?? "")) throw new Error("Invalid input");
    return i;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: thread } = await supabaseAdmin
      .from("sophia_threads")
      .select("id")
      .eq("id", data.threadId)
      .eq("visitor_token", data.token)
      .maybeSingle();
    if (!thread) return null;
    const { data: rows, error } = await supabaseAdmin
      .from("sophia_messages")
      .select("message")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true });
    if (error) { console.error("SOPHIA thread error", error); throw new Error(GENERIC); }
    return { id: thread.id as string, messagesJson: JSON.stringify((rows ?? []).map((r) => r.message as unknown as UIMessage)) };
  });

export const deleteSophiaThread = createServerFn({ method: "POST" })
  .inputValidator((i: { token: string; threadId: string }) => {
    if (!tokenOk(i?.token) || !UUID.test(i?.threadId ?? "")) throw new Error("Invalid input");
    return i;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("sophia_threads")
      .delete()
      .eq("id", data.threadId)
      .eq("visitor_token", data.token);
    if (error) { console.error("SOPHIA thread error", error); throw new Error(GENERIC); }
    return true;
  });

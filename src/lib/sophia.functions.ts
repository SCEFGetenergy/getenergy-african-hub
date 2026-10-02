import { createServerFn } from "@tanstack/react-start";
import type { UIMessage } from "ai";

// Anonymous visitors own their SOPHIA threads through a random browser token.
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
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const createSophiaThread = createServerFn({ method: "POST" })
  .inputValidator((i: { token: string }) => {
    if (!tokenOk(i?.token)) throw new Error("Invalid token");
    return i;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("sophia_threads")
      .insert({ visitor_token: data.token })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return row.id as string;
  });

export const getSophiaThread = createServerFn({ method: "POST" })
  .inputValidator((i: { token: string; threadId: string }) => {
    if (!tokenOk(i?.token) || !/^[0-9a-f-]{36}$/i.test(i?.threadId ?? "")) throw new Error("Invalid input");
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
    if (error) throw new Error(error.message);
    return { id: thread.id as string, messagesJson: JSON.stringify((rows ?? []).map((r) => r.message as unknown as UIMessage)) };
  });

export const deleteSophiaThread = createServerFn({ method: "POST" })
  .inputValidator((i: { token: string; threadId: string }) => {
    if (!tokenOk(i?.token)) throw new Error("Invalid input");
    return i;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("sophia_threads")
      .delete()
      .eq("id", data.threadId)
      .eq("visitor_token", data.token);
    if (error) throw new Error(error.message);
    return true;
  });

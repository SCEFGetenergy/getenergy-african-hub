import { createFileRoute } from "@tanstack/react-router";

// Called every 2 minutes by the database scheduler with a server-only token.
export const Route = createFileRoute("/api/public/cron/electricity-requery")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = /^Bearer (\S+)$/.exec(request.headers.get("authorization") ?? "")?.[1] ?? "";
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: ok } = await supabaseAdmin.rpc("electricity_check_cron_token", { p_token: token });
        if (!ok) return new Response("Unauthorized", { status: 401 });
        if ((process.env["ELECTRICITY_LIVE"] ?? "").toLowerCase() !== "true") return Response.json({ skipped: "flag off" });
        const { sweep } = await import("@/lib/electricity/engine.server");
        return Response.json(await sweep());
      },
    },
  },
});

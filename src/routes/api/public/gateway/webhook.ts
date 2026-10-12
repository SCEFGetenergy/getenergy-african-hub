import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/gateway/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        if (raw.length > 100000) return new Response("Too large", { status: 413 });
        try {
          const { handleGatewayWebhook } = await import("@/lib/electricity/webhooks.server");
          const r = await handleGatewayWebhook(raw, request.headers);
          return new Response(r.status === 200 ? "ok" : "invalid signature", { status: r.status });
        } catch (e) {
          console.error("[gateway webhook]", String(e));
          return new Response("error", { status: 500 });
        }
      },
    },
  },
});

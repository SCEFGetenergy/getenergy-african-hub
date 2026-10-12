import { createFileRoute } from "@tanstack/react-router";

// VTpass transaction-update webhook. Acknowledge first; process in the background.
export const Route = createFileRoute("/api/public/vtpass/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const text = await request.text().catch(() => "");
        const work = (async () => {
          try {
            const { processVtpassWebhook } = await import("@/lib/electricity/webhooks.server");
            await processVtpassWebhook(JSON.parse(text.slice(0, 100000)));
          } catch (e) {
            console.error("[vtpass webhook]", String(e));
          }
        })();
        try {
          const cf = (await import(/* @vite-ignore */ "cloudflare:workers" as string)) as { waitUntil?: (p: Promise<unknown>) => void };
          cf.waitUntil?.(work);
        } catch {
          /* dev server: the promise keeps running */
        }
        return Response.json({ response: "success" });
      },
    },
  },
});

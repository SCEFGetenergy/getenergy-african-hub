import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/power-as-a-service")({
  head: () => ({
    meta: [
      { title: "Power as a Service (PaaS) | GetEnergy" },
      { name: "description", content: "On-demand, on-site power on your terms. We design, finance, deploy, operate and maintain your power system. You pay as you use, with no heavy capital cost." },
      { property: "og:title", content: "Power as a Service (PaaS) | GetEnergy" },
      { property: "og:description", content: "On-demand, on-site power on your terms. We design, finance, deploy, operate and maintain your power system. You pay as you use, with no heavy capital cost." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

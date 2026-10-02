import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/energy-ecommerce")({
  head: () => ({
    meta: [
      { title: "Energy E-Commerce Africa (EEA54) | GetEnergy" },
      { name: "description", content: "Africa's energy marketplace across the 54 African countries. Buy, sell, connect, learn, finance and grow — products, services, professionals, projects and opportunities." },
      { property: "og:title", content: "Energy E-Commerce Africa (EEA54) | GetEnergy" },
      { property: "og:description", content: "Africa's energy marketplace across the 54 African countries. Buy, sell, connect, learn, finance and grow — products, services, professionals, projects and opportunities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy-african-hub.lovable.app/energy-ecommerce" }],
  }),
  component: () => null,
});

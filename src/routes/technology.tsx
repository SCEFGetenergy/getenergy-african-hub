import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: "Technology | GetEnergy" },
      { name: "description", content: "The systems connecting customers, energy assets, suppliers and payments across GetEnergy and Energy E-Commerce Africa (EEA54)." },
      { property: "og:title", content: "Technology | GetEnergy" },
      { property: "og:description", content: "The systems connecting customers, energy assets, suppliers and payments across GetEnergy and Energy E-Commerce Africa (EEA54)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy-african-hub.lovable.app/technology" }],
  }),
  component: () => null,
});

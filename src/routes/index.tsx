import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GetEnergy | Energy for Today. Building What Powers Tomorrow." },
      { name: "description", content: "Reliable energy supply, smarter utility services and cleaner-energy infrastructure for businesses and communities. Explore GetEnergy's four business areas." },
      { property: "og:title", content: "GetEnergy | Energy for Today. Building What Powers Tomorrow." },
      { property: "og:description", content: "Reliable energy supply, smarter utility services and cleaner-energy infrastructure for businesses and communities. Explore GetEnergy's four business areas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

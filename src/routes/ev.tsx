import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/ev")({
  head: () => ({
    meta: [
      { title: "EV Services & Mobility Solutions | GetEnergy" },
      { name: "description", content: "Electric vehicles, charging, battery solutions and after-sales support in one relationship, for businesses, institutions and fleets that cannot afford downtim" },
      { property: "og:title", content: "EV Services & Mobility Solutions | GetEnergy" },
      { property: "og:description", content: "Electric vehicles, charging, battery solutions and after-sales support in one relationship, for businesses, institutions and fleets that cannot afford downtim" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

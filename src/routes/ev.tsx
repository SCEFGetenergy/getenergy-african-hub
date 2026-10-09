import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/ev")({
  head: () => ({
    meta: [
      { title: "EV & Mobility | GetEnergy" },
      { name: "description", content: "GetEnergy is building EV mobility solutions spanning vehicles, charging, battery swap, solar charging and fleet support for Nigerian businesses and communities." },
      { property: "og:title", content: "EV & Mobility | GetEnergy" },
      { property: "og:url", content: "https://getenergy.ng/ev" },
      { property: "og:description", content: "Integrated EV mobility and charging solutions in development for businesses, institutions and fleets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/ev" }],
  }),
  component: () => null,
});

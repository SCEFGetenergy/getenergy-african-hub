import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/get-fuel")({
  head: () => ({
    meta: [
      { title: "Diesel Supply | GetEnergy" },
      { name: "description", content: "GetEnergy diesel supply and energy solutions: bulk and multi-location supply planning for construction, retail, healthcare and facilities in Nigeria." },
      { property: "og:title", content: "Diesel Supply | GetEnergy" },
      { property: "og:url", content: "https://getenergy.ng/get-fuel" },
      { property: "og:description", content: "Reliable diesel supply, coordinated delivery and business continuity for Nigerian organisations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/get-fuel" }],
  }),
  component: () => null,
});

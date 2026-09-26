import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/get-fuel")({
  head: () => ({
    meta: [
      { title: "Diesel Supply | GetEnergy" },
      { name: "description", content: "Structured supply, timely delivery and one point of contact for every site. We plan deliveries around your consumption so your generators, plant and fleet nev" },
      { property: "og:title", content: "Diesel Supply | GetEnergy" },
      { property: "og:description", content: "Structured supply, timely delivery and one point of contact for every site. We plan deliveries around your consumption so your generators, plant and fleet nev" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

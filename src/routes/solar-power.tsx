import { createFileRoute } from "@tanstack/react-router";

// The shared site shell renders this page; this route supplies its URL and metadata.
export const Route = createFileRoute("/solar-power")({
  head: () => ({
    meta: [
      { title: "Solar & Power Solutions | GetEnergy" },
      { name: "description", content: "Solar, battery storage, generators and hybrid power systems for businesses, estates and institutions — in development." },
      { property: "og:title", content: "Solar & Power Solutions | GetEnergy" },
      { property: "og:description", content: "Solar, battery storage, generators and hybrid power systems for businesses, estates and institutions — in development." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

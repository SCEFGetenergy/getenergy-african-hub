import { createFileRoute } from "@tanstack/react-router";

// The shared site shell renders this page; this route supplies its URL and metadata.
export const Route = createFileRoute("/smart-metering")({
  head: () => ({
    meta: [
      { title: "Smart Metering | GetEnergy" },
      { name: "description", content: "Digital metering, token vending and energy-use visibility for residential, commercial and industrial customers." },
      { property: "og:title", content: "Smart Metering | GetEnergy" },
      { property: "og:description", content: "Digital metering, token vending and energy-use visibility for residential, commercial and industrial customers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

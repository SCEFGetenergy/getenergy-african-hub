import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/cng")({
  head: () => ({
    meta: [
      { title: "CNG Services & Energy Solutions | GetEnergy" },
      { name: "description", content: "Explore GetEnergy's developing CNG conversion, refuelling, logistics and power services. Request an assessment; proposed conversion centres are not yet open." },
      { property: "og:title", content: "CNG Services & Energy Solutions | GetEnergy" },
      { property: "og:description", content: "Cleaner fuel opportunities for fleets and businesses. CNG services and conversion centres are in development." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

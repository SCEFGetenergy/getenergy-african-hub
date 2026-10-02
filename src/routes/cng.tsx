import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/cng")({
  head: () => ({
    meta: [
      { title: "CNG Services & Energy Solutions | GetEnergy" },
      { name: "description", content: "Explore GetEnergy's developing CNG refuelling, supply, logistics and fleet services. Vehicle conversion has its own page; proposed centres are not yet open." },
      { property: "og:title", content: "CNG Services & Energy Solutions | GetEnergy" },
      { property: "og:description", content: "Cleaner fuel opportunities for fleets and businesses. CNG services and refuelling infrastructure are in development." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy-african-hub.lovable.app/cng" }],
  }),
  component: () => null,
});

import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About GetEnergy | Energy for Today. Cleaner Opportunities for Tomorrow." },
      { name: "description", content: "Built on commercial fuel supply and electricity access since 2023, GetEnergy is engineering a practical transition toward cleaner mobility, smarter power and green energy." },
      { property: "og:title", content: "About GetEnergy | Energy for Today. Cleaner Opportunities for Tomorrow." },
      { property: "og:description", content: "Built on commercial fuel supply and electricity access since 2023, GetEnergy is engineering a practical transition toward cleaner mobility, smarter power and green energy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

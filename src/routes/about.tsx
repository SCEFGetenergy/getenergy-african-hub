import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About GetEnergy | Energy for Today. Cleaner Opportunities for Tomorrow." },
      { name: "description", content: "From 2023 through August 2026, diesel supply and community electricity vending built our practical experience with these sectors." },
      { property: "og:title", content: "About GetEnergy | Energy for Today. Cleaner Opportunities for Tomorrow." },
      { property: "og:description", content: "From 2023 through August 2026, diesel supply and community electricity vending built our practical experience with these sectors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

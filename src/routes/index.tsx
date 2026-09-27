import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GetEnergy | Integrated Energy Solutions for a Cleaner, Stronger Africa" },
      { name: "description", content: "Built on real experience in commercial fuel supply and electricity access, GetEnergy is engineering a practical transition toward cleaner mobility, smarter power and a stronger green-energy economy." },
      { property: "og:title", content: "GetEnergy | Integrated Energy Solutions for a Cleaner, Stronger Africa" },
      { property: "og:description", content: "Built on real experience in commercial fuel supply and electricity access, GetEnergy is engineering a practical transition toward cleaner mobility, smarter power and a stronger green-energy economy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

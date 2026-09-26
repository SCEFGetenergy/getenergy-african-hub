import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/pay-bills")({
  head: () => ({
    meta: [
      { title: "Pay Bills | GetEnergy" },
      { name: "description", content: "Airtime, data, cable TV, exam PINs, water bills, government payments and more, in one place." },
      { property: "og:title", content: "Pay Bills | GetEnergy" },
      { property: "og:description", content: "Airtime, data, cable TV, exam PINs, water bills, government payments and more, in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

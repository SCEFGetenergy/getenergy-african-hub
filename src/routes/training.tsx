import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/training")({
  head: () => ({
    meta: [
      { title: "Training & Certification | GetEnergy" },
      { name: "description", content: "Practical training, recognised certification and real opportunities for individuals, businesses and institutions building careers in the green economy." },
      { property: "og:title", content: "Training & Certification | GetEnergy" },
      { property: "og:description", content: "Practical training, recognised certification and real opportunities for individuals, businesses and institutions building careers in the green economy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

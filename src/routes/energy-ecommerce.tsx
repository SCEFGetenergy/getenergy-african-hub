import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/energy-ecommerce")({
  head: () => ({
    meta: [
      { title: "Energy E-Commerce Africa (EEA) | GetEnergy" },
      { name: "description", content: "Africa's energy marketplace, all in one place. Buy, sell, connect, learn, finance and grow. Products, services, professionals, projects and opportunities, bui" },
      { property: "og:title", content: "Energy E-Commerce Africa (EEA) | GetEnergy" },
      { property: "og:description", content: "Africa's energy marketplace, all in one place. Buy, sell, connect, learn, finance and grow. Products, services, professionals, projects and opportunities, bui" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

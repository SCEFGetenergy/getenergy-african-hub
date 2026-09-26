import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/get-electricity")({
  head: () => ({
    meta: [
      { title: "Get Electricity | Token Vending & Smart Electricity | GetEnergy" },
      { name: "description", content: "Token vending and smart electricity solutions. Buy tokens, pay bills and manage meters for homes, businesses and communities. Power access made simple." },
      { property: "og:title", content: "Get Electricity | Token Vending & Smart Electricity | GetEnergy" },
      { property: "og:description", content: "Token vending and smart electricity solutions. Buy tokens, pay bills and manage meters for homes, businesses and communities. Power access made simple." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

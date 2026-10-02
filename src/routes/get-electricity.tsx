import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/get-electricity")({
  head: () => ({
    meta: [
      { title: "Get Electricity | Token Vending & Smart Electricity | GetEnergy" },
      { name: "description", content: "Request an electricity token and receive a reference. Online payment is launching soon. Explore smart electricity solutions for homes, businesses and communities." },
      { property: "og:title", content: "Get Electricity | Token Vending & Smart Electricity | GetEnergy" },
      { property: "og:description", content: "Request an electricity token and receive a reference. Online payment is launching soon. Explore smart electricity solutions for homes, businesses and communities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy-african-hub.lovable.app/get-electricity" }],
  }),
  component: () => null,
});

import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/cng")({
  head: () => ({
    meta: [
      { title: "CNG Conversion & GetEnergy Conversion Centres | Lagos, Ibadan, Ilorin" },
      { name: "description", content: "Switch your car, tricycle, bus or truck to compressed natural gas at a GetEnergy Conversion Centre. CNG costs less than petrol or diesel, burns cleaner, and y" },
      { property: "og:title", content: "CNG Conversion & GetEnergy Conversion Centres | Lagos, Ibadan, Ilorin" },
      { property: "og:description", content: "Switch your car, tricycle, bus or truck to compressed natural gas at a GetEnergy Conversion Centre. CNG costs less than petrol or diesel, burns cleaner, and y" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

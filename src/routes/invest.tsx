import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/invest")({
  head: () => ({
    meta: [
      { title: "Invest in GET Energy Refuelling Stations | GetEnergy" },
      {
        name: "description",
        content:
          "Register interest in proposed GET Energy refuelling-station projects, including potential conventional fuel, CNG and EV charging infrastructure.",
      },
      { property: "og:title", content: "Invest in GET Energy Refuelling Stations | GetEnergy" },
      {
        property: "og:description",
        content:
          "Explore proposed refuelling-station projects and register interest as an investor, site, technical, supply or fleet partner.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
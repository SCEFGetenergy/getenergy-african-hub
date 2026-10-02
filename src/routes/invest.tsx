import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/invest")({
  head: () => ({
    meta: [
      { title: "Invest in GET Energy — CNG, EV, Solar & Skills | GetEnergy" },
      {
        name: "description",
        content:
          "Investment opportunities in CNG infrastructure, EV & hybrid mobility, solar, BESS, mini-grids, refuelling stations and green skills across Nigeria and Africa.",
      },
      { property: "og:title", content: "Invest in GET Energy — CNG, EV, Solar & Skills | GetEnergy" },
      {
        property: "og:description",
        content:
          "Explore GET Energy's investment portfolio — CNG, EV & hybrid mobility, distributed power and workforce development — subject to due diligence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
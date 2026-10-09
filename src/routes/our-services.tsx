import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/our-services")({
  head: () => ({
    meta: [
      { title: "Our Services | GetEnergy" },
      { name: "description", content: "All GetEnergy solutions in one place: electricity, diesel supply, CNG services and conversion, EV mobility, Power as a Service, mini-grids, training and EEA54 participation." },
      { property: "og:title", content: "Our Services | GetEnergy" },
      { property: "og:url", content: "https://getenergy.ng/our-services" },
      { property: "og:description", content: "All GetEnergy solutions in one place: electricity, diesel supply, CNG services and conversion, EV mobility, Power as a Service, mini-grids, training and EEA54 participation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/our-services" }],
  }),
  component: () => null,
});

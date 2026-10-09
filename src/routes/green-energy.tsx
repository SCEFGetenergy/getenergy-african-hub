import { createFileRoute } from "@tanstack/react-router";

// The shared site shell renders this page; this route supplies its URL and metadata.
export const Route = createFileRoute("/green-energy")({
  head: () => ({
    meta: [
      { title: "Energy Transition | Cleaner Energy Solutions | GetEnergy" },
      { name: "description", content: "Practical pathways to cleaner energy: a five-stage transition model from reliable supply to renewable and low-carbon energy." },
      { property: "og:title", content: "Energy Transition | Cleaner Energy Solutions | GetEnergy" },
      { property: "og:url", content: "https://getenergy.ng/green-energy" },
      { property: "og:description", content: "Practical pathways to cleaner energy: a five-stage transition model from reliable supply to renewable and low-carbon energy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/green-energy" }],
  }),
  component: () => null,
});

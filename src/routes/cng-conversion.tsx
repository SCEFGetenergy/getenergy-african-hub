import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/cng-conversion")({
  head: () => ({
    meta: [
      { title: "CNG Conversion | Vehicle Conversion & Assessments | GetEnergy" },
      { name: "description", content: "Convert cars, buses, trucks and tricycles to CNG with inspection, testing and aftercare. Proposed centres in Lagos, Ibadan and Ilorin are not yet open — register interest for an assessment." },
      { property: "og:title", content: "CNG Conversion | Vehicle Conversion & Assessments | GetEnergy" },
      { property: "og:description", content: "Bi-fuel CNG conversion for vehicles and fleets. Proposed conversion centres are not yet open; request an assessment and receive a reference." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy-african-hub.lovable.app/cng-conversion" }],
  }),
  component: () => null,
});

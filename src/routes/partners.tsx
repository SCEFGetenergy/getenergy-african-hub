import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Funders & Strategic Partners | GetEnergy" },
      { name: "description", content: "For DFIs, climate funds, development partners, manufacturers, OEMs, investors and technology companies exploring GetEnergy's project pipeline." },
      { property: "og:title", content: "Funders & Strategic Partners | GetEnergy" },
      { property: "og:url", content: "https://getenergy.ng/partners" },
      { property: "og:description", content: "For DFIs, climate funds, development partners, manufacturers, OEMs, investors and technology companies exploring GetEnergy's project pipeline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/partners" }],
  }),
  component: () => null,
});

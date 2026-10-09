import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers | GetEnergy" },
      { name: "description", content: "Current opportunities, internships and our talent network at GET Energy." },
      { property: "og:title", content: "Careers | GetEnergy" },
      { property: "og:url", content: "https://getenergy.ng/careers" },
      { property: "og:description", content: "Current opportunities, internships and our talent network at GET Energy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/careers" }],
  }),
  component: () => null,
});

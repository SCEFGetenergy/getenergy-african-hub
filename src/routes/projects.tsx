import { createFileRoute } from "@tanstack/react-router";

// The shared site shell renders this historical-engagement page.
export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Project Experience | GetEnergy" },
      { name: "description", content: "Selected past GetEnergy commercial and service engagements, with historical references clearly distinguished from current partnerships." },
      { property: "og:title", content: "Project Experience | GetEnergy" },
      { property: "og:url", content: "https://getenergy.ng/projects" },
      { property: "og:description", content: "Selected past GetEnergy commercial and service engagements, with historical references clearly distinguished from current partnerships." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/projects" }],
  }),
  component: () => null,
});
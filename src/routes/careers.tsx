import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers | GetEnergy" },
      { name: "description", content: "Join the team powering Nigeria's move to cleaner energy." },
      { property: "og:title", content: "Careers | GetEnergy" },
      { property: "og:description", content: "Join the team powering Nigeria's move to cleaner energy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy-african-hub.lovable.app/careers" }],
  }),
  component: () => null,
});

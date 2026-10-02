import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | GetEnergy" },
      { name: "description", content: "Join the team powering Nigeria's move to cleaner energy." },
      { property: "og:title", content: "FAQ | GetEnergy" },
      { property: "og:description", content: "Join the team powering Nigeria's move to cleaner energy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy-african-hub.lovable.app/faq" }],
  }),
  component: () => null,
});

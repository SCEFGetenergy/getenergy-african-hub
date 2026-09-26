import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in | GetEnergy" },
      { name: "description", content: "The link may be old or mistyped. Go to the homepage or choose a service." },
      { property: "og:title", content: "Log in | GetEnergy" },
      { property: "og:description", content: "The link may be old or mistyped. Go to the homepage or choose a service." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

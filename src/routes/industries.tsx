import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries We Serve | GetEnergy" },
      { name: "description", content: "Explore twelve sectors GetEnergy serves, from construction and healthcare to manufacturing, fleets and public services, with historical work clearly identified." },
      { property: "og:title", content: "Industries We Serve | GetEnergy" },
      { property: "og:description", content: "Explore twelve sectors GetEnergy serves, from construction and healthcare to manufacturing, fleets and public services, with historical work clearly identified." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

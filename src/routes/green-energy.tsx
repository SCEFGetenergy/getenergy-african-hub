import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/green-energy")({
  head: () => ({
    meta: [
      { title: "Green Energy | Practical Pathways to Cleaner Energy | GetEnergy" },
      { name: "description", content: "GetEnergy does not assume every customer can move immediately to one technology. Our model meets customers where they are and moves them forward." },
      { property: "og:title", content: "Green Energy | Practical Pathways to Cleaner Energy | GetEnergy" },
      { property: "og:description", content: "GetEnergy does not assume every customer can move immediately to one technology. Our model meets customers where they are and moves them forward." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

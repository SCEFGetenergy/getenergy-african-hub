import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GetEnergy | Energy for Today. Something Cleaner Is Coming." },
      { name: "description", content: "GetEnergy is engineering Africa's practical path from reliable power to clean energy. See what we're building." },
      { property: "og:title", content: "GetEnergy | Energy for Today. Something Cleaner Is Coming." },
      { property: "og:description", content: "GetEnergy is engineering Africa's practical path from reliable power to clean energy. See what we're building." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});

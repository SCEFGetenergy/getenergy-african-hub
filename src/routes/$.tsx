import { createFileRoute } from "@tanstack/react-router";

// Unknown URLs: the site shell shows its "page not found" block; this route keeps it out of search.
export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Page not found | GetEnergy" },
      { name: "description", content: "This page doesn't exist." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => null,
});

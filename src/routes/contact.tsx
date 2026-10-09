import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | GetEnergy" },
      { name: "description", content: "Questions, quotes or partnerships. Our team replies within one business day. For urgent diesel orders, call us directly." },
      { property: "og:title", content: "Contact Us | GetEnergy" },
      { property: "og:url", content: "https://getenergy.ng/contact" },
      { property: "og:description", content: "Questions, quotes or partnerships. Our team replies within one business day. For urgent diesel orders, call us directly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/contact" }],
  }),
  component: () => null,
});

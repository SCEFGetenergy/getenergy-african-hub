import { createFileRoute } from "@tanstack/react-router";

// Page content is rendered by the site shell in __root (src/legacy); this route supplies its URL and metadata.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GET Energy Trading Services | Integrated Energy & Green Energy Solutions" },
      { name: "description", content: "Integrated conventional and clean-energy solutions in Nigeria: diesel and AGO, CNG, EV charging, solar, storage, electricity services and energy advisory." },
      { property: "og:title", content: "GET Energy Trading Services | Integrated Energy & Green Energy Solutions" },
      { property: "og:url", content: "https://getenergy.ng/" },
      { property: "og:description", content: "Integrated conventional and clean-energy solutions in Nigeria: diesel and AGO, CNG, EV charging, solar, storage, electricity services and energy advisory." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/" }],
  }),
  component: () => null,
});

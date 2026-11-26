import { createFileRoute } from "@tanstack/react-router";
import { Ev24Deck } from "@/components/ev24/Ev24Deck";

const TITLE = "GET Energy × EV24.africa | Clean Mobility Lagos Pilot Proposal";
const DESCRIPTION =
  "Explore the non-binding Clean Mobility proposal for EV24.africa vehicle delivery with GET Energy charging, installation and after-sales support in Lagos.";

export const Route = createFileRoute("/solutions/clean-mobility")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://getenergy.ng/solutions/clean-mobility" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/solutions/clean-mobility" }],
  }),
  component: Ev24Deck,
});

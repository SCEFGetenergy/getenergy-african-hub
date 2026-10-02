import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/energy-saving-equipment")({
  head: () => ({
    meta: [
      { title: "Energy-Saving Equipment Enquiries | GetEnergy" },
      { name: "description", content: "Explore efficient appliances, LED lighting, solar and smart-home equipment with GET Energy. Request available options and receive a reference; pricing and delivery are confirmed by our team." },
      { property: "og:title", content: "Energy-Saving Equipment Enquiries | GetEnergy" },
      { property: "og:description", content: "Enquire about efficient appliances, lighting and smart-home equipment. Availability, pricing and delivery are confirmed by our team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy-african-hub.lovable.app/energy-saving-equipment" }],
  }),
  component: () => null,
});
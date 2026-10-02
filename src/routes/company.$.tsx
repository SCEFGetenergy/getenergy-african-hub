import { createFileRoute, redirect } from "@tanstack/react-router";

// Retired /company/* copies: one-hop permanent redirects straight to each canonical page.
const CANONICAL: Record<string, string> = {
  about: "/about",
  "green-energy": "/green-energy",
  industries: "/industries",
  technology: "/technology",
  partners: "/partners",
  faq: "/faq",
  careers: "/careers",
  contact: "/contact",
  solutions: "/our-services",
  "solutions/electricity": "/get-electricity",
  "solutions/diesel": "/get-fuel",
  "solutions/cng": "/cng",
  "solutions/cng-conversion": "/cng-conversion",
  "solutions/ev-mobility": "/ev",
  "solutions/ev-charging": "/ev#ev-charging",
  "solutions/power-as-a-service": "/power-as-a-service",
  "solutions/eea": "/energy-ecommerce",
  "solutions/training": "/training-certification",
  "solutions/smart-metering": "/get-electricity#smart-metering",
  "solutions/renewables": "/power-as-a-service#renewables-bess",
  "solutions/mini-grids": "/power-as-a-service#mini-grids",
};

export const Route = createFileRoute("/company/$")({
  beforeLoad: ({ params }) => {
    const key = (params._splat ?? "").replace(/^\/+|\/+$/g, "");
    throw redirect({ href: CANONICAL[key] ?? "/about", statusCode: 301 });
  },
});

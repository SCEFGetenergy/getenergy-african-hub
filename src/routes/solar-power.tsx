import { createFileRoute, redirect } from "@tanstack/react-router";

// Merged into /power-as-a-service#renewables-bess; kept as a one-hop permanent redirect for old links.
export const Route = createFileRoute("/solar-power")({
  beforeLoad: () => {
    throw redirect({ href: "/power-as-a-service#renewables-bess", statusCode: 301 });
  },
});

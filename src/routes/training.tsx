import { createFileRoute, redirect } from "@tanstack/react-router";

// Merged into /training-certification; kept as a one-hop permanent redirect for old links.
export const Route = createFileRoute("/training")({
  beforeLoad: () => {
    throw redirect({ href: "/training-certification", statusCode: 301 });
  },
});

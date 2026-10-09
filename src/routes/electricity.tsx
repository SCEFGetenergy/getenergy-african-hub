import { createFileRoute, redirect } from "@tanstack/react-router";

// Common shorthand for the electricity page; one-hop permanent redirect.
export const Route = createFileRoute("/electricity")({
  beforeLoad: () => {
    throw redirect({ href: "/get-electricity", statusCode: 301 });
  },
});

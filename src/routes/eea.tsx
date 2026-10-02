import { createFileRoute, redirect } from "@tanstack/react-router";

// Alias URL from the master brief; the page itself lives at /energy-ecommerce.
export const Route = createFileRoute("/eea")({
  beforeLoad: () => {
    throw redirect({ to: "/energy-ecommerce", statusCode: 301 });
  },
});

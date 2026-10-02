import { createFileRoute, redirect } from "@tanstack/react-router";

// Alias URL from the master brief; the page itself lives at /green-energy.
export const Route = createFileRoute("/energy-transition")({
  beforeLoad: () => {
    throw redirect({ to: "/green-energy", statusCode: 301 });
  },
});

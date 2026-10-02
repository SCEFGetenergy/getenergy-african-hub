import { createFileRoute, redirect } from "@tanstack/react-router";

// Merged into /get-electricity#smart-metering; kept as a one-hop permanent redirect for old links.
export const Route = createFileRoute("/smart-metering")({
  beforeLoad: () => {
    throw redirect({ href: "/get-electricity#smart-metering", statusCode: 301 });
  },
});

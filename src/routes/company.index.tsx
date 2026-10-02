import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/company/")({
  beforeLoad: () => {
    throw redirect({ href: "/about", statusCode: 301 });
  },
});

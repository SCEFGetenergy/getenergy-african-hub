import { Link, useRouterState } from "@tanstack/react-router";
import { SophiaAvatar } from "./SophiaAvatar";

/** Floating "Ask SOPHIA" button shown on every page except SOPHIA's own pages. */
export function SophiaLauncher() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/sophia")) return null;
  return (
    <Link
      to="/sophia"
      aria-label="Ask SOPHIA, GET Energy's energy assistant"
      className="fixed right-4 bottom-24 z-50 flex min-h-12 items-center gap-2 rounded-full bg-primary py-2 pr-4 pl-2 text-sm font-semibold text-primary-foreground shadow-lg hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <SophiaAvatar className="size-8" />
      Ask SOPHIA
    </Link>
  );
}

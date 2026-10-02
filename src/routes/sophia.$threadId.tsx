import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import type { UIMessage } from "ai";
import { getSophiaThread } from "@/lib/sophia.functions";
import { getVisitorToken } from "@/lib/sophia/visitor";
import { SophiaChat } from "@/components/sophia/SophiaChat";
import { SophiaAvatar } from "@/components/sophia/SophiaAvatar";

export const Route = createFileRoute("/sophia/$threadId")({
  head: () => ({
    meta: [
      { title: "Conversation with SOPHIA | GET Energy" },
      { name: "description", content: "Your conversation with SOPHIA, GET Energy's intelligent energy assistant." },
      { property: "og:title", content: "Conversation with SOPHIA | GET Energy" },
      { property: "og:description", content: "Energy solutions, training and customer support with SOPHIA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThreadPage,
});

function ThreadPage() {
  const { threadId } = Route.useParams();
  const get = useServerFn(getSophiaThread);
  const [state, setState] = useState<{ token: string; messages: UIMessage[] } | "missing" | null>(null);

  useEffect(() => {
    setState(null);
    const token = getVisitorToken();
    get({ data: { token, threadId } })
      .then((t) => setState(t ? { token, messages: t.messages } : "missing"))
      .catch(() => setState("missing"));
  }, [threadId, get]);

  if (state === null)
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-muted-foreground">
        <SophiaAvatar className="animate-pulse" /> Loading conversation…
      </div>
    );
  if (state === "missing")
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="mb-4">This conversation isn't available in this browser.</p>
        <a className="btn" href="/sophia">Start a conversation with SOPHIA</a>
      </div>
    );
  return <SophiaChat key={threadId} threadId={threadId} token={state.token} initialMessages={state.messages} />;
}

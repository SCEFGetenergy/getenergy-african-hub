import { useEffect, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { createSophiaThread, listSophiaThreads } from "@/lib/sophia.functions";
import { getVisitorToken } from "@/lib/sophia/visitor";
import { SophiaAvatar } from "@/components/sophia/SophiaAvatar";

export const Route = createFileRoute("/sophia/")({
  head: () => ({
    meta: [
      { title: "Ask SOPHIA | GET Energy Intelligent Energy Assistant" },
      { name: "description", content: "SOPHIA helps you find the right GET Energy solution, request a quotation, register for training or get customer support." },
      { property: "og:title", content: "Ask SOPHIA | GET Energy" },
      { property: "og:url", content: "https://getenergy.ng/sophia" },
      { property: "og:description", content: "GET Energy's intelligent energy assistant for solutions, training and customer support." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/sophia" }],
  }),
  component: SophiaIndex,
});

function SophiaIndex() {
  const navigate = useNavigate();
  const list = useServerFn(listSophiaThreads);
  const create = useServerFn(createSophiaThread);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const token = getVisitorToken();
    (async () => {
      const threads = await list({ data: { token } });
      const id = threads[0]?.id ?? (await create({ data: { token } }));
      navigate({ to: "/sophia/$threadId", params: { threadId: id }, replace: true });
    })().catch(() => {});
  }, [list, create, navigate]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <SophiaAvatar className="size-12 animate-pulse" />
      <p>Opening SOPHIA…</p>
    </div>
  );
}

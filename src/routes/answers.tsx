import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, MessageCircle } from "lucide-react";
import { PageHero, Section } from "@/components/site/ui-bits";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSuspenseQuery, queryOptions } from '@tanstack/react-query';
import { getPublishedKnowledge } from '@/lib/sophia/knowledge.functions';
import type { KnowledgeEntry, KnowledgeTopic } from '@/lib/sophia/types';
import { createIndex } from '@/lib/sophia/search';

const TITLE = "EV Charging, EV & Hybrid Cars and Academy Answers | GetEnergy";
const DESCRIPTION =
  "Search answers about EV charging stations, home chargers, electric and hybrid cars, and GET Energy Academy green-skills training in Nigeria.";
const knowledgeOptions = queryOptions({ queryKey: ['published-knowledge'], queryFn: () => getPublishedKnowledge(), staleTime: 0 });

export const Route = createFileRoute("/answers")({
  loader: ({ context }) => context.queryClient.ensureQueryData(knowledgeOptions),
  validateSearch: (s: Record<string, unknown>): { q?: string; topic?: KnowledgeTopic } => ({
    ...(typeof s["q"] === "string" && s["q"].length <= 200 ? { q: s["q"] } : {}),
    ...(typeof s["topic"] === "string" && /^[a-z0-9-]{1,80}$/.test(s["topic"]) ? { topic: s["topic"] } : {}),
  }),
  head: ({ loaderData }) => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://getenergy.ng/answers" },
      { property: "og:type", content: "website" },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/answers" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: (loaderData?.entries ?? []).map((k) => ({
            "@type": "Question",
            name: k.question,
            acceptedAnswer: { "@type": "Answer", text: k.answer },
          })),
        }),
      },
    ],
  }),
  component: AnswersPage,
});

function AnswerItem({ entry, open, topicLabel }: { entry: KnowledgeEntry; open?: boolean; topicLabel?: string }) {
  return (
    <details open={open} className="group rounded-xl border border-border bg-card p-4 card-elevated [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 font-semibold text-foreground">
        <span>{entry.question}</span>
        <span aria-hidden className="mt-0.5 text-brand-green transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{entry.answer}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-full bg-brand-green-soft px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-green">
          {topicLabel ?? entry.topic}
        </span>
        {entry.link ? (
          <a href={entry.link.href} className="font-medium text-primary underline-offset-2 hover:underline">
            {entry.link.label} →
          </a>
        ) : null}
      </div>
    </details>
  );
}

function AnswersPage() {
  const { data } = useSuspenseQuery(knowledgeOptions);
  const KNOWLEDGE = data.entries;
  const TOPICS = data.topics.map(topic => topic.id);
  const TOPIC_LABELS = Object.fromEntries(data.topics.map(topic => [topic.id, topic.name]));
  const searchKnowledge = useMemo(() => createIndex(KNOWLEDGE), [KNOWLEDGE]);
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState(search.q ?? "");
  const topic = search.topic;

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return null;
    return searchKnowledge(q, { ...(topic ? { topic } : {}), limit: 8 }).map((r) => r.entry);
  }, [query, topic, searchKnowledge]);

  const browse = useMemo(() => KNOWLEDGE.filter((k) => !topic || k.topic === topic), [topic, KNOWLEDGE]);

  const setTopic = (t: KnowledgeTopic | undefined) =>
    void navigate({ search: (prev) => ({ ...(prev.q ? { q: prev.q } : {}), ...(t ? { topic: t } : {}) }), replace: true });

  const commitQuery = (q: string) =>
    void navigate({ search: (prev) => ({ ...(q.trim() ? { q: q.trim() } : {}), ...(prev.topic ? { topic: prev.topic } : {}) }), replace: true });

  return (
    <>
      <PageHero
        eyebrow="Answers"
        title="Questions about EV charging, electric cars and training?"
        body="Search common questions about EV charging stations, home chargers, electric and hybrid cars, and GET Energy Academy. Can't find it? Ask SOPHIA."
      >
        <form
          role="search"
          className="mt-8 flex max-w-2xl gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            commitQuery(query);
          }}
        >
          <label htmlFor="answers-q" className="sr-only">Search answers</label>
          <div className="relative flex-1">
            <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="answers-q"
              type="search"
              value={query}
              maxLength={200}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => commitQuery(query)}
              placeholder="e.g. How long does it take to charge an EV?"
              className="h-12 bg-background pl-9 text-base"
              autoComplete="off"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">
            Search
          </Button>
        </form>
      </PageHero>

      <Section>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
          {[undefined, ...TOPICS].map((t) => (
            <Button
              key={t ?? "all"}
              type="button"
              aria-pressed={topic === t}
              onClick={() => setTopic(t)}
              className={cn(
                "min-h-10 rounded-full border px-4 text-sm font-medium",
                topic === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-secondary",
              )}
            >
              {t ? TOPIC_LABELS[t] : "All topics"}
            </Button>
          ))}
        </div>

        <div className="mt-8" aria-live="polite">
          {results === null ? (
            <div className="space-y-10">
              {TOPICS.filter((t) => (!topic || t === topic) && browse.some(entry => entry.topic === t)).map((t) => (
                <div key={t}>
                  <h2 className="text-xl font-bold">{TOPIC_LABELS[t]}</h2>
                  <div className="mt-4 grid gap-3">
                    {browse.filter((k) => k.topic === t).map((k) => (
                      <AnswerItem key={k.id} entry={k} topicLabel={TOPIC_LABELS[k.topic] ?? k.topic} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : results.length ? (
            <div className="grid gap-3">
              <p className="text-sm text-muted-foreground">
                {results.length} answer{results.length === 1 ? "" : "s"} for “{query.trim()}”
              </p>
              {results.map((k, i) => (
                <AnswerItem key={k.id} entry={k} open={i === 0} topicLabel={TOPIC_LABELS[k.topic] ?? k.topic} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-surface p-6">
              <p className="font-semibold">No answer found for “{query.trim()}”.</p>
              <p className="mt-1 text-sm text-muted-foreground">Try different words, or ask SOPHIA and she will help or pass you to our team.</p>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col items-start gap-3 rounded-xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Still have a question?</p>
            <p className="text-sm text-muted-foreground">SOPHIA can answer follow-ups and send your request to our team. Support: ccgetenergy@gmail.com</p>
          </div>
          <Button asChild className="min-h-11">
            <Link to="/sophia">
              <MessageCircle className="size-4" /> Ask SOPHIA
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
}

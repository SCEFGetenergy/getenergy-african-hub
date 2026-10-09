import { Link } from "@tanstack/react-router";
import { RequestForm } from "@/components/site/RequestForm";
import { Section, SectionHeading, StatusBadge } from "@/components/site/ui-bits";
import { PIPELINE, type CMPage, type PipelineProject } from "@/lib/clean-mobility";

export function cmHead(title: string, description: string, path: string) {
  const url = `https://getenergy.ng${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

function Hero({ eyebrow, title, body, status, children }: { eyebrow: string; title: string; body: string; status?: string; children?: React.ReactNode }) {
  return (
    <section className="hero-surface px-4 py-12 sm:px-6 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <Link to="/solutions/clean-mobility" className="text-sm text-primary-foreground/80 underline-offset-4 hover:underline">{eyebrow}</Link>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold text-primary-foreground sm:text-4xl md:text-5xl">{title}</h1>
        {status ? <span className="mt-4 inline-block rounded-full bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground">{status}</span> : null}
        <p className="mt-4 max-w-2xl leading-relaxed text-primary-foreground/85">{body}</p>
        {children}
      </div>
    </section>
  );
}

const btn = "inline-flex min-h-11 items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold";

export function CmButton({ href, children, ghost }: { href: string; children: React.ReactNode; ghost?: boolean }) {
  const cls = `${btn} ${ghost ? "border border-primary-foreground/40 text-primary-foreground" : "bg-brand-green text-primary-foreground"}`;
  return href.startsWith("#") ? <a href={href} className={cls}>{children}</a> : <a href={href} className={cls}>{children}</a>;
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
      {items.map((i) => <li key={i} className="rounded-md border border-border bg-background px-3 py-2 text-sm">{i}</li>)}
    </ul>
  );
}

export function PipelineCards({ projects = PIPELINE }: { projects?: PipelineProject[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {projects.map((p) => (
        <article key={p.project} className="rounded-xl border border-border bg-background p-5">
          <StatusBadge status={p.status} />
          <h3 className="mt-3 text-lg font-bold">{p.project}</h3>
          <dl className="mt-3 space-y-1.5 text-sm">
            {([["Location", p.location], ["Technology", p.technology], ["Capacity", p.capacity], ["Services", p.services], ["Partner status", p.partner], ["Expected impact", p.impact]] as const).map(([k, v]) => (
              <div key={k}><dt className="inline font-semibold">{k}: </dt><dd className="inline text-muted-foreground">{v}</dd></div>
            ))}
          </dl>
        </article>
      ))}
    </div>
  );
}

export function CleanMobilityServicePage({ page }: { page: CMPage }) {
  return (
    <>
      <Hero eyebrow="Clean Mobility & Transport Energy" title={page.h1} body={page.intro} status={page.status}>
        <div className="mt-6 flex flex-wrap gap-3"><CmButton href={page.cta.href}>{page.cta.label} →</CmButton><CmButton ghost href="/solutions/clean-mobility">All clean mobility services</CmButton></div>
      </Hero>
      {page.sections.length > 0 && (
        <Section>
          <div className="grid gap-6 md:grid-cols-2">
            {page.sections.map((s) => (
              <div key={s.title} className="rounded-xl border border-border bg-surface p-5">
                <h2 className="text-lg font-bold">{s.title}</h2>
                {s.body ? <p className="mt-2 text-sm text-muted-foreground">{s.body}</p> : null}
                {s.items ? <List items={s.items} /> : null}
              </div>
            ))}
          </div>
        </Section>
      )}
      {page.steps && (
        <Section tone="surface">
          <SectionHeading title={page.steps.heading} />
          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {page.steps.items.map((s, i) => (
              <li key={s} className="flex items-center gap-3 rounded-md border border-border bg-background p-3 text-sm"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-primary-foreground font-bold">{i + 1}</span>{s}</li>
            ))}
          </ol>
        </Section>
      )}
      {page.cards && (
        <Section tone="surface">
          <SectionHeading title={page.cards.heading} />
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
            {page.cards.items.map((c) => <div key={c} className="rounded-lg border border-border bg-background p-4 text-sm font-semibold">{c}</div>)}
          </div>
        </Section>
      )}
      {page.notice && (
        <Section><p className="rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground"><strong className="text-foreground">Status note: </strong>{page.notice}</p></Section>
      )}
      {page.form && (
        <Section tone="surface" id="enquire">
          <div className="mx-auto max-w-2xl">
            <RequestForm requestType={page.form.requestType} serviceName={page.form.serviceName} title={page.form.title} note={page.form.note} fields={page.form.fields} submitLabel={page.form.submitLabel} />
          </div>
        </Section>
      )}
    </>
  );
}

export { Hero as CmHero };

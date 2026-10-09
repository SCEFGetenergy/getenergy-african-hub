import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/ui-bits";
import { AcademyLockup } from "@/components/academy/AcademyParts";
import { CERT_DISCLAIMER, formatNaira, getProgramme, statusOf, whatsappFor } from "@/lib/academy";

export const Route = createFileRoute("/training-certification/programmes/$slug")({
  loader: ({ params }) => {
    const p = getProgramme(params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Programme not found | GET Energy Academy" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.title} — ${loaderData.duration}, proposed ${formatNaira(loaderData.fee)} | GET Energy Academy`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: title },
        { property: "og:url", content: `https://getenergy.ng/training-certification/programmes/${params.slug}` },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `https://getenergy.ng/training-certification/programmes/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: loaderData.title,
            description: loaderData.description,
            provider: { "@type": "Organization", name: "GET Energy Academy" },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <Section>
      <h1 className="text-2xl font-bold">Programme not found</h1>
      <Link to="/training-certification" className="mt-4 inline-block text-primary underline">Back to all programmes</Link>
    </Section>
  ),
  component: ProgrammePage,
});

const TBC = "To be confirmed when a cohort is announced";

function ProgrammePage() {
  const p = Route.useLoaderData();
  const rows: [string, string][] = [
    ["Category", p.category],
    ["Duration", p.duration],
    [p.kind === "pathway" ? "Proposed bundle fee" : "Proposed programme fee", `${formatNaira(p.fee)} (GET Energy training fee)`],
    ["Certification / examination fee", "Partner-confirmed separately, where applicable"],
    ["Who should attend", p.audience?.join(", ") ?? "Individuals, professionals and organisations relevant to this field"],
    ["Training mode", TBC],
    ["Entry requirements", TBC],
    ["Experience level", TBC],
    ["Training partner", p.partner ? `Potential: ${p.partner} (not yet confirmed)` : "Not yet confirmed"],
    ["Certification status", "Partner-dependent"],
    ["Awarding body", "Not yet confirmed"],
    ["Assessment requirements", TBC],
    ["Programme status", statusOf(p)],
    ["Next cohort", "Not yet scheduled — join the waiting list"],
    ["Venue / location", TBC],
  ];
  return (
    <>
      <section className="hero-surface px-4 py-14 sm:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-primary-foreground/70">
            <Link to="/" className="hover:underline">Home</Link> ›{" "}
            <Link to="/training-certification" className="hover:underline">GET Energy Academy</Link> ›{" "}
            <span className="text-brand-green-soft">{p.title}</span>
          </nav>
          <AcademyLockup invert />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-brand-green-soft">
            {p.kind === "pathway" ? "Career pathway" : `Programme ${String(p.n).padStart(2, "0")}`} · {p.category}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold text-primary-foreground sm:text-4xl">{p.title}</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">{p.description}</p>
          <p className="mt-4 text-sm text-primary-foreground">
            <strong>{p.duration}</strong> · Proposed fee <strong>{formatNaira(p.fee)}</strong> · {statusOf(p)}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="min-h-12 bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">
              <Link to="/training-certification/waitlist" search={{ programme: p.slug }}>Join waiting list</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="min-h-12"><Link to="/sophia">Ask SOPHIA</Link></Button>
            <Button asChild size="lg" variant="outline" className="min-h-12 border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <a href={whatsappFor(p.title)} target="_blank" rel="noreferrer">WhatsApp</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-12 border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/training-certification/corporate" search={{ programme: p.slug }}>Request corporate version</Link>
            </Button>
          </div>
        </div>
      </section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            {p.includes ? (
              <>
                <h2 className="text-xl font-bold">Learning sequence</h2>
                <ol className="mt-4 space-y-2">
                  {p.includes.map((m, i) => (
                    <li key={m} className="flex gap-3 rounded-lg border border-border bg-card p-3 text-sm">
                      <span className="font-bold text-brand-green">{i + 1}</span>{m}
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold">Learning outcomes & modules</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  The programme covers the topics described above. The detailed module list, learning outcomes and
                  assessment approach will be published with the first confirmed cohort.
                </p>
              </>
            )}
            {p.note ? <p className="mt-6 rounded-lg border border-brand-green/40 bg-brand-green-soft p-4 text-sm">{p.note}</p> : null}
            <h2 className="mt-8 text-xl font-bold">Career relevance</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Training and certification can strengthen skills, workplace competence and readiness for career
              opportunities. This programme does not guarantee employment, promotion or placement.
            </p>
            <p className="mt-6 rounded-lg border border-border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">{CERT_DISCLAIMER}</p>
          </div>
          <dl className="divide-y divide-border rounded-xl border border-border bg-card text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[9rem_1fr] gap-3 p-3">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>
    </>
  );
}

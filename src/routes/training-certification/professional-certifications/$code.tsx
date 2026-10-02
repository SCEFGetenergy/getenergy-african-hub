import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/ui-bits";
import { AcademyLockup } from "@/components/academy/AcademyParts";
import { RENEWAL_REQUIREMENTS, getCertification } from "@/lib/certifications";

export const Route = createFileRoute("/training-certification/professional-certifications/$code")({
  loader: ({ params }) => {
    const c = getCertification(params.code);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Certification not found | GET Energy Academy" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.name} (${loaderData.code}) | GET Energy Academy`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.purpose },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.purpose },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `https://getenergy-african-hub.lovable.app/training-certification/professional-certifications/${params.code}` }],
    };
  },
  notFoundComponent: () => (
    <Section>
      <h1 className="text-2xl font-bold">Certification not found</h1>
      <Link to="/training-certification/professional-certifications" className="mt-4 inline-block text-primary underline">All certifications</Link>
    </Section>
  ),
  component: CertPage,
});

const TBC = "To be confirmed with the first cohort";
const EMPLOYER = ["Demonstrated technical competence", "Practical assessment", "Workplace productivity skills", "Industry capstone", "Verified credential", "Renewable competency status", "CPD requirement"];

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
      {items.map((i) => (
        <li key={i} className="flex gap-2 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-brand-green" />{i}</li>
      ))}
    </ul>
  );
}

function CertPage() {
  const c = Route.useLoaderData();
  const rows: [string, string][] = [
    ["Code", c.code],
    ["Target audience", c.audience.length ? c.audience.join(", ") : "Experienced professionals in this field"],
    ["Entry requirements", TBC],
    ["Experience requirements", TBC],
    ["Assessment process", "Practical competency assessment, capstone and final assessment"],
    ["Duration", TBC],
    ["Certification validity", "24 months"],
    ["CPD requirement", "40 CPD hours within 24 months"],
    ["Credential verification", `Credential ID format GETS-${c.code}-YY-SERIAL`],
    ["Certification fee", "To be confirmed"],
    ["Status", "Waiting list open"],
  ];
  return (
    <>
      <section className="hero-surface px-4 py-14 sm:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-primary-foreground/70">
            <Link to="/training-certification" className="hover:underline">GET Energy Academy</Link> ›{" "}
            <Link to="/training-certification/professional-certifications" className="hover:underline">Professional certifications</Link> ›{" "}
            <span className="text-brand-green-soft">{c.code}</span>
          </nav>
          <AcademyLockup invert />
          <p className="mt-6 font-mono text-sm font-bold text-brand-green-soft">{c.code}</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold text-primary-foreground sm:text-4xl">{c.name}</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">{c.purpose}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="min-h-12 bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">
              <Link to="/training-certification/professional-certifications/waitlist" search={{ certification: c.code }}>Join waiting list</Link>
            </Button>
            <Button size="lg" variant="secondary" className="min-h-12" disabled title="Applications open when the first cohort is confirmed">
              Apply for certification — opens with first cohort
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-12 border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/sophia">Ask SOPHIA</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-12 border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/training-certification/corporate">Corporate cohort enquiry</Link>
            </Button>
          </div>
        </div>
      </section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold">Why this certification exists</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.purpose} It combines GET Energy's own curriculum and competency standards with practical assessment and a workplace capstone, so holders can show applied capability — not just attendance.</p>
            </div>
            <div><h2 className="text-xl font-bold">Competency framework</h2><List items={c.competencies} /></div>
            <div><h2 className="text-xl font-bold">Contributing GET Energy Academy modules</h2><List items={c.modules} />
              <p className="mt-3 text-xs text-muted-foreground">External modules may contribute where approved agreements permit; none are confirmed yet.</p></div>
            <div>
              <h2 className="text-xl font-bold">Capstone: {c.capstoneTitle}</h2>
              {c.capstone.map((t) => <p key={t} className="mt-2 text-sm text-muted-foreground">{t}</p>)}
              {c.outputs.length ? <List items={c.outputs} /> : null}
            </div>
            {c.notes.length ? <div className="rounded-lg border border-brand-green/40 bg-brand-green-soft p-4 text-sm">{c.notes.map((n) => <p key={n}>{n}</p>)}</div> : null}
            <div><h2 className="text-xl font-bold">Renewal requirements</h2><List items={RENEWAL_REQUIREMENTS} /></div>
            <div>
              <h2 className="text-xl font-bold">What employers can expect</h2><List items={EMPLOYER} />
              <p className="mt-3 text-xs text-muted-foreground">No specific employer has formally recognised this certification yet. Certification can strengthen career readiness but does not guarantee employment or promotion.</p>
            </div>
          </div>
          <dl className="h-fit divide-y divide-border rounded-xl border border-border bg-card text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[9rem_1fr] gap-3 p-3"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
            ))}
          </dl>
        </div>
      </Section>
    </>
  );
}

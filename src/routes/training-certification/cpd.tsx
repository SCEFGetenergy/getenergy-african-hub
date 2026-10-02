import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/ui-bits";
import { RENEWAL_REQUIREMENTS } from "@/lib/certifications";

const TITLE = "CPD & Certification Renewal | GET Energy Academy";
const DESC = "Keep your GETS certification current: 40 CPD hours in 24 months, practice evidence and a renewal assessment.";

export const Route = createFileRoute("/training-certification/cpd")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Cpd,
});

const TRACKED = ["CPD hours completed", "CPD hours required (40)", "Renewal date", "Credential status", "Approved activities"];

function Cpd() {
  return (
    <>
      <Section tone="surface">
        <SectionHeading eyebrow="Continuing professional development" title="Keep your certification current" body="Every GETS professional certification is valid for 24 months. Certified professionals will maintain their CPD record in their account, showing:" />
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {TRACKED.map((t) => <li key={t} className="rounded-xl border border-border bg-card p-4 text-sm font-medium">{t}</li>)}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">CPD records open to holders once the first certifications are awarded.</p>
      </Section>
      <Section>
        <SectionHeading eyebrow="Renewal" title="What renewal requires" body="Technical certifications may also require practical reassessment." />
        <ol className="mt-6 space-y-2 text-sm">
          {RENEWAL_REQUIREMENTS.map((r, i) => <li key={r}><span className="mr-2 font-bold text-brand-green">{i + 1}</span>{r}</li>)}
        </ol>
        <Button asChild className="mt-8 min-h-11"><Link to="/training-certification/professional-certifications">View the 10 certifications</Link></Button>
      </Section>
    </>
  );
}

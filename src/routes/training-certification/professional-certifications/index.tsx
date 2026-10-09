import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/ui-bits";
import { AcademyLockup } from "@/components/academy/AcademyParts";
import { CertificationCard } from "@/components/academy/CertificationCard";
import { CERTIFICATIONS, CERT_STRUCTURE, RENEWAL_REQUIREMENTS } from "@/lib/certifications";

const TITLE = "GETS Professional Certifications | GET Energy Academy";
const DESC =
  "10 competency-based GET Energy professional certifications with practical assessment, capstone projects, 24-month validity and CPD renewal.";

export const Route = createFileRoute("/training-certification/professional-certifications/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:url", content: "https://getenergy.ng/training-certification/professional-certifications" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/training-certification/professional-certifications" }],
  }),
  component: CertsPage,
});

const DEMONSTRATES = ["Technical capability", "Professional competence", "Workplace productivity", "Practical application", "Industry readiness", "Continuing professional development"];
const PROGRESSION = ["Short course", "Advanced course", "Career pathway", "GETS professional certification", "Skills Passport", "Professional practice", "CPD", "2-year renewal"];
const PASSPORT = ["GETS certifications", "External certifications", "Technical competencies", "Practical assessment", "Capstone", "HSE qualifications", "Workplace productivity skills", "Digital skills", "CPD", "Renewal status"];

function CertsPage() {
  return (
    <>
      <section className="hero-surface px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-primary-foreground/70">
            <Link to="/training-certification" className="hover:underline">GET Energy Academy</Link> ›{" "}
            <span className="text-brand-green-soft">Professional certifications</span>
          </nav>
          <AcademyLockup invert />
          <h1 className="mt-6 max-w-3xl text-3xl font-bold text-primary-foreground sm:text-4xl md:text-5xl">
            GET Energy Professional Certifications
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Advanced competency-based professional credentials that combine GET Energy's proprietary curriculum, selected
            technical and professional training modules, practical assessment, workplace productivity, capstone projects
            and continuing professional development. These are not ordinary attendance certificates.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {DEMONSTRATES.map((d) => (
              <li key={d} className="rounded-full border border-primary-foreground/25 px-3 py-1 text-xs text-primary-foreground">{d}</li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="min-h-12 bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">
              <Link to="/training-certification/professional-certifications/waitlist">Join certification waiting list</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="min-h-12">
              <Link to="/training-certification/verify">Verify a credential</Link>
            </Button>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading eyebrow="Certification structure" title="What every GETS certification includes" body="GET Energy owns the certification framework, competency standards, original curriculum, assessments, capstone methodology, case studies, question banks, productivity framework and credential requirements. External organisations may contribute approved learning modules where agreements permit." />
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CERT_STRUCTURE.map((s, i) => (
            <li key={s} className="rounded-xl border border-border bg-card p-4 text-sm font-medium">
              <span className="mr-2 font-bold text-brand-green">{i + 1}</span>{s}
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="10 certifications" title="Choose your professional certification" />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {CERTIFICATIONS.map((c) => <CertificationCard key={c.code} c={c} />)}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Compare"
          title="Compare all 10 certifications"
          body="Key competencies, contributing courses and capstone requirements side by side. Renewal rules are the same for every certification: 24-month validity, then 40 CPD hours, evidence of professional practice, ethics declaration, safety and technology refreshers, and a short renewal assessment."
        />
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-semibold">Certification</th>
                <th scope="col" className="px-4 py-3 font-semibold">Key competencies</th>
                <th scope="col" className="px-4 py-3 font-semibold">Contributing courses</th>
                <th scope="col" className="px-4 py-3 font-semibold">Capstone requirement</th>
                <th scope="col" className="px-4 py-3 font-semibold">Renewal</th>
              </tr>
            </thead>
            <tbody>
              {CERTIFICATIONS.map((c) => (
                <tr key={c.code} className="border-t border-border align-top">
                  <th scope="row" className="px-4 py-4">
                    <Link
                      to="/training-certification/professional-certifications/$code"
                      params={{ code: c.code.toLowerCase() }}
                      className="font-semibold text-primary hover:underline"
                    >
                      {c.code}
                    </Link>
                    <p className="mt-1 text-xs font-normal text-muted-foreground">{c.name}</p>
                  </th>
                  <td className="px-4 py-4">
                    <ul className="space-y-1 text-xs">
                      {c.competencies.slice(0, 5).map((k) => <li key={k}>• {k}</li>)}
                      {c.competencies.length > 5 ? (
                        <li className="text-muted-foreground">+ {c.competencies.length - 5} more</li>
                      ) : null}
                    </ul>
                  </td>
                  <td className="px-4 py-4">
                    <ul className="space-y-1 text-xs">
                      {c.modules.slice(0, 4).map((m) => <li key={m}>• {m}</li>)}
                      {c.modules.length > 4 ? (
                        <li className="text-muted-foreground">+ {c.modules.length - 4} more</li>
                      ) : null}
                    </ul>
                  </td>
                  <td className="px-4 py-4 text-xs">
                    <p className="font-medium">{c.capstoneTitle}</p>
                    {c.capstone[0] ? <p className="mt-1 text-muted-foreground">{c.capstone[0]}</p> : null}
                  </td>
                  <td className="px-4 py-4 text-xs">24 months, then CPD renewal</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Full competency lists, capstone outputs and target audiences are on each certification's page.
        </p>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Validity & renewal" title="Valid for 24 months" body="After 24 months certified professionals must renew. Technical certifications may also require practical reassessment. Credential statuses: Active, Renewal due, Expired, Suspended, Revoked." />
            <ul className="mt-5 space-y-2 text-sm">
              {RENEWAL_REQUIREMENTS.map((r) => <li key={r}>• {r}</li>)}
            </ul>
            <Link to="/training-certification/cpd" className="mt-4 inline-block text-sm font-medium text-primary underline">About CPD and renewal</Link>
          </div>
          <div>
            <SectionHeading eyebrow="For certificate holders" title="GETS Energy & Workforce Skills Passport" body="Certified professionals will receive a Skills Passport bringing together:" />
            <ul className="mt-5 flex flex-wrap gap-2">
              {PASSPORT.map((p) => <li key={p} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs">{p}</li>)}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">The Skills Passport will open when the first certifications are awarded.</p>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="Your progression" title="From first course to certified professional" />
        <ol className="mt-6 flex flex-wrap items-center gap-2 text-sm">
          {PROGRESSION.map((p, i) => (
            <li key={p} className="flex items-center gap-2">
              <span className="rounded-lg border border-border bg-card px-3 py-2 font-medium">{p}</span>
              {i < PROGRESSION.length - 1 ? <span aria-hidden className="text-brand-green">→</span> : null}
            </li>
          ))}
        </ol>
        <p className="mt-6 text-xs text-muted-foreground">
          Certification fees will be published once management approves them. No employer has formally endorsed these
          certifications yet; we will name employers only once they confirm.
        </p>
      </Section>
    </>
  );
}

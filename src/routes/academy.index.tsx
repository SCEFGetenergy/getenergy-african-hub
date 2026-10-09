import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/site/ui-bits";
import { PORTAL_TITLE } from "@/components/academy/portal";

export const Route = createFileRoute("/academy/")({
  head: () => ({
    meta: [
      { title: "Academy Student Portal | GET Energy Academy" },
      { name: "description", content: "Register, apply for GET Energy Academy programmes and certifications, upload your CV and track applications, payments and CPD." },
      { property: "og:title", content: "Academy Student Portal | GET Energy Academy" },
      { property: "og:url", content: "https://getenergy.ng/academy" },
      { property: "og:description", content: "One secure account for Academy applications, documents, payments, certifications and CPD." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/academy" }],
  }),
  component: PortalHome,
});

const STEPS = [
  ["Create your account", "Secure registration with email verification."],
  ["Complete your profile", "Education, experience and area of interest."],
  ["Upload your CV", "Private, secure document upload — no WhatsApp needed."],
  ["Apply", "Choose any of the 74 programmes, pathways or certifications and get a reference."],
  ["Pay when confirmed", "GFA Wzip Wallet payments are being configured; no money is taken until fees are confirmed."],
  ["Track progress", "Applications, certifications, Skills Passport and CPD in one dashboard."],
];

function PortalHome() {
  return (
    <>
      <PageHero eyebrow="Student portal" title={PORTAL_TITLE} body="Register once and manage everything about your training and certification online.">
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="secondary" className="min-h-11"><Link to="/academy/register">Create an account</Link></Button>
          <Button asChild size="lg" variant="outline" className="min-h-11"><Link to="/academy/login">Sign in</Link></Button>
          <Button asChild size="lg" variant="ghost" className="min-h-11 text-primary-foreground"><Link to="/training-certification">Browse the catalogue</Link></Button>
        </div>
      </PageHero>
      <Section>
        <h2 className="text-2xl font-bold">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map(([t, b], i) => (
            <li key={t} className="rounded-xl border border-border bg-card p-5"><span className="font-mono text-xs text-muted-foreground">Step {i + 1}</span><h3 className="mt-1 font-bold">{t}</h3><p className="mt-1 text-sm text-muted-foreground">{b}</p></li>
          ))}
        </ol>
        <p className="mt-6 text-xs text-muted-foreground">Cohort dates and final fees are confirmed per programme. Proposed fees remain proposed until approved by GET Energy management.</p>
      </Section>
    </>
  );
}

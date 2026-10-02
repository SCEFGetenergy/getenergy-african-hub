import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, BriefcaseBusiness, GraduationCap, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/ui-bits";
import { AcademyLockup, Catalogue, ProgrammeCard } from "@/components/academy/AcademyParts";
import { CERT_DISCLAIMER, FEATURED_SLUGS, PROGRAMMES, getProgramme, whatsappFor } from "@/lib/academy";

const TITLE = "GET Energy Academy — Training & Certification in Nigeria | GetEnergy";
const DESC =
  "64 energy training offerings: solar, BESS, mini-grid, HSE, EV charging, CNG, smart metering, green economy, project finance and career pathways. Join a waiting list.";

export const Route = createFileRoute("/training-certification/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "energy training Nigeria, solar training Nigeria, HSE training Nigeria, mini-grid training, BESS training, EV charging training, CNG training, smart metering training, GreenTech training Africa, corporate energy training Nigeria" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy-african-hub.lovable.app/training-certification" }],
  }),
  component: AcademyPage,
});

const PILLARS = [
  { icon: Wrench, t: "Industry-relevant skills" },
  { icon: GraduationCap, t: "Practical learning" },
  { icon: Award, t: "Certification pathways" },
  { icon: BriefcaseBusiness, t: "Career & workforce development" },
];

const PARTNER_TYPES = ["NAPTIN", "HSE training providers", "IOSH-approved providers", "NEBOSH learning partners", "NEMSA competency pathways", "OEM training partners", "Solar OEMs", "BESS manufacturers", "EV technology companies", "CNG technology companies", "Smart meter manufacturers", "Universities, polytechnics & technical colleges", "Professional bodies", "Green economy organisations", "International certification organisations"];

const FAQ = [
  ["Are the fees final?", "No. Fees shown are proposed GET Energy Academy training fees until a programme is marked price-approved. External certification or examination fees are confirmed separately by the partner."],
  ["When does the next cohort start?", "No cohort dates are confirmed yet. Join the waiting list and we will contact you when the start date, venue, trainer, partner and certification requirements are confirmed."],
  ["Will I get a certificate?", "Certification availability, awarding body and recognition depend on the specific programme and partner. Each programme page states its current certification status."],
  ["Does training guarantee a job?", "No. Training and certification can strengthen skills, workplace competence and readiness for career opportunities, but no programme guarantees employment, promotion, salary or placement."],
  ["Can you train our staff?", "Yes. Request corporate training and we will scope programmes, participant numbers, dates and a customised curriculum for your organisation."],
];

function AcademyPage() {
  const featured = FEATURED_SLUGS.map(getProgramme).filter((p) => !!p);
  const courses = PROGRAMMES.filter((p) => p.kind === "course").length;
  const pathways = PROGRAMMES.length - courses;
  return (
    <>
      <section className="hero-surface px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <AcademyLockup invert />
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-brand-green-soft">GET Energy Academy</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold text-primary-foreground sm:text-4xl md:text-5xl">
            Build practical skills. Earn relevant certification. Advance your career.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/80">
            Explore industry-focused technical, HSE, renewable-energy, GreenTech, project-development and professional
            programmes designed for today’s workplace and tomorrow’s energy economy.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="min-h-12 bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">
              <a href="#programmes">Explore all programmes</a>
            </Button>
            <Button asChild size="lg" variant="secondary" className="min-h-12">
              <Link to="/training-certification/waitlist">Join a waiting list</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-12 border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/training-certification/corporate">Request corporate training</Link>
            </Button>
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ icon: I, t }) => (
              <li key={t} className="flex items-center gap-3 rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 p-4 text-sm font-semibold uppercase tracking-wide text-primary-foreground">
                <I className="size-5 shrink-0 text-brand-green-soft" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="Why GET Energy Academy"
          title="Skills for work. Certification for growth. Training for the energy transition."
          body="GET Energy Academy is a commercial training and workforce-development business of GET Energy Trading Services, providing practical technical, HSE, green-economy, energy-business, workforce-productivity and career-development programmes for individuals, professionals, companies and institutions. Selected programmes may be delivered directly by GET Energy or in collaboration with recognized technical institutions, OEMs, professional bodies, HSE providers, certification bodies and other approved training partners."
        />
        <p className="mt-6 text-sm font-medium text-primary">
          {courses} standalone programmes + {pathways} career pathways = {PROGRAMMES.length} offerings. All currently open
          for waiting-list registration.
        </p>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="Featured programmes" title="Start with our most requested programmes" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProgrammeCard key={p.slug} p={p} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Find your programme" title={`Search all ${PROGRAMMES.length} offerings`} body="Filter by category or proposed fee. Career pathways bundle several programmes into one structured sequence." />
        <div className="mt-8">
          <Catalogue />
        </div>
        <p className="mt-8 rounded-lg border border-border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Certification: </strong>
          {CERT_DISCLAIMER} All fees shown are proposed programme fees until approved.
        </p>
      </Section>

      <Section tone="brand">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <SectionHeading invert eyebrow="Corporate training" title="Train your team" body="Customised programmes for companies, institutions, government agencies and project teams — technical, HSE, energy management, sales, operations and leadership." />
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button asChild size="lg" className="min-h-12 bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">
              <Link to="/training-certification/corporate">Request corporate training</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Training & certification partners" title="Who we intend to work with" body="These are partner categories we are pursuing. A named partner or logo will only appear here once the relationship is formally verified and approved for public use." />
        <ul className="mt-6 flex flex-wrap gap-2">
          {PARTNER_TYPES.map((p) => (
            <li key={p} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs">{p}</li>
          ))}
        </ul>
      </Section>

      <Section tone="surface">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Career development" title="Stronger skills, better readiness" body="Training and certification can strengthen skills, workplace competence and readiness for career opportunities. We do not promise employment, promotion, salary, visas or placement." />
          </div>
          <div>
            <SectionHeading eyebrow="Diversity & access" title="Inclusive participation" body="GET Energy supports inclusive participation in technical, professional and capacity-development opportunities and encourages women to participate in engineering, energy, technology and technical career pathways." />
          </div>
        </div>
      </Section>

      <Section>
        <div className="rounded-2xl border border-border bg-card p-6 card-elevated md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <h2 className="text-2xl font-bold">Not sure what to study?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tell SOPHIA your goal — a technical job, starting an energy business, entering the green economy or training
              your employees — and she will recommend programmes.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 md:mt-0">
            <Button asChild className="min-h-11"><Link to="/sophia">Ask SOPHIA</Link></Button>
            <Button asChild variant="outline" className="min-h-11"><a href={whatsappFor()} target="_blank" rel="noreferrer">WhatsApp us</a></Button>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="FAQ" title="Questions about the Academy" />
        <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group p-5">
              <summary className="cursor-pointer list-none font-semibold">{q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="min-h-12 bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">
            <Link to="/training-certification/waitlist">Join a waiting list</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}

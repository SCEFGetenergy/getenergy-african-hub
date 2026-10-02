import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, BatteryCharging, BriefcaseBusiness, Car, Check, Cpu, Flame, Gauge, HardHat, Lightbulb,
  Network, Rocket, ShieldCheck, Sun, TrendingUp, Wallet, Wrench, MessageCircle, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/ui-bits";
import { Catalogue } from "@/components/academy/AcademyParts";
import { CERTIFICATIONS } from "@/lib/certifications";
import { CERT_DISCLAIMER, PROGRAMMES, formatNaira, getProgramme, statusOf, whatsappFor } from "@/lib/academy";
import heroImg from "@/assets/academy/hero.jpg";
import solarImg from "@/assets/academy/solar.jpg";
import bessImg from "@/assets/academy/bess.jpg";
import minigridImg from "@/assets/academy/minigrid.jpg";
import evImg from "@/assets/academy/ev.jpg";
import cngImg from "@/assets/academy/cng.jpg";
import auditImg from "@/assets/academy/audit.jpg";
import hseImg from "@/assets/academy/hse.jpg";
import greentechImg from "@/assets/academy/greentech.jpg";
import teamImg from "@/assets/academy/team.jpg";

const LOGO = "/__l5e/assets-v1/b4ef2a93-b69e-4238-b069-3718af4c155e/ge-b6568e0e8cd0.svg";
const TITLE = "GET Energy Academy — Green Skills & Technical Certification | GetEnergy";
const DESC =
  "74 training, career-pathway and professional certification products: solar, BESS, mini-grid, EV, CNG, HSE, smart energy, green economy and project finance. Join a waiting list.";

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

const TRUST = [
  "Industry-focused training",
  "Practical hands-on learning",
  "Professional certification pathways",
  "Career and workplace development",
  "Corporate workforce training",
  "Technical and GreenTech programmes",
];

const ICONS = [
  { icon: Sun, t: "Solar & Renewable Energy" },
  { icon: BatteryCharging, t: "Battery Storage & BESS" },
  { icon: Network, t: "Mini-Grids & Power Systems" },
  { icon: Car, t: "EV & Clean Mobility" },
  { icon: Flame, t: "CNG & Alternative Fuels" },
  { icon: Cpu, t: "Smart Metering & Digital Energy" },
  { icon: HardHat, t: "HSE & Compliance" },
  { icon: TrendingUp, t: "Energy Finance & Project Development" },
  { icon: Rocket, t: "GreenTech Entrepreneurship" },
  { icon: Gauge, t: "Workplace Productivity" },
];

const FEATURED: [string, string][] = [
  ["solar-pv-installation-supervision", solarImg],
  ["battery-energy-storage-systems-bess", bessImg],
  ["mini-grid-design-development", minigridImg],
  ["ev-charging-infrastructure", evImg],
  ["cng-technical-fundamentals", cngImg],
  ["energy-audit-energy-management", auditImg],
  ["electrical-safety-statutory-regulations", hseImg],
  ["greentech-entrepreneurship", greentechImg],
];

const PATHWAYS = [
  "solar-technician-pathway",
  "ev-charging-technician-pathway",
  "cng-technician-pathway",
  "mini-grid-professional-pathway",
  "energy-manager-pathway",
  "greentech-founder-pathway",
];

const PILLARS = [
  { icon: Wrench, t: "Technical competence" },
  { icon: Gauge, t: "Workplace productivity" },
  { icon: ShieldCheck, t: "Safety & compliance" },
  { icon: BriefcaseBusiness, t: "Career development" },
];

const PARTNER_TYPES = ["NAPTIN", "HSE training providers", "IOSH-approved providers", "NEBOSH learning partners", "NEMSA competency pathways", "OEM training partners", "Solar OEMs", "BESS manufacturers", "EV technology companies", "CNG technology companies", "Smart meter manufacturers", "Universities, polytechnics & technical colleges", "Professional bodies", "Green economy organisations", "International certification organisations"];

const FAQ = [
  ["Are the fees final?", "No. Fees shown are proposed GET Energy Academy training fees until a programme is marked price-approved. External certification or examination fees are confirmed separately by the partner."],
  ["When does the next cohort start?", "No cohort dates are confirmed yet. Join the waiting list and we will contact you when the start date, venue, trainer, partner and certification requirements are confirmed."],
  ["Will I get a certificate?", "Certification availability, awarding body and recognition depend on the specific programme and partner. Each programme page states its current certification status."],
  ["Does training guarantee a job?", "No. Training and certification can strengthen skills, workplace competence and readiness for career opportunities, but no programme guarantees employment, promotion, salary or placement."],
  ["Can you train our staff?", "Yes. Request corporate training and we will scope programmes, participant numbers, dates and a customised curriculum for your organisation."],
];

const greenBtn = "min-h-12 bg-brand-green text-brand-green-foreground hover:bg-brand-green/90";

function AcademyPage() {
  const courses = PROGRAMMES.filter((p) => p.kind === "course").length;
  const pathways = PROGRAMMES.length - courses;
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-background">
        <div aria-hidden className="pointer-events-none absolute -bottom-24 left-0 right-0 h-48 rounded-[50%] bg-gradient-to-r from-brand-deep via-brand to-brand-green opacity-90" />
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 md:pb-28">
          <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <img src={LOGO} alt="GETENERGY.ng" className="h-9 w-auto shrink-0" width={140} height={36} />
              <span aria-hidden className="h-9 w-px bg-border" />
              <span className="min-w-0">
                <span className="block text-sm font-extrabold uppercase tracking-[0.16em] text-brand-deep">GET Energy Academy</span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Green Skills • Technical Certification • Career Development</span>
              </span>
            </div>
            <p className="border-l-4 border-brand-green pl-3 text-[11px] font-semibold uppercase leading-relaxed tracking-[0.2em] text-brand-deep">
              Skills for industry<br />Careers for the future<br />Energy for Africa
            </p>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div className="min-w-0">
              <h1 className="text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-brand-green">Green Skills.</span>
                <span className="block text-brand-deep">Technical Certification.</span>
                <span className="block text-brand-deep">Career Development.</span>
              </h1>
              <p className="mt-5 text-lg font-bold leading-snug text-brand-deep sm:text-xl">
                Build practical skills. Earn relevant certification. Advance your career.
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                GET Energy Academy provides practical, industry-relevant technical, professional and certification programmes designed to develop a skilled workforce for the energy transition, green economy and modern workplace.
              </p>
              <div aria-hidden className="mt-5 h-1 w-16 rounded-full bg-brand-green" />
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg" className={greenBtn}>
                  <a href="#programmes">Explore training programmes <ArrowRight className="size-4" /></a>
                </Button>
                <Button asChild size="lg" variant="outline" className="min-h-12 border-brand-deep text-brand-deep">
                  <Link to="/training-certification/waitlist">Join waiting list</Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="min-h-12 text-brand-deep">
                  <Link to="/training-certification/corporate">Train your team</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <img src={heroImg} alt="GET Energy-style African energy technicians in hard hats at a solar and wind site" width={1280} height={1024} className="aspect-[5/4] w-full rounded-3xl object-cover shadow-xl" />
              <div className="relative -mt-16 mx-3 rounded-2xl border border-brand-green/40 bg-brand-deep/95 p-5 text-brand-foreground shadow-xl sm:absolute sm:-bottom-10 sm:-left-8 sm:mx-0 sm:mt-0 sm:max-w-xs">
                <h2 className="text-lg font-bold leading-snug">Skills for a Cleaner, Smarter and More Productive Africa</h2>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {TRUST.map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 rounded-full bg-brand-green p-0.5 text-brand-green-foreground" />{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ICON STRIP */}
      <section aria-label="Training categories" className="border-b border-border bg-background">
        <ul className="mx-auto flex max-w-6xl snap-x gap-2 overflow-x-auto px-4 py-6 sm:px-6 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible">
          {ICONS.map(({ icon: I, t }) => (
            <li key={t} className="flex w-32 shrink-0 snap-start flex-col items-center gap-2 text-center lg:w-auto">
              <span className="grid size-14 place-items-center rounded-full bg-brand-green-soft text-brand-green"><I className="size-6" /></span>
              <span className="text-xs font-semibold uppercase leading-tight tracking-wide text-brand-deep">{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* FEATURED */}
      <Section tone="surface">
        <SectionHeading eyebrow="Featured programmes" title="Start with our most requested programmes" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map(([slug, img]) => {
            const p = getProgramme(slug);
            if (!p) return null;
            return (
              <article key={slug} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card card-elevated">
                <img src={img} alt="" loading="lazy" width={992} height={672} className="aspect-[3/2] w-full object-cover" />
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-green">{p.category}</span>
                  <h3 className="mt-1 text-base font-bold leading-snug text-brand-deep">{p.title}</h3>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div><dt className="text-muted-foreground">Duration</dt><dd className="font-medium">{p.duration}</dd></div>
                    <div><dt className="text-muted-foreground">Proposed fee</dt><dd className="font-semibold text-primary">{formatNaira(p.fee)}</dd></div>
                    <div><dt className="text-muted-foreground">Certification</dt><dd className="font-medium">Partner-dependent</dd></div>
                    <div><dt className="text-muted-foreground">Status</dt><dd className="font-medium text-brand-green">{statusOf(p)}</dd></div>
                  </dl>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <Button asChild size="sm" className="min-h-11 flex-1"><Link to="/training-certification/programmes/$slug" params={{ slug }}>View programme</Link></Button>
                    <Button asChild size="sm" variant="outline" className="min-h-11 flex-1 border-brand-green text-brand-green"><Link to="/training-certification/waitlist" search={{ programme: slug }}>Join waiting list</Link></Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* CATALOGUE */}
      <Section>
        <SectionHeading eyebrow={`${PROGRAMMES.length + CERTIFICATIONS.length} products`} title="Explore Our Training Programmes" body="Choose from technical, professional, GreenTech, management and certification pathways designed for individuals, professionals, entrepreneurs and organisations." />
        <p className="mt-4 text-sm font-medium text-primary">
          {courses} standalone programmes + {pathways} career pathways + {CERTIFICATIONS.length} GETS professional certifications — all open for waiting-list registration.
        </p>
        <div className="mt-8"><Catalogue /></div>
        <p className="mt-8 rounded-lg border border-border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Certification: </strong>{CERT_DISCLAIMER} All fees shown are proposed programme fees until approved.
        </p>
      </Section>

      {/* CERTIFICATIONS */}
      <Section tone="brand">
        <SectionHeading invert eyebrow="Premium certification layer" title="GET Energy Professional Certifications" body="Advanced competency-based certifications combining technical skills, workplace productivity, practical assessment and real-world industry projects." />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {CERTIFICATIONS.map((c) => (
            <li key={c.code}>
              <Link to="/training-certification/professional-certifications/$code" params={{ code: c.code.toLowerCase() }} className="flex h-full min-h-28 flex-col rounded-xl border border-brand-green/40 bg-primary-foreground/5 p-4 text-primary-foreground transition-colors hover:bg-primary-foreground/10">
                <span className="font-mono text-sm font-bold text-brand-green-soft">{c.code}</span>
                <span className="mt-1 text-xs leading-snug text-primary-foreground/85">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Button asChild size="lg" className={`mt-8 ${greenBtn}`}>
          <Link to="/training-certification/professional-certifications">Explore professional certifications</Link>
        </Button>
      </Section>

      {/* PATHWAYS */}
      <Section>
        <SectionHeading eyebrow="Career pathways" title="Choose a Career Pathway" body="Structured sequences of programmes that build from foundation skills to job-ready competence." />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PATHWAYS.map((slug) => {
            const p = getProgramme(slug);
            if (!p) return null;
            return (
              <article key={slug} className="flex flex-col rounded-2xl border border-border border-t-4 border-t-brand-green bg-card p-5 card-elevated">
                <h3 className="text-lg font-bold text-brand-deep">{p.title.replace(" Pathway", "")}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.duration} · proposed bundle {formatNaira(p.fee)}</p>
                {p.includes ? (
                  <ol className="mt-4 space-y-2">
                    {p.includes.map((s, i) => (
                      <li key={s} className="flex items-start gap-2 text-sm">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-green-soft text-[11px] font-bold text-brand-green">{i + 1}</span>{s}
                      </li>
                    ))}
                  </ol>
                ) : null}
                <Button asChild className={`mt-auto w-full ${greenBtn}`} style={{ marginTop: "1.25rem" }}>
                  <Link to="/training-certification/waitlist" search={{ programme: slug }}>Start this pathway</Link>
                </Button>
              </article>
            );
          })}
        </div>
      </Section>

      {/* CORPORATE */}
      <Section tone="surface">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <img src={teamImg} alt="Trainer briefing a team of African industrial technicians" loading="lazy" width={1024} height={768} className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lg" />
          <div>
            <SectionHeading eyebrow="Corporate training" title="Train Your Team" body="Build technical, operational, leadership and GreenTech capability across your workforce with customised GET Energy Academy training." />
            <p className="mt-6 font-semibold text-brand-deep">Training that connects practical skills to workplace performance.</p>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {PILLARS.map(({ icon: I, t }) => (
                <li key={t} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-xs font-bold uppercase tracking-wide text-brand-deep">
                  <I className="size-5 shrink-0 text-brand-green" />{t}
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className={`mt-6 w-full sm:w-auto ${greenBtn}`}>
              <Link to="/training-certification/corporate">Request corporate training</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* PORTAL + WALLET + SOPHIA */}
      <Section>
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl bg-brand-deep p-6 text-brand-foreground lg:col-span-2">
            <Users className="size-7 text-brand-green-soft" />
            <h2 className="mt-3 text-2xl font-bold">Your Training. One Dashboard.</h2>
            <p className="mt-2 text-sm text-brand-foreground/80">Apply for programmes, upload your CV, manage payments, track your training, access certificates, monitor CPD and maintain your Skills Passport.</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className={greenBtn}><Link to="/academy/login">Student login</Link></Button>
              <Button asChild size="lg" variant="secondary" className="min-h-12"><Link to="/academy/register">Create account</Link></Button>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <Wallet className="size-7 text-primary" />
            <h2 className="mt-3 text-lg font-bold text-brand-deep">Secure Academy Payments with GFA Wzip Wallet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Training, certification, assessment, renewal and other Academy payments will be managed through the GFA Wzip Wallet payment system. Wallet payments are pending configuration — no money is taken on this site yet. We never ask for wallet PINs or OTPs here.</p>
            <Button asChild variant="outline" className="mt-4 min-h-11"><Link to="/academy/payments">View my payments</Link></Button>
          </div>
        </div>
        <div className="mt-5 rounded-2xl border border-border bg-surface p-6 md:flex md:items-center md:justify-between md:gap-8">
          <div className="flex gap-4">
            <Lightbulb className="size-8 shrink-0 text-brand-green" />
            <div>
              <h2 className="text-xl font-bold text-brand-deep">Not Sure Which Programme Is Right for You?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Ask SOPHIA to recommend a training programme, career pathway or professional certification based on your goals and experience.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
            <Button asChild className="min-h-11"><Link to="/sophia">Ask SOPHIA</Link></Button>
            <Button asChild variant="outline" className="min-h-11"><a href={whatsappFor()} target="_blank" rel="noreferrer"><MessageCircle className="size-4" /> WhatsApp</a></Button>
          </div>
        </div>
      </Section>

      {/* PARTNERS */}
      <Section tone="surface">
        <SectionHeading eyebrow="Training & certification partners" title="Who we intend to work with" body="These are partner categories we are pursuing. A named partner or logo will only appear here once the relationship is formally verified and approved for public use." />
        <ul className="mt-6 flex flex-wrap gap-2">
          {PARTNER_TYPES.map((p) => <li key={p} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs">{p}</li>)}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">Training can strengthen skills and readiness for career opportunities; we do not promise employment, promotion, salary, visas or placement. We encourage women to participate in engineering, energy and technical pathways.</p>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeading eyebrow="FAQ" title="Questions about the Academy" />
        <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group p-5">
              <summary className="cursor-pointer list-none font-semibold">{q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* WAITLIST BAND */}
      <section className="bg-gradient-to-r from-brand-green to-brand px-4 py-14 text-brand-foreground sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Be First to Know When the Next Cohort Opens</h2>
            <p className="mt-2 max-w-2xl text-sm text-brand-foreground/90">Join the waiting list for your preferred programme and receive updates about cohort dates, final fees, certification details and enrolment.</p>
            <p className="mt-3 text-xs text-brand-foreground/85">Academy enquiries: ccgetenergy@gmail.com · WhatsApp +234 818 074 2835</p>
          </div>
          <Button asChild size="lg" variant="secondary" className="min-h-12 w-full md:w-auto"><Link to="/training-certification/waitlist">Join waiting list</Link></Button>
        </div>
      </section>
    </>
  );
}

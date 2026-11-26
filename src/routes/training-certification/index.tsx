import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, BatteryCharging, BriefcaseBusiness, Car, Check, Cpu, Flame, Gauge, Lightbulb,
  Network, ShieldCheck, Sun, Wallet, Wrench, MessageCircle, Users, Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/ui-bits";
import { Catalogue } from "@/components/academy/AcademyParts";
import { CertificationCard } from "@/components/academy/CertificationCard";
import { CERTIFICATIONS } from "@/lib/certifications";
import { ACADEMY_AREAS, ACADEMY_CENTRE, CERT_DISCLAIMER, PROGRAMMES, formatNaira, getProgramme, statusOf, whatsappFor } from "@/lib/academy";
import { AcademyIntro, AcademyCentre } from "@/components/academy/AcademyIntro";
import solarImg from "@/assets/academy/solar.jpg";
import bessImg from "@/assets/academy/bess.jpg";
import minigridImg from "@/assets/academy/minigrid.jpg";
import evImg from "@/assets/academy/ev.jpg";
import cngImg from "@/assets/academy/cng.jpg";
import auditImg from "@/assets/academy/audit.jpg";
import hseImg from "@/assets/academy/hse.jpg";
import greentechImg from "@/assets/academy/greentech.jpg";
import teamImg from "@/assets/academy/team.jpg";
import technicalCertificationImg from "@/assets/academy/technical-certification.png.asset.json";
import greenSkillsImg from "@/assets/academy/green-skills.png.asset.json";
import areaSolar from "@/assets/academy/areas/area-solar.jpg";
import areaPower from "@/assets/academy/areas/area-power.jpg";
import areaEfficiency from "@/assets/academy/areas/area-efficiency.jpg";
import areaCng from "@/assets/academy/areas/area-cng.jpg";
import areaEv from "@/assets/academy/areas/area-ev.jpg";
import areaAdvanced from "@/assets/academy/areas/area-advanced.jpg";

const AREA_IMAGES = [
  { src: areaSolar, alt: "Generated training illustration: African instructor and women and men trainees mounting solar panels on a low rig with an inverter and battery cabinet behind" },
  { src: areaPower, alt: "Generated training illustration: African electrical trainees in safety glasses and insulated gloves watching an instructor test a distribution board with a smart meter and lock-out tags" },
  { src: areaEfficiency, alt: "Generated training illustration: African women and men learning an office energy audit using a thermal camera, clamp meter and tablet beside air-conditioning and LED lights" },
  { src: areaCng, alt: "Generated training illustration: African instructor and trainees in protective coveralls and hard hats inspecting a CNG cylinder, pressure lines and leak detector beside a fire extinguisher" },
  { src: areaEv, alt: "Generated training illustration: African trainees connecting a white electric car to a charger and inspecting a battery module with a laptop under a solar canopy" },
  { src: areaAdvanced, alt: "Generated training illustration: African instructor and trainees studying a community biogas digester and micro-hydro turbine beside a rural Nigerian stream" },
];

const TITLE = "GET Academy — B16 Training Centre & Green Skills | GetEnergy";
const DESC =
  "74 training, career-pathway and professional certification products: solar, BESS, mini-grid, EV, CNG, HSE, smart energy, green economy and project finance. Join a waiting list.";

export const Route = createFileRoute("/training-certification/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "energy training Nigeria, solar training Nigeria, HSE training Nigeria, mini-grid training, BESS training, EV charging training, CNG training, smart metering training, GreenTech training Africa, corporate energy training Nigeria" },
      { property: "og:title", content: TITLE },
      { property: "og:url", content: "https://getenergy.ng/training-certification" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/training-certification" }],
  }),
  component: AcademyPage,
});

const ICONS = [Sun, BatteryCharging, Car, Flame, Cpu, Wrench, Laptop, BriefcaseBusiness];

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

const ACADEMY_PROMISE = [
  {
    icon: Sun,
    title: "Green Skills",
    image: greenSkillsImg.url,
    imageAlt: "Green Skills concept showing solar, storage, EV charging and energy technicians",
    body: "Practical capabilities for renewable energy, storage, efficiency, clean mobility and the wider green economy.",
  },
  {
    icon: ShieldCheck,
    title: "Technical Certification",
    image: technicalCertificationImg.url,
    imageAlt: "Technical Certification concept showing supervised electrical practical assessment",
    body: "Competency-based instruction, supervised practical assessments and pathways to recognised qualifications, subject to programme-specific accreditation.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Career Development",
    image: teamImg,
    imageAlt: "Trainer briefing a team of African industrial technicians",
    body: "Workplace, leadership and commercial skills that help learners apply technical knowledge responsibly in real organisations.",
  },
];

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
      <AcademyIntro />

      {/* ACADEMY PROMISE */}
      <Section>
        <SectionHeading eyebrow="One academy, three outcomes" title="Skills for Work. Certification for Growth. Training for the Energy Transition." body="Every learning route connects technical understanding with practical application, workplace productivity and responsible career development." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {ACADEMY_PROMISE.map(({ icon: Icon, title, body, image, imageAlt }) => (
            <article key={title} className="overflow-hidden border-l-4 border-brand-green bg-surface">
              <figure>
                <img src={image} alt={imageAlt} loading="lazy" width={1365} height={768} className="aspect-video w-full object-cover" />
                {title !== "Career Development" && <figcaption className="px-5 pt-3 text-xs text-muted-foreground">Concept illustration</figcaption>}
              </figure>
              <div className="p-5">
              <Icon className="size-7 text-brand-green" />
              <h2 className="mt-4 text-xl font-bold text-brand-deep">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <AcademyCentre />

      {/* DELIVERY AREAS */}
      <Section tone="surface">
        <SectionHeading eyebrow="Academy structure" title="Six Energy Learning Areas" body="GET Energy organises its catalogue around the technical systems, commercial capabilities and specialist knowledge needed across the energy value chain." />
        <div className="mt-8 grid auto-rows-fr gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ACADEMY_AREAS.map((area, index) => {
            const AreaIcon = [Sun, Network, Gauge, Flame, Car, Lightbulb][index] ?? Lightbulb;
            const image = AREA_IMAGES[index];
            return (
              <article key={area.title} className="flex h-full min-w-0 flex-col overflow-hidden rounded-t-lg border-t-4 border-brand-green bg-card shadow-sm">
                {image && <img src={image.src} alt={image.alt} loading="lazy" width={1280} height={864} className="aspect-[3/2] w-full shrink-0 rounded-t-md object-cover" />}
                <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-green-soft text-brand-green"><AreaIcon className="size-5" /></span>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Area {index + 1}</span>
                    <h2 className="text-lg font-bold text-brand-deep">{area.title}</h2>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{area.summary}</p>
                <ul className="mt-4 grid gap-2 text-sm">
                  {area.focus.map((item) => <li key={item} className="flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0 text-brand-green" />{item}</li>)}
                </ul>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* ICON STRIP */}
      <section aria-label="Training focus areas" className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6"><h2 className="text-xl font-bold text-brand-deep">Training focus areas</h2></div>
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-3 gap-y-5 px-4 py-6 sm:grid-cols-4 sm:px-6 lg:gap-4">
          {ACADEMY_CENTRE.focus.map((t, index) => {
            const I = ICONS[index] ?? Sun;
            return (
            <li key={t} className="flex min-w-0 flex-col items-center gap-2 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-brand-green-soft text-brand-green"><I className="size-6" /></span>
              <span className="text-xs font-semibold uppercase leading-tight tracking-wide text-brand-deep">{t}</span>
            </li>
          ); })}
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
                <img src={img} alt={`Illustrative training image for ${p.title}`} loading="lazy" width={992} height={672} className="aspect-[3/2] w-full object-cover" />
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
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CERTIFICATIONS.map((c) => (
            <li key={c.code}>
              <CertificationCard c={c} compact />
            </li>
          ))}
        </ul>
        <Button asChild size="lg" className={`mt-8 ${greenBtn}`}>
          <Link to="/training-certification/professional-certifications">Explore professional certifications</Link>
        </Button>
      </Section>

      {/* PATHWAYS */}
      <Section id="pathways">
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
            <Link to="/training-certification" hash="b16" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-brand-green-soft underline">Venue: B16 Training Centre — proposed facility</Link>
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

      {/* PARTNERSHIP PLANNING */}
      <Section tone="surface">
        <SectionHeading eyebrow="Partnership planning" title="A Platform Supported by Specialist Capability" body="GET Energy operates the Academy platform. Depending on the programme, suitable institutions may support facilities, instructors, practical assessments or recognised certification after formal agreement and verification." />
        <div className="mt-6 divide-y divide-border border-y border-border bg-card">
          {ACADEMY_AREAS.map((area) => (
            <details key={area.title} className="group px-4 py-4 sm:px-5">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-deep">
                <span>{area.shortTitle}</span>
                <span aria-hidden className="text-xl text-brand-green transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="pb-2 pt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prospective organisations under evaluation</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {area.prospectiveOrganisations.map((organisation) => <li key={organisation} className="border border-border bg-surface px-3 py-2 text-xs">{organisation}</li>)}
                </ul>
              </div>
            </details>
          ))}
        </div>
        <p className="mt-5 border-l-4 border-brand-green bg-card p-4 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">Important:</strong> These names are a partnership-planning reference only. They are not presented as current GET Energy partners. Certification, accreditation, facilities and assessment arrangements must be confirmed with the relevant organisation for each programme before enrolment or public promotion.</p>
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

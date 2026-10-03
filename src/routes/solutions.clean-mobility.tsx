import { createFileRoute, Link } from "@tanstack/react-router";
import { CmButton, CmHero, PipelineCards, cmHead } from "@/components/site/CleanMobility";
import { RequestForm } from "@/components/site/RequestForm";
import { Section, SectionHeading, StatusBadge } from "@/components/site/ui-bits";
import { CERT_LANGUAGE, CLEAN_MOBILITY_PAGES, FLEET_FORM, HOST_FORM, PILLARS, TRAINING_LINK } from "@/lib/clean-mobility";

const TITLE = "Clean Mobility Nigeria | CNG & EV Transport Energy | GETENERGY";
const DESC = "GETENERGY is developing an integrated clean-mobility ecosystem in Nigeria: CNG refuelling, conversion and maintenance, EV charging, fleet energy transition, infrastructure and green skills.";

export const Route = createFileRoute("/solutions/clean-mobility")({
  head: () => cmHead(TITLE, DESC, "/solutions/clean-mobility"),
  component: Page,
});

const TRAINING_CATS = ["CNG Technology", "CNG Vehicle Conversion", "CNG Vehicle Maintenance", "CNG Station Operations", "CNG Safety", "EV Fundamentals", "EV Maintenance & Diagnostics", "Hybrid Vehicle Technology", "EV Charging Infrastructure", "EV Charger Installation & Maintenance", "Solar PV", "Battery Energy Storage", "Energy Management", "Electrical Safety", "Health, Safety & Environment", "Clean Mobility Entrepreneurship", "Green Business Development", "Fleet Energy Management", "Customer & Station Operations"];
const PARTNER_SLOTS = ["OEM Partners", "Technical Training Partners", "Certification Bodies", "Universities", "TVET Institutions", "Industry Partners"];

function Page() {
  return (
    <>
      <CmHero eyebrow="Solutions" title="Clean Mobility & Transport Energy Solutions" status="In development"
        body="GETENERGY is developing an integrated clean-mobility ecosystem designed to support businesses, transport operators, institutions, fleets and communities transitioning toward cleaner and more efficient transport energy.">
        <div className="mt-6 flex flex-wrap gap-3">
          <CmButton href="/solutions/cng-refuelling">Explore CNG Solutions</CmButton>
          <CmButton ghost href="/solutions/ev-charging">Explore EV Solutions</CmButton>
          <CmButton ghost href={TRAINING_LINK}>Explore Training Programmes</CmButton>
        </div>
      </CmHero>

      <Section>
        <SectionHeading title="Three pillars" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-lg font-bold">{p.title}</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">{p.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading title="Clean mobility services" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CLEAN_MOBILITY_PAGES.map((p) => (
            <Link key={p.slug} to="/solutions/$slug" params={{ slug: p.slug }} className="flex min-h-24 flex-col justify-between rounded-lg border border-border bg-background p-4">
              <StatusBadge status={p.status} />
              <span className="mt-2 font-semibold">{p.nav} →</span>
            </Link>
          ))}
          <a href={TRAINING_LINK} className="flex min-h-24 flex-col justify-between rounded-lg border border-border bg-background p-4">
            <StatusBadge status="Waiting list open" /><span className="mt-2 font-semibold">Green Energy Skills & Training →</span>
          </a>
        </div>
      </Section>

      <Section>
        <SectionHeading title="Green Energy & Economy Skills Development Centre" body="The human-capital arm supporting Africa's transition toward cleaner transportation and energy systems. Programmes are delivered through GET Energy Academy." />
        <ul className="mt-6 flex flex-wrap gap-2">{TRAINING_CATS.map((c) => <li key={c} className="rounded-full border border-border px-3 py-1.5 text-sm">{c}</li>)}</ul>
        <p className="mt-4 text-sm text-muted-foreground">{CERT_LANGUAGE}</p>
        <h3 className="mt-6 font-semibold">Future partners</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
          {PARTNER_SLOTS.map((s) => <div key={s} className="rounded-lg border border-dashed border-border p-4 text-sm"><strong>{s}</strong><br /><span className="text-muted-foreground">To be announced</span></div>)}
        </div>
        <div className="mt-6"><a className="font-semibold text-brand underline" href={TRAINING_LINK}>Explore Training Programmes →</a></div>
      </Section>

      <Section tone="surface">
        <SectionHeading title="Projects & development pipeline" body="Every project shows its real stage. None of the projects below is operating yet." />
        <div className="mt-6"><PipelineCards /></div>
      </Section>

      <Section id="fleet">
        <div className="mx-auto max-w-2xl"><RequestForm {...FLEET_FORM} /></div>
      </Section>
      <Section tone="surface" id="host-your-site">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 text-sm text-muted-foreground">For property owners, petrol stations, hotels, malls, universities, hospitals, transport terminals, industrial estates, fleet depots, government institutions and commercial property owners.</p>
          <RequestForm {...HOST_FORM} />
        </div>
      </Section>
    </>
  );
}

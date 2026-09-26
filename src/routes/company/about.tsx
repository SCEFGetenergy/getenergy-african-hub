import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Compass, Target } from "lucide-react";
import { BRAND, HISTORICAL_ENGAGEMENTS, VALUES } from "@/lib/site";
import {
  CtaBand,
  Disclaimer,
  JourneyTimeline,
  PageHero,
  Section,
  SectionHeading,
  TransitionModel,
} from "@/components/site/ui-bits";

export const Route = createFileRoute("/company/about")({
  head: () => ({
    meta: [
      { title: "About GetEnergy | GET Energy Trading Services Ltd" },
      {
        name: "description",
        content:
          "GetEnergy's real operating history: diesel supply and community electricity vending from 2023, business process engineering from August 2026, and expansion into green energy.",
      },
      { property: "og:title", content: "About GetEnergy" },
      {
        property: "og:description",
        content: "Mission, vision, values, journey timeline and selected historical engagements.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="An energy company built on operations, not slideware"
        body={`${BRAND.legalName}, trading as GetEnergy, is an integrated energy company serving Nigeria and the wider African market, and a subsidiary of ${BRAND.parent}.`}
      />

      <Section>
        <SectionHeading eyebrow="Brand story" title="What we have actually done" />
        <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            From 2023 through August 2026, GetEnergy's core business was commercial diesel supply and community
            electricity vending. We supplied diesel to construction operations including Pernix Construction and Amasul;
            to retail operations, with Shoprite-related diesel supply across Lagos, Ogun, Delta, Enugu, Kaduna, Abuja,
            Ondo, Oyo/Ibadan and Onitsha; to healthcare at Cedatel Hospitals; and to oil exploration at Halkin
            Exploration and Production Ltd, Lagos.
          </p>
          <p>
            In parallel, we delivered residential and community electricity vending for more than 400 homes at Lekki
            Gardens, working through implementation partners. That work taught us how estates actually consume, pay for
            and dispute electricity — knowledge that now shapes our smart metering and vending offering.
          </p>
          <p>
            GetEnergy also attempted electricity-meter manufacturing through a technology partnership. That effort did
            not progress into an actual manufacturing operation. We present it as a business-learning experience rather
            than an achievement, and it is the reason we now validate technology partnerships against delivery capacity
            before committing.
          </p>
          <p>
            From August 2026 the company began a Business Process Engineering & Digital Transformation phase —
            restructuring operations, processes, governance and digital systems — and is now expanding into green
            energy across CNG, electric and hybrid mobility, charging and battery solutions, solar, storage, smart
            metering and energy e-commerce.
          </p>
        </div>

        <div className="mt-8 flex gap-3 rounded-xl border border-border bg-surface p-5">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-brand-green" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Transparency principle: </strong>
            on every page we distinguish what the company <em>has done</em>, what it <em>is doing</em>, what it{" "}
            <em>is building</em> and what it <em>plans to do</em>. Funders and customers should never have to guess.
          </p>
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 card-elevated">
            <span className="flex size-10 items-center justify-center rounded-lg bg-brand-green-soft text-brand-green">
              <Target className="size-5" />
            </span>
            <h2 className="mt-4 text-xl font-semibold">Mission</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{BRAND.mission}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 card-elevated">
            <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-brand">
              <Compass className="size-5" />
            </span>
            <h2 className="mt-4 text-xl font-semibold">Vision</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{BRAND.vision}</p>
          </div>
        </div>

        <SectionHeading eyebrow="Values" title="Eight commitments we operate by" align="center" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <div key={value.name} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-brand">{value.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{value.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Selected historical engagements"
          title="Where our diesel and vending work was delivered"
          body="These are past commercial engagements, presented for capability evidence only."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HISTORICAL_ENGAGEMENTS.map((item) => (
            <div key={item.sector} className="rounded-xl border border-border bg-card p-6 card-elevated">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">{item.sector}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
        <Disclaimer />
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="Journey" title="2023 to today, and where we are heading" />
        <JourneyTimeline />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Core message"
          title="Reliable energy today, cleaner energy tomorrow"
          body="Our transition model is the spine of every proposal we write."
        />
        <TransitionModel />
      </Section>

      <CtaBand />
    </>
  );
}

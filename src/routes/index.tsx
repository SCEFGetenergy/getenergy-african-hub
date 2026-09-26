import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Fuel, Leaf, Zap } from "lucide-react";
import heroImage from "@/assets/hero-africa-bulb.jpg";
import { BRAND, JOURNEY, SECTORS, SERVICES } from "@/lib/site";
import { SERVICE_ICONS } from "@/components/site/icons";
import {
  CtaBand,
  Disclaimer,
  Eyebrow,
  JourneyTimeline,
  Section,
  SectionHeading,
  StatusBadge,
  TransitionModel,
} from "@/components/site/ui-bits";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GetEnergy — Energy for Today. Cleaner Opportunities for Tomorrow." },
      {
        name: "description",
        content:
          "Integrated energy services in Nigeria and Africa: diesel supply, electricity vending, CNG, EV & hybrid mobility, charging, solar, storage, smart metering and training.",
      },
      { property: "og:title", content: "GetEnergy — Integrated Energy Services for Africa" },
      {
        property: "og:description",
        content:
          "Reliable energy today while building practical pathways to cleaner, smarter and more sustainable energy tomorrow.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const QUICK_ACTIONS = [
  { label: "Buy electricity token", to: "/electricity", icon: Zap, body: "Prepaid tokens & bill payment requests" },
  { label: "Order diesel", to: "/diesel", icon: Fuel, body: "Bulk AGO supply and scheduled delivery" },
  { label: "Go greener", to: "/green-energy", icon: Leaf, body: "CNG, EV, solar, storage and metering" },
];

function Home() {
  return (
    <>
      <section className="hero-surface relative overflow-hidden px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow invert>Integrated energy · Nigeria & Africa</Eyebrow>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-primary-foreground sm:text-4xl md:text-5xl">
              Energy for Today.
              <br />
              <span className="text-brand-green-soft">Cleaner Opportunities for Tomorrow.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/80">
              {BRAND.legalName} delivers reliable energy today — diesel supply and electricity vending — while building
              CNG, electric mobility, renewables and smart infrastructure for tomorrow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">
                <Link to="/contact">
                  {BRAND.primaryCta}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/green-energy">Explore green energy</Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-primary-foreground/60">
              A subsidiary of {BRAND.parent} · Operating since 2023
            </p>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              width={1280}
              height={1024}
              alt="Map of Africa formed from glowing circuits inside a lightbulb, with solar panels, wind turbines and an electric vehicle"
              className="w-full rounded-2xl border border-primary-foreground/15 object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      <Section tone="surface">
        <div className="grid gap-4 sm:grid-cols-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 card-elevated card-lift"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-green-soft text-brand-green">
                <action.icon className="size-5" />
              </span>
              <span>
                <span className="block font-semibold">{action.label}</span>
                <span className="block text-sm text-muted-foreground">{action.body}</span>
              </span>
              <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </Section>

      <Section id="solutions">
        <SectionHeading
          eyebrow="Eleven service areas"
          title="One partner across the energy chain"
          body="From the fuel that keeps your site running today to the charging infrastructure you will need tomorrow. Each area has its own request form and a clear status."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = SERVICE_ICONS[service.icon] ?? Zap;
            return (
              <Link
                key={service.slug}
                to={`/${service.slug}`}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 card-elevated card-lift"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-brand">
                    <Icon className="size-5" />
                  </span>
                  <StatusBadge status={service.status} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{service.summary}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-brand-green">
                  Request this solution
                  <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section tone="brand">
        <SectionHeading
          invert
          eyebrow="The transition model"
          title="Cleaner energy, one financeable step at a time"
          body="We do not ask customers to leap. We move from reliable supply to efficiency, cleaner fuels, smarter infrastructure and finally renewable and low-carbon energy."
        />
        <TransitionModel invert />
        <div className="mt-8">
          <Button asChild className="bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">
            <Link to="/green-energy">
              See our green energy programme
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Our journey"
          title="Built on real operating history"
          body="We distinguish clearly between what we have done, what we are doing, what we are building and what is planned."
        />
        <JourneyTimeline />
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {JOURNEY.map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-card p-4">
              <StatusBadge status={item.status} />
              <p className="mt-2 text-sm font-semibold">{item.title}</p>
            </div>
          ))}
        </div>
        <Disclaimer />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Sectors served"
          title="Industries we have supplied and support"
          body="Each sector is paired with the solution set that fits its load profile and operating risk."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((sector) => (
            <Link
              key={sector.name}
              to={`/${sector.slug}`}
              className="rounded-xl border border-border bg-card p-5 card-elevated card-lift"
            >
              <div className="flex items-center gap-2">
                <Check className="size-4 text-brand-green" />
                <h3 className="font-semibold">{sector.name}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{sector.solution}</p>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/industries">View all industries</Link>
          </Button>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}

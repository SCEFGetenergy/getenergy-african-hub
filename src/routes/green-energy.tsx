import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf } from "lucide-react";
import { GREEN_CATEGORIES } from "@/lib/site";
import { CtaBand, PageHero, Section, SectionHeading, TransitionModel } from "@/components/site/ui-bits";
import { Button } from "@/components/ui/button";
import { RequestForm } from "@/components/site/RequestForm";
import { GENERAL_FIELDS } from "@/lib/site";

export const Route = createFileRoute("/green-energy")({
  head: () => ({
    meta: [
      { title: "Green Energy Transition | GetEnergy" },
      {
        name: "description",
        content:
          "Our five-stage energy transition model plus green energy categories: EV and hybrid mobility, CNG, solar, battery storage, charging infrastructure, smart metering and green skills.",
      },
      { property: "og:title", content: "Green Energy Transition | GetEnergy" },
      {
        property: "og:description",
        content: "Reliable energy today, greater efficiency, cleaner fuels, smarter infrastructure, renewable energy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GreenEnergy,
});

function GreenEnergy() {
  return (
    <>
      <PageHero
        eyebrow="Green energy"
        title="A practical route to cleaner energy in Africa"
        body="Green energy only works when it is affordable, financeable and serviceable. Our transition model starts from the energy customers already buy and moves deliberately toward low-carbon supply."
      />

      <Section>
        <SectionHeading
          eyebrow="Transition model"
          title="Five stages, in order"
          body="Each stage pays for itself and makes the next one easier. Customers can enter at any stage."
        />
        <TransitionModel />
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Green energy categories"
          title="What we are building"
          body="These categories are in build or planning. We are transparent that our proven operating history is diesel supply and electricity vending."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GREEN_CATEGORIES.map((category) => (
            <div key={category.name} className="rounded-xl border border-border bg-card p-6 card-elevated">
              <span className="flex size-10 items-center justify-center rounded-lg bg-brand-green-soft text-brand-green">
                <Leaf className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{category.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{category.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/ev-mobility">
              EV & hybrid mobility
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/renewables">Solar, BESS & distributed power</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/cng">CNG services</Link>
          </Button>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <SectionHeading
              eyebrow="Start somewhere"
              title="Tell us where you are today"
              body="Share your current energy setup and we will map the next practical step — often efficiency or cleaner fuel before renewables."
            />
          </div>
          <RequestForm
            requestType="green-energy"
            serviceName="Green Energy Transition"
            title="Request a green energy pathway"
            description="We respond with a staged recommendation for your site or fleet."
            fields={GENERAL_FIELDS}
          />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}

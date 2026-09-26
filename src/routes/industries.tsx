import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SECTORS } from "@/lib/site";
import { CtaBand, Disclaimer, PageHero, Section, SectionHeading } from "@/components/site/ui-bits";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries We Serve | GetEnergy" },
      {
        name: "description",
        content:
          "Energy solutions for construction, retail, healthcare, hospitality, residential estates, oil & gas, transport, commercial fleets, education and government.",
      },
      { property: "og:title", content: "Industries We Serve | GetEnergy" },
      { property: "og:description", content: "Each sector paired with the GetEnergy solution that fits its load." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Industries,
});

const DETAIL: Record<string, string> = {
  Construction:
    "Sites run on schedule or they lose money. We supplied diesel to construction operations including Pernix Construction and Amasul, with delivery windows planned around pour and lift schedules.",
  "Retail & Malls":
    "Retail needs predictable cost per trading hour. Our diesel supply covered Shoprite-related locations across nine states; efficiency, solar and storage now reduce that fuel bill.",
  Healthcare:
    "Healthcare cannot tolerate outages. Our work with Cedatel Hospitals informs a Power as a Service approach with contracted availability and backup layers.",
  Hospitality:
    "Hotels compete on guest experience and margin. Efficiency retrofits, hybrid power and EV charging bays serve both.",
  "Residential Estates":
    "We vended electricity for 400+ homes at Lekki Gardens through implementation partners. Smart metering makes billing fair and recovery transparent.",
  "Oil & Gas":
    "Remote sites need compliant fuel logistics. We supplied Halkin Exploration and Production Ltd, Lagos, with documented delivery.",
  "Transport & Logistics":
    "Fuel is the largest controllable cost. CNG conversion and refuelling access cut cost per kilometre before electrification becomes viable.",
  "Commercial Fleets":
    "Depot-based fleets are the best first EV case: predictable routes, controlled charging, measurable savings.",
  "Education & Government":
    "Institutions need capital-efficient supply and local skills. Solar, storage, metering and certified training work together.",
};

function Industries() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Industries we serve"
        body="Every sector has a different load profile, tolerance for downtime and route to cleaner energy. Here is how we pair them with solutions."
      />

      <Section>
        <SectionHeading eyebrow="Sector by sector" title="Your industry, matched to a solution" />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {SECTORS.map((sector) => (
            <div key={sector.name} className="flex flex-col rounded-xl border border-border bg-card p-6 card-elevated">
              <h3 className="text-lg font-semibold">{sector.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{DETAIL[sector.name]}</p>
              <p className="mt-4 text-sm font-medium">
                <span className="text-muted-foreground">Recommended: </span>
                {sector.solution}
              </p>
              <Link
                to={`/${sector.slug}`}
                className="mt-4 inline-flex items-center text-sm font-semibold text-brand-green hover:underline"
              >
                Request this solution
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </div>
          ))}
        </div>
        <Disclaimer />
      </Section>

      <CtaBand />
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { BRAND } from "@/lib/site";
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/site/ui-bits";

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: "Technology & Shared Platform | GetEnergy" },
      {
        name: "description",
        content:
          "How GetEnergy's shared technology connects customers, service delivery, the Energy E-Commerce Africa marketplace, suppliers, OEMs and energy professionals.",
      },
      { property: "og:title", content: "Technology & Shared Platform | GetEnergy" },
      {
        property: "og:description",
        content: "One request layer, one shared platform, one supplier and professional network.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Technology,
});

const LAYERS = [
  {
    name: "Customers",
    body: "Homes, estates, businesses, hospitals, hotels, factories and fleets submitting requests for energy, fuel, mobility and metering.",
  },
  {
    name: "GetEnergy",
    body: "Service delivery, assessment, quotation, project execution, operations and customer support across the eleven service areas.",
  },
  {
    name: "Shared Technology",
    body: "One account, request and tracking layer: lead capture, request references, status, metering and vending data, and reporting.",
  },
  {
    name: "Energy E-Commerce Africa (EEA)",
    body: "The marketplace layer for listings, sourcing and digital commerce — currently in pilot registration.",
  },
  {
    name: "Suppliers, OEMs & Professionals",
    body: "Fuel suppliers, equipment manufacturers, installers, conversion technicians and certified energy professionals.",
  },
];

function Technology() {
  return (
    <>
      <PageHero
        eyebrow="Technology"
        title="One shared platform across the energy chain"
        body="Customers should not have to manage five vendors to solve one energy problem. Our technology layer connects demand, delivery, marketplace and supply."
      />

      <Section>
        <SectionHeading eyebrow="Architecture" title="How the pieces connect" />

        <div className="mt-10 overflow-x-auto">
          <pre className="min-w-[640px] rounded-xl border border-border bg-surface p-6 font-mono text-xs leading-relaxed text-foreground">
{`   Customers                GetEnergy               Shared Technology              EEA                 Suppliers / OEMs
 (homes, estates,   <-->  (service delivery,  <-->  (accounts, requests,  <-->  (marketplace,  <-->  (fuel, equipment,
  business, fleets)        assessment, ops)          status, metering)          listings, pilot)      professionals)
        |                        |                         |                         |                      |
        +------------------------+-------------------------+-------------------------+----------------------+
                                  every request carries one reference end to end`}
          </pre>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LAYERS.map((layer, i) => (
            <div key={layer.name} className="rounded-xl border border-border bg-card p-6 card-elevated">
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-brand-green-soft text-xs font-bold text-brand-green">
                {i + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{layer.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{layer.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="What is live today"
          title="Accounts, requests and tracking are working now"
          body="Customers can register an individual or business account, submit a request against any service area, receive a request reference immediately, and track status in their dashboard. Online payment, marketplace transactions and metering data feeds are in build."
        />
        <p className="mt-6 text-sm text-muted-foreground">
          The marketplace pilot is registering participants at{" "}
          <a href={BRAND.eeaUrl} target="_blank" rel="noreferrer" className="font-semibold text-brand-green underline">
            eea.africa
          </a>
          .
        </p>
      </Section>

      <CtaBand />
    </>
  );
}

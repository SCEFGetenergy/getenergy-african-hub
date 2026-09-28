import { createFileRoute } from "@tanstack/react-router";
import { PARTNER_FIELDS } from "@/lib/site";
import { CtaBand, Disclaimer, JourneyTimeline, PageHero, Section, SectionHeading, StatusBadge } from "@/components/site/ui-bits";
import { RequestForm } from "@/components/site/RequestForm";

export const Route = createFileRoute("/company/partners")({
  head: () => ({
    meta: [
      { title: "Partners & Funders | GetEnergy" },
      {
        name: "description",
        content:
          "Company history, current capability, future pipeline and governance for funders, DFIs, OEMs and implementation partners — with a clear done / doing / building / planned breakdown.",
      },
      { property: "og:title", content: "Partners & Funders | GetEnergy" },
      { property: "og:description", content: "Funder-friendly transparency: what is done, doing, building and planned." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Partners,
});

const MATRIX = [
  {
    status: "Done",
    title: "Delivered history (2023 – August 2026)",
    items: [
      "Commercial diesel supply to construction, retail, healthcare and oil exploration customers",
      "Multi-state retail diesel supply across nine states",
      "Community electricity vending for 400+ homes at Lekki Gardens via implementation partners",
      "An attempted electricity-meter manufacturing partnership that did not progress into manufacturing — reported as a learning experience",
    ],
  },
  {
    status: "Doing",
    title: "Current activity (from August 2026)",
    items: [
      "Business Process Engineering & Digital Transformation of operations and governance",
      "Digital request, account and tracking platform in live use",
      "Continued diesel supply and electricity vending operations",
      "Commercial structuring of the eleven service areas",
    ],
  },
  {
    status: "Building",
    title: "In build",
    items: [
      "CNG sourcing, logistics and conversion centre capability",
      "EV and hybrid mobility offering plus charging and battery solutions",
      "Smart metering and vending at wider scale",
      "Energy E-Commerce Africa (EEA54) marketplace — pilot registration",
      "Training and certification programmes for green skills",
    ],
  },
  {
    status: "Planned",
    title: "Pipeline",
    items: [
      "Solar, BESS and distributed power project portfolio",
      "Power as a Service contracts with availability guarantees",
      "CNG station development",
      "Regional expansion beyond Nigeria into other African markets",
    ],
  },
];

const GOVERNANCE = [
  {
    title: "Corporate structure",
    body: "GET Energy Trading Services Ltd is a subsidiary of Pancokrato Integrated Services (PKIS), operating in Nigeria.",
  },
  {
    title: "Due-diligence posture",
    body: "We present verified operating history separately from pipeline ambition. Historical engagements are described as past commercial activity, not current partnerships.",
  },
  {
    title: "Process discipline",
    body: "The Business Process Engineering phase exists to make delivery, documentation and reporting repeatable before we scale capital-intensive services.",
  },
  {
    title: "Learning record",
    body: "The meter-manufacturing attempt is disclosed openly. We would rather lose a slide than misrepresent capability to a funder.",
  },
  {
    title: "Implementation partners",
    body: "Community vending and several delivery activities run through named implementation partners; scope and responsibility are documented per engagement.",
  },
  {
    title: "Data & customer records",
    body: "Customer accounts and service requests are held in a managed cloud database with per-user access controls and request references for traceability.",
  },
];

function Partners() {
  return (
    <>
      <PageHero
        eyebrow="Partners & funders"
        title="Transparent about what exists and what does not"
        body="Funders, DFIs, OEMs and implementation partners need an honest split between delivered history, current activity, build pipeline and plans. This page is that split."
      />

      <Section>
        <SectionHeading eyebrow="Capability matrix" title="Done, doing, building, planned" />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {MATRIX.map((block) => (
            <div key={block.status} className="rounded-xl border border-border bg-card p-6 card-elevated">
              <StatusBadge status={block.status} />
              <h3 className="mt-3 text-lg font-semibold">{block.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {block.items.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-muted-foreground">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Disclaimer />
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="Company history" title="How the business developed" />
        <JourneyTimeline />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Governance & due diligence"
          title="What a reviewer should know"
          body="We aim to answer the first six diligence questions before they are asked."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GOVERNANCE.map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-6 card-elevated">
              <h3 className="font-semibold text-brand">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <SectionHeading
            eyebrow="Get in touch"
            title="Partnership and funding enquiries"
            body="Tell us which part of the pipeline interests you and we will send the corresponding documentation."
          />
          <RequestForm
            requestType="partnership"
            serviceName="Partnership & Funding Enquiry"
            title="Submit a partnership or funding enquiry"
            description="You will receive a reference number immediately and a response from our leadership team."
            fields={PARTNER_FIELDS}
            submitLabel="Submit enquiry"
          />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}

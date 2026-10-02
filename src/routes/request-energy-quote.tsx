import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/ui-bits";
import { RequestForm } from "@/components/site/RequestForm";
import type { FormField } from "@/lib/site";

const NEEDS = [
  "Diesel / AGO Supply", "CNG Supply", "CNG Conversion", "EV Charging", "EV / Hybrid Mobility",
  "Solar & Renewables", "Battery Energy Storage — BESS", "Generators", "Distributed Power", "Mini-Grid",
  "Power-as-a-Service", "Electricity-as-a-Service", "Smart Metering", "Electricity Services",
  "Energy Audit / Advisory", "Training", "Partnership", "Other",
];

const FIELDS: FormField[] = [
  { name: "contact_name", label: "Full name", type: "text", required: true },
  { name: "company_name", label: "Company / Organisation", type: "text", required: true },
  { name: "contact_email", label: "Email address", type: "email", required: true },
  { name: "contact_phone", label: "Phone / WhatsApp", type: "tel", required: true },
  { name: "country", label: "Country", type: "text", placeholder: "Nigeria" },
  { name: "location", label: "State / City", type: "text", required: true },
  { name: "need", label: "What do you need?", type: "select", options: NEEDS, required: true },
  { name: "notes", label: "Project requirement", type: "textarea", required: true },
  { name: "quantity", label: "Estimated quantity / capacity", type: "text" },
  { name: "required_date", label: "Required date", type: "date" },
  { name: "contact_method", label: "Preferred contact method", type: "select", options: ["Phone call", "WhatsApp", "Email"] },
];

const TRUST = ["Practical solutions for your needs", "Expert technical advice", "Transparent commercial options", "Responsive support team"];

export const Route = createFileRoute("/request-energy-quote")({
  head: () => ({
    meta: [
      { title: "Request an Energy Quote | GetEnergy" },
      { name: "description", content: "Tell GET Energy what you need, where and when — diesel, CNG, EV charging, solar, storage, mini-grids and more. Every request gets a reference." },
      { property: "og:title", content: "Request an Energy Quote | GetEnergy" },
      { property: "og:description", content: "Let's power your next project. Request a quote from GET Energy Trading Services." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuotePage,
});

function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Request a quote"
        title="Let's power your next project."
        body="Tell us what you need, where you need it and when you need it. Our team will review your requirements and recommend the appropriate GET Energy solution for your business, facility or project."
      />
      <Section tone="surface">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t) => (
            <li key={t} className="rounded-xl border bg-card p-4 text-sm font-semibold text-foreground">{t}</li>
          ))}
        </ul>
      </Section>
      <Section>
        <div className="mx-auto max-w-2xl space-y-6">
          <RequestForm
            requestType="quote"
            serviceName="Energy Quote"
            title="Request an energy quote"
            note="Thank you — once submitted, the GET Energy team will review your requirements and contact you. No prices or delivery dates are confirmed until our team reviews your request."
            fields={FIELDS}
            submitLabel="Submit request →"
          />
          <p className="text-center text-sm text-muted-foreground">
            Prefer to chat?{" "}
            <a className="font-semibold text-primary underline" href="https://wa.me/2348180742835?text=Hello%20GET%20Energy%2C%20I%20would%20like%20an%20energy%20quote." target="_blank" rel="noopener noreferrer">
              Continue on WhatsApp (+234 818 074 2835)
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}

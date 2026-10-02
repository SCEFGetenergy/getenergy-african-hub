import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/site/ui-bits";
import { AcademyForm, type Field } from "@/components/academy/AcademyForm";
import { getProgramme } from "@/lib/academy";

const TITLE = "Corporate Energy Training in Nigeria | GET Energy Academy";
const DESC = "Train your team: customised technical, HSE, energy-management and professional programmes for organisations.";

export const Route = createFileRoute("/training-certification/corporate")({
  validateSearch: (s: Record<string, unknown>): { programme?: string } =>
    typeof s['programme'] === "string" ? { programme: s['programme'] } : {},
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Corporate,
});

const FIELDS: Field[] = [
  { name: "organisation", label: "Organisation", required: true },
  { name: "contact", label: "Contact person", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "country", label: "Country" },
  { name: "industry", label: "Industry" },
  { name: "programmes", label: "Training programme(s)", type: "textarea", required: true },
  { name: "participants", label: "Number of participants", type: "number" },
  { name: "level", label: "Participant level", type: "select", options: ["Entry", "Intermediate", "Professional", "Management / Executive", "Mixed"] },
  { name: "dates", label: "Preferred dates" },
  { name: "mode", label: "Training mode", type: "select", options: ["Physical", "Virtual", "Hybrid", "No Preference"] },
  { name: "certification", label: "Certification required?", type: "select", options: ["Yes", "No", "Not Sure"] },
  { name: "custom", label: "Customised curriculum required?", type: "select", options: ["Yes", "No", "Not Sure"] },
  { name: "objectives", label: "Training objectives", type: "textarea" },
  { name: "comments", label: "Comments", type: "textarea" },
];

function Corporate() {
  const { programme } = Route.useSearch();
  const p = programme ? getProgramme(programme) : undefined;
  return (
    <Section tone="surface">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="GET Energy Academy" title="Train your team" body="Tell us about your organisation and training needs. You'll receive a request reference immediately and our training team will follow up." />
        <div className="mt-8">
          <AcademyForm kind="corporate" fields={FIELDS} submitLabel="Request corporate training" initial={p ? { programmes: p.title } : {}} />
        </div>
      </div>
    </Section>
  );
}

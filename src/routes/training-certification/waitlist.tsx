import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/site/ui-bits";
import { AcademyForm, type Field } from "@/components/academy/AcademyForm";
import { getProgramme } from "@/lib/academy";

const TITLE = "Join a Training Waiting List | GET Energy Academy";
const DESC = "Register for the next cohort of a GET Energy Academy programme and receive a request reference.";

export const Route = createFileRoute("/training-certification/waitlist")({
  validateSearch: (s: Record<string, unknown>): { programme?: string } =>
    typeof s['programme'] === "string" ? { programme: s['programme'] } : {},
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:url", content: "https://getenergy.ng/training-certification/waitlist" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/training-certification/waitlist" }],
  }),
  component: Waitlist,
});

const FIELDS: Field[] = [
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true },
  { name: "country", label: "Country", required: true },
  { name: "city", label: "State / City", required: true },
  { name: "applicantType", label: "Applicant type", type: "select", required: true, options: ["Student", "Graduate", "NYSC Member", "Technician", "Engineer", "Professional", "Entrepreneur", "Corporate Staff", "Government Employee", "NGO / CSO", "Business Owner", "Other"] },
  { name: "occupation", label: "Occupation" },
  { name: "organisation", label: "Organisation / School" },
  { name: "programme", label: "Selected programme", type: "programme", required: true },
  { name: "experience", label: "Experience level", type: "select", required: true, options: ["Beginner", "Intermediate", "Professional", "Advanced", "Not Sure"] },
  { name: "mode", label: "Preferred training mode", type: "select", required: true, options: ["Physical", "Virtual", "Hybrid", "No Preference"] },
  { name: "period", label: "Preferred training period" },
  { name: "certification", label: "Certification required?", type: "select", options: ["Yes", "No", "Not Sure"] },
  { name: "paymentPlan", label: "Information about payment plans?", type: "select", options: ["Yes", "No"] },
  { name: "objective", label: "Training / career objective", type: "textarea", required: true },
  { name: "source", label: "How did you hear about us?" },
  { name: "consent", label: "I agree that GET Energy Trading Services may use the information provided to contact me regarding this training programme and future cohort availability.", type: "consent", required: true },
];

function Waitlist() {
  const { programme } = Route.useSearch();
  const p = programme ? getProgramme(programme) : undefined;
  return (
    <Section tone="surface">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="GET Energy Academy"
          title={p ? `Join the waiting list: ${p.title}` : "Join a waiting list"}
          body="No cohort dates are confirmed yet. We'll contact you when the start date, venue, final fee, trainer and certification details are confirmed. You'll receive a request reference immediately."
        />
        <div className="mt-8">
          <AcademyForm key={programme ?? ""} kind="waitlist" fields={FIELDS} submitLabel="Join waiting list" initial={p ? { programme: p.slug } : {}} />
        </div>
      </div>
    </Section>
  );
}

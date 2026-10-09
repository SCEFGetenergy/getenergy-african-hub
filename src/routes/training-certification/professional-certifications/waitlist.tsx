import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/site/ui-bits";
import { AcademyForm, type Field } from "@/components/academy/AcademyForm";
import { getCertification } from "@/lib/certifications";

const TITLE = "Professional Certification Waiting List | GET Energy Academy";
const DESC = "Join the waiting list for a GETS professional certification and receive a request reference.";

export const Route = createFileRoute("/training-certification/professional-certifications/waitlist")({
  validateSearch: (s: Record<string, unknown>): { certification?: string } =>
    typeof s["certification"] === "string" ? { certification: s["certification"] } : {},
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:url", content: "https://getenergy.ng/training-certification/professional-certifications/waitlist" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/training-certification/professional-certifications/waitlist" }],
  }),
  component: CertWaitlist,
});

const FIELDS: Field[] = [
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true },
  { name: "country", label: "Country", required: true },
  { name: "city", label: "State / City", required: true },
  { name: "certification", label: "Certification selected", type: "certification", required: true },
  { name: "role", label: "Current role" },
  { name: "organisation", label: "Employer" },
  { name: "years", label: "Years of experience", type: "number" },
  { name: "education", label: "Education" },
  { name: "existing", label: "Existing certifications" },
  { name: "industry", label: "Relevant industry experience" },
  { name: "objective", label: "Career objective", type: "textarea", required: true },
  { name: "mode", label: "Preferred training mode", type: "select", options: ["Physical", "Virtual", "Hybrid", "No Preference"] },
  { name: "sponsor", label: "Would your employer sponsor you?", type: "select", options: ["Yes", "No", "Possibly"] },
  { name: "comments", label: "Comments (you can share your CV with our team on WhatsApp after submitting)", type: "textarea" },
  { name: "consent", label: "I agree that GET Energy Trading Services may use the information provided to contact me regarding this certification and future cohort availability.", type: "consent", required: true },
];

function CertWaitlist() {
  const { certification } = Route.useSearch();
  const c = certification ? getCertification(certification) : undefined;
  return (
    <Section tone="surface">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="GETS Professional Certifications"
          title={c ? `Join the waiting list: ${c.code}` : "Join a certification waiting list"}
          body="Fees, entry requirements and cohort dates are not confirmed yet. We'll contact you when they are. You'll receive a request reference immediately."
        />
        <div className="mt-8">
          <AcademyForm key={c?.code ?? ""} kind="certification" fields={FIELDS} submitLabel="Join certification waiting list" initial={c ? { certification: c.code } : {}} />
        </div>
      </div>
    </Section>
  );
}

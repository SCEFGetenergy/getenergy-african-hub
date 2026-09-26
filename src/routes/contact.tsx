import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { BRAND, CONTACT_FORM_FIELDS, GENERAL_FIELDS } from "@/lib/site";
import { PageHero, Section, SectionHeading } from "@/components/site/ui-bits";
import { RequestForm } from "@/components/site/RequestForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Request an Energy Solution | Contact GetEnergy" },
      {
        name: "description",
        content:
          "Request an energy solution from GetEnergy: diesel supply, electricity, CNG, EV mobility, charging, solar, storage, metering or training. Every request gets a reference number.",
      },
      { property: "og:title", content: "Request an Energy Solution | GetEnergy" },
      { property: "og:description", content: "Tell us your load, location and timeline. We respond with next steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={BRAND.primaryCta}
        body="Use the solution request form for anything energy-related, or the general message form for everything else. No payment is taken on this website."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div>
            <SectionHeading eyebrow="Reach us" title="Talk to our team" />
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 text-brand-green" />
                <span>
                  <span className="block font-semibold">Email</span>
                  <a href={`mailto:${BRAND.email}`} className="text-muted-foreground hover:text-brand-green">
                    {BRAND.email}
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 text-brand-green" />
                <span>
                  <span className="block font-semibold">Phone</span>
                  <span className="text-muted-foreground">{BRAND.phone}</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 text-brand-green" />
                <span>
                  <span className="block font-semibold">Office</span>
                  <span className="text-muted-foreground">{BRAND.address}</span>
                </span>
              </li>
            </ul>
            <p className="mt-8 rounded-lg border border-border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
              {BRAND.legalName} is a subsidiary of {BRAND.parent}. Submitted requests are recorded with a reference
              number; sign in to track them in your account dashboard.
            </p>

            <div className="mt-8">
              <SectionHeading eyebrow="General" title="Send a general message" />
              <div className="mt-6">
                <RequestForm
                  requestType="contact"
                  serviceName="General Enquiry"
                  title="General message"
                  fields={CONTACT_FORM_FIELDS}
                  submitLabel="Send message"
                />
              </div>
            </div>
          </div>

          <div id="request">
            <RequestForm
              requestType="general"
              serviceName="Energy Solution Request"
              title={BRAND.primaryCta}
              description="Tell us what you need and you will get a request reference immediately."
              fields={GENERAL_FIELDS}
            />
          </div>
        </div>
      </Section>
    </>
  );
}

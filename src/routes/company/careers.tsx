import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { CAREER_FIELDS, JOBS } from "@/lib/site";
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/site/ui-bits";
import { RequestForm } from "@/components/site/RequestForm";

export const Route = createFileRoute("/company/careers")({
  head: () => ({
    meta: [
      { title: "Careers at GetEnergy | Energy jobs in Nigeria" },
      {
        name: "description",
        content:
          "Open roles in diesel operations, CNG conversion, solar and BESS engineering, smart metering support, business development and our graduate energy transition programme.",
      },
      { property: "og:title", content: "Careers at GetEnergy" },
      { property: "og:description", content: "Build Africa's energy transition with an operating energy company." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Careers,
});

function Careers() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Work on energy that actually gets delivered"
        body="We hire people who like operations: fuel that arrives, meters that reconcile, systems that stay up. Training and certification are part of the job."
      />

      <Section>
        <SectionHeading eyebrow="Open roles" title="Current openings" body="Do not see your role? Submit an open application." />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {JOBS.map((job) => (
            <div key={job.title} className="rounded-xl border border-border bg-card p-6 card-elevated">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {job.location}
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold text-secondary-foreground">
                  {job.type}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{job.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <SectionHeading
            eyebrow="Apply"
            title="Send us your application"
            body="Every application receives a reference number so you can follow up with us directly."
          />
          <RequestForm
            requestType="career"
            serviceName="Career Application"
            title="Application form"
            fields={CAREER_FIELDS}
            submitLabel="Submit application"
          />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/site";
import { routePath } from "@/lib/paths";
import { PageHero, Section, SectionHeading, StatusBadge } from "@/components/site/ui-bits";

export const Route = createFileRoute("/company/solutions/")({
  head: () => ({
    meta: [
      { title: "Detailed Energy Solutions | GetEnergy" },
      { name: "description", content: "Explore GetEnergy's eleven detailed energy solutions and send a service-specific request." },
      { property: "og:title", content: "Detailed Energy Solutions | GetEnergy" },
      { property: "og:description", content: "Eleven energy service areas with clear delivery status and a dedicated request form for each." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Solutions,
});

function Solutions() {
  return (
    <>
      <PageHero eyebrow="Solutions" title="Energy solutions in detail" body="Explore what we operate today and what we are building, then send a request tailored to your needs." />
      <Section>
        <SectionHeading eyebrow="Eleven service areas" title="Find the right solution" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article key={service.slug} className="flex flex-col rounded-lg border border-border bg-card p-6 card-elevated">
              <StatusBadge status={service.status} />
              <h2 className="mt-4 text-xl font-semibold">{service.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{service.summary}</p>
              <Link to={routePath(service.slug)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:underline">
                View details <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
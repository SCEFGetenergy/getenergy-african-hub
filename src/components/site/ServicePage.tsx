import { Check } from "lucide-react";
import { getService } from "@/lib/site";
import { SERVICE_ICONS } from "@/components/site/icons";
import { CtaBand, PageHero, Section, StatusBadge } from "@/components/site/ui-bits";
import { RequestForm } from "@/components/site/RequestForm";

export function ServicePage({ slug }: { slug: string }) {
  const service = getService(slug);
  const Icon = SERVICE_ICONS[service.icon] ?? Check;

  return (
    <>
      <PageHero eyebrow="Solution" title={service.title} body={service.summary}>
        <div className="mt-6 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary-foreground/10 text-brand-green-soft">
            <Icon className="size-6" />
          </span>
          <StatusBadge status={service.status} className="bg-brand-green text-brand-green-foreground" />
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div>
            <h2 className="text-2xl font-bold">What this covers</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{service.intro}</p>
            <ul className="mt-6 space-y-3">
              {service.offerings.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 rounded-lg border border-border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
              <strong className="font-semibold text-foreground">Status: {service.status}. </strong>
              We clearly distinguish what we have delivered, what we are doing now, what we are building and what is
              planned. Ask us for specifics on this service at any time.
            </p>
          </div>

          <div id="request">
            <RequestForm
              requestType={service.slug}
              serviceName={service.title}
              title={service.formTitle}
              description="Complete the form and you will receive a request reference immediately."
              note={service.formNote}
              fields={service.fields}
            />
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}

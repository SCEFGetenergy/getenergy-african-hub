import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BRAND, JOURNEY, SERVICES, TRANSITION_MODEL } from "@/lib/site";

const COMPANY_LABELS: Record<string, string> = {
  "/company/about": "About",
  "/company/green-energy": "Green energy",
  "/company/industries": "Industries",
  "/company/technology": "Technology",
  "/company/partners": "Partners & funders",
  "/company/faq": "FAQ",
  "/company/careers": "Careers",
  "/company/contact": "Contact",
  "/company/solutions": "Solutions",
};

export function Breadcrumbs({ invert }: { invert?: boolean | undefined }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (!pathname.startsWith("/company")) return null;

  const crumbs: { label: string; to?: string }[] = [{ label: "Home", to: "/" }];
  if (pathname.startsWith("/company/solutions/")) {
    crumbs.push({ label: "Solutions", to: "/company/solutions" });
    const slug = pathname.split("/").pop() ?? "";
    const service = SERVICES.find((s) => s.slug === slug);
    crumbs.push({ label: service?.title ?? slug });
  } else {
    crumbs.push({ label: COMPANY_LABELS[pathname] ?? "Company" });
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 ? (
                <ChevronRight
                  className={cn("size-3.5", invert ? "text-primary-foreground/50" : "text-muted-foreground")}
                />
              ) : null}
              {crumb.to && !last ? (
                <Link
                  to={crumb.to}
                  className={cn(
                    "underline-offset-4 hover:underline",
                    invert ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={invert ? "text-brand-green-soft" : "text-foreground"}
                >
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function Section({
  children,
  className,
  tone = "default",
  id,
}: {
  children: ReactNode;
  className?: string | undefined;
  tone?: "default" | "surface" | "brand" | "green" | undefined;
  id?: string | undefined;
}) {
  const tones = {
    default: "bg-background",
    surface: "bg-surface",
    brand: "hero-surface",
    green: "green-surface",
  } as const;

  return (
    <section id={id} className={cn("px-4 py-14 sm:px-6 md:py-20", tones[tone], className)}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, invert }: { children: ReactNode; invert?: boolean | undefined }) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.18em]",
        invert ? "text-brand-green-soft" : "text-brand-green",
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  invert,
  align = "left",
}: {
  eyebrow?: string | undefined;
  title: string;
  body?: string | undefined;
  invert?: boolean | undefined;
  align?: "left" | "center" | undefined;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? <Eyebrow invert={invert}>{eyebrow}</Eyebrow> : null}
      <h2 className={cn("mt-2 text-2xl font-bold sm:text-3xl md:text-4xl", invert && "text-primary-foreground")}>
        {title}
      </h2>
      {body ? (
        <p className={cn("mt-4 text-base leading-relaxed", invert ? "text-primary-foreground/80" : "text-muted-foreground")}>
          {body}
        </p>
      ) : null}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  Done: "bg-brand-green-soft text-brand-green",
  Doing: "bg-secondary text-secondary-foreground",
  Operating: "bg-brand-green-soft text-brand-green",
  Building: "bg-secondary text-secondary-foreground",
  Planned: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status, className }: { status: string; className?: string | undefined }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        statusStyles[status] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      {status}
    </span>
  );
}

export function TransitionModel({ invert }: { invert?: boolean | undefined }) {
  return (
    <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {TRANSITION_MODEL.map((step, i) => (
        <li
          key={step.stage}
          className={cn(
            "rounded-xl border p-5",
            invert ? "border-primary-foreground/20 bg-primary-foreground/5" : "border-border bg-card card-elevated",
          )}
        >
          <span
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-full text-xs font-bold",
              invert ? "bg-brand-green text-brand-green-foreground" : "bg-brand-green-soft text-brand-green",
            )}
          >
            {i + 1}
          </span>
          <h3 className={cn("mt-3 text-sm font-semibold", invert && "text-primary-foreground")}>{step.stage}</h3>
          <p className={cn("mt-2 text-sm leading-relaxed", invert ? "text-primary-foreground/75" : "text-muted-foreground")}>
            {step.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function JourneyTimeline() {
  return (
    <ol className="mt-8 space-y-5 border-l border-border pl-5 sm:pl-7">
      {JOURNEY.map((item) => (
        <li key={item.period} className="relative">
          <span className="absolute -left-[26px] top-2 size-3 rounded-full bg-brand-green ring-4 ring-background sm:-left-[34px]" />
          <div className="rounded-xl border border-border bg-card p-5 card-elevated">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">{item.period}</p>
              <StatusBadge status={item.status} />
            </div>
            <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Disclaimer({ className }: { className?: string | undefined }) {
  return (
    <p className={cn("mt-8 rounded-lg border border-border bg-surface p-4 text-xs leading-relaxed text-muted-foreground", className)}>
      <strong className="font-semibold text-foreground">Disclaimer: </strong>
      {BRAND.disclaimer}
    </p>
  );
}

export function CtaBand({
  title = "Ready to solve an energy problem?",
  body = "Tell us your load, location and timeline. Every request gets a reference number and a response from our team.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <Section tone="brand">
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl">{title}</h2>
          <p className="mt-3 text-primary-foreground/80">{body}</p>
        </div>
        <Button asChild size="lg" className="bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">
          <Link to="/contact">
            {BRAND.primaryCta}
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}

export function PageHero({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow?: string | undefined;
  title: string;
  body?: string | undefined;
  children?: ReactNode | undefined;
}) {
  return (
    <section className="hero-surface px-4 py-14 sm:px-6 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <Breadcrumbs invert />
        {eyebrow ? <Eyebrow invert>{eyebrow}</Eyebrow> : null}
        <h1 className="mt-3 max-w-3xl text-3xl font-bold text-primary-foreground sm:text-4xl md:text-5xl">{title}</h1>
        {body ? <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/80">{body}</p> : null}
        {children}
      </div>
    </section>
  );
}

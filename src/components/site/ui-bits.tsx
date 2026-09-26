import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BRAND, JOURNEY, TRANSITION_MODEL } from "@/lib/site";

export function Section({
  children,
  className,
  tone = "default",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "surface" | "brand" | "green";
  id?: string;
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

export function Eyebrow({ children, invert }: { children: ReactNode; invert?: boolean }) {
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
  eyebrow?: string;
  title: string;
  body?: string;
  invert?: boolean;
  align?: "left" | "center";
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

export function StatusBadge({ status, className }: { status: string; className?: string }) {
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

export function TransitionModel({ invert }: { invert?: boolean }) {
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

export function Disclaimer({ className }: { className?: string }) {
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
  eyebrow?: string;
  title: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <section className="hero-surface px-4 py-14 sm:px-6 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        {eyebrow ? <Eyebrow invert>{eyebrow}</Eyebrow> : null}
        <h1 className="mt-3 max-w-3xl text-3xl font-bold text-primary-foreground sm:text-4xl md:text-5xl">{title}</h1>
        {body ? <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/80">{body}</p> : null}
        {children}
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Certification } from "@/lib/certifications";

export function CertificationCard({ c }: { c: Certification }) {
  return (
    <article className="flex flex-col rounded-2xl border border-brand-green/40 bg-card p-6 card-elevated">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2 py-1 font-mono text-xs font-bold text-primary-foreground">
          <BadgeCheck className="size-3.5" />
          {c.code}
        </span>
        <span className="rounded-full bg-brand-green-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-green">
          Waiting list open
        </span>
      </div>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-brand-green">Professional level</p>
      <h3 className="mt-1 text-lg font-semibold leading-snug">{c.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.purpose}</p>
      <p className="mt-3 text-xs text-muted-foreground">
        <strong className="text-foreground">Key competencies: </strong>
        {c.competencies.slice(0, 6).join(", ")}
        {c.competencies.length > 6 ? "…" : ""}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        <strong className="text-foreground">Contributing programmes: </strong>
        {c.modules.slice(0, 4).join(", ")}
        {c.modules.length > 4 ? "…" : ""}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {[
          ["Practical assessment", "Required"],
          ["Capstone", "Required"],
          ["Validity", "24 months"],
          ["Renewal", "Required"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-surface p-2">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs font-medium">Professional certification fee: to be confirmed</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild size="sm" className="min-h-11">
          <Link to="/training-certification/professional-certifications/$code" params={{ code: c.code.toLowerCase() }}>
            View certification
          </Link>
        </Button>
        <Button asChild size="sm" className="min-h-11 bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">
          <Link to="/training-certification/professional-certifications/waitlist" search={{ certification: c.code }}>
            Join waiting list
          </Link>
        </Button>
        <Button asChild size="sm" variant="ghost" className="min-h-11">
          <Link to="/sophia">Ask SOPHIA</Link>
        </Button>
      </div>
    </article>
  );
}

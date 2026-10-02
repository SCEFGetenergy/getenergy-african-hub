import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ACADEMY_CATEGORIES,
  PRICE_TIERS,
  PROGRAMMES,
  formatNaira,
  statusOf,
  type Programme,
} from "@/lib/academy";

export function AcademyLockup({ invert }: { invert?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3 text-xs", invert ? "text-primary-foreground" : "text-foreground")}>
      <span className="font-bold tracking-tight">GETENERGY.ng</span>
      <span aria-hidden className={cn("h-8 w-px", invert ? "bg-primary-foreground/30" : "bg-border")} />
      <span>
        <span className="block font-bold uppercase tracking-[0.16em]">GET Energy Academy</span>
        <span className={invert ? "text-primary-foreground/70" : "text-muted-foreground"}>
          Green Skills • Technical Certification • Career Development
        </span>
      </span>
    </div>
  );
}

export function ProgrammeCard({ p, large }: { p: Programme; large?: boolean }) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border border-border bg-card p-5 card-elevated",
        large && "border-brand-green/40 md:p-6",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-green">{p.category}</span>
        <span className="rounded-full bg-brand-green-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-green">
          {statusOf(p)}
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold leading-snug">{p.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
      {p.includes ? (
        <p className="mt-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Sequence: </strong>
          {p.includes.join(" → ")}
        </p>
      ) : null}
      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <div>
          <dt className="text-muted-foreground">Duration</dt>
          <dd className="flex items-center gap-1 font-medium">
            <Clock className="size-3.5" />
            {p.duration}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{p.kind === "pathway" ? "Proposed bundle fee" : "Proposed fee"}</dt>
          <dd className="font-semibold text-primary">{formatNaira(p.fee)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Delivery</dt>
          <dd className="font-medium">To be confirmed per cohort</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Certification</dt>
          <dd className="font-medium">Partner-dependent</dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap gap-2 pt-1">
        <Button asChild size="sm" className="min-h-11 bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">
          <Link to="/training-certification/waitlist" search={{ programme: p.slug }}>
            Join waiting list
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="min-h-11">
          <Link to="/training-certification/programmes/$slug" params={{ slug: p.slug }}>
            View programme
          </Link>
        </Button>
        <Button asChild size="sm" variant="ghost" className="min-h-11">
          <Link to="/sophia">Ask SOPHIA</Link>
        </Button>
      </div>
    </article>
  );
}

export function Catalogue() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [tier, setTier] = useState<number>(-1);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PROGRAMMES.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      const t = PRICE_TIERS[tier];
      if (t && (p.fee < t.min || p.fee > t.max)) return false;
      if (!term) return true;
      return [p.title, p.category, p.description, ...(p.includes ?? [])].join(" ").toLowerCase().includes(term);
    });
  }, [q, cat, tier]);

  return (
    <div id="programmes">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search: Solar, BESS, EV, CNG, HSE, Mini-Grid, Project Finance…"
          aria-label="Find your programme"
          className="h-12 pl-10"
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Programme categories">
        {["All", ...ACADEMY_CATEGORIES].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={cn(
              "min-h-9 rounded-full border px-3 text-xs font-medium transition-colors",
              cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-surface",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <label htmlFor="tier" className="text-muted-foreground">
          Proposed fee:
        </label>
        <select
          id="tier"
          value={tier}
          onChange={(e) => setTier(Number(e.target.value))}
          className="h-9 rounded-md border border-input bg-background px-2"
        >
          <option value={-1}>Any fee</option>
          {PRICE_TIERS.map((t, i) => (
            <option key={t.label} value={i}>
              {t.label}
            </option>
          ))}
        </select>
        <span className="ml-auto text-muted-foreground" aria-live="polite">
          {list.length} of {PROGRAMMES.length} offerings
        </span>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ProgrammeCard key={p.slug} p={p} large={p.kind === "pathway"} />
        ))}
      </div>
      {list.length === 0 ? (
        <p className="mt-6 rounded-lg border border-border bg-surface p-6 text-center text-sm text-muted-foreground">
          No programme matches yet. Try another word, or{" "}
          <Link to="/sophia" className="font-medium text-primary underline">
            ask SOPHIA
          </Link>{" "}
          to recommend one.
        </p>
      ) : null}
    </div>
  );
}

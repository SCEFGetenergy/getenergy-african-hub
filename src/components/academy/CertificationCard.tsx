import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, ClipboardCheck, Clock3, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Certification } from "@/lib/certifications";
import operationsImg from "@/assets/academy/audit.jpg";
import distributedImg from "@/assets/academy/minigrid.jpg";
import solarImg from "@/assets/academy/solar.jpg";
import smartImg from "@/assets/academy/bess.jpg";
import mobilityImg from "@/assets/academy/ev.jpg";
import projectImg from "@/assets/academy/hero.jpg";
import ventureImg from "@/assets/academy/greentech.jpg";
import productivityImg from "@/assets/academy/cng.jpg";
import safetyImg from "@/assets/academy/hse.jpg";
import teamImg from "@/assets/academy/team.jpg";

const portraits: Record<string, string> = {
  CEOWP: operationsImg,
  CDESP: distributedImg,
  CSBMP: solarImg,
  CSEMP: smartImg,
  CGMAP: mobilityImg,
  CEPCM: projectImg,
  CGEVB: ventureImg,
  CIPOEP: productivityImg,
  CEHRCP: safetyImg,
  CTTLS: teamImg,
};

export function CertificationCard({ c, compact = false }: { c: Certification; compact?: boolean }) {
  const title = c.name.replace(/^GETS Certified /, "");
  const detail = { to: "/training-certification/professional-certifications/$code" as const, params: { code: c.code.toLowerCase() } };

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-md border border-border bg-card text-card-foreground card-elevated transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none">
      <div className="relative h-36 overflow-hidden bg-surface-strong sm:h-40">
        <img src={portraits[c.code]} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" />
        <span className="absolute bottom-0 left-0 bg-brand-deep px-4 py-2 font-display text-xl font-black text-brand-foreground shadow-md">{c.code}</span>
        <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-brand-foreground/40 bg-brand-green text-brand-green-foreground" aria-hidden="true"><BadgeCheck className="size-5" /></span>
      </div>

      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5 sm:p-6"}`}>
        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-green">GETS professional certification</p>
        <h3 className={`mt-2 font-display font-bold leading-tight text-brand-deep ${compact ? "text-base" : "text-xl"}`}>{title}</h3>
        {!compact && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.purpose}</p>}

        <ul className={`mt-4 space-y-1.5 text-xs text-foreground ${compact ? "min-h-20" : ""}`} aria-label={`Key competencies for ${c.code}`}>
          {c.competencies.slice(0, compact ? 3 : 4).map((skill) => (
            <li key={skill} className="flex items-start gap-2"><span aria-hidden="true" className="mt-1 size-1.5 shrink-0 rounded-full bg-brand-green" />{skill}</li>
          ))}
        </ul>

        {!compact && (
          <div className="mt-5 space-y-3 border-t border-border pt-4 text-xs leading-relaxed">
            <p><strong className="text-brand-deep">Contributing courses</strong><br />{c.modules.slice(0, 3).join(" · ")}{c.modules.length > 3 ? " · more" : ""}</p>
            <p><strong className="text-brand-deep">Capstone</strong><br />{c.capstoneTitle}</p>
          </div>
        )}

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border py-3 text-[11px] font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1"><ClipboardCheck className="size-3.5 text-brand-green" /> Practical assessment & capstone</span>
            <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5 text-brand-green" /> 24-month validity · CPD renewal</span>
          </div>
          {!compact && <p className="mb-3 text-xs font-medium text-muted-foreground">Fee to be confirmed · Waiting list open</p>}
          <div className={`flex gap-2 ${compact ? "flex-col" : "flex-wrap"}`}>
            <Button asChild size="sm" className="min-h-11 flex-1 bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">
              <Link {...detail}>Explore certification <ArrowRight className="size-4" /></Link>
            </Button>
            {!compact && (
              <>
                <Button asChild size="sm" variant="outline" className="min-h-11 flex-1 border-brand-green text-brand-green">
                  <Link to="/training-certification/professional-certifications/waitlist" search={{ certification: c.code }}>Join waiting list</Link>
                </Button>
                <Button asChild size="sm" variant="ghost" className="min-h-11">
                  <Link to="/sophia">Ask SOPHIA <ExternalLink className="size-3.5" /></Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="h-1 bg-brand-green" aria-hidden="true" />
    </article>
  );
}
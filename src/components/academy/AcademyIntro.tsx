import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, MonitorPlay, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/ui-bits";
import { ACADEMY_CENTRE } from "@/lib/academy";
import trainingImage from "@/assets/academy/green-skills-training.png.asset.json";
import centreImage from "@/assets/academy/b16-centre.png.asset.json";

const greenButton = "min-h-12 bg-brand-green text-brand-green-foreground hover:bg-brand-green/90";

export function AcademyIntro() {
  return (
    <>
      <section aria-labelledby="academy-title" className="bg-background">
        <div className="relative overflow-hidden bg-surface">
          <img src={trainingImage.url} alt="GET Energy Academy concept: an instructor and learners in a green-skills classroom with solar, EV charging and multimedia equipment" width={1365} height={768} fetchPriority="high" className="mx-auto block max-h-[60svh] w-full object-contain" />
          <span className="absolute bottom-3 right-3 bg-background/95 px-3 py-2 text-xs font-semibold text-brand-deep sm:bottom-5 sm:right-6">{ACADEMY_CENTRE.imageStatus}</span>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <p className="text-sm font-bold uppercase text-brand-green">Green Skills · Technical Certification · Career Development</p>
          <h1 id="academy-title" className="mt-3 !text-4xl font-black !leading-tight text-brand-deep sm:!text-5xl">GET Energy Academy</h1>
          <p className="mt-4 text-lg font-semibold text-brand-deep">Build practical skills. Earn relevant certification. Advance your career.</p>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">GET Energy Academy is a commercial learning platform for practical energy skills, competency-based development and career growth across Nigeria’s evolving energy economy.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className={greenButton}><a href="#programmes">Explore training programmes <ArrowRight className="size-4" /></a></Button>
            <Button asChild size="lg" variant="outline" className="min-h-12 border-brand-deep text-brand-deep"><Link to="/training-certification/waitlist">Join waiting list</Link></Button>
            <Button asChild size="lg" variant="ghost" className="min-h-12 text-brand-deep"><Link to="/training-certification/corporate">Train your team</Link></Button>
          </div>
        </div>
      </section>
      <section aria-label="Green skills focus" className="border-y border-border bg-brand-deep text-brand-foreground">
        <ul className="mx-auto flex max-w-6xl flex-wrap gap-x-8 gap-y-3 px-4 py-5 sm:px-6">
          {ACADEMY_CENTRE.focus.map((focus) => <li key={focus} className="flex items-center gap-2 text-sm font-semibold"><Check className="size-4 shrink-0 text-brand-green-soft" />{focus}</li>)}
        </ul>
      </section>
    </>
  );
}

export function AcademyCentre() {
  const icons = [Sun, Laptop, MonitorPlay];
  return (
    <Section id="training-centre" tone="surface">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeading eyebrow="Our next learning environment" title={ACADEMY_CENTRE.name} body={ACADEMY_CENTRE.introduction} />
        <span className="border-l-4 border-brand-green bg-background px-4 py-2 text-sm font-semibold text-brand-deep">{ACADEMY_CENTRE.status}</span>
      </div>
      <figure className="mt-8">
        <img src={centreImage.url} alt="B16 Training Centre concept with green-skills teaching, a multimedia production zone and proposed education branding" loading="lazy" width={1365} height={768} className="block aspect-video w-full object-cover" />
        <figcaption className="border-b border-border py-4 text-sm leading-relaxed text-muted-foreground">{ACADEMY_CENTRE.disclaimer}</figcaption>
      </figure>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {ACADEMY_CENTRE.zones.map((zone, index) => {
          const Icon = icons[index] ?? Sun;
          return <article key={zone.title} className="border-t-2 border-brand-green pt-5"><Icon className="size-7 text-brand-green" /><h3 className="mt-3 text-xl font-bold text-brand-deep">{zone.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{zone.description}</p></article>;
        })}
      </div>
      <p className="mt-7 text-sm font-semibold text-brand-deep">Waiting-list registration remains open. No cohort dates are confirmed and no payment is taken yet.</p>
      <Button asChild variant="outline" className="mt-4 min-h-12"><Link to="/training-certification/corporate">Discuss training requirements <ArrowRight className="size-4" /></Link></Button>
    </Section>
  );
}
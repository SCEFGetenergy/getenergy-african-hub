import { Link } from "@tanstack/react-router";
import { ArrowRight, MonitorPlay, Sun, Laptop, Ruler, Users, CalendarDays, Wifi, Video, Mic, Radio, Scissors, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/ui-bits";
import { ACADEMY_CENTRE } from "@/lib/academy";
import trainingImage from "@/assets/academy/green-skills-training.png.asset.json";
import studioFallback from "@/assets/academy/team.jpg";
import solarImage from "@/assets/academy/solar.jpg";
import evImage from "@/assets/academy/ev.jpg";
import cngImage from "@/assets/academy/cng.jpg";
import { B16FloorPlan } from "./B16FloorPlan";

// Optional owner-supplied slots: absent slots retain the current imagery, never synthetic photos.
const renders = import.meta.glob<string>("/src/assets/academy/b16-{hall,studio,practical}.jpg", { eager: true, query: "?url", import: "default" });
const pointers = import.meta.glob<{ url: string }>("/src/assets/academy/b16-{hall,studio,practical}.jpg.asset.json", { eager: true, import: "default" });
function renderSlot(name: "hall" | "studio" | "practical", fallback: string) {
  const path = `/src/assets/academy/b16-${name}.jpg`;
  return pointers[`${path}.asset.json`]?.url ?? renders[path] ?? fallback;
}

const greenButton = "min-h-12 bg-brand-green text-brand-green-foreground hover:bg-brand-green/90";

export function AcademyIntro() {
  return (
    <>
      <section aria-labelledby="academy-title" className="bg-background">
        <div className="relative overflow-hidden bg-surface">
          <img src={renderSlot("hall", trainingImage.url)} alt="GET Academy proposed B16 classroom concept with an instructor, learners and green-skills training equipment" width={1365} height={768} fetchPriority="high" className="mx-auto block max-h-[60svh] w-full object-contain" />
          <span className="absolute bottom-3 right-3 bg-background/95 px-3 py-2 text-xs font-semibold text-brand-deep sm:bottom-5 sm:right-6">{ACADEMY_CENTRE.imageStatus}</span>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <h1 id="academy-title" className="!text-4xl font-black !leading-tight text-brand-deep sm:!text-5xl">GET Academy</h1>
          <p className="mt-3 text-sm font-bold text-brand-green sm:text-base">Green Skills | Technical Certification | Career Development</p>
          <a href="#b16" className="mt-4 inline-flex min-h-11 flex-wrap items-center gap-2 border-l-4 border-brand-green bg-surface px-3 py-2 text-sm font-semibold text-brand-deep">Venue: B16 Training Centre <span className="text-xs font-normal text-muted-foreground">— Proposed facility</span></a>
          <p className="mt-4 text-lg font-semibold text-brand-deep">Build practical skills. Earn relevant certification. Advance your career.</p>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">GET Energy Academy is a commercial learning platform for practical energy skills, competency-based development and career growth across Nigeria’s evolving energy economy.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className={greenButton}><a href="#programmes">Explore programmes <ArrowRight className="size-4" /></a></Button>
            <Button asChild size="lg" variant="outline" className="min-h-12 border-brand-deep text-brand-deep"><Link to="/training-certification/waitlist">Join waiting list</Link></Button>
            <Button asChild size="lg" variant="ghost" className="min-h-12 text-brand-deep"><Link to="/training-certification/corporate">Train your team</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}

export function AcademyCentre() {
  const { room, capacity, furniture } = ACADEMY_CENTRE;
  const specs = [
    { icon: Ruler, value: `Room ${room.widthMetres.toFixed(2)} m × ${room.depthMetres.toFixed(2)} m` },
    { icon: Ruler, value: `Floor area ${room.areaSquareMetres} m² (≈ ${room.approximateSquareFeet} ft²)` },
    { icon: Users, value: `Up to ${capacity.learnersPerSession} learners per session (plus instructor)` },
    { icon: CalendarDays, value: `Two sessions a day (up to ${capacity.learnersPerSession * capacity.sessionsPerDay} learners)` },
    { icon: MonitorPlay, value: ACADEMY_CENTRE.equipment[0] },
    { icon: Wifi, value: ACADEMY_CENTRE.equipment[1] },
  ];
  const productionIcons = [Video, Mic, Radio, Scissors, Smartphone, Laptop];
  const practicalImages = [solarImage, evImage, cngImage];
  return (
    <>
    <Section id="b16" tone="surface" className="scroll-mt-24">
      <span id="training-centre" className="scroll-mt-24" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeading eyebrow="Our training venue" title={ACADEMY_CENTRE.name} body={ACADEMY_CENTRE.introduction} />
        <span className="border-l-4 border-brand-green bg-background px-4 py-2 text-sm font-semibold text-brand-deep">{ACADEMY_CENTRE.status}</span>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {specs.map(({ icon: Icon, value }) => <article key={value} className="flex items-start gap-3 border border-border bg-background p-5"><Icon aria-hidden="true" className="size-6 shrink-0 text-brand-green" /><p className="text-sm font-semibold leading-relaxed text-brand-deep">{value}</p></article>)}
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <h3 className="text-2xl font-bold text-brand-deep">Furniture</h3>
          <ul className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <li>{furniture.studentTables} two-seater student tables ({furniture.tableWidthMetres.toFixed(2)} × {furniture.tableDepthMinMetres.toFixed(2)}–{furniture.tableDepthMaxMetres.toFixed(2)} × {furniture.tableHeightMetres.toFixed(2)} m)</li>
            <li>{furniture.studentChairs} ergonomic mesh chairs</li>
            <li>{furniture.instructorTables} instructor/presenter table with laptop, mic and control access</li>
            <li>{furniture.multimediaDesks} multimedia production desk</li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">{ACADEMY_CENTRE.disclaimer}</p>
        </div>
        <figure><B16FloorPlan /><figcaption className="mt-2 text-center text-xs text-muted-foreground">Room proportions to scale; interior zones are schematic.</figcaption></figure>
      </div>
      <p className="mt-8 border-t border-border pt-5 text-sm text-muted-foreground">{ACADEMY_CENTRE.caption}</p>
      <p className="mt-7 text-sm font-semibold text-brand-deep">Waiting-list registration remains open. No cohort dates are confirmed and no payment is taken yet.</p>
      <Button asChild variant="outline" className="mt-4 min-h-12"><Link to="/training-certification/corporate">Discuss training requirements <ArrowRight className="size-4" /></Link></Button>
    </Section>
    <Section>
      <SectionHeading eyebrow="Shared learning & media" title="Multimedia & Production Zone (in-room)" body="The planned zone supports recorded lessons, livestreamed classes and webinars for both academies." />
      <figure className="mt-8">
        <img src={renderSlot("studio", studioFallback)} alt="Existing Academy training image used while the B16 in-room multimedia studio render is being confirmed" loading="lazy" width={1024} height={768} className="max-h-96 w-full object-cover" />
        <figcaption className="mt-3 text-xs text-muted-foreground">Illustrative image — proposed production zone.</figcaption>
      </figure>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACADEMY_CENTRE.production.map((title, index) => {
          const Icon = productionIcons[index] ?? Video;
          return <article key={title} className="flex items-center gap-3 border border-border bg-surface p-5"><Icon aria-hidden="true" className="size-6 shrink-0 text-brand-green" /><h3 className="text-base font-semibold text-brand-deep">{title}</h3></article>;
        })}
      </div>
    </Section>
    <Section tone="surface">
      <SectionHeading eyebrow="Planned facilities" title="Practical training areas" />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {ACADEMY_CENTRE.practicalAreas.map((area, index) => <article key={area.slug} className="flex flex-col overflow-hidden rounded-lg border border-border bg-background">
          <img src={renderSlot("practical", practicalImages[index] ?? solarImage)} alt={`Illustrative concept for the planned ${area.title}`} loading="lazy" width={1024} height={768} className="aspect-[4/3] w-full object-cover" />
          <div className="flex flex-1 flex-col p-5"><span className="text-xs font-bold uppercase text-brand-green">{area.status}</span><h3 className="mt-2 text-xl font-bold text-brand-deep">{area.title}</h3><Button asChild variant="outline" className="mt-5 min-h-11"><Link to="/training-certification/programmes/$slug" params={{ slug: area.slug }}>View programme <ArrowRight className="size-4" /></Link></Button></div>
        </article>)}
      </div>
    </Section>
    <Section>
      <div className="flex flex-wrap items-center justify-between gap-6"><SectionHeading eyebrow="Proposed venue roles" title="Who runs B16" /><img src="/images/getenergylogo.svg" alt="GETENERGY.ng" loading="lazy" width={160} height={60} className="h-14 w-40 object-contain" /></div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ACADEMY_CENTRE.operators.map((operator) => <article key={operator.name} className="border-t-4 border-brand-green pt-5"><h3 className="text-lg font-bold text-brand-deep">{operator.name}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{operator.role}</p></article>)}
      </div>
    </Section>
    </>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/ui-bits";

export const Route = createFileRoute("/policies/gender-diversity-inclusion")({
  head: () => ({
    meta: [
      { title: "Gender Diversity & Inclusion Policy | GetEnergy" },
      { name: "description", content: "GET Energy Trading Services Ltd's Gender Diversity & Inclusion Policy: equal opportunity, training access, non-discrimination, support for women in technical roles and annual review." },
      { property: "og:title", content: "Gender Diversity & Inclusion Policy | GetEnergy" },
      { property: "og:description", content: "Our commitment to a diverse, equitable and inclusive workplace." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PolicyPage,
});

function PolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Company policy"
        title="Gender Diversity & Inclusion Policy"
        body="Get Energy Trading Services Ltd (RC 6929126) · Effective September 2026 · Reviewed annually"
      />
      <Section>
        <article className="mx-auto max-w-3xl space-y-6 text-foreground [&_h2]:text-xl [&_h2]:font-bold [&_li]:mt-2 [&_ul]:list-disc [&_ul]:pl-6">
          <div className="flex flex-wrap gap-3 print:hidden">
            <button type="button" onClick={() => window.print()} className="min-h-11 rounded-lg bg-primary px-5 font-semibold text-primary-foreground">
              Print or save as PDF
            </button>
          </div>
          <h2>1. Purpose</h2>
          <p>Get Energy Trading Services Ltd is committed to building a diverse, equitable and inclusive workplace, and to ensuring that gender balance is reflected across recruitment, staff development, and participation in company training and capacity-building initiatives, including those supported by external partners and funders.</p>
          <h2>2. Current workforce composition</h2>
          <p>As of September 2026, Get Energy employs 15 staff members: 9 male (60%) and 6 female (40%), spanning management, engineering and technical roles. The company recognizes the value of continuing to grow female representation, particularly in technical and engineering positions, as the business scales its clean energy service line.</p>
          <h2>3. Commitments</h2>
          <ul>
            <li><b>Equal opportunity:</b> Recruitment, promotion, and compensation decisions are made solely on merit, qualifications, and performance, without regard to gender.</li>
            <li><b>Training access:</b> Company-sponsored training and capacity-building opportunities, including technical certifications, will be allocated with the aim of maintaining or improving the company's existing gender balance, targeting proportional representation of male and female staff in each training cohort wherever technically and operationally feasible.</li>
            <li><b>Non-discrimination:</b> Get Energy maintains a zero-tolerance approach to gender-based discrimination or harassment in the workplace.</li>
            <li><b>Technical roles:</b> The company actively encourages and supports female staff and applicants in engineering and technical career tracks, recognizing this segment's historically lower female representation across the Nigerian energy sector.</li>
            <li><b>Reporting:</b> Gender-disaggregated data on staffing, training participation, and career progression will be maintained and made available to partners and funders, including CICSA, upon request.</li>
          </ul>
          <h2>4. Application to current capacity-building programme</h2>
          <p>For the NAPTIN-delivered renewable energy training programme (20 days, 22 participants) supported under this CICSA application, the confirmed participant cohort is 12 male and 10 female (45.5% female) — exceeding the company's overall staff gender ratio (9M/6F, 40% female) and reflecting Get Energy's commitment to strong female representation in technical and engineering capacity-building.</p>
          <h2>5. Review</h2>
          <p>This policy will be reviewed annually by company management, or sooner if required by a partner or funding requirement, to ensure it remains current and effective.</p>
          <p className="border-t pt-4 text-sm text-muted-foreground">Approved by: Babashola Santos Aderibigbe, Co-founder</p>
        </article>
      </Section>
    </>
  );
}

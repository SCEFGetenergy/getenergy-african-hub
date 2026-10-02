import { createFileRoute } from "@tanstack/react-router";
import { PortalShell, Panel, useAcademyProfile, portalHead, useMyAcademy } from "@/components/academy/portal";

export const Route = createFileRoute("/_authenticated/academy/skills-passport")({
  head: () => portalHead("Skills Passport", "Your GET Energy Academy Skills Passport of verified training and competencies."),
  component: Passport,
});

function Passport() {
  const { data } = useAcademyProfile();
  const p = data?.profile;
  return (
    <PortalShell title="Skills Passport" intro="A single record of the programmes you complete, competencies assessed and credentials earned with GET Energy Academy.">
      <Panel>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-muted-foreground">Holder</dt><dd className="font-semibold">{p ? `${p.first_name} ${p.middle_name ?? ""} ${p.last_name}`.replace(/\s+/g, " ") : "—"}</dd></div>
          <div><dt className="text-muted-foreground">Student ID</dt><dd className="font-mono font-semibold">{p?.student_id ?? "—"}</dd></div>
          <div><dt className="text-muted-foreground">Programmes completed</dt><dd>0</dd></div>
          <div><dt className="text-muted-foreground">Competencies assessed</dt><dd>0</dd></div>
        </dl>
        <p className="mt-4 text-sm text-muted-foreground">Nothing has been recorded yet. Entries are added by the Academy only after you complete a programme or pass an assessment — they are never self-reported.</p>
      </Panel>
    </PortalShell>
  );
}

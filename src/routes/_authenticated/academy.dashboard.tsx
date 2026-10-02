import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PortalShell, Panel, Pill, useAcademyProfile, completion, portalHead, WALLET_NOTICE, useMyAcademy } from "@/components/academy/portal";

export const Route = createFileRoute("/_authenticated/academy/dashboard")({
  head: () => portalHead("Student dashboard", "Your GET Energy Academy applications, documents, payments and certification status."),
  component: Dashboard,
});

function Dashboard() {
  const prof = useAcademyProfile();
  const mine = useMyAcademy();
  const pct = completion(prof.data?.profile);
  const apps = mine.data?.apps ?? [];
  const hasCv = (mine.data?.docs ?? []).some((d) => d.doc_type === "CV");
  const stats = [
    ["Applications", apps.length],
    ["In review / progress", apps.filter((a) => ["in_review", "contacted", "in_progress"].includes(a.status)).length],
    ["Documents", mine.data?.docs.length ?? 0],
    ["Payment requests", mine.data?.pays.length ?? 0],
    ["Certifications awarded", 0],
    ["CPD hours", 0],
  ] as const;
  return (
    <PortalShell title={`Welcome${prof.data ? `, ${prof.data.profile.first_name}` : ""}`} intro="Your Academy summary. Statuses update here when the Academy team reviews your applications.">
      {prof.error ? <p className="text-sm text-destructive">Could not load your profile. Please refresh.</p> : null}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {stats.map(([l, v]) => <div key={l} className="rounded-xl border border-border bg-card p-4"><div className="text-2xl font-bold">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>)}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Next steps">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between gap-2"><span>Profile {pct}% complete</span>{pct < 100 ? <Button asChild size="sm" className="min-h-11"><Link to="/academy/profile">Complete profile</Link></Button> : <Pill status="approved" />}</li>
            <li className="flex items-center justify-between gap-2"><span>CV uploaded</span>{hasCv ? <Pill status="approved" /> : <Button asChild size="sm" className="min-h-11"><Link to="/academy/documents">Upload CV</Link></Button>}</li>
            <li className="flex items-center justify-between gap-2"><span>Apply for a programme or certification</span><Button asChild size="sm" variant="outline" className="min-h-11"><Link to="/academy/programmes">Apply</Link></Button></li>
          </ul>
        </Panel>
        <Panel title="Recent applications">
          {!apps.length ? <p className="text-sm text-muted-foreground">No applications yet.</p> : (
            <ul className="divide-y divide-border text-sm">{apps.slice(0, 4).map((a) => <li key={a.id} className="flex items-center justify-between gap-2 py-2"><span><span className="font-mono text-xs">{a.reference}</span><br />{a.service_name}</span><Pill status={a.status} /></li>)}</ul>
          )}
        </Panel>
        <Panel title="GFA Wzip Wallet" className="lg:col-span-2"><p className="text-sm text-muted-foreground">{WALLET_NOTICE}</p><Button asChild variant="outline" size="sm" className="mt-3 min-h-11"><Link to="/academy/payments">View payments</Link></Button></Panel>
      </div>
    </PortalShell>
  );
}

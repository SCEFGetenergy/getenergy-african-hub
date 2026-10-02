import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PortalShell, Panel, Pill, portalHead, useMyAcademy } from "@/components/academy/portal";
import { CERTIFICATIONS, CERT_VALIDITY_MONTHS } from "@/lib/certifications";


export const Route = createFileRoute("/_authenticated/academy/certifications")({
  head: () => portalHead("My certifications", "Your GET Energy professional certification applications and credentials."),
  component: Certs,
});

function Certs() {
  const { data } = useMyAcademy();
  const mine = (data?.apps ?? []).filter((a) => a.request_type === "academy-certification");
  return (
    <PortalShell title="My certifications" intro={`GETS professional certifications are valid for ${CERT_VALIDITY_MONTHS} months after award and renew through CPD.`}>
      <Panel title="Awarded credentials"><p className="text-sm text-muted-foreground">No credentials awarded yet. Credentials appear here, with a verification ID, only after you pass the final assessment.</p></Panel>
      <Panel title="My certification applications" className="mt-4">
        {!mine.length ? <p className="text-sm text-muted-foreground">You haven't applied for a certification.</p> : (
          <ul className="divide-y divide-border text-sm">{mine.map((a) => <li key={a.id} className="flex items-center justify-between gap-2 py-3"><span><span className="font-mono text-xs">{a.reference}</span><br />{a.service_name}</span><Pill status={a.status} /></li>)}</ul>
        )}
      </Panel>
      <Panel title="Available certifications" className="mt-4">
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {CERTIFICATIONS.map((c) => <li key={c.code} className="flex items-center justify-between gap-2 rounded-lg border border-border p-2"><span><span className="font-mono text-xs font-bold">{c.code}</span> {c.name}</span><Button asChild size="sm" variant="outline" className="min-h-11 shrink-0"><Link to="/academy/programmes" search={{ item: c.code }}>Apply</Link></Button></li>)}
        </ul>
      </Panel>
    </PortalShell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PortalShell, Panel, Pill, portalHead, useMyAcademy } from "@/components/academy/portal";


export const Route = createFileRoute("/_authenticated/academy/applications")({
  head: () => portalHead("My applications", "Track your GET Energy Academy applications and waiting-list entries."),
  component: Apps,
});

const KIND: Record<string, string> = { "academy-application": "Programme application", "academy-certification": "Certification", "academy-waitlist": "Waiting list", "academy-corporate": "Corporate training", "academy-support": "Support request" };

function Apps() {
  const { data, isLoading } = useMyAcademy();
  const apps = data?.apps ?? [];
  return (
    <PortalShell title="My applications" intro="Applications, waiting-list entries and support requests made while signed in.">
      <Panel>
        {isLoading ? <p className="text-sm">Loading…</p> : !apps.length ? (
          <div className="text-sm"><p className="text-muted-foreground">Nothing yet.</p><Button asChild className="mt-3 min-h-11"><Link to="/academy/programmes">Apply for a programme</Link></Button></div>
        ) : (
          <ul className="divide-y divide-border text-sm">
            {apps.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <span><span className="font-mono text-xs">{a.reference}</span> · <span className="text-muted-foreground">{KIND[a.request_type] ?? a.request_type}</span><br /><strong>{a.service_name}</strong><br /><span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span></span>
                <Pill status={a.status} />
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </PortalShell>
  );
}

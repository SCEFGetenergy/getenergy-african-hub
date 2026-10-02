import { createFileRoute } from "@tanstack/react-router";
import { PortalShell, Panel, portalHead } from "@/components/academy/portal";
import { RENEWAL_REQUIREMENTS } from "@/lib/certifications";

export const Route = createFileRoute("/_authenticated/academy/cpd")({
  head: () => portalHead("CPD dashboard", "Track continuing professional development hours toward GETS certification renewal."),
  component: Cpd,
});

function Cpd() {
  return (
    <PortalShell title="CPD dashboard" intro="Certification holders need 40 CPD hours within 24 months to renew.">
      <Panel>
        <div className="flex items-end gap-2"><span className="text-3xl font-bold">0</span><span className="pb-1 text-sm text-muted-foreground">of 40 hours</span></div>
        <div className="mt-2 h-2 rounded-full bg-muted"><div className="h-2 w-0 rounded-full bg-primary" /></div>
        <p className="mt-3 text-sm text-muted-foreground">CPD tracking starts once you hold an awarded GETS certification.</p>
      </Panel>
      <Panel title="Renewal requirements" className="mt-4"><ul className="list-disc space-y-1 pl-5 text-sm">{RENEWAL_REQUIREMENTS.map((r) => <li key={r}>{r}</li>)}</ul></Panel>
    </PortalShell>
  );
}

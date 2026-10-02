import { createFileRoute } from "@tanstack/react-router";
import { PortalShell, Panel, Pill, portalHead, WALLET_NOTICE } from "@/components/academy/portal";
import { formatNaira } from "@/lib/academy";
import { useMyAcademy } from "./academy.dashboard";

export const Route = createFileRoute("/_authenticated/academy/payments")({
  head: () => portalHead("Payments & GFA Wzip Wallet", "Your Academy payment requests and GFA Wzip Wallet status."),
  component: Payments,
});

function Payments() {
  const { data } = useMyAcademy();
  const pays = data?.pays ?? [];
  return (
    <PortalShell title="Payments & GFA Wzip Wallet">
      <Panel title="GFA Wzip Wallet — integration pending configuration">
        <p className="text-sm text-muted-foreground">{WALLET_NOTICE}</p>
        <p className="mt-2 text-sm text-muted-foreground">When the wallet is connected you will be able to pay training fees, certification fees, assessment and renewal fees, including approved instalments, and download receipts here.</p>
      </Panel>
      <Panel title="My payment requests" className="mt-4">
        {!pays.length ? <p className="text-sm text-muted-foreground">No payment requests yet. You can save one after submitting an application.</p> : (
          <ul className="divide-y divide-border text-sm">
            {pays.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <span><strong>{p.purpose}</strong><br /><span className="text-xs text-muted-foreground">ID {p.id.slice(0, 8).toUpperCase()} · Application {p.application_reference ?? "—"} · {p.amount_ngn ? `Proposed ${formatNaira(p.amount_ngn)}` : "Amount to be confirmed"}</span></span>
                <Pill status={p.status} />
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted-foreground">Receipts are issued only for payments confirmed by the wallet. No receipt is shown for unpaid requests.</p>
      </Panel>
    </PortalShell>
  );
}

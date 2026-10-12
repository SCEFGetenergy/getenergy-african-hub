import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminOrderAction, adminTokenSales } from "@/lib/electricity.functions";
import { ORDER_STATUSES } from "@/lib/electricity/rules";

const lagosToday = () => new Date(Date.now() + 3600000).toISOString().slice(0, 10);

export function TokenSales() {
  const qc = useQueryClient();
  const [day, setDay] = useState(lagosToday());
  const [status, setStatus] = useState("");
  const load = useServerFn(adminTokenSales);
  const act = useServerFn(adminOrderAction);
  const { data, isLoading, error } = useQuery({ queryKey: ["token-sales", day], queryFn: () => load({ data: { day } }) });
  const discos = useQuery({
    queryKey: ["disco-live"],
    queryFn: async () => (await supabase.from("electricity_disco_live").select("*").order("label")).data ?? [],
  });
  const action = useMutation({
    mutationFn: (p: { orderId: string; action: "requery" | "refund" | "confirm" }) => act({ data: p }),
    onSuccess: (r) => { toast.success(`Order is now ${r.status}`); qc.invalidateQueries({ queryKey: ["token-sales"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const toggle = useMutation({
    mutationFn: async (p: { service_id: string; confirmed_live: boolean }) => {
      const { error } = await supabase.from("electricity_disco_live").update({ confirmed_live: p.confirmed_live, updated_at: new Date().toISOString() }).eq("service_id", p.service_id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["disco-live"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const orders = (data?.orders ?? []).filter((o) => !status || o.status === status);
  const flagged = (data?.recon ?? []).filter((r) => r.flags.length);

  return (
    <section className="space-y-10">
      <div>
        <h2 className="text-xl font-bold">Token sales</h2>
        {error ? <p className="mt-2 text-sm text-destructive">{(error as Error).message}</p> : null}
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          <Stat label="Live purchase" value={data ? (data.live ? "ON" : "OFF") : "…"} />
          <Stat label="VTpass" value={data?.vtpassMode ?? "…"} />
          <Stat label="Payment gateway" value={data?.gateway ?? "…"} />
          <Stat label="VTpass wallet" value={data?.balance == null ? "Unavailable" : `₦${data.balance.toLocaleString("en-NG")}`} warn={data?.lowBalance} />
        </div>
        {data?.lowBalance ? <p className="mt-2 text-sm font-semibold text-destructive">Low VTpass wallet balance — top up soon. Purchases above the balance are turned off automatically.</p> : null}
      </div>

      <div>
        <h3 className="font-bold">DISCOs available for "Buy a token"</h3>
        <p className="text-xs text-muted-foreground">Switch on only after verify and pay both pass in live testing. Others show "Request a token".</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {(discos.data ?? []).map((d) => (
            <label key={d.service_id} className="flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-sm">
              <input type="checkbox" checked={d.confirmed_live} onChange={(e) => toggle.mutate({ service_id: d.service_id, confirmed_live: e.target.checked })} />
              {d.label} <span className="text-xs text-muted-foreground">({d.service_id})</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold">Admin alerts</h3>
        <ul className="mt-2 space-y-1 text-sm">
          {(data?.alerts ?? []).slice(0, 15).map((a) => <li key={a.id}>{new Date(a.created_at).toLocaleString()} · {a.event.replace("admin_alert_", "").replace(/_/g, " ")}</li>)}
          {data && !data.alerts.length ? <li className="text-muted-foreground">No alerts.</li> : null}
        </ul>
      </div>

      <div>
        <div className="flex flex-wrap items-end gap-2">
          <h3 className="mr-auto font-bold">Daily reconciliation (Lagos day)</h3>
          <Input type="date" aria-label="Day" value={day} onChange={(e) => setDay(e.target.value)} className="h-11 w-44" />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Compares gateway payments, VTpass results and our orders. {flagged.length} mismatch(es); {data?.orphanPayments.length ?? 0} gateway payment(s) with no order.</p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-surface text-xs text-muted-foreground"><tr><th className="p-2">Order</th><th className="p-2">Our status</th><th className="p-2">Amount</th><th className="p-2">Gateway paid</th><th className="p-2">VTpass</th><th className="p-2">Refund</th><th className="p-2">Flags</th></tr></thead>
            <tbody className="divide-y divide-border">
              {(data?.recon ?? []).map((r) => (
                <tr key={r.id} className={r.flags.length ? "bg-destructive/10" : ""}>
                  <td className="p-2 font-mono text-xs">{r.ref}</td><td className="p-2">{r.status}</td><td className="p-2">₦{r.amount.toLocaleString("en-NG")}</td>
                  <td className="p-2">{r.gatewayPaid == null ? "—" : `₦${r.gatewayPaid.toLocaleString("en-NG")}`}</td><td className="p-2">{r.vtpassStatus ?? "—"}</td><td className="p-2">{r.refund ?? "—"}</td>
                  <td className="p-2 font-semibold">{r.flags.join(", ") || "OK"}</td>
                </tr>
              ))}
              {data && !data.recon.length ? <tr><td colSpan={7} className="p-2 text-muted-foreground">No orders this day.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-end gap-2">
          <h3 className="mr-auto font-bold">Orders</h3>
          <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 rounded-md border border-input bg-background px-2 text-sm">
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-surface text-xs text-muted-foreground"><tr><th className="p-2">Order</th><th className="p-2">Customer</th><th className="p-2">Meter</th><th className="p-2">Amount</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead>
            <tbody className="divide-y divide-border">
              {isLoading ? <tr><td colSpan={6} className="p-2">Loading…</td></tr> : null}
              {orders.map((o) => (
                <tr key={o.id} className="align-top">
                  <td className="p-2 font-mono text-xs">{o.order_reference}<div className="text-muted-foreground">{new Date(o.created_at).toLocaleString()}</div><div className="text-muted-foreground">req {o.request_id}</div></td>
                  <td className="p-2">{o.customer_name}<div className="text-xs text-muted-foreground">{o.email} · {o.phone}</div></td>
                  <td className="p-2">{o.meter_number}<div className="text-xs text-muted-foreground">{o.meter_type} · {o.disco_label}</div></td>
                  <td className="p-2">₦{o.amount_ngn.toLocaleString("en-NG")}</td>
                  <td className="p-2">{o.status}{o.vtpass_code ? <div className="text-xs text-muted-foreground">VTpass {o.vtpass_code}</div> : null}{o.last_error ? <div className="text-xs text-destructive">{o.last_error}</div> : null}</td>
                  <td className="p-2"><div className="flex flex-wrap gap-1">
                    {o.status === "awaiting_payment" ? <Button size="sm" variant="outline" className="min-h-11" onClick={() => action.mutate({ orderId: o.id, action: "confirm" })}>Check payment</Button> : null}
                    {o.vend_attempted_at && o.status !== "refunded" ? <Button size="sm" variant="outline" className="min-h-11" onClick={() => action.mutate({ orderId: o.id, action: "requery" })}>Requery</Button> : null}
                    {o.paid_at && !["delivered", "refunded"].includes(o.status) ? <Button size="sm" variant="outline" className="min-h-11" onClick={() => { if (confirm("Refund this order to the customer?")) action.mutate({ orderId: o.id, action: "refund" }); }}>Refund</Button> : null}
                  </div></td>
                </tr>
              ))}
              {data && !orders.length ? <tr><td colSpan={6} className="p-2 text-muted-foreground">No orders.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean | undefined }) {
  return (
    <div className={`rounded-xl border p-3 ${warn ? "border-destructive" : "border-border"}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}

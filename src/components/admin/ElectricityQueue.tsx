import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ELEC_STATUSES = ["New", "Contacted", "In Review", "Pending Partner Integration", "Waiting for Customer", "Closed", "Converted to Customer"] as const;

const COLS = ["request_reference", "created_at", "status", "full_name", "phone", "email", "preferred_contact_method", "disco", "meter_type", "meter_number", "amount_ngn", "state", "city_lga", "admin_notes"] as const;

export function toCsv(rows: Record<string, unknown>[]) {
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s; // block spreadsheet formulas
    return `"${safe.replace(/"/g, '""')}"`;
  };
  return [COLS.join(","), ...rows.map((r) => COLS.map((c) => esc(r[c])).join(","))].join("\n");
}

type Row = { id: string; request_reference: string; created_at: string; status: string; full_name: string; phone: string; email: string; preferred_contact_method: string; disco: string; meter_type: string; meter_number: string; amount_ngn: number; state: string; city_lga: string; admin_notes: string | null };

export function ElectricityQueue() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-elec", status],
    queryFn: async () => {
      let qy = supabase.from("electricity_token_requests").select("*").order("created_at", { ascending: false }).limit(500);
      if (status) qy = qy.eq("status", status);
      const { data, error } = await qy;
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });
  const save = useMutation({
    mutationFn: async (p: { id: string; status?: string; admin_notes?: string }) => {
      const { id, ...rest } = p;
      const { error } = await supabase.from("electricity_token_requests").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Enquiry updated"); qc.invalidateQueries({ queryKey: ["admin-elec"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const term = q.trim().toLowerCase();
  const rows = (data ?? []).filter((r) => !term || `${r.request_reference} ${r.full_name} ${r.phone} ${r.email} ${r.meter_number}`.toLowerCase().includes(term));
  const exportCsv = () => {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `getelec-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <section>
      <h2 className="text-xl font-bold">Electricity token enquiries (GETELEC)</h2>
      <p className="mt-1 text-xs text-muted-foreground">Enquiries only — no payment has been taken and no token issued. Status and note changes are recorded in the audit log.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Input aria-label="Search enquiries" placeholder="Reference, name, phone, meter" value={q} onChange={(e) => setQ(e.target.value)} className="h-11 max-w-xs" />
        <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 rounded-md border border-input bg-background px-2 text-sm">
          <option value="">All statuses</option>
          {ELEC_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <Button variant="outline" className="min-h-11" onClick={exportCsv} disabled={!rows.length}>Export CSV ({rows.length})</Button>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-surface text-xs text-muted-foreground"><tr><th className="p-3">Reference</th><th className="p-3">Customer</th><th className="p-3">Meter</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">Internal note</th></tr></thead>
          <tbody className="divide-y divide-border">
            {isLoading ? <tr><td colSpan={6} className="p-3">Loading…</td></tr> : null}
            {!isLoading && !rows.length ? <tr><td colSpan={6} className="p-3 text-muted-foreground">No enquiries match.</td></tr> : null}
            {rows.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="p-3 font-mono text-xs">{r.request_reference}<div className="text-muted-foreground">{new Date(r.created_at).toLocaleString()}</div></td>
                <td className="p-3">{r.full_name}<div className="text-xs text-muted-foreground">{r.phone} · {r.email}<br />Prefers {r.preferred_contact_method} · {r.city_lga}, {r.state}</div></td>
                <td className="p-3">{r.meter_number}<div className="text-xs text-muted-foreground">{r.meter_type} · {r.disco}</div></td>
                <td className="p-3">₦{r.amount_ngn.toLocaleString("en-NG")}</td>
                <td className="p-3">
                  <select aria-label={`Status for ${r.request_reference}`} value={r.status} onChange={(e) => save.mutate({ id: r.id, status: e.target.value })} className="h-11 rounded-md border border-input bg-background px-2 text-sm">
                    {ELEC_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3"><NoteEditor initial={r.admin_notes ?? ""} onSave={(n) => save.mutate({ id: r.id, admin_notes: n })} /><EnquiryTimeline reference={r.request_reference} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function NoteEditor({ initial, onSave }: { initial: string; onSave: (n: string) => void }) {
  const [v, setV] = useState(initial);
  return (
    <div className="flex flex-col gap-2">
      <textarea aria-label="Internal note" value={v} maxLength={2000} onChange={(e) => setV(e.target.value)} rows={2} className="w-56 rounded-md border border-input bg-background p-2 text-sm" />
      <Button size="sm" variant="outline" className="min-h-11 self-start" disabled={v === initial} onClick={() => onSave(v.trim())}>Save note</Button>
    </div>
  );
}

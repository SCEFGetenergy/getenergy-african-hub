import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const SERVICE_STATUS_LABEL: Record<string, string> = {
  live: "Live",
  launching_soon: "Launching soon",
  enquiry_only: "Enquiries only",
  paused: "Paused",
};

const REQ_STATUSES = ["submitted", "in_review", "contacted", "in_progress", "closed"] as const;
const REQ_LABEL: Record<string, string> = { submitted: "Submitted", in_review: "In review", contacted: "Contacted", in_progress: "In progress", closed: "Closed" };
const sel = "h-11 rounded-md border border-input bg-background px-2 text-sm";

export function Overview() {
  const { data } = useQuery({
    queryKey: ["cc-overview"],
    queryFn: async () => {
      const count = async (q: PromiseLike<{ count: number | null }>) => (await q).count ?? 0;
      const base = () => supabase.from("service_requests").select("id", { count: "exact", head: true }).is("deleted_at", null).eq("is_test", false);
      const [all, open, elec, tickets] = await Promise.all([
        count(base()),
        count(base().neq("status", "closed")),
        count(supabase.from("electricity_token_requests").select("id", { count: "exact", head: true }).eq("status", "New")),
        count(supabase.from("electricity_support_tickets").select("id", { count: "exact", head: true }).neq("status", "Closed")),
      ]);
      return { all, open, elec, tickets };
    },
  });
  const cards = [
    ["All enquiries", data?.all],
    ["Open enquiries", data?.open],
    ["New electricity requests", data?.elec],
    ["Open support tickets", data?.tickets],
  ] as const;
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map(([l, v]) => (
        <div key={l} className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">{l}</div>
          <div className="mt-1 text-2xl font-bold">{v ?? "–"}</div>
        </div>
      ))}
    </div>
  );
}

export function RequestsInbox() {
  const qc = useQueryClient();
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("open");
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["cc-requests", type, status, q],
    queryFn: async () => {
      let r = supabase
        .from("service_requests")
        .select("id, reference, request_type, service_name, contact_name, contact_email, contact_phone, location, status, created_at")
        .is("deleted_at", null)
        .eq("is_test", false);
      if (type !== "all") r = r.eq("request_type", type);
      if (status === "open") r = r.neq("status", "closed");
      else if (status !== "all") r = r.eq("status", status);
      const s = q.trim().replace(/[,()%]/g, "");
      if (s) r = r.or(`reference.ilike.%${s}%,contact_name.ilike.%${s}%,contact_email.ilike.%${s}%`);
      return (await r.order("created_at", { ascending: false }).limit(200)).data ?? [];
    },
  });
  const types = useQuery({
    queryKey: ["cc-types"],
    queryFn: async () => {
      const { data } = await supabase.from("service_requests").select("request_type").is("deleted_at", null).limit(1000);
      return [...new Set((data ?? []).map((d) => d.request_type))].sort();
    },
  });
  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("service_requests").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["cc-requests"] }); qc.invalidateQueries({ queryKey: ["cc-overview"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <section>
      <h2 className="text-xl font-bold">All service requests</h2>
      <p className="mt-1 text-xs text-muted-foreground">Every enquiry from every form on the site (diesel, CNG, contact, investment, equipment, SOPHIA, Academy…). Test entries are hidden. Electricity token requests have their own queue under Electricity.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <select aria-label="Request type" value={type} onChange={(e) => setType(e.target.value)} className={sel}>
          <option value="all">All types</option>
          {types.data?.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className={sel}>
          <option value="open">Open</option>
          <option value="all">All statuses</option>
          {REQ_STATUSES.map((s) => <option key={s} value={s}>{REQ_LABEL[s]}</option>)}
        </select>
        <Input aria-label="Search" placeholder="Reference, name or email" value={q} onChange={(e) => setQ(e.target.value)} className="h-11 max-w-xs" />
      </div>
      <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-surface text-xs text-muted-foreground">
            <tr><th className="p-3">Reference</th><th className="p-3">Contact</th><th className="p-3">Service</th><th className="p-3">Date</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? <tr><td className="p-3" colSpan={5}>Loading…</td></tr> : null}
            {!isLoading && !data?.length ? <tr><td className="p-3 text-muted-foreground" colSpan={5}>No matching requests.</td></tr> : null}
            {data?.map((r) => (
              <tr key={r.id}>
                <td className="p-3 font-mono text-xs">{r.reference}</td>
                <td className="p-3">{r.contact_name}<div className="text-xs text-muted-foreground">{r.contact_email}{r.contact_phone ? ` · ${r.contact_phone}` : ""}</div></td>
                <td className="p-3">{r.service_name}<div className="text-xs text-muted-foreground">{r.request_type}{r.location ? ` · ${r.location}` : ""}</div></td>
                <td className="p-3 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  <select aria-label={`Status for ${r.reference}`} value={r.status} onChange={(e) => update.mutate({ id: r.id, status: e.target.value })} className="h-10 rounded-md border border-input bg-background px-2">
                    {REQ_STATUSES.map((s) => <option key={s} value={s}>{REQ_LABEL[s]}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ServiceAvailability() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["service-statuses"],
    queryFn: async () => (await supabase.from("service_statuses").select("*").order("sort_order")).data ?? [],
  });
  const save = useMutation({
    mutationFn: async (r: { slug: string; status: string; public_note: string }) => {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("service_statuses").update({ status: r.status, public_note: r.public_note.trim() || null, updated_at: new Date().toISOString(), updated_by: u.user?.id ?? null }).eq("slug", r.slug);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Service availability saved"); qc.invalidateQueries({ queryKey: ["service-statuses"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <section>
      <h2 className="text-xl font-bold">Service availability</h2>
      <p className="mt-1 text-xs text-muted-foreground">Shown as a notice at the top of each service page. "Live" hides the notice. Setting a service to Live does not switch on payments — online payment stays off until a payment provider is connected.</p>
      <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
        {data?.map((s) => <StatusRow key={s.slug + s.updated_at} row={s} onSave={(r) => save.mutate(r)} />)}
      </div>
    </section>
  );
}

function StatusRow({ row, onSave }: { row: { slug: string; label: string; path: string; status: string; public_note: string | null }; onSave: (r: { slug: string; status: string; public_note: string }) => void }) {
  const [status, setStatus] = useState(row.status);
  const [note, setNote] = useState(row.public_note ?? "");
  return (
    <div className="grid gap-3 p-3 md:grid-cols-[14rem_11rem_1fr_auto] md:items-center">
      <div><div className="text-sm font-semibold">{row.label}</div><div className="font-mono text-xs text-muted-foreground">{row.path}</div></div>
      <select aria-label={`Status for ${row.label}`} value={status} onChange={(e) => setStatus(e.target.value)} className={sel}>
        {Object.entries(SERVICE_STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <Input aria-label={`Public note for ${row.label}`} maxLength={300} placeholder="Optional note visitors see" value={note} onChange={(e) => setNote(e.target.value)} className="h-11" />
      <Button className="min-h-11" onClick={() => onSave({ slug: row.slug, status, public_note: note })}>Save</Button>
    </div>
  );
}

export function SiteNoticeEditor() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["site-notice"],
    queryFn: async () => (await supabase.from("site_notices").select("*").eq("id", 1).maybeSingle()).data,
  });
  if (!data) return null;
  return <NoticeForm key={data.updated_at} initial={data} onSaved={() => qc.invalidateQueries({ queryKey: ["site-notice"] })} />;
}

function NoticeForm({ initial, onSaved }: { initial: { message: string; link_url: string | null; link_label: string | null; active: boolean }; onSaved: () => void }) {
  const [message, setMessage] = useState(initial.message);
  const [url, setUrl] = useState(initial.link_url ?? "");
  const [label, setLabel] = useState(initial.link_label ?? "");
  const [active, setActive] = useState(initial.active);
  const save = useMutation({
    mutationFn: async () => {
      if (active && !message.trim()) throw new Error("Write a message before switching the notice on");
      if (url && !/^\/[A-Za-z0-9/_#?=&.-]*$/.test(url)) throw new Error("Link must be a page on this site, starting with /");
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("site_notices").update({ message: message.trim(), link_url: url || null, link_label: label.trim() || null, active, updated_at: new Date().toISOString(), updated_by: u.user?.id ?? null }).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Site notice saved"); onSaved(); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <section>
      <h2 className="text-xl font-bold">Site-wide notice</h2>
      <p className="mt-1 text-xs text-muted-foreground">A short banner shown at the top of every page — e.g. holiday hours or a new service. Keep it factual; never announce something as available before it is.</p>
      <div className="mt-4 grid gap-3 rounded-xl border border-border bg-card p-4">
        <Input aria-label="Notice message" maxLength={280} placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} className="h-11" />
        <div className="grid gap-3 md:grid-cols-2">
          <Input aria-label="Link (optional)" placeholder="Link, e.g. /contact" value={url} onChange={(e) => setUrl(e.target.value.trim())} className="h-11" />
          <Input aria-label="Link text (optional)" maxLength={60} placeholder="Link text" value={label} onChange={(e) => setLabel(e.target.value)} className="h-11" />
        </div>
        <label className="inline-flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4" /> Show on the site</label>
        <Button className="min-h-11 w-fit" onClick={() => save.mutate()} disabled={save.isPending}>Save notice</Button>
      </div>
    </section>
  );
}

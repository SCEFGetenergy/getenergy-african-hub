import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/site/ui-bits";
import { CERTIFICATIONS } from "@/lib/certifications";
import { AuditLog, DocumentReview, Invitations, PaymentRequests } from "@/components/admin/AdminExtras";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Team Admin | GET Energy Academy" },
      { name: "description", content: "Team screen for certification fees, application statuses and recognised employers." },
      { property: "og:title", content: "Team Admin | GET Energy Academy" },
      { property: "og:description", content: "Internal management for GET Energy certifications." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const STATUSES = ["submitted", "in_review", "contacted", "in_progress", "closed"] as const;
const LABEL: Record<string, string> = { submitted: "Submitted", in_review: "In review", contacted: "Contacted", in_progress: "In progress", closed: "Closed" };

function AdminPage() {
  const isAdmin = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return false;
      const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
      return !!data;
    },
  });

  if (isAdmin.isLoading) return <Section><p>Checking access…</p></Section>;
  if (!isAdmin.data)
    return (
      <Section>
        <h1 className="text-2xl font-bold">Team access only</h1>
        <p className="mt-2 text-muted-foreground">Your account doesn't have admin access. Ask a GET Energy administrator to grant it.</p>
        <Button asChild className="mt-4 min-h-11"><Link to="/account">Back to my account</Link></Button>
      </Section>
    );

  return (
    <Section>
      <h1 className="text-3xl font-bold">Team admin</h1>
      <p className="mt-2 text-sm text-muted-foreground">Changes here appear on the public certification pages straight away.</p>
      <div className="mt-8 space-y-12">
        <Fees />
        <Employers />
        <Applications />
        <DocumentReview />
        <PaymentRequests />
        <Invitations />
        <AuditLog />
      </div>
    </Section>
  );
}

function Fees() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-fees"],
    queryFn: async () => (await supabase.from("certification_settings").select("*")).data ?? [],
  });
  const save = useMutation({
    mutationFn: async (row: { code: string; fee_ngn: number | null; fee_approved: boolean }) => {
      const { error } = await supabase.from("certification_settings").upsert({ ...row, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Fee saved"); qc.invalidateQueries({ queryKey: ["admin-fees"] }); qc.invalidateQueries({ queryKey: ["cert-public"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <section>
      <h2 className="text-xl font-bold">Certification fees</h2>
      <p className="mt-1 text-xs text-muted-foreground">A fee shows publicly only when "Approved" is ticked; otherwise the site says "To be confirmed".</p>
      <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
        {CERTIFICATIONS.map((c) => {
          const row = data?.find((r) => r.code === c.code);
          return <FeeRow key={c.code + (row?.updated_at ?? "")} code={c.code} name={c.name} fee={row?.fee_ngn ?? null} approved={row?.fee_approved ?? false} onSave={(r) => save.mutate(r)} />;
        })}
      </div>
    </section>
  );
}

function FeeRow({ code, name, fee, approved, onSave }: { code: string; name: string; fee: number | null; approved: boolean; onSave: (r: { code: string; fee_ngn: number | null; fee_approved: boolean }) => void }) {
  const [v, setV] = useState(fee?.toString() ?? "");
  const [ok, setOk] = useState(approved);
  return (
    <div className="grid gap-3 p-3 md:grid-cols-[1fr_10rem_7rem_auto] md:items-center">
      <div><span className="font-mono text-xs font-bold">{code}</span> <span className="text-sm">{name}</span></div>
      <Input inputMode="numeric" aria-label={`${code} fee in naira`} placeholder="Fee (₦)" value={v} onChange={(e) => setV(e.target.value.replace(/\D/g, ""))} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} /> Approved</label>
      <Button size="sm" className="min-h-11" onClick={() => onSave({ code, fee_ngn: v ? Number(v) : null, fee_approved: ok && !!v })}>Save</Button>
    </div>
  );
}

function Employers() {
  const qc = useQueryClient();
  const [code, setCode] = useState(CERTIFICATIONS[0]?.code ?? "");
  const [name, setName] = useState("");
  const { data } = useQuery({
    queryKey: ["admin-employers"],
    queryFn: async () => (await supabase.from("certification_employers").select("*").order("certification_code")).data ?? [],
  });
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin-employers"] }); qc.invalidateQueries({ queryKey: ["cert-public"] }); };
  const add = useMutation({
    mutationFn: async () => {
      const n = name.trim();
      if (!n || n.length > 200) throw new Error("Enter an employer name (max 200 characters)");
      const { error } = await supabase.from("certification_employers").insert({ certification_code: code, employer_name: n });
      if (error) throw error;
    },
    onSuccess: () => { setName(""); toast.success("Employer added"); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("certification_employers").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Employer removed"); refresh(); },
  });
  return (
    <section>
      <h2 className="text-xl font-bold">Formally recognised employers</h2>
      <p className="mt-1 text-xs text-muted-foreground">Only add employers who have confirmed recognition in writing.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <select aria-label="Certification" value={code} onChange={(e) => setCode(e.target.value)} className="h-11 rounded-md border border-input bg-background px-2 text-sm">
          {CERTIFICATIONS.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
        </select>
        <Input aria-label="Employer name" placeholder="Employer name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 max-w-sm" />
        <Button className="min-h-11" onClick={() => add.mutate()} disabled={add.isPending}>Add employer</Button>
      </div>
      <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
        {(data ?? []).length === 0 ? <li className="p-3 text-sm text-muted-foreground">No recognised employers yet.</li> : null}
        {(data ?? []).map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-2 p-3 text-sm">
            <span><span className="font-mono text-xs font-bold">{r.certification_code}</span> · {r.employer_name} <span className="text-muted-foreground">({r.recognised_on})</span></span>
            <Button size="icon" variant="ghost" aria-label={`Remove ${r.employer_name}`} onClick={() => remove.mutate(r.id)}><Trash2 className="size-4" /></Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Applications() {
  const qc = useQueryClient();
  const [showTest, setShowTest] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-applications", showTest],
    queryFn: async () => {
      let q = supabase
        .from("service_requests")
        .select("id, reference, request_type, service_name, contact_name, contact_email, contact_phone, status, created_at, is_test")
        .like("request_type", "academy-%")
        .is("deleted_at", null);
      if (!showTest) q = q.eq("is_test", false);
      return (await q.order("created_at", { ascending: false }).limit(200)).data ?? [];
    },
  });
  const toggleTest = useMutation({
    mutationFn: async ({ id, is_test }: { id: string; is_test: boolean }) => {
      const { error } = await supabase.from("service_requests").update({ is_test }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, v) => { toast.success(v.is_test ? "Marked as test entry" : "Marked as real enquiry"); qc.invalidateQueries({ queryKey: ["admin-applications"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("service_requests").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["admin-applications"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const archive = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { error } = await supabase.rpc("archive_service_request", reason ? { p_id: id, p_reason: reason } : { p_id: id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Moved to deleted requests — you can restore it below");
      qc.invalidateQueries({ queryKey: ["admin-applications"] });
      qc.invalidateQueries({ queryKey: ["admin-archived"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <section>
      <h2 className="text-xl font-bold">Applications & waiting lists</h2>
      <p className="mt-1 text-xs text-muted-foreground">Applicants see the new status in their account dashboard. Test entries (from @getenergytest.dev addresses or named "QA Test") are flagged automatically and hidden unless you show them.</p>
      <label className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm">
        <input type="checkbox" checked={showTest} onChange={(e) => setShowTest(e.target.checked)} className="h-4 w-4" />
        Show test entries
      </label>
      <div className="mt-2 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-surface text-xs text-muted-foreground">
            <tr><th className="p-3">Reference</th><th className="p-3">Applicant</th><th className="p-3">For</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? <tr><td className="p-3" colSpan={6}>Loading…</td></tr> : null}
            {!isLoading && !data?.length ? <tr><td className="p-3 text-muted-foreground" colSpan={6}>No applications yet.</td></tr> : null}
            {data?.map((r) => (
              <tr key={r.id} className={r.is_test ? "bg-muted/50" : undefined}>
                <td className="p-3 font-mono text-xs">
                  {r.reference}
                  {r.is_test ? <div><span className="mt-1 inline-block rounded bg-accent px-1.5 py-0.5 font-sans text-[10px] font-bold uppercase text-accent-foreground">QA test</span></div> : null}
                </td>
                <td className="p-3">{r.contact_name}<div className="text-xs text-muted-foreground">{r.contact_email}{r.contact_phone ? ` · ${r.contact_phone}` : ""}</div></td>
                <td className="p-3">{r.service_name}<div className="text-xs text-muted-foreground">{r.request_type.replace("academy-", "")}</div></td>
                <td className="p-3 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  <select aria-label={`Status for ${r.reference}`} value={r.status} onChange={(e) => update.mutate({ id: r.id, status: e.target.value })} className="h-10 rounded-md border border-input bg-background px-2">
                    {STATUSES.map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
                  </select>
                </td>
                <td className="flex gap-2 p-3">
                  <button
                    type="button"
                    className="h-10 whitespace-nowrap rounded-md border border-border px-3 text-xs font-semibold"
                    onClick={() => toggleTest.mutate({ id: r.id, is_test: !r.is_test })}
                  >{r.is_test ? "Not a test" : "Mark as test"}</button>
                  <button
                    type="button"
                    className="h-10 rounded-md border border-border px-3 text-xs font-semibold text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      const reason = window.prompt(`Remove ${r.reference} from the list? Optional reason:`);
                      if (reason !== null) archive.mutate({ id: r.id, reason });
                    }}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DeletedRequests />
    </section>
  );
}

function DeletedRequests() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-archived"],
    queryFn: async () =>
      (await supabase
        .from("service_requests")
        .select("id, reference, request_type, service_name, contact_name, contact_email, deleted_at, delete_reason")
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false })
        .limit(200)).data ?? [],
  });
  const restore = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("restore_service_request", { p_id: id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Request restored");
      qc.invalidateQueries({ queryKey: ["admin-applications"] });
      qc.invalidateQueries({ queryKey: ["admin-archived"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold">Deleted requests</h3>
      <p className="mt-1 text-xs text-muted-foreground">Removed requests are kept here and can be restored. Every delete and restore is recorded in the audit log with who did it and when.</p>
      <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-surface text-xs text-muted-foreground">
            <tr><th className="p-3">Reference</th><th className="p-3">Contact</th><th className="p-3">For</th><th className="p-3">Deleted</th><th className="p-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? <tr><td className="p-3" colSpan={5}>Loading…</td></tr> : null}
            {!isLoading && !data?.length ? <tr><td className="p-3 text-muted-foreground" colSpan={5}>No deleted requests.</td></tr> : null}
            {data?.map((r) => (
              <tr key={r.id}>
                <td className="p-3 font-mono text-xs">{r.reference}</td>
                <td className="p-3">{r.contact_name}<div className="text-xs text-muted-foreground">{r.contact_email}</div></td>
                <td className="p-3">{r.service_name}<div className="text-xs text-muted-foreground">{r.request_type}</div></td>
                <td className="p-3 text-xs">{r.deleted_at ? new Date(r.deleted_at).toLocaleString() : ""}{r.delete_reason ? <div className="text-muted-foreground">“{r.delete_reason}”</div> : null}</td>
                <td className="p-3">
                  <button type="button" disabled={restore.isPending} onClick={() => restore.mutate(r.id)} className="h-10 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground disabled:opacity-60">Restore</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


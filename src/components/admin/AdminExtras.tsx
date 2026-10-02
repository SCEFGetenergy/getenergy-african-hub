import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/academy/portal";

const box = "mt-4 overflow-x-auto rounded-xl border border-border bg-card";

export function Invitations() {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("staff");
  const [link, setLink] = useState("");
  const { data } = useQuery({ queryKey: ["admin-invites"], queryFn: async () => (await supabase.from("admin_invitations").select("id, email, role, expires_at, accepted_at, revoked_at, created_at").order("created_at", { ascending: false })).data ?? [] });
  const create = useMutation({
    mutationFn: async () => {
      const { data: token, error } = await supabase.rpc("create_admin_invitation", { p_email: email.trim(), p_role: role });
      if (error) throw error;
      return token as string;
    },
    onSuccess: (t) => { setLink(`${window.location.origin}/team-invite?token=${t}`); setEmail(""); qc.invalidateQueries({ queryKey: ["admin-invites"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const revoke = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.rpc("revoke_admin_invitation", { p_id: id }); if (error) throw error; },
    onSuccess: () => { toast.success("Invitation revoked"); qc.invalidateQueries({ queryKey: ["admin-invites"] }); },
  });
  const state = (i: { accepted_at: string | null; revoked_at: string | null; expires_at: string }) => i.accepted_at ? "Accepted" : i.revoked_at ? "Revoked" : new Date(i.expires_at) < new Date() ? "Expired" : "Pending";
  return (
    <section>
      <h2 className="text-xl font-bold">Team invitations</h2>
      <p className="mt-1 text-xs text-muted-foreground">Single-use links that expire after 72 hours and only work for the invited email address. Copy the link and send it to the team member yourself.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Input aria-label="Team member email" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 max-w-xs" />
        <select aria-label="Role" value={role} onChange={(e) => setRole(e.target.value as "admin" | "staff")} className="h-11 rounded-md border border-input bg-background px-2 text-sm"><option value="staff">Staff</option><option value="admin">Admin</option></select>
        <Button className="min-h-11" onClick={() => create.mutate()} disabled={create.isPending || !email}>Create invitation</Button>
      </div>
      {link ? <div className="mt-3 rounded-lg border border-border bg-surface p-3 text-sm"><p className="font-semibold">Invitation link (shown once):</p><code className="mt-1 block break-all text-xs">{link}</code><Button size="sm" variant="outline" className="mt-2 min-h-11" onClick={() => { void navigator.clipboard.writeText(link); toast.success("Copied"); }}>Copy link</Button></div> : null}
      <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card text-sm">
        {!data?.length ? <li className="p-3 text-muted-foreground">No invitations yet.</li> : null}
        {data?.map((i) => (
          <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 p-3">
            <span>{i.email} · <span className="font-semibold">{i.role}</span> · {state(i)}<span className="block text-xs text-muted-foreground">Sent {new Date(i.created_at).toLocaleString()}</span></span>
            {state(i) === "Pending" ? <Button size="sm" variant="ghost" className="min-h-11" onClick={() => revoke.mutate(i.id)}>Revoke</Button> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DocumentReview() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-docs"], queryFn: async () => (await supabase.from("academy_documents").select("*").order("created_at", { ascending: false }).limit(200)).data ?? [] });
  const review = useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: string; note: string | null }) => {
      const { error } = await supabase.from("academy_documents").update({ status, reviewer_note: note, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Document updated"); qc.invalidateQueries({ queryKey: ["admin-docs"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const open = async (path: string) => {
    const { data: s } = await supabase.storage.from("academy-documents").createSignedUrl(path, 60);
    if (s?.signedUrl) window.open(s.signedUrl, "_blank", "noopener");
  };
  return (
    <section>
      <h2 className="text-xl font-bold">Student documents</h2>
      <p className="mt-1 text-xs text-muted-foreground">Links open for 60 seconds. Every review is recorded in the audit log.</p>
      <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card text-sm">
        {!data?.length ? <li className="p-3 text-muted-foreground">No documents uploaded yet.</li> : null}
        {data?.map((d) => (
          <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 p-3">
            <span><strong>{d.doc_type}</strong> · {d.file_name}<span className="block text-xs text-muted-foreground">{new Date(d.created_at).toLocaleString()}</span></span>
            <span className="flex flex-wrap items-center gap-2"><Pill status={d.status} />
              <Button size="sm" variant="outline" className="min-h-11" onClick={() => open(d.file_path)}>Open</Button>
              <Button size="sm" className="min-h-11" onClick={() => review.mutate({ id: d.id, status: "approved", note: null })}>Approve</Button>
              <Button size="sm" variant="ghost" className="min-h-11" onClick={() => { const n = window.prompt("Reason (shown to the student)"); if (n) review.mutate({ id: d.id, status: "rejected", note: n["slice"](0, 300) }); }}>Request replacement</Button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PaymentRequests() {
  const { data } = useQuery({ queryKey: ["admin-pays"], queryFn: async () => (await supabase.from("academy_payments").select("*").order("created_at", { ascending: false }).limit(200)).data ?? [] });
  return (
    <section>
      <h2 className="text-xl font-bold">GFA Wzip Wallet payment requests</h2>
      <p className="mt-1 text-xs text-muted-foreground">The wallet integration is pending configuration, so these are requests only — no money has been collected.</p>
      <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card text-sm">
        {!data?.length ? <li className="p-3 text-muted-foreground">No payment requests yet.</li> : null}
        {data?.map((p) => <li key={p.id} className="flex items-center justify-between gap-2 p-3"><span>{p.purpose}<span className="block text-xs text-muted-foreground">{p.application_reference ?? "—"} · {p.amount_ngn ? `₦${p.amount_ngn.toLocaleString("en-NG")}` : "TBC"}</span></span><Pill status={p.status} /></li>)}
      </ul>
    </section>
  );
}

const ENTITY: Record<string, string> = { certification_settings: "Certification fee", certification_employers: "Recognised employer", service_requests: "Application status", user_roles: "Team role", academy_documents: "Document review", academy_payments: "Payment", admin_invitations: "Invitation" };

function summary(r: { entity_type: string; action: string; old_value: unknown; new_value: unknown }) {
  const o = (r.old_value ?? {}) as Record<string, unknown>;
  const n = (r.new_value ?? {}) as Record<string, unknown>;
  switch (r.entity_type) {
    case "certification_settings": return `${String(n["code"] ?? o["code"])}: ₦${o["fee_ngn"] ?? "—"} → ₦${n["fee_ngn"] ?? "—"}, approved ${String(o["fee_approved"] ?? "—")} → ${String(n["fee_approved"] ?? "—")}`;
    case "certification_employers": return `${String(n["certification_code"] ?? o["certification_code"])}: ${String(n["employer_name"] ?? o["employer_name"])}`;
    case "service_requests": return `${String(n["reference"])}: ${String(o["status"])} → ${String(n["status"])}`;
    case "user_roles": return `${String(n["role"] ?? o["role"])} for user ${String(n["user_id"] ?? o["user_id"]).slice(0, 8)}`;
    case "academy_documents": return `${String(n["doc_type"] ?? o["doc_type"])}: ${String(o["status"])} → ${String(n["status"] ?? "deleted")}`;
    case "admin_invitations": return `${String(n["email"])} (${String(n["role"])})`;
    default: return "";
  }
}

export function AuditLog() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const { data } = useQuery({
    queryKey: ["admin-audit", type],
    queryFn: async () => {
      let qy = supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(300);
      if (type) qy = qy.eq("entity_type", type);
      return (await qy).data ?? [];
    },
  });
  const rows = (data ?? []).filter((r) => !q || `${r.actor_email} ${summary(r)}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <section>
      <h2 className="text-xl font-bold">Audit log</h2>
      <p className="mt-1 text-xs text-muted-foreground">Recorded automatically by the database for every fee, employer, status, role, invitation and document change. Entries cannot be edited or deleted.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Input aria-label="Search audit log" placeholder="Search by person or detail" value={q} onChange={(e) => setQ(e.target.value)} className="h-11 max-w-xs" />
        <select aria-label="Filter by type" value={type} onChange={(e) => setType(e.target.value)} className="h-11 rounded-md border border-input bg-background px-2 text-sm"><option value="">All changes</option>{Object.entries(ENTITY).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      </div>
      <div className={box}>
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-surface text-xs text-muted-foreground"><tr><th className="p-3">When</th><th className="p-3">Who</th><th className="p-3">What</th><th className="p-3">Detail</th></tr></thead>
          <tbody className="divide-y divide-border">
            {!rows.length ? <tr><td colSpan={4} className="p-3 text-muted-foreground">No changes recorded yet.</td></tr> : null}
            {rows.map((r) => <tr key={r.id}><td className="p-3 text-xs">{new Date(r.created_at).toLocaleString()}</td><td className="p-3">{r.actor_email ?? "System"}</td><td className="p-3">{ENTITY[r.entity_type] ?? r.entity_type} · {r.action}</td><td className="p-3 text-xs">{summary(r)}</td></tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}

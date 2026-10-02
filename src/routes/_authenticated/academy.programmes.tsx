import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PortalShell, Panel, useAcademyProfile, completion, portalHead, WALLET_NOTICE } from "@/components/academy/portal";
import { PROGRAMMES, formatNaira } from "@/lib/academy";
import { CERTIFICATIONS } from "@/lib/certifications";

export const Route = createFileRoute("/_authenticated/academy/programmes")({
  head: () => portalHead("Apply for a programme", "Apply for any GET Energy Academy programme, pathway or professional certification."),
  validateSearch: (s: Record<string, unknown>): { item?: string | undefined } => ({ item: typeof s["item"] === "string" ? s["item"] : undefined }),
  component: Apply,
});

type Item = { id: string; title: string; kind: string; fee: number | null; type: string };
const ITEMS: Item[] = [
  ...PROGRAMMES.map((p) => ({ id: p.slug, title: p.title, kind: p.kind === "pathway" ? "Career pathway" : "Programme", fee: p.fee, type: "academy-application" })),
  ...CERTIFICATIONS.map((c) => ({ id: c.code, title: `${c.code} — ${c.name}`, kind: "Professional certification", fee: null, type: "academy-certification" })),
];

function Apply() {
  const { item } = Route.useSearch();
  const prof = useAcademyProfile();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [chosen, setChosen] = useState<Item | undefined>(() => ITEMS.find((i) => i.id === item));
  const [mode, setMode] = useState("Physical");
  const [motivation, setMotivation] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<{ ref: string; item: Item } | null>(null);
  const [payRef, setPayRef] = useState("");
  const list = useMemo(() => ITEMS.filter((i) => i.title.toLowerCase().includes(q.toLowerCase())).slice(0, 30), [q]);
  const pct = completion(prof.data?.profile);

  const submit = async () => {
    if (!chosen || !prof.data) return;
    setBusy(true); setErr("");
    const p = prof.data.profile;
    const { data, error } = await supabase.rpc("submit_service_request", {
      p_request_type: chosen.type, p_service_name: chosen.title.slice(0, 160),
      p_contact_name: `${p.first_name} ${p.last_name}`.trim() || prof.data.email, p_contact_email: prof.data.email,
      p_contact_phone: p.phone ?? "", p_company_name: p.organisation ?? "", p_location: [p.city, p.state, p.country].filter(Boolean).join(", ") || "",
      p_details: { source: "academy-portal", student_id: p.student_id, item_id: chosen.id, kind: chosen.kind, proposed_fee_ngn: chosen.fee, delivery_mode: mode, motivation: motivation.slice(0, 1500) },
    });
    setBusy(false);
    if (error || !data) return setErr("Your application could not be submitted. Please try again.");
    setDone({ ref: data, item: chosen });
    setTimeout(() => window.scrollTo({ top: 0 }), 50);
    qc.invalidateQueries({ queryKey: ["academy-mine"] });
  };

  const requestPayment = async () => {
    if (!done) return;
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data, error } = await supabase.from("academy_payments").insert({ user_id: u.user.id, application_reference: done.ref, purpose: `Training fee — ${done.item.title}`.slice(0, 200), amount_ngn: done.item.fee }).select("id").single();
    if (error || !data) return setErr("Could not save the payment request.");
    setPayRef(data.id.slice(0, 8).toUpperCase());
    qc.invalidateQueries({ queryKey: ["academy-mine"] });
  };

  if (done)
    return (
      <PortalShell title="Application submitted">
        <Panel>
          <p className="text-sm">Your application for <strong>{done.item.title}</strong> was received.</p>
          <p className="mt-2 text-lg">Reference: <span className="font-mono font-bold">{done.ref}</span></p>
          <p className="mt-3 text-sm text-muted-foreground">Track its status under My applications. The Academy team confirms the cohort, final fee and next steps.</p>
          <div className="mt-5 rounded-lg border border-border bg-surface p-4">
            <h2 className="font-bold">Pay with GFA Wzip Wallet</h2>
            <p className="mt-1 text-sm text-muted-foreground">{WALLET_NOTICE }</p>
            {payRef ? <p className="mt-3 text-sm font-semibold text-brand-green">Payment request saved (ID {payRef}). Status: awaiting wallet launch — nothing has been charged.</p>
              : <Button className="mt-3 min-h-11" variant="outline" onClick={requestPayment}>Save a payment request</Button>}
          </div>
          {err ? <p role="alert" className="mt-2 text-sm text-destructive">{err}</p> : null}
          <div className="mt-5 flex flex-wrap gap-3"><Button asChild className="min-h-11"><Link to="/academy/applications">My applications</Link></Button><Button variant="outline" className="min-h-11" onClick={() => { setDone(null); setPayRef(""); setChosen(undefined); }}>Apply for another</Button></div>
        </Panel>
      </PortalShell>
    );

  return (
    <PortalShell title="Apply for a programme" intro="Choose from all 74 Academy products. Your saved profile is attached automatically.">
      {pct < 100 ? <p className="mb-4 rounded-lg border border-border bg-card p-3 text-sm">Your profile is {pct}% complete. You can apply now, but the team needs a complete profile to review it. <Link to="/academy/profile" className="font-semibold text-primary underline">Complete profile</Link></p> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="1. Choose">
          <Input aria-label="Search programmes" placeholder="Search programmes, pathways, certifications…" value={q} onChange={(e) => setQ(e.target.value)} />
          <ul className="mt-3 max-h-96 divide-y divide-border overflow-y-auto text-sm">
            {list.map((i) => (
              <li key={i.id}><button type="button" onClick={() => setChosen(i)} className={`w-full min-h-11 px-2 py-2 text-left ${chosen?.id === i.id ? "bg-secondary font-semibold" : "hover:bg-surface"}`}>
                {i.title}<span className="block text-xs text-muted-foreground">{i.kind} · {i.fee ? `Proposed fee ${formatNaira(i.fee)}` : "Fee to be confirmed"}</span></button></li>
            ))}
          </ul>
        </Panel>
        <Panel title="2. Details">
          {!chosen ? <p className="text-sm text-muted-foreground">Select an item on the left.</p> : (
            <div className="space-y-4 text-sm">
              <p><strong>{chosen.title}</strong><br /><span className="text-muted-foreground">{chosen.kind} · {chosen.fee ? `Proposed fee ${formatNaira(chosen.fee)} (subject to approval)` : "Fee to be confirmed"}</span></p>
              <label className="block">Preferred delivery<select value={mode} onChange={(e) => setMode(e.target.value)} className="mt-1 h-11 w-full rounded-md border border-input bg-background px-3">{["Physical", "Online", "Hybrid", "No preference"].map((m) => <option key={m}>{m}</option>)}</select></label>
              <label className="block">Why do you want to take this? (optional)<textarea value={motivation} onChange={(e) => setMotivation(e.target.value)} maxLength={1500} rows={4} className="mt-1 w-full rounded-md border border-input bg-background p-2" /></label>
              {err ? <p role="alert" className="text-destructive">{err}</p> : null}
              <Button className="min-h-11" onClick={submit} disabled={busy || !prof.data}>{busy ? "Submitting…" : "Submit application"}</Button>
            </div>
          )}
        </Panel>
      </div>
    </PortalShell>
  );
}

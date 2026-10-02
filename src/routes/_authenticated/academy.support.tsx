import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PortalShell, Panel, useAcademyProfile, portalHead, useMyAcademy } from "@/components/academy/portal";
import { whatsappFor } from "@/lib/academy";

export const Route = createFileRoute("/_authenticated/academy/support")({
  head: () => portalHead("Support", "Get help with your GET Energy Academy registration, application, documents or payments."),
  component: Support,
});

const TOPICS = ["Registration / account", "Application", "Documents / CV", "Payment / GFA Wallet", "Certification", "CPD / renewal", "Other"];

function Support() {
  const prof = useAcademyProfile();
  const qc = useQueryClient();
  const [topic, setTopic] = useState(TOPICS[0]!);
  const [msg, setMsg] = useState("");
  const [ref, setRef] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const send = async () => {
    if (!prof.data || msg.trim().length < 5) return setErr("Please describe your question.");
    setBusy(true); setErr("");
    const p = prof.data.profile;
    const { data, error } = await supabase.rpc("submit_service_request", {
      p_request_type: "academy-support", p_service_name: `Academy support — ${topic}`,
      p_contact_name: `${p.first_name} ${p.last_name}`.trim() || prof.data.email, p_contact_email: prof.data.email, p_contact_phone: p.phone ?? undefined,
      p_details: { student_id: p.student_id, topic, message: msg.trim().slice(0, 2000) },
    });
    setBusy(false);
    if (error || !data) return setErr("Could not send. Please try again.");
    setRef(data); setMsg("");
    qc.invalidateQueries({ queryKey: ["academy-mine"] });
  };
  return (
    <PortalShell title="Support" intro="Send a message to the Academy team. You'll get a reference and can follow it under My applications.">
      <Panel>
        {ref ? <p className="mb-4 text-sm font-semibold text-brand-green">Sent. Your reference is <span className="font-mono">{ref}</span>.</p> : null}
        <label className="block text-sm">Topic<select value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1 h-11 w-full rounded-md border border-input bg-background px-3">{TOPICS.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label className="mt-4 block text-sm">Message<textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={5} maxLength={2000} className="mt-1 w-full rounded-md border border-input bg-background p-2" /></label>
        {err ? <p role="alert" className="mt-2 text-sm text-destructive">{err}</p> : null}
        <div className="mt-4 flex flex-wrap gap-3">
          <Button className="min-h-11" onClick={send} disabled={busy}>{busy ? "Sending…" : "Send to Academy team"}</Button>
          <Button asChild variant="outline" className="min-h-11"><a href={whatsappFor()} target="_blank" rel="noopener noreferrer">WhatsApp (optional)</a></Button>
          <Button asChild variant="ghost" className="min-h-11"><Link to="/sophia">Ask SOPHIA</Link></Button>
        </div>
      </Panel>
    </PortalShell>
  );
}

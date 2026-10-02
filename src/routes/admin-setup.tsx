import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/site/ui-bits";

export const Route = createFileRoute("/admin-setup")({
  head: () => ({
    meta: [
      { title: "First administrator setup | GET Energy" },
      { name: "description", content: "One-time setup to create the first GET Energy team administrator." },
      { property: "og:title", content: "First administrator setup | GET Energy" },
      { property: "og:description", content: "One-time GET Energy admin setup." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Setup,
});

function Setup() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const [open, setOpen] = useState<boolean | undefined>(undefined);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    void supabase.rpc("first_admin_available").then(({ data }) => setOpen(Boolean(data)));
  }, []);
  const claim = async () => {
    setBusy(true);
    const { data, error } = await supabase.rpc("claim_first_admin", { p_code: code.trim().slice(0, 100) });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message });
    if (data !== "ok") return setMsg({ ok: false, text: "That setup code is not correct." });
    setMsg({ ok: true, text: "You are now the first administrator." });
  };
  return (
    <Section>
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-bold">First administrator setup</h1>
        {msg?.ok ? (
          <><p className="mt-3 text-sm text-brand-green">{msg.text} Invite the rest of your team from the admin page.</p><Button asChild className="mt-4 min-h-11"><Link to="/admin">Open team admin</Link></Button></>
        ) : open === undefined || email === undefined ? <p className="mt-3 text-sm">Checking…</p>
          : !open ? <p className="mt-3 text-sm">Setup is closed — an administrator already exists. Ask them to send you an invitation.</p>
          : email === null ? (
            <><p className="mt-3 text-sm">Sign in (or register) with the account that should become the administrator, then come back to this page.</p><Button asChild className="mt-4 min-h-11"><Link to="/login">Sign in</Link></Button></>
          ) : (
            <>
              <p className="mt-3 text-sm">Signed in as <strong>{email}</strong>. Enter the one-time setup code. It works once, and locks after 10 wrong attempts.</p>
              <Input aria-label="Setup code" autoComplete="off" value={code} onChange={(e) => setCode(e.target.value)} className="mt-4 h-11" />
              {msg ? <p role="alert" className="mt-2 text-sm text-destructive">{msg.text}</p> : null}
              <Button className="mt-4 min-h-11" disabled={busy || !code.trim()} onClick={claim}>Become administrator</Button>
            </>
          )}
      </div>
    </Section>
  );
}

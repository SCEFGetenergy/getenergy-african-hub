import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/site/ui-bits";

export const Route = createFileRoute("/academy/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password | GET Energy Academy" },
      { name: "description", content: "Choose a new password for your GET Energy Academy account." },
      { property: "og:title", content: "Set a new password | GET Energy Academy" },
      { property: "og:url", content: "https://getenergy.ng/academy/reset-password" },
      { property: "og:description", content: "Password reset for GET Energy Academy accounts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/academy/reset-password" }],
  }),
  component: Reset,
});

function Reset() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const pw = String(f.get("password") ?? "");
    if (pw.length < 8) return setMsg({ ok: false, text: "Use at least 8 characters." });
    if (pw !== String(f.get("confirm") ?? "")) return setMsg({ ok: false, text: "Passwords do not match." });
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    setMsg(error ? { ok: false, text: "This reset link is invalid or has expired. Request a new one from the sign-in page." } : { ok: true, text: "Password updated." });
  };
  return (
    <Section>
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-bold">Set a new password</h1>
        {msg?.ok ? (
          <><p className="mt-3 text-sm text-brand-green">{msg.text}</p><Button asChild className="mt-4 min-h-11"><Link to="/academy/dashboard">Go to my dashboard</Link></Button></>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-4">
            <div><Label htmlFor="password">New password</Label><Input id="password" name="password" type="password" required minLength={8} className="mt-1" autoComplete="new-password" /></div>
            <div><Label htmlFor="confirm">Confirm new password</Label><Input id="confirm" name="confirm" type="password" required className="mt-1" autoComplete="new-password" /></div>
            {msg ? <p role="alert" className="text-sm text-destructive">{msg.text}</p> : null}
            <Button type="submit" className="min-h-11 w-full" disabled={busy}>Update password</Button>
          </form>
        )}
      </div>
    </Section>
  );
}

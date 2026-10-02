import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/site/ui-bits";

export const Route = createFileRoute("/academy/login")({
  head: () => ({
    meta: [
      { title: "Sign in | GET Energy Academy Portal" },
      { name: "description", content: "Sign in to your GET Energy Academy student portal." },
      { property: "og:title", content: "Sign in | GET Energy Academy Portal" },
      { property: "og:description", content: "Access your Academy applications, documents, payments and certifications." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    setBusy(true);
    setMsg(null);
    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/academy/reset-password` });
      setBusy(false);
      return setMsg(error ? { ok: false, text: error.message } : { ok: true, text: `If an account exists for ${email}, a reset link is on its way.` });
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password: String(f.get("password") ?? "") });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message === "Email not confirmed" ? "Please confirm your email first — check your inbox for the link." : "Email or password is incorrect." });
    navigate({ to: "/academy/dashboard" });
  };

  return (
    <Section>
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-bold">{mode === "login" ? "Sign in to the Academy portal" : "Reset your password"}</h1>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required autoComplete="email" className="mt-1" /></div>
          {mode === "login" ? <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required autoComplete="current-password" className="mt-1" /></div> : null}
          {msg ? <p role="alert" className={msg.ok ? "text-sm text-brand-green" : "text-sm text-destructive"}>{msg.text}</p> : null}
          <Button type="submit" className="min-h-11 w-full" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Send reset link"}</Button>
        </form>
        <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm">
          <button type="button" className="min-h-11 font-medium text-primary underline" onClick={() => { setMode(mode === "login" ? "forgot" : "login"); setMsg(null); }}>{mode === "login" ? "Forgot password?" : "Back to sign in"}</button>
          <Link to="/academy/register" className="flex min-h-11 items-center font-medium text-primary underline">Create an account</Link>
        </div>
      </div>
    </Section>
  );
}

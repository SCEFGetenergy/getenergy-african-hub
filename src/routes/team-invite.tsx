import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/ui-bits";

export const Route = createFileRoute("/team-invite")({
  validateSearch: (s: Record<string, unknown>) => ({ token: typeof s.token === "string" ? s.token : "" }),
  head: () => ({
    meta: [
      { title: "Accept team invitation | GET Energy" },
      { name: "description", content: "Accept an invitation to join the GET Energy team admin." },
      { property: "og:title", content: "Accept team invitation | GET Energy" },
      { property: "og:description", content: "GET Energy team invitation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Invite,
});

function Invite() {
  const { token } = Route.useSearch();
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => {
    if (token) sessionStorage.setItem("team-invite-token", token);
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, [token]);
  const accept = async () => {
    const t = token || sessionStorage.getItem("team-invite-token") || "";
    const { data, error } = await supabase.rpc("accept_admin_invitation", { p_token: t });
    if (error) return setMsg({ ok: false, text: error.message });
    sessionStorage.removeItem("team-invite-token");
    setMsg({ ok: true, text: `Done — you now have ${data} access.` });
  };
  return (
    <Section>
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-bold">Team invitation</h1>
        {!token ? <p className="mt-3 text-sm text-destructive">This link is missing its invitation code.</p>
          : email === undefined ? <p className="mt-3 text-sm">Checking…</p>
          : email === null ? (
            <><p className="mt-3 text-sm">Sign in (or register) with the email address the invitation was sent to, then open this link again.</p><Button asChild className="mt-4 min-h-11"><Link to="/login">Sign in</Link></Button></>
          ) : msg?.ok ? (
            <><p className="mt-3 text-sm text-brand-green">{msg.text}</p><Button asChild className="mt-4 min-h-11"><Link to="/admin">Open team admin</Link></Button></>
          ) : (
            <><p className="mt-3 text-sm">Signed in as <strong>{email}</strong>.</p>{msg ? <p role="alert" className="mt-2 text-sm text-destructive">{msg.text}</p> : null}<Button className="mt-4 min-h-11" onClick={accept}>Accept invitation</Button></>
          )}
      </div>
    </Section>
  );
}

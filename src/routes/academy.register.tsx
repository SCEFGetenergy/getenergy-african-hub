import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/site/ui-bits";
import { ACADEMY_CATEGORIES } from "@/lib/academy";

export const Route = createFileRoute("/academy/register")({
  head: () => ({
    meta: [
      { title: "Create your Academy account | GET Energy Academy" },
      { name: "description", content: "Register for a secure GET Energy Academy student account to apply for training and certifications." },
      { property: "og:title", content: "Create your Academy account | GET Energy Academy" },
      { property: "og:description", content: "Secure student registration for GET Energy Academy programmes and certifications." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Register,
});

const sel = "h-11 w-full rounded-md border border-input bg-background px-3 text-sm";

function F({ id, label, req, children }: { id: string; label: string; req?: boolean; children: React.ReactNode }) {
  return <div><Label htmlFor={id}>{label}{req ? " *" : ""}</Label><div className="mt-1">{children}</div></div>;
}

function Register() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr("");
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "").trim();
    const email = g("email");
    const pw = String(f.get("password") ?? "");
    if (pw.length < 8) return setErr("Password must be at least 8 characters.");
    if (pw !== String(f.get("confirm") ?? "")) return setErr("Passwords do not match.");
    if (!f.get("consent")) return setErr("Please tick the consent box to continue.");
    const meta: Record<string, string> = { account_type: "individual", consent_at: new Date().toISOString() };
    for (const k of ["first_name", "middle_name", "last_name", "phone", "country", "state", "city", "gender", "date_of_birth", "nationality", "occupation", "organisation", "qualification", "years_experience", "interest"]) {
      const v = g(k).slice(0, 200);
      if (v) meta[k] = v;
    }
    meta["full_name"] = `${meta["first_name"] ?? ""} ${meta["last_name"] ?? ""}`.trim();
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({ email, password: pw, options: { emailRedirectTo: `${window.location.origin}/academy/dashboard`, data: meta } });
    setBusy(false);
    if (error) return setErr(error.message);
    setDone(data.session ? "signed-in" : email);
  };

  if (done)
    return (
      <Section>
        <div className="mx-auto max-w-lg rounded-xl border border-border bg-card p-6 text-center">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">We sent a confirmation link to <strong>{done}</strong>. Click it to activate your Academy account, then sign in. Your student ID is created on first sign-in.</p>
          <Button asChild className="mt-4 min-h-11"><Link to="/academy/login">Go to sign in</Link></Button>
        </div>
      </Section>
    );

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Create your Academy account</h1>
        <p className="mt-2 text-sm text-muted-foreground">One secure account for applications, documents, payments, certifications and CPD. WhatsApp is optional support — you don't need it to register. Fields marked * are required.</p>
        <form onSubmit={submit} className="mt-6 grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
          <F id="first_name" label="First name" req><Input id="first_name" name="first_name" required maxLength={100} /></F>
          <F id="middle_name" label="Middle name"><Input id="middle_name" name="middle_name" maxLength={100} /></F>
          <F id="last_name" label="Last name" req><Input id="last_name" name="last_name" required maxLength={100} /></F>
          <F id="email" label="Email address" req><Input id="email" name="email" type="email" required maxLength={255} autoComplete="email" /></F>
          <F id="phone" label="Mobile / WhatsApp number" req><Input id="phone" name="phone" type="tel" required maxLength={30} /></F>
          <F id="country" label="Country" req><Input id="country" name="country" required defaultValue="Nigeria" maxLength={80} /></F>
          <F id="state" label="State / Province" req><Input id="state" name="state" required maxLength={80} /></F>
          <F id="city" label="City" req><Input id="city" name="city" required maxLength={80} /></F>
          <F id="gender" label="Gender (optional)"><select id="gender" name="gender" className={sel} defaultValue=""><option value="">Prefer not to say</option><option>Female</option><option>Male</option></select></F>
          <F id="nationality" label="Nationality"><Input id="nationality" name="nationality" maxLength={80} /></F>
          <F id="occupation" label="Current occupation"><Input id="occupation" name="occupation" maxLength={120} /></F>
          <F id="organisation" label="Organisation / Employer"><Input id="organisation" name="organisation" maxLength={160} /></F>
          <F id="qualification" label="Highest qualification"><select id="qualification" name="qualification" className={sel} defaultValue=""><option value="">Select…</option>{["SSCE / O-Level","OND / NCE","HND","Bachelor's degree","Master's degree","Doctorate","Trade / vocational certificate","Other"].map((q) => <option key={q}>{q}</option>)}</select></F>
          <F id="years_experience" label="Years of professional experience"><Input id="years_experience" name="years_experience" type="number" min={0} max={60} /></F>
          <F id="interest" label="Primary area of interest"><select id="interest" name="interest" className={sel} defaultValue=""><option value="">Select…</option>{ACADEMY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}<option>Professional Certifications</option></select></F>
          <div />
          <F id="password" label="Password (min 8 characters)" req><Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" /></F>
          <F id="confirm" label="Confirm password" req><Input id="confirm" name="confirm" type="password" required autoComplete="new-password" /></F>
          <label className="flex items-start gap-2 text-sm sm:col-span-2"><input type="checkbox" name="consent" className="mt-1 size-4" required /> I agree that GET Energy Academy may store and process my details to manage my registration, applications and certification, and contact me about them. *</label>
          {err ? <p role="alert" className="text-sm font-medium text-destructive sm:col-span-2">{err}</p> : null}
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <Button type="submit" className="min-h-11" disabled={busy}>{busy ? "Creating account…" : "Create Academy account"}</Button>
            <Link to="/academy/login" className="text-sm font-medium text-primary underline">Already registered? Sign in</Link>
          </div>
        </form>
      </div>
    </Section>
  );
}

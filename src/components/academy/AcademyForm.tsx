import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PROGRAMMES, getProgramme, whatsappFor } from "@/lib/academy";
import { CERTIFICATIONS, getCertification } from "@/lib/certifications";
import { HONEYPOT_NAME, RATE_LIMIT_MESSAGE, readReference } from "@/lib/requests";
import { currentPageReturnTo } from "@/lib/auth";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "select" | "textarea" | "programme" | "certification" | "consent";
  options?: string[];
  required?: boolean;
};

const selectCls = "h-11 w-full rounded-md border border-input bg-background px-3 text-sm";
type CourseResult = { status?: string; reference?: string };

export function AcademyForm({
  kind,
  fields,
  submitLabel,
  initial = {},
}: {
  kind: "waitlist" | "corporate" | "certification";
  fields: Field[];
  submitLabel: string;
  initial?: Record<string, string>;
}) {
  const qc = useQueryClient();
  const requiresAccount = kind !== "corporate";
  const [v, setV] = useState<Record<string, string>>(initial);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ref, setRef] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState(false);
  const [trap, setTrap] = useState("");
  const [signedIn, setSignedIn] = useState<boolean | null>(requiresAccount ? null : true);
  const set = (k: string, val: string) => setV((p) => ({ ...p, [k]: val }));

  useEffect(() => {
    if (!requiresAccount) return;
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      const user = data.user;
      setSignedIn(!!user);
      if (!user) return;
      const meta = (user.user_metadata ?? {}) as Record<string, string | undefined>;
      setV((previous) => ({
        ...previous,
        email: previous["email"] || user.email || "",
        name: previous["name"] || meta["full_name"] || "",
        phone: previous["phone"] || meta["phone"] || "",
        country: previous["country"] || meta["country"] || "",
        city: previous["city"] || meta["city"] || "",
        occupation: previous["occupation"] || meta["occupation"] || "",
        organisation: previous["organisation"] || meta["organisation"] || "",
      }));
    });
    return () => { active = false; };
  }, [requiresAccount]);

  const cert = getCertification(v["certification"] ?? "");
  const programmeTitle = cert ? `${cert.name} (${cert.code})` : getProgramme(v["programme"] ?? "")?.title ?? v["programmes"] ?? "";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const missing = fields.find((f) => f.required && !(v[f.name] ?? "").trim());
    if (missing) return setErr(`${missing.label.replace(" *", "")} is required.`);
    const email = (v["email"] ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) return setErr("Please enter a valid email.");
    if (Object.values(v).some((x) => x.length > 2000)) return setErr("Please shorten your answers.");
    setErr(null);
    if (trap) return setRef("Received"); // honeypot: pretend success, save nothing
    setBusy(true);
    const lines = fields
      .filter((f) => f.type !== "consent" && v[f.name])
      .map((f) => `${f.label.replace(" *", "")}: ${f.type === "programme" || f.type === "certification" ? programmeTitle : v[f.name]}`);
    const name = (v["name"] ?? v["contact"] ?? email).trim();

    if (requiresAccount) {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        setBusy(false);
        setSignedIn(false);
        return;
      }
      const courseKey = kind === "certification" ? v["certification"] : v["programme"];
      const { data, error } = await supabase.rpc("register_academy_course", {
        p_course_key: courseKey ?? "",
        p_contact_name: name,
        p_contact_phone: (v["phone"] ?? "").trim(),
        ...(v["organisation"]?.trim() ? { p_company_name: v["organisation"].trim() } : {}),
        ...([v["city"], v["country"]].filter(Boolean).length ? { p_location: [v["city"], v["country"]].filter(Boolean).join(", ") } : {}),
        p_details: { ...v, lines, source: "academy-course-form" },
        p_consent: true,
      });
      setBusy(false);
      if (error) return setErr(error.message || "We couldn't save your registration. Please try again.");
      const result = (data ?? {}) as CourseResult;
      if (result.status === "rate_limited") return setErr(RATE_LIMIT_MESSAGE);
      if (!result.reference) return setErr("We couldn't save your registration. Please try again.");
      setDuplicate(result.status === "duplicate");
      setRef(result.reference);
      qc.invalidateQueries({ queryKey: ["academy-mine"] });
      return;
    }

    const { data, error } = await supabase.rpc("submit_service_request", {
      p_request_type: "academy-corporate",
      p_service_name: "GET Energy Academy Corporate Training",
      p_contact_name: name.slice(0, 200),
      p_contact_email: email,
      p_contact_phone: (v["phone"] ?? "").trim(),
      ...(v["organisation"]?.trim() ? { p_company_name: v["organisation"].trim() } : {}),
      ...(v["city"]?.trim() || v["country"]?.trim() ? { p_location: [v["city"], v["country"]].filter(Boolean).join(", ") } : {}),
      p_details: { lines, ...v },
    });
    setBusy(false);
    if (error) return setErr("We couldn't save your details. Please try again, or message us on WhatsApp.");
    const res = readReference(data);
    if ("error" in res) return setErr(res.error);
    setRef(res.reference);
  }

  if (ref) {
    return (
      <div className="rounded-2xl border border-brand-green/40 bg-card p-6 card-elevated" role="status">
        <CheckCircle2 className="size-8 text-brand-green" />
        <h2 className="mt-3 text-2xl font-bold">
          {duplicate ? "You're already registered" : kind !== "corporate" ? "You're on the waiting list" : "Corporate training request received"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {duplicate ? "Existing registration reference: " : "Request reference: "}<strong className="font-mono text-foreground">{ref}</strong>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {kind !== "corporate" ? (
            <>
              {duplicate ? "Your existing registration for " : "Thank you for your interest in GET Energy Academy. We have received your details for "}
              <strong className="text-foreground">{programmeTitle}</strong>. Our training team will contact you when the
              next cohort, final programme fee, training schedule and certification details are confirmed. No payment is taken yet.
            </>
          ) : (
            "Our training team will contact you to scope participants, curriculum, dates and certification options."
          )}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {requiresAccount ? <Button asChild className="min-h-11"><Link to="/academy/applications">View my applications</Link></Button> : null}
          <Button asChild variant={requiresAccount ? "outline" : "default"} className="min-h-11">
            <Link to="/sophia">Ask SOPHIA</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11">
            <a href={whatsappFor(programmeTitle || undefined)} target="_blank" rel="noreferrer">
              Continue on WhatsApp
            </a>
          </Button>
          <Button asChild variant="ghost" className="min-h-11">
            <Link to="/training-certification" hash="programmes">
              Explore more programmes
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (requiresAccount && signedIn === null) return <p className="rounded-2xl border border-border bg-card p-5 text-sm">Checking your account…</p>;
  if (requiresAccount && signedIn === false) {
    const returnTo = currentPageReturnTo();
    return (
      <div className="rounded-2xl border border-border bg-card p-5 card-elevated md:p-7">
        <h2 className="text-xl font-bold">Sign in to join this waiting list</h2>
        <p className="mt-2 text-sm text-muted-foreground">Your selected course will be kept. After signing in or creating your account, you will return here to complete the registration.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild className="min-h-11"><Link to="/academy/login" search={{ returnTo }}>Sign in</Link></Button>
          <Button asChild variant="outline" className="min-h-11"><Link to="/academy/register" search={{ returnTo }}>Create an account</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 rounded-2xl border border-border bg-card p-5 card-elevated sm:grid-cols-2 md:p-7">
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Leave this field empty
          <input type="text" name={HONEYPOT_NAME} tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </label>
      </div>
      {fields.map((f) => {
        const id = `ac-${f.name}`;
        const label = `${f.label}${f.required ? " *" : ""}`;
        const wide = f.type === "textarea" || f.type === "consent" || f.type === "programme" || f.type === "certification";
        if (f.type === "consent") {
          return (
            <label key={f.name} className="flex gap-3 text-xs leading-relaxed text-muted-foreground sm:col-span-2">
              <input
                id={id}
                name={f.name}
                type="checkbox"
                className="mt-0.5 size-4"
                checked={v[f.name] === "yes"}
                onChange={(e) => set(f.name, e.target.checked ? "yes" : "")}
              />
              <span>{label}</span>
            </label>
          );
        }
        return (
          <div key={f.name} className={wide ? "sm:col-span-2" : undefined}>
            <Label htmlFor={id}>{label}</Label>
            <div className="mt-1.5">
              {f.type === "programme" ? (
                <select id={id} className={selectCls} value={v[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)}>
                  <option value="">Select a programme</option>
                  {PROGRAMMES.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {String(p.n).padStart(2, "0")}. {p.title}
                    </option>
                  ))}
                </select>
              ) : f.type === "certification" ? (
                <select id={id} className={selectCls} value={v[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)}>
                  <option value="">Select a certification</option>
                  {CERTIFICATIONS.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              ) : f.type === "select" ? (
                <select id={id} className={selectCls} value={v[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)}>
                  <option value="">Select</option>
                  {f.options?.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : f.type === "textarea" ? (
                <Textarea id={id} rows={4} maxLength={2000} value={v[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)} />
              ) : (
                <Input
                  id={id}
                  type={f.type ?? "text"}
                  maxLength={255}
                  className="h-11"
                  value={v[f.name] ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              )}
            </div>
          </div>
        );
      })}
      {err ? (
        <p role="alert" className="text-sm font-medium text-destructive sm:col-span-2">
          {err}
        </p>
      ) : null}
      <Button type="submit" disabled={busy} size="lg" className="min-h-12 bg-brand-green text-brand-green-foreground hover:bg-brand-green/90 sm:col-span-2">
        {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
        {submitLabel}
      </Button>
    </form>
  );
}

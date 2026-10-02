import type { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const PORTAL_TITLE = "GET Energy Academy for Green Skills, Certification & Workforce Productivity";

export const PORTAL_NAV = [
  { to: "/academy/dashboard", label: "Dashboard" },
  { to: "/academy/profile", label: "Profile" },
  { to: "/academy/programmes", label: "Apply for a programme" },
  { to: "/academy/applications", label: "My applications" },
  { to: "/academy/payments", label: "Payments & wallet" },
  { to: "/academy/documents", label: "Documents & CV" },
  { to: "/academy/certifications", label: "Certifications" },
  { to: "/academy/skills-passport", label: "Skills Passport" },
  { to: "/academy/cpd", label: "CPD" },
  { to: "/academy/support", label: "Support" },
] as const;

export const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted", in_review: "In review", contacted: "Contacted", in_progress: "In progress", closed: "Closed",
  uploaded: "Uploaded", approved: "Approved", rejected: "Needs replacing",
  pending_configuration: "Awaiting wallet launch", pending: "Pending", successful: "Paid", failed: "Failed", cancelled: "Cancelled",
};

export function Pill({ status }: { status: string }) {
  const good = ["approved", "successful", "contacted", "in_progress"].includes(status);
  const bad = ["rejected", "failed"].includes(status);
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
      good ? "bg-brand-green-soft text-brand-green" : bad ? "bg-destructive/10 text-destructive" : "bg-secondary text-secondary-foreground")}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export type AcademyProfile = {
  user_id: string; student_id: string; first_name: string; middle_name: string | null; last_name: string;
  phone: string | null; country: string | null; state: string | null; city: string | null; gender: string | null;
  date_of_birth: string | null; nationality: string | null; occupation: string | null; organisation: string | null;
  qualification: string | null; years_experience: number | null; interest: string | null; consent_at: string | null;
};

const META_KEYS = ["first_name", "middle_name", "last_name", "phone", "country", "state", "city", "gender", "date_of_birth", "nationality", "occupation", "organisation", "qualification", "interest"] as const;

/** Loads the signed-in student's Academy profile, creating it from sign-up details on first visit. */
export function useAcademyProfile() {
  return useQuery({
    queryKey: ["academy-profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const user = u.user;
      if (!user) throw new Error("Not signed in");
      const { data } = await supabase.from("academy_profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (data) return { profile: data as AcademyProfile, email: user.email ?? "" };
      const m = (user.user_metadata ?? {}) as Record<string, string | undefined>;
      const row: Record<string, unknown> = { user_id: user.id };
      for (const k of META_KEYS) row[k] = m[k] || null;
      row.first_name = m.first_name || (m.full_name ?? "").split(" ")[0] || "";
      row.last_name = m.last_name || (m.full_name ?? "").split(" ").slice(1).join(" ") || "";
      row.years_experience = m.years_experience ? Number(m.years_experience) : null;
      row.consent_at = m.consent_at || null;
      const { data: created, error } = await supabase.from("academy_profiles").insert(row as never).select("*").single();
      if (error) throw error;
      return { profile: created as AcademyProfile, email: user.email ?? "" };
    },
  });
}

export const REQUIRED_PROFILE: (keyof AcademyProfile)[] = ["first_name", "last_name", "phone", "country", "state", "city", "occupation", "qualification", "interest"];
export function completion(p?: AcademyProfile) {
  if (!p) return 0;
  return Math.round((REQUIRED_PROFILE.filter((k) => p[k] != null && String(p[k]).trim() !== "").length / REQUIRED_PROFILE.length) * 100);
}

export function PortalShell({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { pathname } = useLocation();
  const { data } = useAcademyProfile();
  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/academy/login", replace: true });
  };
  return (
    <div className="bg-surface px-4 py-8 sm:px-6 md:py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[14rem_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">GET Energy Academy</p>
          {data ? <p className="mt-1 text-sm font-semibold">{data.profile.first_name} {data.profile.last_name}<span className="block font-mono text-xs text-muted-foreground">{data.profile.student_id}</span></p> : null}
          <nav aria-label="Academy portal" className="mt-4 flex gap-1 overflow-x-auto pb-2 md:flex-col md:overflow-visible">
            {PORTAL_NAV.map((n) => (
              <Link key={n.to} to={n.to} className={cn("flex min-h-11 shrink-0 items-center rounded-md px-3 text-sm",
                pathname === n.to ? "bg-primary font-semibold text-primary-foreground" : "text-foreground hover:bg-card")}>{n.label}</Link>
            ))}
          </nav>
          <Button variant="outline" className="mt-3 min-h-11 w-full" onClick={signOut}><LogOut className="mr-2 size-4" />Sign out</Button>
        </aside>
        <main>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          {intro ? <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{intro}</p> : null}
          <div className="mt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function Panel({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border border-border bg-card p-4 sm:p-5", className)}>
      {title ? <h2 className="mb-3 text-lg font-bold">{title}</h2> : null}
      {children}
    </section>
  );
}

export const WALLET_NOTICE = "GFA Wzip Wallet payment integration is pending configuration. No money is taken on this site yet. Your payment request is saved, and the Academy team will confirm the fee and payment instructions before any payment is made.";

export function portalHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} | GET Energy Academy` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | GET Energy Academy` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  };
}

export function useMyAcademy() {
  return useQuery({
    queryKey: ["academy-mine"],
    queryFn: async () => {
      const [a, d, p] = await Promise.all([
        supabase.from("service_requests").select("id, reference, service_name, request_type, status, created_at").like("request_type", "academy-%").order("created_at", { ascending: false }),
        supabase.from("academy_documents").select("id, doc_type, file_name, status, reviewer_note, created_at, file_path, size_bytes").order("created_at", { ascending: false }),
        supabase.from("academy_payments").select("*").order("created_at", { ascending: false }),
      ]);
      return { apps: a.data ?? [], docs: d.data ?? [], pays: p.data ?? [] };
    },
  });
}


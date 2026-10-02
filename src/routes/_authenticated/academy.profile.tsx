import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortalShell, Panel, useAcademyProfile, completion, portalHead, type AcademyProfile } from "@/components/academy/portal";

export const Route = createFileRoute("/_authenticated/academy/profile")({
  head: () => portalHead("My profile", "Update your GET Energy Academy applicant profile."),
  component: ProfilePage,
});

const FIELDS: [keyof AcademyProfile, string, string?][] = [
  ["first_name", "First name *"], ["middle_name", "Middle name"], ["last_name", "Last name *"], ["phone", "Mobile / WhatsApp *", "tel"],
  ["country", "Country *"], ["state", "State / Province *"], ["city", "City *"], ["gender", "Gender (optional)"],
  ["date_of_birth", "Date of birth (only if a programme requires it)", "date"], ["nationality", "Nationality"], ["occupation", "Current occupation *"],
  ["organisation", "Organisation / Employer"], ["qualification", "Highest qualification *"], ["years_experience", "Years of experience", "number"], ["interest", "Primary area of interest *"],
];

function ProfilePage() {
  const { data } = useAcademyProfile();
  return (
    <PortalShell title="My profile" intro={`Profile ${completion(data?.profile)}% complete. Fields marked * are needed before an application can be reviewed.`}>
      {data ? <ProfileForm key={data.profile.user_id} p={data.profile} email={data.email} /> : <p className="text-sm">Loading…</p>}
    </PortalShell>
  );
}

function ProfileForm({ p, email }: { p: AcademyProfile; email: string }) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const [k, , t] of FIELDS) {
      const v = String(f.get(k) ?? "").trim().slice(0, 200);
      row[k] = v === "" ? null : t === "number" ? Number(v) : v;
    }
    if (!row.first_name || !row.last_name) return toast.error("First and last name are required.");
    setBusy(true);
    const { error } = await supabase.from("academy_profiles").update(row as never).eq("user_id", p.user_id);
    setBusy(false);
    if (error) return toast.error("Could not save your profile.");
    toast.success("Profile saved");
    qc.invalidateQueries({ queryKey: ["academy-profile"] });
  };
  return (
    <Panel>
      <p className="text-sm">Student ID <span className="font-mono font-bold">{p.student_id}</span> · {email}</p>
      <form onSubmit={save} className="mt-4 grid gap-4 sm:grid-cols-2">
        {FIELDS.map(([k, l, t]) => (
          <div key={k}><Label htmlFor={k}>{l}</Label><Input id={k} name={k} type={t ?? "text"} defaultValue={p[k] == null ? "" : String(p[k])} className="mt-1" /></div>
        ))}
        <div className="sm:col-span-2"><Button type="submit" className="min-h-11" disabled={busy}>{busy ? "Saving…" : "Save profile"}</Button></div>
      </form>
    </Panel>
  );
}

import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, LogOut, Save, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero, Section, SectionHeading } from "@/components/site/ui-bits";
import { BRAND } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My Account | GetEnergy Dashboard" },
      { name: "description", content: "View your GetEnergy profile and track the status of your service requests." },
      { property: "og:title", content: "My Account | GetEnergy" },
      { property: "og:description", content: "Your profile and submitted energy service requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountPage,
});

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  in_review: "In review",
  contacted: "Contacted",
  in_progress: "In progress",
  closed: "Closed",
  new: "New",
  "in review": "In review",
  "pending partner integration": "Pending partner integration",
  "waiting for customer": "Waiting for you",
  "converted to customer": "Converted to customer",
};

const STATUS_STYLES: Record<string, string> = {
  submitted: "bg-secondary text-secondary-foreground",
  new: "bg-secondary text-secondary-foreground",
  "in review": "bg-secondary text-secondary-foreground",
  "pending partner integration": "bg-secondary text-secondary-foreground",
  "waiting for customer": "bg-secondary text-secondary-foreground",
  contacted: "bg-brand-green-soft text-brand-green",
  in_progress: "bg-brand-green-soft text-brand-green",
  "converted to customer": "bg-brand-green-soft text-brand-green",
  closed: "bg-muted text-muted-foreground",
};

const statusLabel = (status: string) => STATUS_LABELS[status.toLowerCase()] ?? status;
const statusStyle = (status: string) => STATUS_STYLES[status.toLowerCase()] ?? "bg-muted text-muted-foreground";

function AccountPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, account_type, company_name, phone, email")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data ?? { id: userId, full_name: "", account_type: "individual", company_name: "", phone: "", email: userData.user?.email ?? "" };
    },
  });

  const requestsQuery = useQuery({
    queryKey: ["my-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_requests")
        .select("id, reference, service_name, request_type, status, created_at, location, details")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const electricityQuery = useQuery({
    queryKey: ["my-electricity-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("electricity_token_requests")
        .select("id, request_reference, disco, meter_type, meter_number, amount_ngn, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profileQuery.data) return;
    setFullName(profileQuery.data.full_name ?? "");
    setPhone(profileQuery.data.phone ?? "");
    setCompanyName(profileQuery.data.company_name ?? "");
  }, [profileQuery.data]);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        full_name: fullName.trim(),
        phone: phone.trim(),
        company_name: companyName.trim() || null,
        email: userData.user?.email ?? null,
        account_type: profileQuery.data?.account_type ?? "individual",
        updated_at: new Date().toISOString(),
      });
    setSaving(false);
    if (error) {
      toast.error("Could not save your profile.");
      return;
    }
    toast.success("Profile updated");
    void queryClient.invalidateQueries({ queryKey: ["profile"] });
  };

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };

  const profile = profileQuery.data;
  const requests = requestsQuery.data ?? [];
  const electricityRequests = electricityQuery.data ?? [];

  return (
    <>
      <PageHero
        eyebrow="Dashboard"
        title={profile?.full_name ? `Welcome, ${profile.full_name}` : "My account"}
        body="Your profile details and every service request you have submitted, with its current status."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">
            <Link to="/contact">{BRAND.primaryCta}</Link>
          </Button>
          <Button
            variant="outline"
            onClick={signOut}
            className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Card className="card-elevated">
            <CardHeader>
              <div className="flex items-center gap-3">
                {profile?.account_type === "business" ? (
                  <Building2 className="size-5 text-brand-green" />
                ) : (
                  <User className="size-5 text-brand-green" />
                )}
                <CardTitle>My profile</CardTitle>
              </div>
              <CardDescription>
                {profile?.account_type === "business" ? "Business account" : "Individual account"} · {profile?.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveProfile} className="space-y-4">
                <div>
                  <Label htmlFor="acc-name" className="mb-2 block">Full name</Label>
                  <Input id="acc-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="acc-phone" className="mb-2 block">Phone number</Label>
                  <Input id="acc-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="acc-company" className="mb-2 block">Company name</Label>
                  <Input id="acc-company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <Button type="submit" disabled={saving}>
                  <Save className="size-4" />
                  {saving ? "Saving…" : "Save changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div>
            <SectionHeading eyebrow="My requests" title={`${requests.length} request${requests.length === 1 ? "" : "s"}`} />
            <div className="mt-6 space-y-4">
              {requestsQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Loading your requests…</p>
              ) : requests.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      You have not submitted a request yet. Requests made while signed in appear here.
                    </p>
                    <Button asChild className="mt-4">
                      <Link to="/contact">{BRAND.primaryCta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                requests.map((request) => (
                  <Card key={request.id} className="card-elevated">
                    <CardContent className="pt-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-display text-sm font-bold text-brand">{request.reference}</p>
                          <h3 className="mt-1 font-semibold">{request.service_name}</h3>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusStyle(request.status)}`}
                        >
                          {statusLabel(request.status)}
                        </span>
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Submitted {new Date(request.created_at).toLocaleDateString()}
                        {request.location ? ` · ${request.location}` : ""}
                      </p>
                      {request.details && Object.keys(request.details as Record<string, string>).length > 0 ? (
                        <dl className="mt-4 grid gap-2 sm:grid-cols-2">
                          {Object.entries(request.details as Record<string, string>).map(([key, value]) => (
                            <div key={key} className="text-xs">
                              <dt className="font-semibold text-muted-foreground">{key}</dt>
                              <dd className="mt-0.5">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Electricity" title="My electricity token requests" />
        <p className="mt-2 text-sm text-muted-foreground">
          GETELEC requests you submitted while signed in. No payment has been taken and no token has been issued for these requests.
        </p>
        <div className="mt-6 space-y-4">
          {electricityQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading your electricity requests…</p>
          ) : electricityRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  You have not submitted an electricity token request yet. Requests made while signed in appear here.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/get-electricity">Request an electricity token</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            electricityRequests.map((request) => (
              <Card key={request.id} className="card-elevated">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-display text-sm font-bold text-brand">{request.request_reference}</p>
                      <h3 className="mt-1 font-semibold">
                        {request.disco} · {request.meter_type} meter {request.meter_number}
                      </h3>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusStyle(request.status)}`}
                    >
                      {statusLabel(request.status)}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Submitted {new Date(request.created_at).toLocaleDateString()} · ₦{request.amount_ngn.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </Section>
    </>
  );
}

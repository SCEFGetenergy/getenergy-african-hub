import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PageHero, Section } from "@/components/site/ui-bits";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login or Register | GetEnergy Account" },
      {
        name: "description",
        content:
          "Create a GetEnergy individual or business account to submit energy service requests and track their status in your dashboard.",
      },
      { property: "og:title", content: "Login or Register | GetEnergy" },
      { property: "og:description", content: "Manage your energy requests in one account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [accountType, setAccountType] = useState("individual");

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/account", replace: true });
    });
  }, [navigate]);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed in");
    navigate({ to: "/account" });
  };

  const signUp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (accountType === "business" && !companyName.trim()) {
      toast.error("Business accounts need a company name.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
          company_name: companyName.trim(),
          account_type: accountType,
        },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) {
      setEmailSent(true);
      toast.success("Check your email to confirm your account.");
      return;
    }
    toast.success("Account created");
    navigate({ to: "/account" });
  };

  const googleSignIn = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/account" });
  };

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Login or create your GetEnergy account"
        body="An account lets you submit service requests, keep your details on file and track the status of every request you make."
      />

      <Section>
        <div className="mx-auto max-w-lg">
          {emailSent ? (
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Confirm your email</CardTitle>
                <CardDescription>
                  We sent a confirmation link to {email}. Click it to activate your account, then sign in.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => { setEmailSent(false); setMode("signin"); }}>
                  Back to sign in
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Welcome to GetEnergy</CardTitle>
                <CardDescription>Individual and business accounts supported.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={mode} onValueChange={(v) => setMode(v as "signin" | "signup")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign in</TabsTrigger>
                    <TabsTrigger value="signup">Register</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="mt-6">
                    <form onSubmit={signIn} className="space-y-4">
                      <div>
                        <Label htmlFor="signin-email" className="mb-2 block">Email</Label>
                        <Input id="signin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="signin-password" className="mb-2 block">Password</Label>
                        <Input id="signin-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                      </div>
                      <Button type="submit" className="w-full" disabled={busy}>
                        {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                        Sign in
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="mt-6">
                    <form onSubmit={signUp} className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Account type</Label>
                        <RadioGroup value={accountType} onValueChange={setAccountType} className="flex gap-6">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="individual" id="type-individual" />
                            <Label htmlFor="type-individual" className="font-normal">Individual</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="business" id="type-business" />
                            <Label htmlFor="type-business" className="font-normal">Business</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div>
                        <Label htmlFor="signup-name" className="mb-2 block">Full name</Label>
                        <Input id="signup-name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                      </div>
                      {accountType === "business" ? (
                        <div>
                          <Label htmlFor="signup-company" className="mb-2 block">Company name</Label>
                          <Input id="signup-company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                        </div>
                      ) : null}
                      <div>
                        <Label htmlFor="signup-phone" className="mb-2 block">Phone number</Label>
                        <Input id="signup-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="signup-email" className="mb-2 block">Email</Label>
                        <Input id="signup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="signup-password" className="mb-2 block">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          required
                          minLength={8}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className="mt-1.5 text-xs text-muted-foreground">Minimum 8 characters.</p>
                      </div>
                      <Button type="submit" className="w-full" disabled={busy}>
                        {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                        Create account
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="my-6 flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
                  <span className="h-px flex-1 bg-border" />
                </div>

                <Button type="button" variant="outline" className="w-full" onClick={googleSignIn} disabled={busy}>
                  Continue with Google
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </Section>
    </>
  );
}

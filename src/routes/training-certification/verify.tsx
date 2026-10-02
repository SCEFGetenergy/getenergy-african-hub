import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section, SectionHeading } from "@/components/site/ui-bits";
import { getCertification } from "@/lib/certifications";

const TITLE = "Verify a GETS Credential | GET Energy Academy";
const DESC = "Check the status of a GET Energy professional certification by credential ID.";

export const Route = createFileRoute("/training-certification/verify")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Verify,
});

const FORMAT = /^GETS-([A-Z]{4,6})-(\d{2})-(\d{6})$/;

function Verify() {
  const [id, setId] = useState("");
  const [result, setResult] = useState<string | null>(null);
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const m = id.trim().toUpperCase().match(FORMAT);
    if (!m || !getCertification(m[1] ?? "")) {
      setResult("That isn't a valid credential ID. Credential IDs look like GETS-CDESP-27-000124.");
      return;
    }
    setResult("No credential with this ID was found. GETS professional certifications have not yet been awarded, so no credentials can be verified at this time.");
  }
  return (
    <Section tone="surface">
      <div className="mx-auto max-w-2xl">
        <SectionHeading eyebrow="Credential verification" title="Verify a GETS credential" body="Enter a credential ID, or scan the QR code on a certificate, to see the holder's name, certification, credential code, issue date, valid-until date, status and professional level." />
        <form onSubmit={onSubmit} className="mt-8 rounded-2xl border border-border bg-card p-6 card-elevated">
          <Label htmlFor="cred">Credential ID</Label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Input id="cred" value={id} onChange={(e) => setId(e.target.value)} placeholder="GETS-CDESP-27-000124" maxLength={30} className="h-11 font-mono" />
            <Button type="submit" className="min-h-11">Verify</Button>
          </div>
          {result ? <p role="status" className="mt-4 rounded-lg bg-surface p-4 text-sm">{result}</p> : null}
        </form>
      </div>
    </Section>
  );
}

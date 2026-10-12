import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/ui-bits";

export const Route = createFileRoute("/policies/refunds")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Electricity Tokens | GetEnergy" },
      { name: "description", content: "How GetEnergy refunds electricity token purchases that fail, are reversed or cannot be completed." },
      { property: "og:title", content: "Refund Policy — Electricity Tokens | GetEnergy" },
      { property: "og:url", content: "https://getenergy.ng/policies/refunds" },
      { property: "og:description", content: "How GetEnergy refunds electricity token purchases that fail, are reversed or cannot be completed." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/policies/refunds" }],
  }),
  component: RefundsPage,
});

function RefundsPage() {
  return (
    <>
      <PageHero eyebrow="Electricity tokens" title="Refund Policy" body="GET Energy Trading Services Ltd · Draft placeholder pending legal review" />
      <Section>
        <article className="mx-auto max-w-3xl space-y-4 text-foreground [&_h2]:text-xl [&_h2]:font-bold">
          <h2>1. When you are refunded</h2>
          <p>If your payment is confirmed but your token cannot be delivered — because the electricity company declined the purchase, reversed it, or we could not complete it within 60 minutes — we refund the full amount you paid to your original payment method.</p>
          <h2>2. Pending purchases</h2>
          <p>Some purchases take a few minutes to confirm with the electricity company. We check them automatically for up to 30 minutes. If a purchase is still unconfirmed, our team reviews it and either completes it or refunds you.</p>
          <h2>3. Delivered tokens</h2>
          <p>Tokens that have been delivered cannot be refunded, because the electricity value has already been credited to the meter. Please check your DISCO, meter number and amount before paying.</p>
          <h2>4. How long refunds take</h2>
          <p>Refunds are started automatically. How quickly the money reaches you depends on your bank or payment provider.</p>
          <h2>5. Need help?</h2>
          <p>Use “Token not received?” on the Get Electricity page with your order reference, or contact us at ccgetenergy@gmail.com.</p>
        </article>
      </Section>
    </>
  );
}

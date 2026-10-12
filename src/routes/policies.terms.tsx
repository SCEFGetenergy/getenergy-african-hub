import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/ui-bits";

export const Route = createFileRoute("/policies/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Purchase — Electricity Tokens | GetEnergy" },
      { name: "description", content: "Terms for buying electricity tokens and paying electricity bills through GetEnergy." },
      { property: "og:title", content: "Terms of Purchase — Electricity Tokens | GetEnergy" },
      { property: "og:url", content: "https://getenergy.ng/policies/terms" },
      { property: "og:description", content: "Terms for buying electricity tokens and paying electricity bills through GetEnergy." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/policies/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Electricity tokens" title="Terms of Purchase" body="GET Energy Trading Services Ltd · Draft placeholder pending legal review" />
      <Section>
        <article className="mx-auto max-w-3xl space-y-4 text-foreground [&_h2]:text-xl [&_h2]:font-bold">
          <h2>1. Who we are</h2>
          <p>GET Energy Trading Services Ltd (“GetEnergy”) sells electricity tokens and accepts electricity bill payments through a licensed vending partner. GetEnergy is not an electricity distribution company (DISCO).</p>
          <h2>2. Your details</h2>
          <p>You are responsible for choosing the correct DISCO, meter type and meter number. We show the customer name returned by the DISCO so you can confirm it before you pay.</p>
          <h2>3. Minimum amounts</h2>
          <p>Each DISCO sets a minimum purchase, which may be higher when a meter has outstanding arrears. We show the minimum after verifying your meter.</p>
          <h2>4. Payment and delivery</h2>
          <p>Your purchase is only processed after your payment is confirmed. Prepaid tokens are shown on screen and sent by email and SMS; postpaid payments receive a confirmation with a transaction reference.</p>
          <h2>5. Failures and refunds</h2>
          <p>If a purchase cannot be completed, our Refund policy applies.</p>
          <h2>6. Draft notice</h2>
          <p>These terms are a placeholder pending legal review and may be updated.</p>
        </article>
      </Section>
    </>
  );
}

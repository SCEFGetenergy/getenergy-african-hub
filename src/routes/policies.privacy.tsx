import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/ui-bits";

export const Route = createFileRoute("/policies/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Notice — Electricity Token Purchases | GetEnergy" },
      { name: "description", content: "How GetEnergy collects and uses personal data for electricity token purchases, under the Nigeria Data Protection Act 2023." },
      { property: "og:title", content: "Privacy Notice — Electricity Token Purchases | GetEnergy" },
      { property: "og:url", content: "https://getenergy.ng/policies/privacy" },
      { property: "og:description", content: "How GetEnergy collects and uses personal data for electricity token purchases, under the Nigeria Data Protection Act 2023." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://getenergy.ng/policies/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Electricity tokens" title="Privacy Notice" body="GET Energy Trading Services Ltd · Draft placeholder pending legal review" />
      <Section>
        <article className="mx-auto max-w-3xl space-y-4 text-foreground [&_h2]:text-xl [&_h2]:font-bold">
          <h2>1. Data we collect</h2>
          <p>Your DISCO, meter number and type, the customer name and address returned by the DISCO, the amount, your phone number and email address, and payment and transaction references.</p>
          <h2>2. Why we use it</h2>
          <p>To verify your meter, process your payment and purchase, deliver your token and receipt, handle refunds and support, prevent fraud, and meet our legal and accounting obligations. Our lawful basis is the performance of your purchase contract and our legal obligations.</p>
          <h2>3. Who we share it with</h2>
          <p>Our electricity vending partner and the relevant DISCO (to complete the purchase), our payment provider (to take and refund payment), and messaging providers (to send your receipt). We do not sell your data.</p>
          <h2>4. How long we keep it</h2>
          <p>Transaction records are kept for as long as required for accounting, audit and legal purposes. Meter numbers are masked in our operational logs.</p>
          <h2>5. Your rights</h2>
          <p>Under the Nigeria Data Protection Act 2023 you may request access to, correction of, or deletion of your data, object to processing, and complain to the Nigeria Data Protection Commission. Contact us at ccgetenergy@gmail.com.</p>
          <h2>6. Draft notice</h2>
          <p>This notice is a placeholder pending legal review and may be updated.</p>
        </article>
      </Section>
    </>
  );
}

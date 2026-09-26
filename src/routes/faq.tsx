import { createFileRoute } from "@tanstack/react-router";
import { FAQS } from "@/lib/site";
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/site/ui-bits";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions | GetEnergy" },
      {
        name: "description",
        content:
          "Answers about GetEnergy's operating history, service status, electricity token requests, payment availability, EEA marketplace and what happens after you submit a request.",
      },
      { property: "og:title", content: "Frequently Asked Questions | GetEnergy" },
      { property: "og:description", content: "What we do today, what we are building, and how requests work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Faq,
});


function Faq() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Questions we are asked most" body="Straight answers, including about the things that did not work." />

      <Section>
        <SectionHeading eyebrow="Answers" title="Frequently asked questions" />
        <Accordion type="single" collapsible className="mt-8">
          {FAQS.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <CtaBand />
    </>
  );
}

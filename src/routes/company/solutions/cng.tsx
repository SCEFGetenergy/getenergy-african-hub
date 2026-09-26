import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import { getService } from "@/lib/site";

const SLUG = "cng";

export const Route = createFileRoute("/company/solutions/cng")({
  head: () => {
    const service = getService(SLUG);
    const title = `${service.title} | GetEnergy`;
    return {
      meta: [
        { title },
        { name: "description", content: service.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: service.summary },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: () => <ServicePage slug={SLUG} />,
});

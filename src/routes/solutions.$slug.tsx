import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { CleanMobilityServicePage, cmHead } from "@/components/site/CleanMobility";
import { CLEAN_MOBILITY_PAGES, TRAINING_LINK } from "@/lib/clean-mobility";

export const Route = createFileRoute("/solutions/$slug")({
  beforeLoad: ({ params }) => {
    if (params.slug === "green-energy-training") throw redirect({ href: TRAINING_LINK, statusCode: 301 });
  },
  loader: ({ params }) => {
    const page = CLEAN_MOBILITY_PAGES.find((p) => p.slug === params.slug);
    if (!page) throw notFound();
    return { slug: page.slug };
  },
  head: ({ loaderData }) => {
    const page = CLEAN_MOBILITY_PAGES.find((p) => p.slug === loaderData?.slug);
    if (!page) return { meta: [{ title: "Not found | GETENERGY" }, { name: "robots", content: "noindex" }] };
    return cmHead(page.title, page.description, `/solutions/${page.slug}`);
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useLoaderData();
  const page = CLEAN_MOBILITY_PAGES.find((p) => p.slug === slug)!;
  return <CleanMobilityServicePage page={page} />;
}

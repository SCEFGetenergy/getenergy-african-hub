/**
 * Service and sector slugs each have a matching top-level route file, but the
 * slug strings come from data, so the router's literal path union cannot be
 * inferred. This helper keeps the single assertion in one place.
 */
export function routePath(slug: string) {
  return `/${slug}` as "/diesel";
}

<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules

- All site content (services, sectors, journey, FAQs, jobs, form field definitions) lives in `src/lib/site.ts`; pages read from it so copy changes happen in one file.
- Service pages are thin route files rendering `src/components/site/ServicePage.tsx` from the `SERVICES` data — add a service by adding data plus a one-line route file.
- Lead capture goes through the `submit_service_request` database function (security definer), not a direct table insert: anonymous visitors must receive a reference without being able to read the requests table.
- Route links built from data slugs use `routePath()` in `src/lib/paths.ts`, the single place asserting data strings into the router's typed path union.

- Site markup, styles and behaviour come verbatim from the client's supplied HTML, stored in `src/legacy/` (body.html, legacy.css, legacy.ts) and rendered by `LegacySite` in __root; route files only supply URL + head metadata. Why: the client requires the site to match their file exactly.
- Additional earlier corporate pages live under `/company/*` and render React children through `LegacySite` while the supplied HTML pages retain their existing paths and appearance. Why: preserve the supplied design and add the prior content without replacing it.
- Legacy forms submit through `submit_service_request` and Supabase auth inside `LegacySite`'s submit handler.
- The `/projects` page uses historical references in the legacy shell with a separate route for metadata; this preserves the supplied site styling while making those references shareable.
- Keep the Energy Desk interest form in the shared footer rather than the homepage; this keeps registration reachable from every page after the homepage was shortened.
- SOPHIA chat threads are owned by a random browser visitor token and accessed only through server functions/route using the admin client (tables have RLS with no policies). Why: anonymous visitors need persistent threads without exposing other visitors' chats.
- SOPHIA's knowledge/system brief lives in `src/lib/sophia/brief.md`, loaded by `/api/sophia`; enquiries she captures are inserted into `service_requests` with request_type `sophia`. Why: one editable source for her behaviour and one lead table for the team.
- Energy-saving equipment uses the legacy-shell enquiry form and request-reference flow, not a shopping checkout. Why: availability and commercial terms must be confirmed before any order or payment is represented.
- GET Energy Academy catalogue lives in `src/lib/academy.ts` (generated from the brief) and its React pages under `/training-certification/*` render through `LegacySite`; waiting-list/corporate forms use `submit_service_request` with request types `academy-waitlist`/`academy-corporate`. Why: one catalogue source for pages, filters and SOPHIA.

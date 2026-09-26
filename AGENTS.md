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
- Legacy forms submit through `submit_service_request` and Supabase auth inside `LegacySite`'s submit handler.

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
- Lead capture goes through the `submit_service_request` database function (security definer), not a direct table insert: anonymous visitors must receive a reference without being able to read the requests table.

- Site markup, styles and behaviour come verbatim from the client's supplied HTML, stored in `src/legacy/` (body.html, legacy.css, legacy.ts) and rendered by `LegacySite` in __root; route files only supply URL + head metadata. Why: the client requires the site to match their file exactly.
- Each topic has one canonical route; retired URLs (/company/*, /smart-metering, /solar-power, /training) are one-hop 301 redirects in their route files straight to the final page/anchor. Why: no duplicate indexing or broken inbound links.
- Legacy forms submit through `submit_service_request` and Supabase auth inside `LegacySite`'s submit handler.
- The `/projects` page uses historical references in the legacy shell with a separate route for metadata; this preserves the supplied site styling while making those references shareable.
- Keep the Energy Desk interest form in the shared footer rather than the homepage; this keeps registration reachable from every page after the homepage was shortened.
- SOPHIA chat threads are owned by a random browser visitor token and accessed only through server functions/route using the admin client (tables have RLS with no policies). Why: anonymous visitors need persistent threads without exposing other visitors' chats.
- SOPHIA's knowledge/system brief lives in `src/lib/sophia/brief.md`, loaded by `/api/sophia`; enquiries she captures are inserted into `service_requests` with request_type `sophia`. Why: one editable source for her behaviour and one lead table for the team.
- Energy-saving equipment uses the legacy-shell enquiry form and request-reference flow, not a shopping checkout. Why: availability and commercial terms must be confirmed before any order or payment is represented.
- GET Energy Academy catalogue lives in `src/lib/academy.ts` (generated from the brief) and its React pages under `/training-certification/*` render through `LegacySite`; waiting-list/corporate forms use `submit_service_request` with request types `academy-waitlist`/`academy-corporate`. Why: one catalogue source for pages, filters and SOPHIA.
- Team admin lives at `/_authenticated/admin`, gated by `has_role(..,'admin')` in `user_roles`; certification fees/recognised employers are stored in `certification_settings`/`certification_employers` (public read, admin write via RLS) and read by public pages. Why: staff edit live data without code changes, and roles stay out of profiles.
- Academy student portal lives at `/academy/*` (public register/login/reset) and `/_authenticated/academy/*`, sharing `src/components/academy/portal.tsx`; applications reuse `submit_service_request`. Why: one lead/request table and reference format across the site.
- Audit entries are written only by the `write_audit()` database trigger, never by app code; team roles are granted through hashed, expiring `admin_invitations` accepted via RPC. Why: tamper-resistant history and no client-side role grants.
- Academy payments are stored as `pending_configuration` requests until the GFA Wzip Wallet integration exists; clients cannot set any other status. Why: never represent an unpaid fee as paid.
- The first admin is created once via /admin-setup with a hashed one-time code (claim_first_admin RPC, locks after use or 10 bad attempts, closed once any admin exists); later admins only via invitations. Why: no manual database edits and no open self-promotion.
- GetEnergy Token administration is authorized server-side through the existing admin role until a distinct super-admin assignment flow is introduced; never trust browser role state. Why: provider and go-live controls must remain restricted.
- Electricity token enquiries and sandbox transactions use dedicated database tables and validated database functions, separate from general service leads. Why: custom references, simulation-only records and operational audits need an explicit trust boundary.

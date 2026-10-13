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

- Corporate copy is centralized in src/lib/site.ts; Academy catalogue in src/lib/academy.ts. Why: one editable source per domain.
- Preserve the client's legacy HTML/CSS/behavior through LegacySite; leaf routes supply URL and metadata. Render only the active data-page block and bind each mounted scope. Why: exact design and one page per URL.
- Each topic has one canonical route; retired URLs redirect once to the final destination, unknown paths are noindex. Why: no duplicate indexing.
- Forms use submit_service_request (or dedicated electricity RPCs), never anonymous direct inserts; show request references. Why: anonymous leads without exposing lead tables.
- Historical projects remain in the legacy shell; Energy Desk signup stays in the shared footer. Why: preserve shareable references and universal signup access.
- Energy-saving equipment uses enquiries, not checkout. Why: availability and commercial terms need confirmation.
- SOPHIA threads belong to random visitor tokens; access only through server handlers with admin clients and policy-free RLS tables. Keep her brief in src/lib/sophia/brief.md and leads in service_requests. Why: private anonymous chats and centralized behavior.
- Academy pages render in LegacySite; portal shares components/academy/portal.tsx and applications reuse lead RPCs. Waiting-list/corporate forms use academy-waitlist/academy-corporate. Why: shared references and catalogue.
- Team admin is permission-gated by has_permission() and RLS; full admins have all, staff have explicit admin_permissions set only by admins. Why: database-enforced section access.
- Certification settings/employers are public-read, admin-write database records. Why: staff edit live data without code changes.
- Audit entries come only from write_audit() triggers; invitations are hashed, expiring RPC claims. Why: tamper-resistant history and no client role grants.
- Academy payments remain pending_configuration until the wallet integration exists. Why: no unpaid fee represented as paid.
- First admin uses the locked, hashed one-time claim_first_admin flow; later admins use invitations. Why: no open promotion.
- Token administration uses existing server-verified admin roles until a distinct super-admin flow exists. Why: never trust browser privileges.
- Token enquiries and sandbox operations have dedicated tables and validated RPCs. Why: separate operational trust boundary from general leads.
- Service availability/notices are public-read, admin-write, audited records rendered by SiteNotices; admin groups queues in tabs. Availability never enables payments. Why: safe staff-managed announcements.
- Live electricity modules stay in src/lib/electricity behind ELECTRICITY_LIVE; payments are server-confirmed, each order stores one VTpass request_id, and electricity_claim_vend atomically claims vending. Why: no double-vend or browser-trusted payment.
- Gateways implement PaymentGateway and are selected by PAYMENT_GATEWAY; mock refuses live VTpass. Why: safe provider substitution.
- Homepage electricity controls use stable legacy-shell portal slots; sessionStorage plus an external prefill bridge carries quick-start data into unchanged forms. Existing live configuration determines eligibility. Why: preserve references and other pages.

# GetEnergy Token platform

## Goal
Build the uploaded GetEnergy Token foundation while keeping public electricity payments and real vending unavailable. Keep the existing GetEnergy site and Academy intact.

## User-facing changes
- Keep the public electricity page visibly marked “Electricity tokens · online payment launching soon” and retain the no-payment/no-token disclaimer. Add the full request form from the brief and give these enquiries their own `GETELEC-YYYYMMDD-XXXX` reference format without changing other site references.
- Add a signed-in `/app/getenergy-token` workspace with dashboard, buy-electricity, meter verification, payment, token result, transactions, saved meters, wallet, support, agent, corporate and admin views. Provide a clear sandbox label; generated meter checks, payments, units, tokens and wallet activity are simulations only and cannot be mistaken for live service.
- Add an electricity operations area for authorised admins: overview, enquiries, transactions and support; search/filter, status changes, internal notes, assignment and CSV export. Restrict provider configuration and go-live checklist completion to a separately authorised super-admin role.

## Platform and safeguards
- Add structured electricity requests, saved meters, verification logs, sandbox transactions, support tickets and operational settings with explicit grants, row-level access rules and audit history. Keep user roles in a dedicated role table, never profiles. Anonymous visitors can submit enquiries but cannot read them; signed-in users see only their records; staff/admin access is checked server-side and enforced in the database.
- Implement the brief's supported DisCo and prepaid/postpaid flow in sandbox, including clearly synthetic meter verification, mock-payment and mock-token outcomes plus pending/delayed/failed/reversal states. No card charge, transfer, real wallet funds, real token or real provider call will occur.
- Keep the platform sandbox-only. As requested, leave live-mode switching locked until a super admin is appointed; do not add credentials, provider secrets, live payment, or a route that can activate live service now. Treat API, payment, messaging, settlement and webhook features as unconfigured placeholders.
- Use server-validated inputs and protected server-side operations for simulation and privileged changes. Preserve the site's existing authentication conventions, responsive branding and WCAG-friendly controls.

## Technical approach
- Use TanStack Start file routes under `src/routes/_authenticated/app.getenergy-token.*`; all private screens remain behind the existing authenticated layout. Add only routes needed for the requested workspace, with leaf-page metadata and noindex where appropriate.
- Apply database changes through the Lovable Database migration tool, with explicit grants, RLS, role checks and audit triggers. Use the existing `submit_service_request` path for general site forms; use a narrowly validated electricity-intake RPC for the custom reference format and admin workflow.
- Add focused rule tests for the custom reference and sandbox-only/no-live behavior, then verify the public request confirmation, private route access, simulated purchase states and admin list on desktop and phone.

## Not included
Live DisCo/aggregator vending, real payment providers, SMS/email/WhatsApp delivery, wallet funding/withdrawals, external API credentials, and a live-mode switch. These require approved integrations and a super-admin appointment; the site continues to say launching soon until then.

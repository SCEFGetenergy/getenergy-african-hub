# Visitor reply form mapping

All replies are sent only from the existing token-verified `/api/public/lead-alert` notification after a saved lead. They do not run in the browser or delay the form RPC. Missing/invalid email addresses are skipped. Duplicate Academy registrations return their existing reference without inserting or resending. The visitor send has a stable event-specific Resend idempotency key.

| Live form / entry point | Saved request type | Template |
| --- | --- | --- |
| Academy programme/course/pathway pages, main waiting list, portal programme application | academy-application, academy-waitlist | 1 Academy waiting list |
| Professional certification pages and portal application | academy-certification | 1 Academy waiting list |
| Legacy training enquiry, if mounted | training | 1 Academy waiting list |
| Careers / talent network | careers | 2 Careers |
| Request an Energy Solution / Contact | contact | 3 General enquiry, no questions |
| Request an energy quote | quote | 3 Service enquiry; selected “What do you need?” determines questions |
| Diesel supply | fuel | 3 Diesel questions |
| Community electricity / bulk vending | community | 3 Power questions |
| Power as a Service | paas | 3 Power questions |
| CNG conversion / booking | cngbook | 3 CNG questions |
| CNG refuelling / maintenance | cng-refuelling, cng-maintenance | 3 CNG questions |
| EV vehicle enquiry / EV & hybrid services | ev, ev-hybrid-services | 3 EV questions |
| Fleet transition | fleet-transition | 3 EV questions (CNG questions where selected explicitly) |
| Host a charging/refuelling site / charging location partner | host-site | 3 Selected solution questions, default EV |
| EEA / investor enquiries | eea, invest | 3 Partner/investor questions |
| Energy-saving equipment | equipment | 3 Equipment questions |
| Bill-payment enquiry | bills | 3 General enquiry, no questions |
| Energy Desk / WhatsApp signup (shared footer) | whatsapp | 3 General enquiry, no questions |
| SOPHIA saved enquiry | sophia | 3 Service enquiry; stored category/service determines questions |
| Signed-in Academy support | academy-support | 3 General enquiry, no questions |
| Electricity token request | electricity_token_requests table | 4 Electricity token request |
| Corporate training | academy-corporate | 5 Corporate training |

Smart-metering, solar/BESS/mini-grid, partner and other service enquiries through quote/SOPHIA are template 3 with the relevant service question set. Unknown services receive template 3 without questions or the “reply before we call” step.

## Not lead submissions (unchanged)

Sign-in/sign-up/password reset, profile changes, administrator setup/team invitation claims, document/CV uploads, certification verification/search and payment-intent/checkout operations are not saved through either lead table and do not send these five replies. Existing authentication emails remain separate. Academy payment requests and document uploads have no matching approved reply template; no new notifications are added to these unrelated account operations.

## Sender activation

With no `VISITOR_REPLY_FROM`, only `ccgetenergy@gmail.com` receives test replies from `GET Energy <onboarding@resend.dev>`. Other visitors are skipped with `visitor reply skipped: no verified sender`. After Resend verifies `notify.getenergy.ng`, set `VISITOR_REPLY_FROM` to `GET Energy <hello@notify.getenergy.ng>`. This setting is an owner-controlled readiness signal, not an automatic DNS verification check. Owner alerts continue to use `LEAD_ALERT_FROM` unchanged. Publishing is required to activate this code on the published site.

## Verification (27 November 2026)

- All 217 tests passed; preview build reported OK.
- Submitted one real preview form for each type; all five submission RPCs returned 200 and references were read back from storage and displayed in the UI.
- Academy registration intentionally uses the authenticated account's email rather than the editable form email. For this isolated test only, the saved temporary Academy lead was updated to the owner inbox before testing the notification. No registration/authentication logic was changed.
- Exercised the token-verified local preview alert handler against each saved test row. All five owner alerts and all five visitor replies reached Resend, but all ten were rejected with HTTP 400: `API key is invalid`. Each handler retained the existing owner-failure HTTP 502 response. Visitor failures did not affect the previously successful submissions.
- The existing trigger targets `https://getenergy.ng/api/public/lead-alert`, not the unpublished local preview. Its five automatic callbacks showed three timeouts and two HTTP 200 results; these are not evidence of Resend acceptance or inbox receipt. The trigger destination was not changed.
- Deleted only the five test rows by exact ID/reference. No schema, page copy, design or published deployment changed.
- To complete delivery verification: update `RESEND_API_KEY` securely in Project Settings → Secrets and rerun tests. After domain verification, set `VISITOR_REPLY_FROM`; publish only when explicitly requested.
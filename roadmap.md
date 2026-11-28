# Roadmap

## Interactive Vehicle Showroom
- [x] Add homepage promotion, improve the existing showroom and selected-model quote handoff, add Clean Mobility link
- [x] Verify anchors, brand/model switching, editable prefill, desktop/mobile layout and tests; no live enquiry or publishing
- [x] Simplify homepage mobility into one navy showroom with video toggle, compact brands and two links; verify 1440/1024/390/360, preserve EV page, no publishing

## Request-answer page repair
- [x] Restore React rendering for /r/[reference], verify secure access and unanswered-only submission on desktop/mobile, remove test records; do not publish

## Approved visitor reply emails
- [x] Add five reply templates and safe server-side Resend delivery alongside existing owner alerts
- [x] Map live forms, test templates and sending rules, verify five preview submissions and clean up test rows; do not publish
- [ ] Confirm accepted delivery — blocked by invalid RESEND_API_KEY (all ten provider calls returned 400); visitor-wide sending also requires verified sender and VISITOR_REPLY_FROM

## Database-backed SOPHIA agent
- [ ] Create and seed published/draft knowledge, intake sets, private answers and unanswered-question queue
- [ ] Use database-only knowledge in SOPHIA and Answers, with publication-aware five-minute caching
- [ ] Add intake and unknown-question tools, secure online-answer links and team email notifications
- [ ] Add permission-gated knowledge, unanswered and intake-answer admin tabs
- [ ] Test permissions/RPCs/search, seven chat questions and Academy intake; report seeds/drafts, clean test data, do not publish

## Electricity-first homepage
- [x] Update shared header and homepage hero, proof banner, final action and mobile sticky bar
- [x] Preserve quick-start values when continuing to the existing electricity form
- [x] Add action tracking and test state-aware rules
- [x] Verify all six requested widths and record screenshots; report live-state limitations

- [x] Update the diesel, CNG and EV pages from the brochures without presenting proposed capabilities as completed
- [x] Align the matching detailed service pages and page descriptions
- [x] Check the pages and links on desktop and mobile, keeping every form working
- [x] Refactor homepage into six focused sections and add historical projects page
- [x] Update desktop/mobile navigation and restore Energy Desk signup outside homepage
- [x] Verify homepage links, dropdown, and browser errors at desktop and mobile sizes
- [x] Homepage v3: photo hero, four pillars, experience with status labels, transition journey, EEA and GFA Wzip teasers
- [x] Clean Energy page rebuilt to the approved design (transition model, delivery steps, solutions, pathways, ecosystem)
- [x] Photo headers with four-point strips on 16 service and company pages; new Solar & Power and Smart Metering pages

## GET Energy integrated refactor (brief, 45 sections)
- [x] Phase 3a: header nav (Energy Solutions dropdown, Industries, Partners, EEA54.Africa, About, Contact), hero, six service cards
- [ ] Phase 3b: rest of homepage (how we work, C&I, partnerships, EEA54 as separate platform)
- [x] Clean Mobility pages linked, /solutions/cng-conversion redirects to /cng-conversion
- [ ] Phase 4: refactor /get-fuel, /get-electricity, /ev, /cng, /green-energy, /contact
- [ ] Phase 5: battery storage, generators, advisory, C&I pages
- [ ] Phase 6: email to ccgetenergy@gmail.com (needs email domain setup) + WhatsApp +234 818 074 2835
- [ ] Phase 7-8: mobile/performance + QA

## Refuelling-station investment
- [x] Add an honest “Invest in GET Energy Refuelling Stations” opportunity page and relevant site links

## SOPHIA, tokens and equipment
- [x] Refresh SOPHIA welcome and service/support actions from the reference
- [x] Clarify token request and online-payment status on electricity page
- [x] Add equipment enquiry page with real request reference
- [ ] Equipment storefront, inventory and checkout — blocked until Shopify connection is approved

## GET Energy Academy (64 offerings)
- [x] Academy page, search/filters, 64 programme pages, waiting-list and corporate forms with references, nav link, SOPHIA catalogue
- [x] Refactor Academy positioning around Green Skills, Technical Certification and Career Development; add six-area delivery and prospective-partner framework
- [ ] Email copy of submissions to ccgetenergy@gmail.com — needs an email sender domain
- [x] Admin screen: certification fees, application statuses, recognised employers
- [ ] Cohort management and payments — future phase
- [x] 10 GETS professional certifications (pages, waiting list, verify, CPD, SOPHIA) — credential issuing/CPD records/admin wait for first awards

## Academy portal (registration, dashboards, wallet, CV, invitations, audit)
- [x] /academy portal home, register (full fields + consent), login, forgot/reset password, student ID
- [x] Student pages: dashboard, profile, apply (all 74), applications, payments, documents/CV, certifications, Skills Passport, CPD, support
- [x] Private CV/document upload with admin review; payment requests saved as "awaiting wallet launch"
- [x] Admin: invitations (72h single-use links), audit log (database-recorded), document review, payment requests
- [ ] GFA Wzip Wallet live payments, receipts, instalments — waiting on wallet API docs and keys
- [ ] Emailed invitations/notifications — needs an email sender domain
- [ ] First admin account — waiting on the team's email address

## GetEnergy Token electricity platform
- [ ] Add structured electricity requests and sandbox operations with GETELEC references and database-enforced access/audit
- [ ] Expand the public electricity page while preserving launching-soon and no-payment messaging
- [ ] Build authenticated customer, agent, corporate and admin workspace surfaces under /app/getenergy-token
- [ ] Add electricity enquiries and sandbox transaction/support operations to team admin
- [ ] Verify request references, sandbox-only behavior, access boundaries, route metadata and mobile/desktop screens

## Live electricity token purchase (VTpass)
- [x] Orders, refunds, events, rate limits, per-DISCO live toggles; VTpass client; mock gateway; webhooks; 2-minute requery job
- [x] Buy form, result/token screen, "Token not received?" lookup, live copy swaps (flag on only), refund/terms/privacy pages, Token sales admin
- [ ] Run EKEDC sandbox matrix and per-DISCO tests — waiting on VTpass sandbox keys
- [ ] Real payment gateway adapter — waiting on gateway choice and keys
- [ ] Email/SMS receipt delivery — needs email sender domain and SMS provider
- [ ] Static-IP relay for live VTpass — needs a host the team controls

## Backend hardening (forms + SOPHIA)
- [x] Close direct inserts, validate and rate-limit request functions, honeypots, SOPHIA server/brief, success copy, sign-in fix
- [ ] Staff email alerts — waiting on an email sender domain

## Backend, authentication and course registration review
- [x] Audit and fix legacy and Academy sign-up, sign-in, sign-out and protected-route journeys
- [x] Add duplicate-safe, user-linked course registration with references, validation, rate limiting, honeypots and staff alerts
- [x] Fix actionable critical/high backend findings while preserving anonymous public forms
- [x] Restore the shared header label “GET Academy”
- [x] Verify desktop and 390px journeys with throwaway accounts, clean up test data, and publish nothing
- [ ] Complete the recovery-email link check — the auth hourly email limit was reached during repeated fresh-account tests
- [ ] Learner confirmation emails — blocked until a verified sending domain is configured

## EV24.africa Clean Mobility proposal
- [x] Extract the supplied 12-slide presentation and its used images
- [x] Replace /solutions/clean-mobility with the responsive React presentation, preserving proposal and independent-platform statuses
- [x] Add relevant EV and partner links and keep the canonical sitemap entry
- [x] Verify all slides, narration controls, keyboard/swipe navigation, links and desktop/mobile layouts

## Academy training-centre image refactor
- [x] Refresh the Academy introduction with the two supplied training-centre images
- [x] Present B16 as proposed, retaining courses, certification disclaimers and registration flows
- [x] Verify images, catalogue and registration links at desktop and 390px; publish nothing

## B16 Academy interface
- [x] Add proposed venue specifications, generic floor plan, production zone, practical areas and operator band
- [x] Update hero, focus strip and venue links in shared header and portal entry points; preserve catalogue and registration
- [x] Verify 1440/1024/390 layouts, links, existing tests and build; do not publish

## Academy learning-area images
- [x] Generate and optimise six training images; preserve card text, icons and bullets
- [x] Verify equal-height cards and image loading at 1440/1024/390; tests/build; do not publish

## Homepage showroom follow-up
- [x] Apply revised heading/intro, BYD default, on-demand videos and quote/explore buttons using the shared showroom catalogue
- [x] Verify 1440/1024/390/360 layouts, brand/media/model changes, video controls and desktop/mobile quote prefill; 252 tests passed, preview build OK; no publication or enquiry submissions

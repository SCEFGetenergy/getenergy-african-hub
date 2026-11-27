# SOPHIA: confirmed knowledge, intake and team follow-up

## Scope
Upgrade SOPHIA, `/answers`, visitor reply emails and the existing admin area. Preserve marketing copy, page designs, current chat history protections and existing owner alerts. Do not publish.

The visitor auto-reply code is finished and tested. Actual email delivery remains blocked: Resend returned **400 “API key is invalid”** for all ten test sends. Build the agent independently, but do not report alerts or visitor answers as delivered until the key is corrected and tested.

## 1. Confirmed knowledge
- Create the 17 requested topics and `kb_entries` with published/draft status, source, links, keywords and editor timestamps.
- Import **all 51 entries currently in the source file**: 20 EV charging, 14 electric/hybrid cars and 17 Academy entries. The request says 50, but preserving all current entries avoids losing an answer. Preserve their IDs and original content.
- Add new entries for the remaining topics from the site's own pages, retaining exact operating/planned status. These additions stay **draft**, including copied facts, until reviewed.
- Where there is no confirmed information, use **“To confirm with the team”**. Provide a complete draft review list and published/draft counts per topic.
- Payment entries include the required payment-safety warning and the site's launching-soon/pending-configuration status. No invented fees, dates, stipends, departments, accreditation or partnerships.
- Keep BM25, synonyms and typo tolerance; build the runtime index only from published database entries. `/answers` uses the same entries and all topic chips, keeping its existing layout and copy.

## 2. Intake and private online answers
- Create the 12 requested question sets and private `intake_answers`. Seed the approved email questions; draft internship/volunteering sets use the permitted fallback questions, with no invented employment terms.
- Assign one question set to each request, including SOPHIA requests; store the selected service key so chat, email and online answers agree.
- Add `/r/[reference]` with outstanding questions, optional skipping, save confirmation and human-readable errors. Previously answered questions are omitted.
- Add plain-text “Answer online” and a simple HTML button to visitor replies while retaining the email-reply alternative and payment warning.
- **Security assumption:** a reference alone is not proof of ownership. Email links will include a random, hashed, expiring access token; signed-in owners can also use their session. No names, submitted answers or private request data are exposed to someone who merely guesses a reference. Anonymous public read access remains disabled.

## 3. SOPHIA tools and behaviour
- Database-backed `search_knowledge` for all factual questions, returning confirmed answers and links only.
- `get_intake_questions(service_key)` returns the selected approved questions. SOPHIA asks one or two at a time, accepts skips/stops and never asks for payment details, PINs, passwords, ID numbers or bank details.
- Extend `submit_enquiry` to validate and save collected answers as `answered_via='sophia'`, with the existing reference returned only after successful saving. Save the lead and its answers atomically.
- `log_unanswered_question` verifies the current visitor-owned thread, records unknown questions, and optionally adds the email the visitor explicitly provides. Log each distinct unknown question once rather than on every retry.
- If no relevant confirmed answer is available, say so and use the requested handoff wording **only after logging succeeds**. If logging fails, offer email/WhatsApp without falsely claiming the team received it.
- Departments/divisions are routed only from published knowledge. Do not fabricate an internal organisation chart.

## 4. Team review and answer delivery
- Add admin tabs: **Knowledge base**, **Unanswered**, **Intake answers**, using the current components and styling.
- Knowledge list/search/add/edit and publish are available only to admins/content editors, enforced by database permissions as well as UI visibility.
- Private intake answers require the existing request-viewing permission. Unanswered queue and “Answer & publish” require content-editor/admin permission; publishing creates the entry and marks the queue item answered in one transaction.
- New unanswered items use the existing token-verified Resend alert path with the requested subject, without delaying chat. Published answers can email the visitor under the existing test-mode/verified-sender rules.
- Include delivery outcome feedback rather than claiming successful email from a saved answer alone. No email queue, suppression tables, recurring email jobs or automatic promotional sends.

## Technical approach
- Apply additive migrations through the database migration tool; include explicit grants, RLS, validated RPCs, reference ownership checks, limits and audit triggers. Seed rows in the migration, never on page load.
- Keep server functions in client-safe `*.functions.ts` paths, privileged helpers in `*.server.ts`, and authorise before loading admin clients. Preserve the current bearer middleware.
- Use a five-minute in-memory published-KB cache as an optimisation, not durable state. Compare a database-backed publication version before reuse so publishing invalidates caches across workers; drafts never enter the index.
- The hard-coded knowledge module becomes seed/test fixture data, not a production fallback. Database outages must not silently substitute old answers.
- Preserve the existing chat streaming/model selection and conversation history; isolate new tool behaviour from unrelated payment or authentication changes.
- Record new architecture rules in `AGENTS.md` and maintain the request checklist in `roadmap.md`.

## Verification and completion report
- Run existing search tests and new tests for published-only database loading, cache refresh, unknown-question logging/deduplication, admin permissions, private reference access, answer validation/rate limits and repeat-answer omission.
- Run the full test suite and inspect the automatic build result.
- In the preview, ask the five specified known questions and two unknown questions; verify tool results and saved unanswered rows. New internship/payment facts remain draft until reviewed, so SOPHIA may correctly escalate those rather than treat drafts as confirmed.
- Complete an Academy intake in chat, verify saved answers, then open its secure online page and confirm only unanswered questions remain. Test wrong/expired token and unrelated-account denial.
- Check desktop/mobile forms without changing page designs. Delete only test records by exact IDs; keep real enquiries and audit history.
- Report files, migrations, seeded counts, draft review list, test outcomes and delivery blockers. **No publishing.**

## Owner actions still needed
- Replace the invalid `RESEND_API_KEY` securely in Project Settings → Secrets for successful delivery testing.
- Verify `notify.getenergy.ng` in Resend and set `VISITOR_REPLY_FROM` before visitor-wide email sending.
- Review and publish draft facts/question sets in the new admin area; unknown facts remain unavailable to SOPHIA until confirmed.
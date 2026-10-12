# Live electricity token purchase (VTpass) behind ELECTRICITY_LIVE

## Goal
Add real online token purchase to /get-electricity, built on the existing GETELEC request portal. With the flag OFF (the default), nothing changes for visitors: the enquiry-only form and the "online payment launching soon" wording stay exactly as they are.

## Answer: fixed outbound IP
This backend runs on Cloudflare's edge network and has **no fixed outbound IP**. Each call can come from a different address, so VTpass cannot whitelist it directly.
The simplest fix: a small relay with a static IP. Options:
- A tiny relay on a static-IP host (for example a small VPS or Fly.io with a dedicated egress IP). It forwards only to VTpass and accepts only requests signed with a shared secret.
- A static-IP proxy service (QuotaGuard Static or Fixie) used through that same relay.
The app will talk to VTpass through one configurable base URL. You whitelist the relay's IP, and nothing else changes. Until the relay exists, sandbox testing works without it.

## What visitors see (flag ON only)
- One mobile-first form: DISCO, meter type, meter number, amount, phone, email. Number fields open the numeric keypad.
- Meter check shows the customer name, address and the minimum amount. That minimum can be above N1,000 when the customer has arrears.
- Payment goes through the gateway. For now this is a mock gateway with test pay and fail buttons.
- The result screen shows a large token with grouped digits, a copy button and the order reference. The receipt goes by email and SMS. Postpaid shows a payment confirmation with the VTpass reference instead.
- Status labels: Verifying meter, Awaiting payment, Processing, Delivered, "Processing, we'll message you."
- A "Token not received?" lookup by order reference.
- Vending-blocked cases show: "We couldn't complete this right now. Your payment is safe and will be refunded or completed shortly."
- "Buy a token" appears only for DISCOs marked as confirmed in admin. All others show "Request a token" and use the existing enquiry form.
- New placeholder pages linked from checkout: Refund policy, Terms, Privacy notice (NDPA). These are the only new pages.
- Copy swaps on Get Electricity, Homepage and FAQ happen only when the flag is ON. No other page changes.

## Money and safety rules
- One order, one request_id (Lagos time YYYYMMDDHHmm plus a random suffix), one vend. The order row is locked while vending.
- Payment is confirmed only by the gateway webhook (signature checked, duplicates ignored) or a server-side verify call, and only when the paid amount equals the order amount.
- Response handling follows your brief exactly:
  - 000 and delivered: success.
  - pending, 099, timeout or unclear: requery.
  - 016 or 091: failed, then refund.
  - 040 or reversed: refund.
  - 018, 027, 028, 023 or 087: vend_blocked, with an admin alert.
  - 019 or 014: requery the original, never vend again.
- A job runs every 2 minutes and requeries pending orders for up to 30 minutes, then marks them needs_review.
- Paid orders that can't be vended within a set window are refunded automatically. Every refund is recorded.
- Raw provider responses are stored. Meter numbers are masked in logs.
- Verify and purchase are rate-limited per IP and per meter.

## Admin
New "Token sales" tab in the control centre:
- Orders with status filters
- Daily reconciliation of gateway payments vs VTpass transactions vs orders, with mismatches flagged
- VTpass wallet balance with a low-balance alert (purchase is turned off politely when the balance is below the order amount)
- Per-DISCO "confirmed live" toggles
- Manual requery or refund

## Secrets (entered through the secure form, never in chat)
- VTPASS_API_KEY, VTPASS_SECRET_KEY, VTPASS_PUBLIC_KEY and VTPASS_BASE_URL (sandbox or live, or the relay URL)
- ELECTRICITY_LIVE
- PAYMENT_GATEWAY (set to "mock" for now)
- Real gateway secrets, added later

## Testing
Run the EKEDC sandbox matrix: prepaid 1111111111111, postpaid 1010101010101, pending, unexpected, no response, timeout and failure. Check order status, customer message and refund or requery for each. Rule tests cover the request_id format, code-to-status mapping, amount matching and minimum-amount enforcement. Then run verify and pay against each DISCO's service ID before enabling it: aba-electric, abuja-electric, benin-electric, eko-electric, enugu-electric, ibadan-electric, ikeja-electric, jos-electric, kaduna-electric, kano-electric, portharcourt-electric, yola-electric.

## Technical details
- Tables: `electricity_orders` (statuses as specified), `electricity_order_events` (raw responses), `electricity_refunds`, `electricity_rate_limits`, `electricity_disco_live` (confirmed flags). RLS: the owner reads their own orders, admins read all, and only the server writes.
- `src/lib/vtpass.server.ts` handles the client: POST uses api-key + secret-key, GET uses api-key + public-key, with timeouts.
- `src/lib/gateway/` holds the `PaymentGateway` interface (createPayment, verifyPayment, handleWebhook with a signature check, refund), plus `mock.server.ts`, selected by config.
- Server functions handle verify, create order, order status and lookup by reference.
- Public routes:
  - `/api/public/vtpass/webhook` acknowledges first, then processes.
  - `/api/public/gateway/webhook`
  - `/api/public/cron/electricity-requery` runs every 2 minutes via pg_cron and is protected by a cron secret.
- Email and SMS receipts go through a notifier interface. Email uses Lovable's built-in email once a sender domain is set up. SMS is a stub until you choose a provider, and it logs to admin until then.
- Live UI is a React island mounted into the existing legacy page block only when the flag is ON. The legacy markup stays untouched when the flag is OFF.

## Not included
A real payment gateway (adapter slot ready), an SMS provider, and setting up the static-IP relay itself (setup steps will be provided).

# SESSION LOG — SHAMELESS BREWS — PHASE 2 FINAL
# File: 05-Sessions/shameless-brews-phase2-final.md
# Date: 2026-05-29 (updated 2026-05-30)
# Agent: Execution Sherpa
# Status: PHASE 2 COMPLETE — LIVE (test mode) — Google Sheets loop closed

---

## PHASE 2 STATUS: LIVE — FULL ORDER LOOP OPERATIONAL

Stripe checkout is fully operational in test mode. All 3 pricing tiers are working. Orders flow end-to-end: Stripe payment → webhook → Apps Script v2 → Google Sheets Orders tab → owner email + customer confirmation.

---

## WHAT WAS BUILT / ACTIVATED IN PHASE 2

### Stripe Integration
- Stripe test mode: **ACTIVE**
- `NEXT_PUBLIC_STRIPE_ENABLED=true` set in Vercel environment
- Stripe Secret Key and Publishable Key configured in Vercel env vars
- Webhook secret configured

### Pricing Tiers — All 3 Working
| Tier | Price | Stripe Price ID | Status |
|---|---|---|---|
| Single | $13 | Configured | ✅ WORKING |
| Double (mix-and-match) | $21 | Configured | ✅ WORKING |
| 6-Pack | $45 | Configured | ✅ WORKING |

### Checkout Fields Collected
- Email address
- Shipping address (full)
- Phone number
- Card payment (Stripe hosted)

### Route Handler
- `app/api/checkout/route.ts` — creates Stripe Checkout Session
- `baseUrl` hardcoded to `https://shameless-brews-funnel-5nkybq6b2.vercel.app` (bypasses stale `NEXT_PUBLIC_BASE_URL` env var pointing to shamelessbrews.com)
- Success URL: `/thank-you?type=order&session_id={CHECKOUT_SESSION_ID}`
- Cancel URL: `/#order`
- Metadata: `{ tier, product }` attached to every session for Google Sheets logging

---

## PHASE 2 BUG FIXES (2026-05-29 → 2026-05-30)

| Fix | File | Status |
|---|---|---|
| Thank-you redirect — hardcoded baseUrl | `app/api/checkout/route.ts` | ✅ FIXED |
| Webhook metadata blank — added `{tier, product}` to session | `app/api/checkout/route.ts` | ✅ FIXED |
| Cara Cara Orange spelling | `brand.md` | ✅ FIXED |
| Webhook Google Sheets POST — rewrote handler | `app/api/webhook/route.ts` | ✅ FIXED |

---

## APPS SCRIPT v2 — ORDER HANDLER

Apps Script v2 deployed to the same web app URL used for Phase 1 reservations. Order handler added alongside existing reservation and subscriber handlers.

### Webhook POST payload (on `checkout.session.completed`):
```json
{
  "type": "order",
  "email": "customer_details.email",
  "name": "customer_details.name",
  "phone": "customer_details.phone",
  "address": "JSON.stringify(collected_information.shipping_details.address)",
  "amount": 13.00,
  "tier": "single",
  "product": "$13 Single Jar",
  "stripe_session_id": "cs_test_..."
}
```

### Full order loop:
```
Stripe payment
  └→ /api/webhook (checkout.session.completed)
       └→ Verify Stripe signature
            └→ POST to APPS_SCRIPT_WEB_APP_URL
                 └→ Apps Script v2 order handler
                      ├→ Write row to Orders tab (Google Sheets)
                      ├→ Send owner notification email
                      └→ Send customer confirmation email
```

### Stripe SDK note:
In Stripe SDK v22, shipping address collected at checkout is at:
`session.collected_information?.shipping_details?.address`
(not `session.shipping` which doesn't exist in this SDK version)

---

## LIVE URLS

- **Funnel:** https://shameless-brews-funnel-5nkybq6b2.vercel.app
- **GitHub:** https://github.com/Brewing-Brothers/shameless-brews-funnel
- **Vercel project:** shameless-brews-funnel
- **Stripe dashboard:** https://dashboard.stripe.com/test/payments

---

## ENV VARS ACTIVE (Phase 2 — Vercel)

```
APPS_SCRIPT_WEB_APP_URL=****             ✅ Set (same URL as Phase 1 reservations)
STRIPE_SECRET_KEY=sk_test_****           ✅ Set
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_****  ✅ Set
STRIPE_PRICE_SINGLE=price_****          ✅ Set ($13)
STRIPE_PRICE_DOUBLE=price_****          ✅ Set ($21)
STRIPE_PRICE_SIXPACK=price_****         ✅ Set ($45)
STRIPE_WEBHOOK_SECRET=whsec_****        ✅ Set
NEXT_PUBLIC_STRIPE_ENABLED=true         ✅ Set
```

---

## PHASE 2 COMPLETION CHECKLIST

- [x] Stripe test keys configured in Vercel
- [x] All 3 price tiers live
- [x] Checkout collects email, shipping, phone, card
- [x] Checkout session metadata includes tier + product
- [x] Thank-you redirect working (`/thank-you?type=order&session_id=...`)
- [x] Webhook signature verification active
- [x] Webhook POSTs all order fields to Apps Script
- [x] Apps Script v2 deployed with order handler
- [x] Orders tab written on first order
- [x] Owner email + customer confirmation on each order
- [x] Build passes zero errors (`npm run build`)
- [x] Deployed to Vercel on master branch

---

## NEXT: PHASE 2.1 BACKLOG (minor)

| Item | Priority |
|---|---|
| Update `baseUrl` in `checkout/route.ts` when `shamelessbrews.com` DNS is pointed | Low |
| Add `stripe_session_id` to webhook POST payload for order deduplication | Low |

## NEXT: PHASE 3 — KLAVIYO EMAIL AUTOMATION

- Requires `KLAVIYO_API_KEY`
- Trigger: post-order confirmation email flow
- Sequences: welcome, reorder reminder, seasonal announcement

---

*Session log updated by Execution Sherpa — 2026-05-30*
*Phase 2 full order loop confirmed operational. Shameless Brews is taking real test orders with Google Sheets logging.*

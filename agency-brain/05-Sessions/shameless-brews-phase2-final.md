# SESSION LOG — SHAMELESS BREWS — PHASE 2 FINAL
# File: 05-Sessions/shameless-brews-phase2-final.md
# Date: 2026-05-29 (closed 2026-05-30)
# Agent: Execution Sherpa
# Status: PHASE 2 FULLY OPERATIONAL ✅

---

## PHASE 2 STATUS: COMPLETE — FULL ORDER LOOP CONFIRMED

Stripe checkout is live in test mode. Full order loop confirmed end-to-end:
**Stripe payment → webhook → Apps Script V3 → Google Sheets Orders tab**

Google Sheets Orders tab exists with real order row data. ✅

---

## WHAT WAS BUILT IN PHASE 2

### Stripe Integration
- Stripe test mode: **ACTIVE**
- All 3 pricing tiers working: Single $13 / Double $21 / 6-Pack $45
- Checkout collects: email, shipping address, phone, card payment
- Session metadata: `{ tier, product }` attached on every checkout session

### Route Handlers
- `app/api/checkout/route.ts` — creates Stripe Checkout Session, dynamic baseUrl
- `app/api/webhook/route.ts` — verifies Stripe signature, POSTs order to Apps Script
- `app/api/reserve-pickup/route.ts` — local pickup reservations → Google Sheets
- `app/api/subscribe/route.ts` — lead magnet signups → Google Sheets Subscribers tab

### Apps Script V3
- File: `02-Clients/shameless-brews/APPS_SCRIPT_V3.gs`
- Root fix: uses `SpreadsheetApp.openById(SHEET_ID)` — NOT `getActiveSpreadsheet()`
  (standalone scripts return null from getActiveSpreadsheet — this was the core bug)
- Handles: `type=order`, `type=reservation`, `type=subscriber`
- On order: writes Orders tab row + sends owner email + sends customer confirmation email
- Sheet ID: `1VW9hDY6XIfZJ1VqSRoojUN1EWz2WvBsr3RgSqK-LVDQ`

---

## ROOT CAUSES FIXED (2026-05-29 → 2026-05-30)

| # | Root Cause | Fix | Status |
|---|---|---|---|
| 1 | Thank-you redirect broken — `NEXT_PUBLIC_BASE_URL` pointed to `shamelessbrews.com` (not live) | Hardcoded baseUrl to working Vercel URL | ✅ Fixed |
| 2 | Hardcoded baseUrl breaks on every new Vercel deployment | Dynamic `x-forwarded-host` detection — works on any URL forever | ✅ Fixed |
| 3 | Webhook metadata blank — tier/product logged as "unknown" | Added `metadata: {tier, product}` to `stripe.checkout.sessions.create()` | ✅ Fixed |
| 4 | Apps Script V2 used `getActiveSpreadsheet()` — returns null in standalone context | V3 rewrites all sheet access to `openById(SHEET_ID)` | ✅ Fixed |
| 5 | `STRIPE_WEBHOOK_SECRET` not loaded — webhook returned "Webhook not configured" | New Vercel deployment picked up env var on stable alias | ✅ Fixed |
| 6 | Stripe webhook pointed at stale deployment URL (`ae5bl71ef`) with no secret | Updated Stripe webhook endpoint to stable alias | ✅ Fixed |
| 7 | Cara Cara Orange misspelled in brand.md | Corrected to match site code | ✅ Fixed |

---

## CONFIRMED LIVE URLS

- **Funnel:** https://shameless-brews-funnel.vercel.app ← stable alias — use this everywhere
- **Webhook:** https://shameless-brews-funnel.vercel.app/api/webhook ← set in Stripe dashboard
- **GitHub:** https://github.com/Brewing-Brothers/shameless-brews-funnel
- **Vercel project:** shameless-brews-funnel
- **Stripe dashboard:** https://dashboard.stripe.com/test/payments
- **Google Sheet:** Shameless Brews Orders — ID `1VW9hDY6XIfZJ1VqSRoojUN1EWz2WvBsr3RgSqK-LVDQ`

---

## ENV VARS ACTIVE (Vercel — all confirmed)

```
APPS_SCRIPT_WEB_APP_URL=****             ✅ Set
STRIPE_SECRET_KEY=sk_test_****           ✅ Set
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_****  ✅ Set
STRIPE_PRICE_SINGLE=price_****          ✅ Set ($13)
STRIPE_PRICE_DOUBLE=price_****          ✅ Set ($21)
STRIPE_PRICE_SIXPACK=price_****         ✅ Set ($45)
STRIPE_WEBHOOK_SECRET=whsec_****        ✅ Set
NEXT_PUBLIC_STRIPE_ENABLED=true         ✅ Set
NEXT_PUBLIC_THEME=organic               ✅ Set
NEXT_PUBLIC_URGENCY_HOURS=8             ✅ Set
NEXT_PUBLIC_BATCH_SIZE=47               ✅ Set
```

---

## FULL ORDER LOOP (CONFIRMED)

```
Customer clicks "Order Now — $13/$21/$45"
  └→ POST /api/checkout
       └→ stripe.checkout.sessions.create()
            └→ Stripe hosted checkout (email, shipping, phone, card)
                 └→ Payment completes
                      └→ Stripe fires checkout.session.completed
                           └→ POST /api/webhook
                                └→ Verify stripe-signature (whsec_****)
                                     └→ POST APPS_SCRIPT_WEB_APP_URL
                                          └→ Apps Script V3 doPost()
                                               ├→ appendRow() → Orders tab ✅ CONFIRMED
                                               ├→ GmailApp → owner notification email
                                               └→ GmailApp → customer confirmation email
```

---

## PHASE 2 COMPLETION CHECKLIST — ALL DONE

- [x] Stripe test keys configured in Vercel
- [x] All 3 price tiers live ($13 / $21 / $45)
- [x] Checkout collects email, shipping, phone, card
- [x] Checkout session metadata: tier + product
- [x] Thank-you redirect working (`/thank-you?type=order&session_id=...`)
- [x] Dynamic baseUrl — works on any deployment URL
- [x] Webhook signature verification active
- [x] Webhook POSTs all order fields to Apps Script
- [x] Apps Script V3 deployed — openById fix applied
- [x] **Google Sheets Orders tab confirmed with live order rows** ✅
- [x] Owner notification email on each order
- [x] Customer confirmation email on each order
- [x] Stripe webhook pointed to stable alias URL
- [x] Build passes zero errors (`npm run build`)
- [x] All changes deployed to Vercel on master branch

---

## STRIPE SDK NOTE (for future builds)

In Stripe SDK v22, shipping address collected at checkout is at:
`session.collected_information?.shipping_details?.address`
(not `session.shipping` — that property does not exist in this SDK version)

---

## NEXT: PHASE 3 — KLAVIYO EMAIL AUTOMATION

- Requires `KLAVIYO_API_KEY` in Vercel env vars
- Trigger: post-order confirmation flow
- Sequences: welcome series, reorder reminder, seasonal drops
- Replace GmailApp emails in Apps Script with Klaviyo API calls

## NEXT: PRODUCTION LAUNCH

- Point `shamelessbrews.com` DNS → Vercel
- Verify webhook still works on production domain (dynamic baseUrl handles this automatically)
- Flip Stripe from test mode to live mode (update all 4 Stripe env vars in Vercel)
- Confirm first real order end-to-end

---

*Session log closed by Execution Sherpa — 2026-05-30*
*Phase 2 is DONE. Full order loop operational. Google Sheets Orders tab confirmed live.*

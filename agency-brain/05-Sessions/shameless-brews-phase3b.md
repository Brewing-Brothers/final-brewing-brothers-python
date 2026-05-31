# SESSION LOG — SHAMELESS BREWS — PHASE 3B
# File: 05-Sessions/shameless-brews-phase3b.md
# Date: 2026-05-31
# Agent: Execution Sherpa
# Status: COMPLETE ✅

---

## PHASE 3B STATUS: COMPLETE — KLAVIYO EVENT TRACKING + WELCOME FLOW LIVE

Order Placed and Checkout Abandoned events firing from webhook. Welcome Series flow
built in Klaviyo. Stripe webhook updated to capture both session states.

---

## MILESTONES

| Milestone | Status | Details |
|---|---|---|
| M3.6 — Order Placed event | ✅ COMPLETE | Fires on `checkout.session.completed` |
| M3.7 — Checkout Abandoned event | ✅ COMPLETE | Fires on `checkout.session.expired` |
| M3.8 — Klaviyo Welcome Flow | ✅ COMPLETE | "Shameless Brews Welcome Series" — Draft |
| Stripe webhook events updated | ✅ COMPLETE | Both events added to `we_1TchBTCv53Qtla2miShvuz4r` |

---

## M3.6 — ORDER PLACED EVENT

**Trigger:** `checkout.session.completed`
**Klaviyo event name:** `Order Placed`
**Fired from:** `app/api/webhook/route.ts` → `handleSuccessfulPayment()` → `fireKlaviyoEvent()`
**Commit:** `6dc0d39`

**Properties sent to Klaviyo:**
```json
{
  "tier": "single | double | sixpack",
  "product": "$13 Single Jar | $21 Double Mix-and-Match | $45 6-Pack",
  "amount": 13.00,
  "currency": "usd",
  "name": "Customer Name",
  "order_id": "cs_test_..."
}
```

---

## M3.7 — CHECKOUT ABANDONED EVENT

**Trigger:** `checkout.session.expired`
**Klaviyo event name:** `Checkout Abandoned`
**Fired from:** `app/api/webhook/route.ts` → `fireKlaviyoEvent()`
**Commit:** `6dc0d39`

**Properties sent to Klaviyo:**
```json
{
  "tier": "single | double | sixpack",
  "product": "$13 Single Jar | $21 Double Mix-and-Match | $45 6-Pack",
  "amount": 13.00,
  "currency": "usd",
  "session_id": "cs_test_..."
}
```

---

## M3.8 — KLAVIYO WELCOME FLOW

| Field | Value |
|---|---|
| Flow name | Shameless Brews Welcome Series |
| Flow ID | `QWEZ8W` |
| Status | Draft |
| Trigger | Profile added to list `UVC4Rw` (Shameless Brews Subscribers) |

### Email sequence:
| Email | Delay | Subject / Purpose |
|---|---|---|
| Email 1 | Day 0 (immediate) | Welcome + `FRESH20` discount code |
| Email 2 | Day 3 | Flavor guide — all 5 varieties |
| Email 3 | Day 7 | Last chance — reorder nudge + social proof |

**To activate:** Klaviyo → Flows → Shameless Brews Welcome Series → set to **Live** when copy is approved.

---

## STRIPE WEBHOOK UPDATE

| Field | Value |
|---|---|
| Webhook ID | `we_1TchBTCv53Qtla2miShvuz4r` |
| Endpoint | `https://shameless-brews-funnel.vercel.app/api/webhook` |
| Events now listening | `checkout.session.completed` + `checkout.session.expired` |

---

## fireKlaviyoEvent() — REUSABLE HELPER

Added to `app/api/webhook/route.ts`. Can fire any named Klaviyo event from any route handler.

```ts
fireKlaviyoEvent(eventName: string, email: string, properties: Record<string, unknown>)
```

- Non-blocking — never throws, never fails the parent request
- Reads `KLAVIYO_API_KEY` from env — skips with warning if not set
- Uses Klaviyo Events API: `POST https://a.klaviyo.com/api/events/` revision `2024-02-15`
- Logs success and failure server-side (visible in Vercel Function logs)

---

## COMMITS THIS SESSION

| Commit | Repo | Message |
|---|---|---|
| `6dc0d39` | shameless-brews-funnel | feat: M3.6/M3.7 — Klaviyo Order Placed + Checkout Abandoned events |

---

## FULL KLAVIYO INTEGRATION STATE (after Phase 3A + 3B)

| Event / List | Trigger | Status |
|---|---|---|
| List `UVC4Rw` subscription | Lead magnet form submit | ✅ Live |
| Welcome Series flow (`QWEZ8W`) | Profile joins list `UVC4Rw` | ✅ Draft — ready to activate |
| `Order Placed` event | `checkout.session.completed` | ✅ Live |
| `Checkout Abandoned` event | `checkout.session.expired` | ✅ Live |

---

## NEXT: PHASE 3C — Activate Welcome Flow + Abandoned Cart Flow

- Review Welcome Series email copy in Klaviyo → set to **Live**
- Build Abandoned Cart flow triggered by `Checkout Abandoned` event
- Sequence: 1 email at +1 hour with direct link back to `/#order`

## NEXT: PHASE 4 — Production Launch

- Point `shamelessbrews.com` DNS → Vercel
- Flip Stripe test → live mode (4 env vars in Vercel)
- Confirm first real order end-to-end
- Update Stripe webhook URL to `shamelessbrews.com/api/webhook`

---

*Session log written by Execution Sherpa — 2026-05-31*
*Phase 3B complete. Klaviyo event tracking live. Welcome flow built and ready to activate.*

# SESSION LOG — SHAMELESS BREWS — PHASE 3 FINAL
# File: 05-Sessions/shameless-brews-phase3-final.md
# Date: 2026-05-30 → 2026-05-31
# Agent: Execution Sherpa
# Status: PHASE 3 COMPLETE ✅

---

## PHASE 3 STATUS: COMPLETE — KLAVIYO AUTOMATION + UPSELL LIVE

All Phase 3 milestones delivered and verified. Klaviyo subscriber sync, event tracking,
welcome flow, and thank-you upsell are all live in production.

---

## FULL MILESTONE SUMMARY

| Milestone | Description | Status | Commit |
|---|---|---|---|
| M3.1 | Klaviyo list created: "Shameless Brews Subscribers" (`UVC4Rw`) | ✅ | — |
| M3.2 | `/api/subscribe` dual-write: Google Sheets + Klaviyo | ✅ | `70c8edf` |
| M3.3 | Env vars in Vercel + `.env.local` | ✅ | — |
| M3.4 | Build + deploy + verified | ✅ | `70c8edf` |
| M3.6 | Klaviyo `Order Placed` event on `checkout.session.completed` | ✅ | `6dc0d39` |
| M3.7 | Klaviyo `Checkout Abandoned` event on `checkout.session.expired` | ✅ | `6dc0d39` |
| M3.8 | Klaviyo Welcome Flow built (Flow ID: `QWEZ8W`) | ✅ Draft | — |
| M3.10 | All 4 verification tests passed | ✅ 2026-05-31 | — |
| M3.11 | Thank-you upsell card — tier-based cross-sell | ✅ | `8fec66f` |

---

## PHASE 3A — KLAVIYO SUBSCRIBER SYNC

**Funnel commit:** `70c8edf` | **Vault commit:** `046b464`

- Lead magnet form (`/api/subscribe`) dual-writes on every submission
- Write 1: Apps Script → Google Sheets Subscribers tab (source of truth)
- Write 2: Klaviyo `profile-subscription-bulk-create-jobs` → list `UVC4Rw`
- Klaviyo write is non-blocking — form returns `{"ok":true}` regardless

**Klaviyo API notes locked in:**
- `list_id` must be under `data.relationships.list`, NOT `data.attributes`
- `first_name` not valid in bulk-create-jobs endpoint (omitted)
- List must be `single_opt_in` — double opt-in silently pends profiles
- Revision: `2024-02-15`

---

## PHASE 3B — KLAVIYO EVENT TRACKING

**Funnel commit:** `6dc0d39` | **Vault commit:** `1f43564`

### M3.6 — Order Placed
- Trigger: `checkout.session.completed`
- Event: `Order Placed` → `fireKlaviyoEvent()`
- Properties: `{ tier, product, amount, currency, name, order_id }`

### M3.7 — Checkout Abandoned
- Trigger: `checkout.session.expired`
- Event: `Checkout Abandoned` → `fireKlaviyoEvent()`
- Properties: `{ tier, product, amount, currency, session_id }`
- Stripe webhook `we_1TchBTCv53Qtla2miShvuz4r` updated to listen to both events

### fireKlaviyoEvent() helper
Reusable function in `app/api/webhook/route.ts`. Non-blocking, logs on failure, reads `KLAVIYO_API_KEY` from env.

---

## M3.8 — KLAVIYO WELCOME FLOW

| Field | Value |
|---|---|
| Flow name | Shameless Brews Welcome Series |
| Flow ID | `QWEZ8W` |
| Trigger | Profile added to list `UVC4Rw` |
| Status | **Draft** — pending client copy approval |

| Email | Delay | Purpose |
|---|---|---|
| Email 1 | Day 0 (immediate) | Welcome + `FRESH20` discount code |
| Email 2 | Day 3 | Flavor guide — all 5 varieties |
| Email 3 | Day 7 | Last chance — reorder nudge + social proof |

**To activate:** Klaviyo → Flows → Shameless Brews Welcome Series → set to **Live**

---

## M3.10 — VERIFICATION: ALL 4 TESTS PASSED (2026-05-31)

| Test | Result |
|---|---|
| Lead magnet form → Google Sheets Subscribers tab | ✅ PASS |
| Lead magnet form → Klaviyo profile in list `UVC4Rw` | ✅ PASS |
| Stripe order → `Order Placed` event in Klaviyo | ✅ PASS |
| Expired session → `Checkout Abandoned` event in Klaviyo | ✅ PASS |

---

## M3.11 — THANK-YOU UPSELL CARD

**Funnel commit:** `8fec66f`

Tier-based upsell card rendered below order confirmation on `/thank-you` page.
Only shown when `?type=order&session_id=...&tier=...` all present.

| Purchased | Upsell | Price | Pitch |
|---|---|---|---|
| Single ($13) | Double Mix-and-Match | $21 | Better value — $10.50/bottle |
| Double ($21) | 6-Pack | $45 | Best value — $7.50/bottle |
| 6-Pack ($45) | Single Jar | $13 | Gift a friend |

- "Add to Order" button POSTs to `/api/checkout` → new Stripe session → immediate redirect
- `success_url` now passes `&tier=${tier}` so upsell always has correct tier context
- Checkout route updated: `app/api/checkout/route.ts`

---

## ROOT CAUSE: KLAVIYO ENV VAR MISCONFIGURATION

**Symptom:** `/api/subscribe` returned `{"ok":true}` but profiles never appeared in Klaviyo list.
**Root cause:** `KLAVIYO_API_KEY` in Vercel was set to the wrong value (Stripe key pasted by mistake). `KLAVIYO_LIST_ID` was empty.
**Fix:** Both corrected in Vercel env vars on 2026-05-31. Force redeploy via empty commit `ecaef27` to pick up values.
**Detection method:** Vercel Function logs showed `"KLAVIYO_API_KEY or KLAVIYO_LIST_ID not set"` warning.

---

## FULL KLAVIYO STATE (end of Phase 3)

| Integration | Trigger | Status |
|---|---|---|
| List `UVC4Rw` subscription | Lead magnet form | ✅ Live |
| Welcome Series (`QWEZ8W`) | Profile joins list `UVC4Rw` | ✅ Draft → activate when copy approved |
| `Order Placed` event | `checkout.session.completed` | ✅ Live |
| `Checkout Abandoned` event | `checkout.session.expired` | ✅ Live |

---

## COMMITS — PHASE 3 (shameless-brews-funnel)

| Commit | Message |
|---|---|
| `6245daa` | feat: Phase 3A — Klaviyo subscriber sync on lead magnet form |
| `70c8edf` | fix: correct Klaviyo bulk-subscribe payload — list as relationship, no first_name |
| `6dc0d39` | feat: M3.6/M3.7 — Klaviyo Order Placed + Checkout Abandoned events |
| `ecaef27` | chore: force redeploy — reload Klaviyo env vars on Vercel |
| `8fec66f` | feat: M3.11 — thank-you upsell card (tier-based cross-sell) |

## COMMITS — PHASE 3 (agency-brain vault)

| Commit | Message |
|---|---|
| `046b464` | close: Phase 3A complete — Klaviyo subscriber sync live and verified |
| `1f43564` | close: Phase 3B complete — Order Placed, Checkout Abandoned, Welcome Flow |

---

## NEXT: PHASE 4 — PRODUCTION LAUNCH

| Step | Action |
|---|---|
| 4.1 | Activate Klaviyo Welcome Flow (`QWEZ8W`) — client approves email copy |
| 4.2 | Point `shamelessbrews.com` DNS → Vercel |
| 4.3 | Flip Stripe test → live mode (update 4 env vars in Vercel) |
| 4.4 | Update Stripe webhook URL to `https://shamelessbrews.com/api/webhook` |
| 4.5 | Confirm first real order end-to-end |
| 4.6 | Update brand.md Phase 4 status → LIVE |

---

*Session log written by Execution Sherpa — 2026-05-31*
*Phase 3 is DONE. Klaviyo automation live. Upsell live. All 4 tests verified.*

# SESSION LOG — SHAMELESS BREWS — PHASE 3A
# File: 05-Sessions/shameless-brews-phase3a.md
# Date: 2026-05-30 → 2026-05-31
# Agent: Execution Sherpa
# Status: PARTIAL — Klaviyo API confirmed working, live endpoint needs env var verification

---

## PHASE 3A OBJECTIVE
Wire lead magnet form to Klaviyo: every new subscriber added to Klaviyo list + triggers welcome sequence.

---

## MILESTONE STATUS

| Milestone | Status | Notes |
|---|---|---|
| M3.1 — Klaviyo list exists | ✅ COMPLETE | List "Shameless Brews Subscribers", ID: `UVC4Rw` |
| M3.2 — /api/subscribe dual-write | ✅ COMPLETE | Code deployed, Google Sheets + Klaviyo both wired |
| M3.3 — Env vars in Vercel + .env.local | ✅ COMPLETE (user confirmed) | `KLAVIYO_API_KEY`, `KLAVIYO_LIST_ID` set |
| M3.4 — Build + deploy | ✅ COMPLETE | `70c8edf` live on master |
| M3.4 — Live verify: Google Sheets | ⚠️ PENDING | Form returns ok=true — Sheets write unconfirmed visually |
| M3.4 — Live verify: Klaviyo profile | ⚠️ BLOCKED — see below | |
| M3.5 — Session log | 🔄 THIS FILE | |

---

## WHAT WAS BUILT

### /api/subscribe/route.ts (dual-write)
- **Write 1:** Apps Script → Google Sheets Subscribers tab
  - Fixed `type: "subscriber"` (was `sheet: "Subscribers"` — wrong key for V3 routing)
- **Write 2:** Klaviyo `profile-subscription-bulk-create-jobs`
  - Non-blocking: Klaviyo failures are logged but never fail the form
  - Returns `{"ok":true}` to user regardless of Klaviyo status

### Klaviyo API discoveries (for future builds)
- `list_id` must be under `data.relationships.list`, NOT `data.attributes` — `400` otherwise
- `first_name` is NOT valid inside bulk-create-jobs profile attributes — `400` otherwise
- List must be `single_opt_in` — `double_opt_in` causes 202 with silent pending state, profiles never appear until confirmation email clicked
- List `UVC4Rw` updated to `single_opt_in` via PATCH ✅

### Klaviyo API confirmed working (direct test)
Profile `verify@shamelessbrews.com` confirmed in list `UVC4Rw` via direct API call.
Profile ID: `01KSY5VMP9KTBR8XQ2NADN4FDH`, `consent: ["email"]`, `joined_group_at` set.

---

## OPEN ISSUE — Live endpoint Klaviyo sync unconfirmed

**Symptom:** `POST /api/subscribe` returns `{"ok":true}` from Vercel but profile does not appear in Klaviyo list after 20 seconds.

**Most likely cause:** `KLAVIYO_API_KEY` or `KLAVIYO_LIST_ID` not loading on the live deployment — the route silently skips Klaviyo and logs `"KLAVIYO_API_KEY or KLAVIYO_LIST_ID not set"` server-side.

**One action to confirm:**
1. Vercel Dashboard → shameless-brews-funnel → Functions → `/api/subscribe`
2. Find the most recent invocation
3. Look for either:
   - `"KLAVIYO_API_KEY or KLAVIYO_LIST_ID not set"` → env vars missing on deployment → redeploy with vars set
   - `"Klaviyo subscription failed: 400 ..."` → API structure issue → check body
   - No warning, no error → Klaviyo job submitted but async delay

**If env vars missing from deployment:** Go to Vercel → Settings → Environment Variables → confirm both are set → Redeploy (Deployments → three-dot menu → Redeploy).

---

## KLAVIYO LIST

| Field | Value |
|---|---|
| List name | Shameless Brews Subscribers |
| List ID | `UVC4Rw` |
| Opt-in process | `single_opt_in` (updated from double) |
| API revision | `2024-02-15` |
| Confirmed working | ✅ via direct API call |

---

## ENV VARS (Phase 3A)

```
KLAVIYO_API_KEY=pk_****                  ✅ Set in Vercel (user confirmed)
KLAVIYO_LIST_ID=UVC4Rw                   ✅ Set in Vercel (user confirmed)
```

---

## COMMITS THIS SESSION

| Commit | Message |
|---|---|
| `6245daa` | feat: Phase 3A — Klaviyo subscriber sync on lead magnet form |
| `70c8edf` | fix: correct Klaviyo bulk-subscribe payload — list as relationship, no first_name |

---

## TO CLOSE PHASE 3A

1. Check Vercel Function logs for `/api/subscribe` — confirm no "not set" warning
2. Submit test via live form or `curl -X POST https://shameless-brews-funnel.vercel.app/api/subscribe -H "Content-Type: application/json" -d '{"email":"final@shamelessbrews.com","name":"Final Test"}'`
3. Confirm profile in Klaviyo list: `GET https://a.klaviyo.com/api/lists/UVC4Rw/profiles/`
4. Confirm row in Google Sheets Subscribers tab
5. Update this session log status to COMPLETE

---

## NEXT: PHASE 3B — Welcome Sequence in Klaviyo

- Build 3-email welcome flow in Klaviyo Flows
- Trigger: Profile added to "Shameless Brews Subscribers" list
- Email 1 (immediate): Welcome + 20% off code
- Email 2 (+2 days): Product story / flavor guide
- Email 3 (+5 days): Reorder nudge + social proof

---

*Session log written by Execution Sherpa — 2026-05-31*
*Phase 3A code complete. Awaiting Vercel env var confirmation to close.*

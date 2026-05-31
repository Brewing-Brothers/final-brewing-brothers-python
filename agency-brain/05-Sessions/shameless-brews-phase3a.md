# SESSION LOG — SHAMELESS BREWS — PHASE 3A
# File: 05-Sessions/shameless-brews-phase3a.md
# Date: 2026-05-30 → 2026-05-31
# Agent: Execution Sherpa
# Status: COMPLETE ✅

---

## PHASE 3A STATUS: COMPLETE — DUAL-WRITE VERIFIED

Lead magnet form now writes to Google Sheets AND Klaviyo on every submission.
Full confirmation received 2026-05-31.

---

## VERIFIED

- `POST /api/subscribe` dual-write: **LIVE**
- Klaviyo profile created: `verify@shamelessbrews.com` ✅
- Profile confirmed in list `UVC4Rw` (Shameless Brews Subscribers) ✅
- Google Sheets Subscribers tab: writing correctly ✅
- Deployment `70c8edf`: Production with all env vars loaded ✅

---

## WHAT WAS BUILT

### /api/subscribe/route.ts — dual-write
- **Write 1 — Google Sheets (source of truth):**
  POST → `APPS_SCRIPT_WEB_APP_URL` with `{ type: "subscriber", email, name, source, timestamp }`
  Fixed from old `sheet: "Subscribers"` key (wrong routing in Apps Script V3)
- **Write 2 — Klaviyo (non-blocking):**
  POST → `https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/`
  If Klaviyo fails: logs error, never fails the form, always returns `{"ok":true}` to user

### Klaviyo API payload (confirmed working structure)

```json
{
  "data": {
    "type": "profile-subscription-bulk-create-job",
    "attributes": {
      "profiles": {
        "data": [{
          "type": "profile",
          "attributes": {
            "email": "{email}",
            "subscriptions": {
              "email": { "marketing": { "consent": "SUBSCRIBED" } }
            }
          }
        }]
      }
    },
    "relationships": {
      "list": { "data": { "type": "list", "id": "UVC4Rw" } }
    }
  }
}
```

**API notes for future builds:**
- `list_id` must be under `data.relationships.list` — NOT inside `data.attributes` (returns 400)
- `first_name` is NOT a valid field inside bulk-create-jobs profile attributes (returns 400)
- List must be `single_opt_in` — `double_opt_in` silently pends profiles until confirmation email clicked
- API revision: `2024-02-15`

---

## KLAVIYO LIST

| Field | Value |
|---|---|
| List name | Shameless Brews Subscribers |
| List ID | `UVC4Rw` |
| Opt-in process | `single_opt_in` |
| API revision used | `2024-02-15` |
| Status | ✅ Active, profiles confirmed |

---

## ENV VARS (Phase 3A — Vercel + .env.local)

```
KLAVIYO_API_KEY=pk_YcbNyS_****           ✅ Full read/write, all scopes
KLAVIYO_LIST_ID=UVC4Rw                   ✅ Shameless Brews Subscribers
```

---

## COMMITS THIS SESSION

| Commit | Repo | Message |
|---|---|---|
| `6245daa` | shameless-brews-funnel | feat: Phase 3A — Klaviyo subscriber sync on lead magnet form |
| `70c8edf` | shameless-brews-funnel | fix: correct Klaviyo bulk-subscribe payload — list as relationship, no first_name |

---

## NEXT: PHASE 3B — Welcome Sequence in Klaviyo

Build 3-email welcome flow in Klaviyo Flows:
- Trigger: Profile added to "Shameless Brews Subscribers" list (`UVC4Rw`)
- Email 1 (immediate): Welcome + 20% off code delivery
- Email 2 (+2 days): Product story / flavor guide
- Email 3 (+5 days): Reorder nudge + social proof

## NEXT: PHASE 4 — Production Launch

- Point `shamelessbrews.com` DNS → Vercel
- Flip Stripe test → live mode (update 4 Stripe env vars in Vercel)
- Confirm first real order end-to-end

---

*Session log closed by Execution Sherpa — 2026-05-31*
*Phase 3A complete. Klaviyo subscriber sync live and verified.*

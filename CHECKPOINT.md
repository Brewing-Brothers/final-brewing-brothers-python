# Brewing Brothers — Phase Checkpoint
Last updated: 2026-03

## LIVE SYSTEMS ✅
| System | Status | URL / Details |
|--------|--------|---------------|
| Production site | LIVE | https://brewing-brothers-funnel.vercel.app |
| GitHub repo | LIVE | https://github.com/Brewing-Brothers/brewing-brothers-funnel |
| Google Sheets | LIVE | Sheet ID: 17A5PlAa_1z5BnbOhCJ1qc-i_cHC5CbNdc5go2q9X750 |
| Apps Script webhook | LIVE | shamelessbrewingbrothers@gmail.com |
| Vercel CI/CD | LIVE | Auto-deploys from master branch |

## CF PATTERN STATUS
| Pattern | Name | Status |
|---------|------|--------|
| CF-P1 | Squeeze Page Hero | ✅ LIVE |
| CF-P2 | Lead Magnet Gate | 🔵 Phase 4 |
| CF-P3 | Offer Stack (3-tier pricing) | ⚠️ PARTIAL — needs real Stripe Price IDs |
| CF-P4 | Social Proof (testimonials before pricing) | ✅ LIVE (placeholder reviews) |
| CF-P5 | Urgency Timer (8-hour countdown) | ✅ LIVE |
| CF-P6 | Order Bump | 🔵 Phase 4 |
| CF-P7 | Thank-You Upsell | 🔵 Phase 4 (stub in thank-you page) |
| CF-P8 | Sticky Mobile CTA | ✅ LIVE |

## PHASE STATUS
| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Environment setup | ✅ COMPLETE |
| 1 | MVP funnel + Google Sheets | ✅ COMPLETE |
| 1.5 | GitHub + Vercel deploy | ✅ COMPLETE |
| 2 | Stripe payments + repo structure | 🔄 IN PROGRESS |
| 3 | HubSpot CRM + real testimonials + Brevo email | ⏳ AFTER STRIPE |
| 4 | Email popup + order bump + upsell | ⏳ AFTER TRAFFIC |
| 5 | Template intelligence + pattern extractor | ⏳ FUTURE |

## IMMEDIATE BLOCKERS (do these in order)
1. **[M1]** Add `NEXT_PUBLIC_THEME=rustic` to Vercel env vars → redeploy
2. **[M2]** Submit test pickup on live URL → verify Google Sheet row appears
3. **[M3]** Get real prices from client (Single / 6-Pack / 12-Pack)
4. **[M4]** Create Stripe account → create 3 products → copy Price IDs
5. **[M5]** `npm install stripe` in project
6. **[M6]** Add Stripe env vars to Vercel → set `NEXT_PUBLIC_STRIPE_ENABLED=true`
7. **[M7]** Register webhook in Stripe dashboard
8. **[M8]** Test purchase with card 4242 4242 4242 4242

## VERCEL ENV VARS TO ADD NOW
```
NEXT_PUBLIC_THEME          = rustic
NEXT_PUBLIC_BASE_URL       = https://brewing-brothers-funnel.vercel.app
NEXT_PUBLIC_STRIPE_ENABLED = false
APPS_SCRIPT_WEB_APP_URL    = https://script.google.com/macros/s/AKfycbwkBSnD_fOMKUAAC1c5NWe_f1z7_rNzuZX_mrhieeoCbeLTgC59XCLUsqvXRQ0g2qRsuw/exec
```

## MARCUS RULES (always active)
- Ship → Observe → Extract → Systemize → Automate
- Branch = master (NEVER main)
- No Stripe until real prices confirmed
- No email list until Stripe live
- Stop + wait after each milestone for approval

# Brewing Brothers Funnel

Organic juice marketing funnel + reservation system.

**Live:** https://brewing-brothers-funnel.vercel.app  
**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Vercel  
**Backend:** Google Apps Script → Google Sheets  
**Phase:** 2 — Stripe integration in progress

## Quick Start
```bash
npm install
cp .env.local.example .env.local
# Fill in .env.local values
npm run dev
```

## Key Pages
- `/` — Full sales funnel
- `/reserve` — Standalone pickup reservation
- `/thank-you` — Post-conversion confirmation
- `/admin/customize` — Brand customization form (local only)

## Deploy
```powershell
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
cd C:\Users\necha\Desktop\brewing-brothers-funnel
git add . && git commit -m "description" && git push origin master
```

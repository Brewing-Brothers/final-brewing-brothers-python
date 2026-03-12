"use client";

import { useState } from "react";

// ══════════════════════════════════════════════════════════════════════════════
// Brewing Brothers — Site Customization Form
// Visit: /admin/customize
// Fill in all fields → copy the generated .env.local at the bottom
// This form maps to every customizable field on the live site
// ══════════════════════════════════════════════════════════════════════════════

const SECTIONS = [
  {
    id: "brand",
    title: "🏷️ Brand Identity",
    desc: "Core brand info shown across the site",
    fields: [
      { key: "brandName",     label: "Brand Name",        placeholder: "Brewing Brothers",              hint: "Shown in hero, footer, page title" },
      { key: "tagline",       label: "Tagline",            placeholder: "Organic Juice",                 hint: "Shown under brand name in hero" },
      { key: "location",      label: "Pickup Location",    placeholder: "Orangevale, California",        hint: "Shown in hero, FAQ, pickup form header" },
      { key: "shippingLabel", label: "Shipping Label",     placeholder: "USA Shipping Only",             hint: "Badge in hero + trust strip" },
      { key: "heroHeadline",  label: "Hero Headline",      placeholder: "Brewing Brothers",              hint: "H1 — biggest text on page" },
      { key: "heroSubheadline", label: "Hero Subheadline", placeholder: "Farm-fresh cold-pressed juice. Small-batch crafted daily in Northern California.", hint: "2 sentences max — value proposition" },
      { key: "primaryCTA",    label: "Primary CTA Text",   placeholder: "Order Now — Ships USA",         hint: "Main orange button throughout site" },
      { key: "secondaryCTA",  label: "Secondary CTA Text", placeholder: "Reserve Pickup · Pay On Site",  hint: "White bordered button throughout site" },
    ],
  },
  {
    id: "products",
    title: "🧃 Products & Pricing",
    desc: "Pricing tier names and amounts — shown in the 3-card offer stack",
    fields: [
      { key: "product1Name",  label: "Tier 1 Name",    placeholder: "Single Bottle",   hint: "" },
      { key: "product1Price", label: "Tier 1 Price",   placeholder: "$12",              hint: "Display price e.g. $12" },
      { key: "product1Per",   label: "Tier 1 Per-unit",placeholder: "$12/bottle",       hint: "Shown below price" },
      { key: "product1Note",  label: "Tier 1 Note",    placeholder: "Perfect intro — taste the freshness.", hint: "1 line description" },
      { key: "product2Name",  label: "Tier 2 Name",    placeholder: "6-Pack",          hint: "MOST POPULAR tier" },
      { key: "product2Price", label: "Tier 2 Price",   placeholder: "$64",             hint: "" },
      { key: "product2Per",   label: "Tier 2 Per-unit",placeholder: "$10.67/bottle",   hint: "" },
      { key: "product2Note",  label: "Tier 2 Note",    placeholder: "Most popular — better value per bottle.", hint: "" },
      { key: "product3Name",  label: "Tier 3 Name",    placeholder: "12-Pack",         hint: "BEST VALUE tier" },
      { key: "product3Price", label: "Tier 3 Price",   placeholder: "$119",            hint: "" },
      { key: "product3Per",   label: "Tier 3 Per-unit",placeholder: "$9.92/bottle",    hint: "" },
      { key: "product3Note",  label: "Tier 3 Note",    placeholder: "Best value — stock up, free shipping.", hint: "" },
    ],
  },
  {
    id: "testimonials",
    title: "⭐ Testimonials",
    desc: "3 customer reviews shown BEFORE pricing — proof before ask (CF-P4)",
    fields: [
      { key: "t1Quote",    label: "Review 1 Quote",    placeholder: "Best juice I've had. You can taste the freshness the second you open it.", hint: "1-3 sentences" },
      { key: "t1Name",     label: "Review 1 Name",     placeholder: "Sarah M.",        hint: "First name + last initial" },
      { key: "t1Location", label: "Review 1 Location", placeholder: "Sacramento, CA",  hint: "" },
      { key: "t1Product",  label: "Review 1 Product",  placeholder: "6-Pack",          hint: "" },
      { key: "t2Quote",    label: "Review 2 Quote",    placeholder: "Finally a local juice worth driving for.", hint: "" },
      { key: "t2Name",     label: "Review 2 Name",     placeholder: "James T.",        hint: "" },
      { key: "t2Location", label: "Review 2 Location", placeholder: "Orangevale, CA", hint: "" },
      { key: "t2Product",  label: "Review 2 Product",  placeholder: "12-Pack",         hint: "" },
      { key: "t3Quote",    label: "Review 3 Quote",    placeholder: "Ordered twice already. My whole family loves it.", hint: "" },
      { key: "t3Name",     label: "Review 3 Name",     placeholder: "Lisa R.",         hint: "" },
      { key: "t3Location", label: "Review 3 Location", placeholder: "Folsom, CA",      hint: "" },
      { key: "t3Product",  label: "Review 3 Product",  placeholder: "12-Pack",         hint: "" },
    ],
  },
  {
    id: "urgency",
    title: "⏰ Urgency Timer",
    desc: "Countdown timer shown at top of page (CF-P5)",
    fields: [
      { key: "urgencyMsg",   label: "Urgency Message",      placeholder: "This week's batch closes in:", hint: "Shown before the countdown clock" },
      { key: "countdownHrs", label: "Countdown Hours",      placeholder: "8",  hint: "Hours from page load. Resets on refresh." },
    ],
  },
  {
    id: "faqs",
    title: "❓ FAQ Answers",
    desc: "Answers to the 6 FAQ questions shown on site (questions are fixed for conversion)",
    fields: [
      { key: "faq1a", label: "FAQ 1 Answer — Do you ship internationally?", placeholder: "No. USA-only shipping for now.", hint: "" },
      { key: "faq2a", label: "FAQ 2 Answer — Where is pickup located?",     placeholder: "Orangevale, California. We'll confirm timing and address by phone/email.", hint: "" },
      { key: "faq3a", label: "FAQ 3 Answer — How fresh is the juice?",      placeholder: "Pressed to order, shipped cold. Best within 5-7 days.", hint: "" },
      { key: "faq4a", label: "FAQ 4 Answer — Return policy?",               placeholder: "Contact us within 48 hours and we'll make it right.", hint: "" },
      { key: "faq5a", label: "FAQ 5 Answer — Can I pick up without ordering online?", placeholder: "Yes — use the Reserve Pickup form below.", hint: "" },
      { key: "faq6a", label: "FAQ 6 Answer — Is the payment secure?",       placeholder: "Yes. We use Stripe — trusted by Amazon and millions of businesses.", hint: "" },
    ],
  },
  {
    id: "contact",
    title: "📞 Contact & Business",
    desc: "Contact info referenced in APIs and notifications",
    fields: [
      { key: "ownerName",    label: "Owner / Contact Name", placeholder: "Your Name",                  hint: "Used in email signatures" },
      { key: "businessName", label: "Legal Business Name",  placeholder: "Brewing Brothers LLC",       hint: "" },
      { key: "notifyEmail",  label: "Notification Email",   placeholder: "shamelessbrewingbrothers@gmail.com", hint: "Gets emailed on every reservation and order" },
      { key: "contactPhone", label: "Contact Phone",        placeholder: "(916) 555-0123",             hint: "Optional — shown if you add it to FAQ or footer" },
    ],
  },
  {
    id: "keys",
    title: "🔑 API Keys & Secret Config",
    desc: "Never share these. Copy them into Vercel → Settings → Environment Variables",
    fields: [
      { key: "appsScriptUrl",    label: "Apps Script Web App URL",       placeholder: "https://script.google.com/macros/s/...",  hint: "From Apps Script → Deploy → Manage Deployments" },
      { key: "stripeSecretKey",  label: "Stripe Secret Key",             placeholder: "sk_test_...",                              hint: "Stripe Dashboard → Developers → API keys" },
      { key: "stripeWebhookSecret", label: "Stripe Webhook Secret",     placeholder: "whsec_...",                                hint: "Stripe Dashboard → Webhooks → Signing secret" },
      { key: "stripePriceSingle",   label: "Stripe Price ID — Single",  placeholder: "price_...",                               hint: "Stripe Dashboard → Products → [product] → Price ID" },
      { key: "stripePriceSixpack",  label: "Stripe Price ID — 6-Pack",  placeholder: "price_...",                               hint: "" },
      { key: "stripePriceTwelve",   label: "Stripe Price ID — 12-Pack", placeholder: "price_...",                               hint: "" },
      { key: "hubspotApiKey",       label: "HubSpot API Key (Phase 3)", placeholder: "pat-na1-...",                              hint: "HubSpot → Settings → Private Apps → Create app" },
      { key: "brevoApiKey",         label: "Brevo API Key (Phase 4)",   placeholder: "xkeysib-...",                             hint: "app.brevo.com → Settings → API Keys" },
    ],
    secret: true,
  },
  {
    id: "theme",
    title: "🎨 Theme",
    desc: "Visual color scheme — set via NEXT_PUBLIC_THEME in Vercel",
    fields: [],
    isTheme: true,
  },
];

type FormData = Record<string, string>;

export default function CustomizePage() {
  const defaults: FormData = {};
  SECTIONS.forEach(s => s.fields.forEach(f => { defaults[f.key] = ""; }));
  defaults.theme = "rustic";

  const [form, setForm]     = useState<FormData>(defaults);
  const [copied, setCopied] = useState(false);

  function set(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function generateEnv(): string {
    const v = form;
    return [
      "# ══════════════════════════════════════════════════════════════",
      "# Brewing Brothers — Generated .env.local",
      "# Paste ALL of these into Vercel → Settings → Environment Variables",
      "# Also save as .env.local in your local project folder",
      "# ══════════════════════════════════════════════════════════════",
      "",
      "# Theme",
      `NEXT_PUBLIC_THEME=${v.theme || "rustic"}`,
      `NEXT_PUBLIC_BASE_URL=https://brewing-brothers-funnel.vercel.app`,
      "",
      "# Prices (displayed on site)",
      `NEXT_PUBLIC_PRICE_SINGLE=${v.product1Price || "$12"}`,
      `NEXT_PUBLIC_PRICE_SIXPACK=${v.product2Price || "$64"}`,
      `NEXT_PUBLIC_PRICE_TWELVE=${v.product3Price || "$119"}`,
      "",
      "# Apps Script backend",
      `APPS_SCRIPT_WEB_APP_URL=${v.appsScriptUrl || ""}`,
      "",
      "# Stripe",
      `NEXT_PUBLIC_STRIPE_ENABLED=false`,
      `STRIPE_SECRET_KEY=${v.stripeSecretKey || "sk_test_REPLACE_ME"}`,
      `STRIPE_WEBHOOK_SECRET=${v.stripeWebhookSecret || "whsec_REPLACE_ME"}`,
      `STRIPE_PRICE_SINGLE=${v.stripePriceSingle || "price_REPLACE_ME"}`,
      `STRIPE_PRICE_SIXPACK=${v.stripePriceSixpack || "price_REPLACE_ME"}`,
      `STRIPE_PRICE_TWELVE=${v.stripePriceTwelve || "price_REPLACE_ME"}`,
      `NEXT_PUBLIC_STRIPE_PRICE_SINGLE=${v.stripePriceSingle || "price_REPLACE_ME"}`,
      `NEXT_PUBLIC_STRIPE_PRICE_SIXPACK=${v.stripePriceSixpack || "price_REPLACE_ME"}`,
      `NEXT_PUBLIC_STRIPE_PRICE_TWELVE=${v.stripePriceTwelve || "price_REPLACE_ME"}`,
      "",
      "# HubSpot CRM (Phase 3)",
      `HUBSPOT_API_KEY=${v.hubspotApiKey || "pat-na1-REPLACE_ME"}`,
      "",
      "# Email (Phase 4)",
      `BREVO_API_KEY=${v.brevoApiKey || "xkeysib-REPLACE_ME"}`,
      `BREVO_LIST_ID=1`,
    ].join("\n");
  }

  function generateSummary(): string {
    const v = form;
    return [
      "# ══ Brand Config to update in app/page.tsx ═══════════════════",
      `# BRAND_CONFIG.name           = "${v.brandName || "Brewing Brothers"}"`,
      `# BRAND_CONFIG.tagline        = "${v.tagline || "Organic Juice"}"`,
      `# BRAND_CONFIG.location       = "${v.location || "Orangevale, California"}"`,
      `# BRAND_CONFIG.heroHeadline   = "${v.heroHeadline || "Brewing Brothers"}"`,
      `# BRAND_CONFIG.primaryCTA     = "${v.primaryCTA || "Order Now — Ships USA"}"`,
      `# BRAND_CONFIG.urgencyMsg     = "${v.urgencyMsg || "This week's batch closes in:"}"`,
      `# BRAND_CONFIG.countdownHrs   = ${v.countdownHrs || 8}`,
    ].join("\n");
  }

  async function copyEnv() {
    await navigator.clipboard.writeText(generateEnv() + "\n\n" + generateSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <main className="min-h-screen bg-amber-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-block bg-amber-700 text-white px-4 py-1 rounded-full text-sm font-medium mb-3">
            Admin Only
          </div>
          <h1 className="text-3xl font-bold text-amber-900">Site Customization</h1>
          <p className="mt-2 text-slate-600">
            Fill in your brand details, pricing, testimonials, and API keys below.
            When done, copy the generated <code className="bg-amber-100 px-1 rounded">.env.local</code> block at the bottom and paste it into Vercel.
          </p>
        </div>

        {/* Sections */}
        {SECTIONS.map(section => (
          <div key={section.id} className="mb-8 bg-white border border-amber-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-amber-900 mb-1">{section.title}</h2>
            <p className="text-slate-500 text-sm mb-5">{section.desc}</p>

            {/* Theme picker */}
            {section.isTheme && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "rustic", label: "🌾 Rustic", desc: "Amber / warm orange", preview: "bg-amber-700" },
                  { id: "bold",   label: "⚡ Bold",   desc: "Dark + lime green",   preview: "bg-lime-400" },
                  { id: "minimal",label: "⬜ Minimal", desc: "Clean slate grey",    preview: "bg-slate-900" },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => set("theme", t.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition ${
                      form.theme === t.id ? "border-amber-700 bg-amber-50" : "border-slate-200"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${t.preview} mb-2`} />
                    <p className="font-semibold text-slate-800 text-sm">{t.label}</p>
                    <p className="text-xs text-slate-500">{t.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Fields */}
            {section.fields.map(field => (
              <div key={field.key} className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {field.label}
                  {section.secret && <span className="ml-2 text-xs text-red-600 font-normal">🔒 secret</span>}
                </label>
                {field.key.includes("Note") || field.key.includes("Quote") || field.key.includes("Subheadline") || field.key.includes("a") && field.key.startsWith("faq") ? (
                  <textarea
                    value={form[field.key] || ""}
                    onChange={e => set(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={2}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                ) : (
                  <input
                    type={section.secret && field.key.includes("Key") ? "password" : "text"}
                    value={form[field.key] || ""}
                    onChange={e => set(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                )}
                {field.hint && <p className="text-xs text-slate-400 mt-1">{field.hint}</p>}
              </div>
            ))}
          </div>
        ))}

        {/* Generated output */}
        <div className="bg-amber-900 rounded-3xl p-6 text-white">
          <h2 className="text-xl font-bold mb-2">📋 Generated Config</h2>
          <p className="text-amber-200 text-sm mb-4">
            Copy this entire block. Paste into <strong>Vercel → Settings → Environment Variables</strong>.
            Also save as <code className="bg-amber-700 px-1 rounded">.env.local</code> locally.
          </p>
          <pre className="bg-amber-950 rounded-2xl p-4 text-xs text-amber-100 overflow-x-auto whitespace-pre-wrap">
            {generateEnv()}
            {"\n\n"}
            {generateSummary()}
          </pre>
          <button
            onClick={copyEnv}
            className="mt-4 w-full py-3 rounded-2xl bg-white text-amber-900 font-bold hover:bg-amber-50 transition"
          >
            {copied ? "✅ Copied!" : "📋 Copy Full Config"}
          </button>
        </div>

        <p className="text-center mt-6 text-sm text-slate-500">
          <a href="/" className="text-amber-700 hover:underline">← Back to main site</a>
        </p>
      </div>
    </main>
  );
}

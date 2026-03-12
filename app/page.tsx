"use client";

import { useMemo, useState, useEffect } from "react";
import { getTheme, themeClasses } from "@/lib/themes";

// ── BRAND CONFIG — edit these to customize the site ─────────────────────────
export const BRAND_CONFIG = {
  name:           "Brewing Brothers",
  tagline:        "Organic Juice",
  location:       "Orangevale, California",
  shipping:       "USA Shipping Only",
  heroHeadline:   "Brewing Brothers",
  heroSubheadline:"Farm-fresh cold-pressed juice. Small-batch crafted daily in Northern California. Real ingredients. Zero additives.",
  primaryCTA:     "Order Now — Ships USA",
  secondaryCTA:   "Reserve Pickup · Pay On Site",
  urgencyMsg:     "This week's batch closes in:",
  countdownHrs:   8,
  pickupNote:     "Pickup: Orangevale, California · Secure Stripe checkout",
};

export const PRODUCTS = [
  { name:"Single Bottle", price: process.env.NEXT_PUBLIC_PRICE_SINGLE  || "$12",  per:"$12/bottle",    note:"Perfect intro — taste the freshness.",            badge:null,           priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SINGLE   || "", featured:false },
  { name:"6-Pack",        price: process.env.NEXT_PUBLIC_PRICE_SIXPACK || "$64",  per:"$10.67/bottle", note:"Most popular — better value per bottle.",         badge:"MOST POPULAR", priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SIXPACK  || "", featured:true  },
  { name:"12-Pack",       price: process.env.NEXT_PUBLIC_PRICE_TWELVE  || "$119", per:"$9.92/bottle",  note:"Best value — stock up, free shipping.",           badge:"BEST VALUE",   priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_TWELVE  || "", featured:false },
];

export const TESTIMONIALS = [
  { quote:"Best juice I've had. You can taste the freshness the second you open it. Won't buy store-bought again.", name:"Sarah M.", location:"Sacramento, CA", product:"6-Pack",  stars:5 },
  { quote:"Finally a local juice worth driving for. The cold-press process is real — you can tell the difference.",   name:"James T.", location:"Orangevale, CA",product:"12-Pack", stars:5 },
  { quote:"Ordered twice already. My whole family loves it. The 12-pack disappears in a week.",                       name:"Lisa R.",  location:"Folsom, CA",     product:"12-Pack", stars:5 },
];

export const BENEFITS = [
  { icon:"🌿", h:"100% Organic",       p:"Every ingredient is USDA certified organic. No exceptions, no compromises." },
  { icon:"❄️", h:"Cold-Pressed Daily", p:"Small-batch pressed each morning. Ships same day. Not designed for a shelf." },
  { icon:"🚜", h:"Local Farm Sourced", p:"Ingredients from Northern California farms within 60 miles of Orangevale." },
];

export const FAQS = [
  { q:"Do you ship internationally?",            a:"No. USA-only shipping for now. We want to ensure quality through every leg of delivery." },
  { q:"Where is pickup located?",                a:"Orangevale, California. We'll confirm exact pickup timing and address via phone or email after your reservation." },
  { q:"How fresh is the juice when it arrives?", a:"Small-batch pressed to order, shipped cold. Best consumed within 5–7 days of delivery." },
  { q:"What's your return policy?",             a:"We stand behind every bottle. If anything is wrong with your order, contact us within 48 hours and we'll make it right." },
  { q:"Can I pick up without ordering online?",  a:"Yes — use the Reserve Pickup form below and we'll coordinate directly. Pay on pickup, no upfront payment required." },
  { q:"Is the Order Now payment secure?",        a:"Yes. We use Stripe — the same processor trusted by Amazon, Shopify, and millions of businesses worldwide." },
];

export const TRUST_BADGES = [
  { label:"USDA Organic",    icon:"🌿" },
  { label:"Cold-Pressed",    icon:"❄️" },
  { label:"Local CA Farm",   icon:"🚜" },
  { label:"USA Shipping",    icon:"🇺🇸" },
  { label:"Secure Checkout", icon:"🔒" },
];

function useCountdown(targetHours: number) {
  const [time, setTime] = useState({ h: targetHours, m: 0, s: 0 });
  useEffect(() => {
    const end = Date.now() + targetHours * 3_600_000;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setTime({ h:Math.floor(diff/3_600_000), m:Math.floor((diff%3_600_000)/60_000), s:Math.floor((diff%60_000)/1_000) });
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [targetHours]);
  return time;
}
const pad = (n: number) => String(n).padStart(2, "0");

export default function Home() {
  const theme    = useMemo(() => getTheme(process.env.NEXT_PUBLIC_THEME), []);
  const t        = themeClasses(theme);
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sticky,  setSticky]  = useState(false);
  const countdown = useCountdown(BRAND_CONFIG.countdownHrs);

  useEffect(() => {
    const fn = () => setSticky(window.scrollY > 400);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  async function submitPickup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg(null); setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res  = await fetch("/api/reserve-pickup", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ name:String(form.get("name")||""), email:String(form.get("email")||""), phone:String(form.get("phone")||""), quantity:String(form.get("quantity")||"") }) });
      const data = await res.json();
      if (!res.ok || !data.ok) { setMsg(data.error || "Something went wrong. Try again."); }
      else { window.location.href = "/thank-you?type=pickup"; }
    } catch (err) { setMsg(String(err)); } finally { setLoading(false); }
  }

  async function handleOrder(priceId: string) {
    const enabled = process.env.NEXT_PUBLIC_STRIPE_ENABLED === "true";
    if (!enabled) { alert("Online ordering is coming soon! Reserve a local pickup below — no payment required."); return; }
    try {
      const res  = await fetch("/api/checkout", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ priceId }) });
      const data = await res.json();
      if (data.ok && data.url) { window.location.href = data.url; }
      else { alert(data.error || "Checkout unavailable."); }
    } catch { alert("Checkout unavailable. Please try again."); }
  }

  return (
    <main className={`min-h-screen ${t.pageBg}`}>
      <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${sticky?"translate-y-0":"translate-y-full"}`}>
        <div className="bg-amber-800 px-4 py-3 flex gap-2 shadow-2xl">
          <a href="#order"  className="flex-1 text-center bg-white text-amber-900 font-bold py-3 rounded-xl text-sm">Order Now</a>
          <a href="#pickup" className="flex-1 text-center border border-white text-white font-bold py-3 rounded-xl text-sm">Reserve Pickup</a>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="rounded-2xl bg-amber-900 text-amber-50 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 mb-8">
          <p className="text-sm font-medium">🧃 <strong>{BRAND_CONFIG.urgencyMsg}</strong> Reserve before it&apos;s gone.</p>
          <div className="flex gap-2 text-center font-mono font-bold text-lg">
            {[{v:countdown.h,l:"HR"},{v:countdown.m,l:"MIN"},{v:countdown.s,l:"SEC"}].map(({v,l})=>(
              <div key={l} className="flex flex-col items-center">
                <span className="bg-amber-700 px-3 py-1 rounded-lg min-w-[3rem]">{pad(v)}</span>
                <span className="text-xs text-amber-300 mt-0.5">{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={`rounded-3xl p-8 sm:p-12 ${t.card}`}>
          <div className="flex flex-col gap-5 max-w-3xl">
            <span className={`inline-flex w-fit px-3 py-1 rounded-full text-sm font-medium ${t.badge}`}>
              {BRAND_CONFIG.shipping} · {BRAND_CONFIG.location} pickup · Organic certified
            </span>
            <h1 className={`text-4xl sm:text-5xl font-bold leading-tight ${t.accent}`}>
              {BRAND_CONFIG.heroHeadline}<br/><span className="text-amber-600">{BRAND_CONFIG.tagline}</span>
            </h1>
            <p className="text-lg text-slate-700 leading-relaxed">{BRAND_CONFIG.heroSubheadline}</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <a href="#order"  className={`inline-flex justify-center items-center px-8 py-4 rounded-2xl font-bold text-lg shadow-lg ${t.button}`}>{BRAND_CONFIG.primaryCTA}</a>
              <a href="#pickup" className="inline-flex justify-center items-center px-8 py-4 rounded-2xl font-bold text-lg border-2 border-amber-700 text-amber-800 bg-white hover:bg-amber-50 transition">{BRAND_CONFIG.secondaryCTA}</a>
            </div>
            <p className="text-sm text-slate-500">📍 {BRAND_CONFIG.pickupNote}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {TRUST_BADGES.map(b=>(
            <div key={b.label} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${t.badge}`}><span>{b.icon}</span><span>{b.label}</span></div>
          ))}
        </div>
        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {BENEFITS.map(x=>(
            <div key={x.h} className={`rounded-2xl p-6 ${t.card}`}>
              <div className="text-3xl mb-3">{x.icon}</div>
              <h3 className="text-lg font-bold text-amber-900">{x.h}</h3>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">{x.p}</p>
            </div>
          ))}
        </section>
        <section className="mt-12">
          <h2 className={`text-2xl font-bold text-center mb-2 ${t.accent}`}>What Customers Are Saying</h2>
          <p className="text-center text-slate-500 text-sm mb-8">Real customers. Real reviews.</p>
          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map(r=>(
              <div key={r.name} className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
                <div className="text-amber-500 text-lg mb-3">{"★".repeat(r.stars)}</div>
                <p className="text-slate-700 italic text-sm leading-relaxed">&ldquo;{r.quote}&rdquo;</p>
                <div className="mt-4">
                  <p className="font-bold text-amber-900 text-sm">{r.name}</p>
                  <p className="text-xs text-slate-500">{r.location} · {r.product}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#order"  className={`inline-flex justify-center items-center px-8 py-4 rounded-2xl font-bold text-lg shadow ${t.button}`}>Order Now →</a>
          <a href="#pickup" className="inline-flex justify-center items-center px-8 py-4 rounded-2xl font-bold text-lg border-2 border-amber-700 text-amber-800 bg-white hover:bg-amber-50 transition">Reserve Pickup</a>
        </div>
        <section id="order" className="mt-14">
          <div className={`rounded-3xl p-8 ${t.card}`}>
            <h2 className={`text-2xl font-bold ${t.accent}`}>Order Now — USA Shipping</h2>
            <p className="mt-1 text-slate-600">{process.env.NEXT_PUBLIC_STRIPE_ENABLED==="true" ? "Secure Stripe payment. Ships within 24 hours." : "Stripe checkout coming soon — reserve a pickup below!"}</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {PRODUCTS.map(p=>(
                <div key={p.name} className={`relative rounded-2xl border-2 p-6 flex flex-col bg-white ${p.badge==="MOST POPULAR"?"border-amber-600 shadow-lg":"border-slate-200"}`}>
                  {p.badge && <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold ${p.badge==="MOST POPULAR"?"bg-amber-600 text-white":"bg-slate-800 text-white"}`}>{p.badge}</span>}
                  <h3 className="font-bold text-lg text-slate-800">{p.name}</h3>
                  <div className="mt-2 text-3xl font-black text-amber-800">{p.price}</div>
                  <div className="text-xs text-slate-500 mb-1">{p.per}</div>
                  <p className="text-sm text-slate-600 flex-1 mb-4">{p.note}</p>
                  <button onClick={()=>handleOrder(p.priceId)} className={`w-full px-4 py-3 rounded-xl font-bold ${t.button}`}>
                    {process.env.NEXT_PUBLIC_STRIPE_ENABLED==="true"?"Order Now":"Coming Soon"}
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-slate-500 text-center">✅ Secure Stripe checkout · 📦 USA shipping only · 🔄 Satisfaction guarantee</p>
          </div>
        </section>
        <div className="mt-6 text-center">
          <a href="#pickup" className="inline-flex justify-center items-center px-8 py-3 rounded-2xl font-semibold border-2 border-amber-700 text-amber-800 bg-white hover:bg-amber-50 transition">Prefer local pickup? Reserve below →</a>
        </div>
        <section id="pickup" className="mt-14">
          <div className={`rounded-3xl p-8 ${t.card}`}>
            <h2 className={`text-2xl font-bold ${t.accent}`}>Reserve Pickup — {BRAND_CONFIG.location}</h2>
            <p className="mt-1 text-slate-600">Reserve now. Pay on pickup. We&apos;ll contact you to confirm timing.</p>
            <form onSubmit={submitPickup} className="mt-6 grid gap-4 sm:grid-cols-2">
              <input name="name"     placeholder="Full Name"          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" required />
              <input name="email"    placeholder="Email Address" type="email" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" required />
              <input name="phone"    placeholder="Phone Number"        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" required />
              <select name="quantity" defaultValue="" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" required>
                <option value="" disabled>Select quantity...</option>
                <option>1 Bottle</option><option>2 Bottles</option><option>6-Pack</option><option>12-Pack</option><option>Custom — specify at pickup</option>
              </select>
              <div className="sm:col-span-2">
                <button disabled={loading} className={`w-full px-6 py-4 rounded-2xl font-bold text-lg ${t.button} disabled:opacity-60`}>
                  {loading ? "Submitting…" : "Reserve My Pickup Spot →"}
                </button>
              </div>
              {msg && <div className="sm:col-span-2 text-sm text-red-700 bg-red-50 rounded-xl p-3">{msg}</div>}
            </form>
            <p className="mt-4 text-xs text-slate-500 text-center">We&apos;ll reach out within 24 hours to confirm. No payment required until pickup.</p>
          </div>
        </section>
        <section className="mt-14">
          <div className={`rounded-3xl p-8 ${t.card}`}>
            <h2 className={`text-2xl font-bold mb-6 ${t.accent}`}>Frequently Asked Questions</h2>
            <div className="divide-y divide-slate-100">
              {FAQS.map((faq,i)=>(
                <div key={i} className="py-4">
                  <button onClick={()=>setOpenFaq(openFaq===i?null:i)} className="w-full flex items-center justify-between text-left">
                    <span className="font-semibold text-slate-800 text-sm sm:text-base">{faq.q}</span>
                    <span className="text-amber-600 ml-4 text-lg flex-shrink-0">{openFaq===i?"−":"+"}</span>
                  </button>
                  {openFaq===i && <p className="mt-2 text-slate-600 text-sm leading-relaxed">{faq.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="mt-10">
          <div className="rounded-3xl bg-amber-900 p-10 text-center">
            <h2 className="text-3xl font-black text-white mb-3">Ready to taste the difference?</h2>
            <p className="text-amber-200 mb-8 max-w-lg mx-auto">Order for shipping or reserve your local pickup spot today. Small-batch means limited availability every week.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#order"  className="inline-flex justify-center items-center px-10 py-4 rounded-2xl font-bold text-lg bg-white text-amber-900 hover:bg-amber-50 transition shadow-lg">Order Now — Ships USA</a>
              <a href="#pickup" className="inline-flex justify-center items-center px-10 py-4 rounded-2xl font-bold text-lg border-2 border-white text-white hover:bg-amber-800 transition">Reserve Pickup (Free)</a>
            </div>
            <p className="text-amber-300 text-xs mt-6">🔒 Secure · 🌿 Organic · 📍 {BRAND_CONFIG.location} · 🚚 {BRAND_CONFIG.shipping}</p>
          </div>
        </section>
        <footer className="py-10 text-center text-sm text-slate-500">
          <p className="font-medium text-slate-700 mb-1">{BRAND_CONFIG.name}</p>
          <p>{BRAND_CONFIG.tagline} · {BRAND_CONFIG.location} · {BRAND_CONFIG.shipping}</p>
          <p className="mt-2 text-xs text-slate-400">© {new Date().getFullYear()} {BRAND_CONFIG.name}. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}

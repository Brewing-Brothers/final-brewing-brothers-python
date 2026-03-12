#!/usr/bin/env python3
"""
Brewing Brothers — Repo Builder v2.0
=====================================
Drop this file in: C:\\Users\\necha\\Desktop\\brewing-brothers-funnel
Run: python repo-builder.py

What it does:
  1. Writes all production files to the correct paths
  2. Creates directory structure
  3. Runs git add . && git commit && git push origin master

Git branch: master (NEVER main)
"""

import os
import sys

# ─── File registry ────────────────────────────────────────────────────────────
FILES = {}

FILES["app/page.tsx"] = '''"use client";

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
  urgencyMsg:     "This week\'s batch closes in:",
  countdownHrs:   8,
  pickupNote:     "Pickup: Orangevale, California · Secure Stripe checkout",
};

export const PRODUCTS = [
  { name:"Single Bottle", price: process.env.NEXT_PUBLIC_PRICE_SINGLE  || "$12",  per:"$12/bottle",    note:"Perfect intro — taste the freshness.",            badge:null,           priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SINGLE   || "", featured:false },
  { name:"6-Pack",        price: process.env.NEXT_PUBLIC_PRICE_SIXPACK || "$64",  per:"$10.67/bottle", note:"Most popular — better value per bottle.",         badge:"MOST POPULAR", priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SIXPACK  || "", featured:true  },
  { name:"12-Pack",       price: process.env.NEXT_PUBLIC_PRICE_TWELVE  || "$119", per:"$9.92/bottle",  note:"Best value — stock up, free shipping.",           badge:"BEST VALUE",   priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_TWELVE  || "", featured:false },
];

export const TESTIMONIALS = [
  { quote:"Best juice I\'ve had. You can taste the freshness the second you open it. Won\'t buy store-bought again.", name:"Sarah M.", location:"Sacramento, CA", product:"6-Pack",  stars:5 },
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
  { q:"Where is pickup located?",                a:"Orangevale, California. We\'ll confirm exact pickup timing and address via phone or email after your reservation." },
  { q:"How fresh is the juice when it arrives?", a:"Small-batch pressed to order, shipped cold. Best consumed within 5–7 days of delivery." },
  { q:"What\'s your return policy?",             a:"We stand behind every bottle. If anything is wrong with your order, contact us within 48 hours and we\'ll make it right." },
  { q:"Can I pick up without ordering online?",  a:"Yes — use the Reserve Pickup form below and we\'ll coordinate directly. Pay on pickup, no upfront payment required." },
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
'''

FILES["app/layout.tsx"] = '''import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brewing Brothers — Organic Juice",
  description: "Farm-fresh cold-pressed organic juice. Small-batch crafted daily in Northern California.",
  openGraph: { title:"Brewing Brothers — Organic Juice", description:"Cold-pressed. USDA Organic. Local CA farm sourced.", type:"website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
'''

FILES["app/globals.css"] = '''@tailwind base;
@tailwind components;
@tailwind utilities;
html { scroll-behavior: smooth; }
@media (max-width: 767px) { body { padding-bottom: 72px; } }
'''

FILES["lib/themes.ts"] = '''export type ThemeName = "rustic" | "bold" | "minimal";
export function getTheme(name: string | undefined): ThemeName {
  if (name === "rustic" || name === "bold" || name === "minimal") return name;
  return "rustic";
}
export function themeClasses(theme: ThemeName) {
  switch (theme) {
    case "rustic":  return { pageBg:"bg-amber-50", card:"bg-white border border-amber-200 shadow-sm", accent:"text-amber-900", button:"bg-amber-700 hover:bg-amber-800 text-white transition", badge:"bg-amber-100 text-amber-800" };
    case "bold":    return { pageBg:"bg-zinc-950",  card:"bg-zinc-900 border border-zinc-800",          accent:"text-lime-300",  button:"bg-lime-400 hover:bg-lime-300 text-zinc-950 transition",   badge:"bg-zinc-800 text-zinc-100" };
    case "minimal":
    default:        return { pageBg:"bg-slate-50",  card:"bg-white border border-slate-200",            accent:"text-slate-900", button:"bg-slate-900 hover:bg-slate-800 text-white transition",     badge:"bg-slate-100 text-slate-700" };
  }
}
'''

FILES["app/thank-you/page.tsx"] = '''export default function ThankYouPage({ searchParams }: { searchParams: { type?: string } }) {
  const isPickup = (searchParams.type || "order") === "pickup";
  return (
    <main className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white border border-amber-200 rounded-3xl p-10 text-center shadow-lg">
        <div className="text-5xl mb-4">{isPickup ? "📍" : "📦"}</div>
        <h1 className="text-2xl font-bold text-amber-900">{isPickup ? "Pickup Reserved ✅" : "Order Confirmed ✅"}</h1>
        <p className="mt-3 text-slate-700 leading-relaxed">
          {isPickup ? "We received your Orangevale pickup reservation. We\'ll reach out within 24 hours to confirm pickup timing. No payment required until you arrive."
                    : "Thanks for your order! You\'ll receive a confirmation email shortly with tracking information."}
        </p>
        <div className="mt-6 p-4 bg-amber-50 rounded-2xl text-sm text-amber-800">
          <p className="font-semibold">What happens next?</p>
          <p className="mt-1">{isPickup ? "We\'ll call or email you to confirm timing and exact pickup location." : "Your order is being prepared. Expect delivery within 2–5 business days."}</p>
        </div>
        <a href="/" className="inline-block mt-8 px-8 py-3 rounded-2xl bg-amber-700 text-white font-bold hover:bg-amber-800 transition">Back to Home</a>
      </div>
    </main>
  );
}
'''

FILES["app/reserve/page.tsx"] = '''"use client";
import { useState } from "react";
export default function ReservePage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg(null); setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/reserve-pickup", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ name:String(form.get("name")||""), email:String(form.get("email")||""), phone:String(form.get("phone")||""), quantity:String(form.get("quantity")||"") }) });
      const data = await res.json();
      if (!res.ok || !data.ok) { setMsg(data.error || "Something went wrong."); }
      else { window.location.href = "/thank-you?type=pickup"; }
    } catch(err) { setMsg(String(err)); } finally { setLoading(false); }
  }
  return (
    <main className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <span className="inline-block bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-sm font-medium mb-4">Orangevale, California · Pay on pickup</span>
          <h1 className="text-3xl font-bold text-amber-900">Reserve Your Pickup</h1>
          <p className="mt-2 text-slate-600">No payment required. We\'ll confirm timing within 24 hours.</p>
        </div>
        <div className="bg-white border border-amber-200 rounded-3xl p-8 shadow-sm">
          <form onSubmit={submit} className="flex flex-col gap-4">
            <input name="name"  placeholder="Full Name"     className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" required />
            <input name="email" placeholder="Email" type="email" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" required />
            <input name="phone" placeholder="Phone"         className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" required />
            <select name="quantity" defaultValue="" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" required>
              <option value="" disabled>Select quantity...</option>
              <option>1 Bottle</option><option>2 Bottles</option><option>6-Pack</option><option>12-Pack</option><option>Custom</option>
            </select>
            <button disabled={loading} className="mt-2 w-full px-6 py-4 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-lg transition disabled:opacity-60">
              {loading ? "Submitting…" : "Reserve My Spot →"}
            </button>
            {msg && <div className="text-sm text-red-700 bg-red-50 rounded-xl p-3">{msg}</div>}
          </form>
        </div>
        <p className="text-center mt-6 text-sm"><a href="/" className="text-amber-700 hover:underline">← Back to main site</a></p>
      </div>
    </main>
  );
}
'''

FILES["app/api/reserve-pickup/route.ts"] = '''import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ ok:false, error:"Invalid request body." }, { status:400 });
    const { name, email, phone, quantity } = body as Record<string,string>;
    if (!name?.trim())     return NextResponse.json({ ok:false, error:"Name is required."     }, { status:400 });
    if (!email?.trim())    return NextResponse.json({ ok:false, error:"Email is required."    }, { status:400 });
    if (!phone?.trim())    return NextResponse.json({ ok:false, error:"Phone is required."    }, { status:400 });
    if (!quantity?.trim()) return NextResponse.json({ ok:false, error:"Quantity is required." }, { status:400 });
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return NextResponse.json({ ok:false, error:"Please enter a valid email." }, { status:400 });
    const appsScriptUrl = process.env.APPS_SCRIPT_WEB_APP_URL;
    if (!appsScriptUrl) return NextResponse.json({ ok:false, error:"Backend not configured." }, { status:500 });
    const appsResponse = await fetch(appsScriptUrl, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ action:"reservePickup", name:name.trim(), email:email.trim().toLowerCase(), phone:phone.trim(), quantity:quantity.trim(), timestamp:new Date().toISOString(), source:"website" }),
    });
    const appsData = await appsResponse.json().catch(() => ({ status:"error" }));
    if (!appsResponse.ok || appsData.status === "error") return NextResponse.json({ ok:false, error:"Could not save reservation. Please try again." }, { status:500 });
    // HubSpot CRM (Phase 3 — non-fatal if fails)
    const hubspotKey = process.env.HUBSPOT_API_KEY;
    if (hubspotKey) {
      try {
        await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
          method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${hubspotKey}`},
          body: JSON.stringify({ properties:{ firstname:name.trim().split(" ")[0]||name.trim(), lastname:name.trim().split(" ").slice(1).join(" ")||"", email:email.trim().toLowerCase(), phone:phone.trim(), hs_lead_status:"NEW", quantity_requested:quantity.trim(), lead_source:"Website Pickup Form" } }),
        });
      } catch(e) { console.warn("HubSpot sync failed (non-fatal):", e); }
    }
    return NextResponse.json({ ok:true });
  } catch(err) {
    console.error("reserve-pickup error:", err);
    return NextResponse.json({ ok:false, error:"Unexpected error." }, { status:500 });
  }
}
'''

FILES["app/api/checkout/route.ts"] = '''import { NextRequest, NextResponse } from "next/server";
// Activate: npm install stripe + set NEXT_PUBLIC_STRIPE_ENABLED=true + all STRIPE_* env vars
export async function POST(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_STRIPE_ENABLED !== "true")
    return NextResponse.json({ ok:false, error:"Stripe not yet enabled." }, { status:503 });
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion:"2024-04-10" });
    const { priceId } = await req.json();
    if (!priceId) return NextResponse.json({ ok:false, error:"No price selected." }, { status:400 });
    const base = process.env.NEXT_PUBLIC_BASE_URL || "https://brewing-brothers-funnel.vercel.app";
    const session = await stripe.checkout.sessions.create({
      mode:"payment", payment_method_types:["card"],
      line_items:[{ price:priceId, quantity:1 }],
      success_url:`${base}/thank-you?type=order&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:`${base}/?checkout=cancelled`,
      shipping_address_collection:{ allowed_countries:["US"] },
    });
    return NextResponse.json({ ok:true, url:session.url });
  } catch(err) {
    const msg = err instanceof Error ? err.message : "Checkout failed.";
    return NextResponse.json({ ok:false, error:msg }, { status:500 });
  }
}
'''

FILES["app/api/webhook/stripe/route.ts"] = '''import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_STRIPE_ENABLED !== "true") return NextResponse.json({ received:true });
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion:"2024-04-10" });
    const body = await req.text();
    const sig  = req.headers.get("stripe-signature") || "";
    let event;
    try { event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!); }
    catch { return NextResponse.json({ error:"Invalid signature" }, { status:400 }); }
    if (event.type === "checkout.session.completed") {
      const s = event.data.object as { id?:string; customer_details?:{ email?:string; name?:string }; amount_total?:number };
      const url = process.env.APPS_SCRIPT_WEB_APP_URL;
      if (url) await fetch(url, { method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ action:"logOrder", sessionId:s.id, email:s.customer_details?.email||"", name:s.customer_details?.name||"", amount:((s.amount_total||0)/100).toFixed(2), timestamp:new Date().toISOString() }) });
    }
    return NextResponse.json({ received:true });
  } catch(err) { return NextResponse.json({ error:"Handler failed" }, { status:500 }); }
}
export const config = { api:{ bodyParser:false } };
'''

FILES["app/api/subscribe/route.ts"] = '''import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email?.trim() || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email))
      return NextResponse.json({ ok:false, error:"Valid email required." }, { status:400 });
    const brevoKey = process.env.BREVO_API_KEY;
    if (brevoKey) {
      const res = await fetch("https://api.brevo.com/v3/contacts", {
        method:"POST", headers:{"Content-Type":"application/json","api-key":brevoKey},
        body:JSON.stringify({ email:email.trim().toLowerCase(), listIds:[parseInt(process.env.BREVO_LIST_ID||"1")], updateEnabled:true }),
      });
      if (!res.ok && res.status !== 204) return NextResponse.json({ ok:false, error:"Could not subscribe." }, { status:500 });
    }
    return NextResponse.json({ ok:true });
  } catch { return NextResponse.json({ ok:false, error:"Unexpected error." }, { status:500 }); }
}
'''

FILES["next.config.js"] = '''/** @type {import(\'next\').NextConfig} */
const nextConfig = { reactStrictMode: true };
module.exports = nextConfig;
'''

FILES["tailwind.config.ts"] = '''import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {} },
  plugins: [],
};
export default config;
'''

FILES["tsconfig.json"] = '''{"compilerOptions":{"target":"es5","lib":["dom","dom.iterable","esnext"],"allowJs":true,"skipLibCheck":true,"strict":true,"noEmit":true,"esModuleInterop":true,"module":"esnext","moduleResolution":"bundler","resolveJsonModule":true,"isolatedModules":true,"jsx":"preserve","incremental":true,"plugins":[{"name":"next"}],"paths":{"@/*":["./*"]}},"include":["next-env.d.ts","**/*.ts","**/*.tsx",".next/types/**/*.ts"],"exclude":["node_modules"]}
'''

FILES["postcss.config.js"] = '''module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
'''

FILES["package.json"] = '''{
  "name": "brewing-brothers-funnel",
  "version": "2.0.0",
  "private": true,
  "scripts": { "dev":"next dev","build":"next build","start":"next start","lint":"next lint" },
  "dependencies": { "next":"14.2.5","react":"^18","react-dom":"^18" },
  "devDependencies": { "@types/node":"^20","@types/react":"^18","@types/react-dom":"^18","autoprefixer":"^10.0.1","eslint":"^8","eslint-config-next":"14.2.5","postcss":"^8","tailwindcss":"^3.3.0","typescript":"^5" }
}
'''

FILES[".gitignore"] = '''node_modules/
/.next/
/out/
.env.local
.env.*.local
.vercel
.DS_Store
*.tsbuildinfo
next-env.d.ts
'''

FILES[".env.local.example"] = '''# Copy to .env.local and fill in values. Also set all in Vercel dashboard.
NEXT_PUBLIC_THEME=rustic
NEXT_PUBLIC_BASE_URL=https://brewing-brothers-funnel.vercel.app
NEXT_PUBLIC_STRIPE_ENABLED=false
APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/AKfycbwkBSnD_fOMKUAAC1c5NWe_f1z7_rNzuZX_mrhieeoCbeLTgC59XCLUsqvXRQ0g2qRsuw/exec
STRIPE_SECRET_KEY=sk_test_REPLACE_ME
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_ME
STRIPE_PRICE_SINGLE=price_REPLACE_ME
STRIPE_PRICE_SIXPACK=price_REPLACE_ME
STRIPE_PRICE_TWELVE=price_REPLACE_ME
NEXT_PUBLIC_STRIPE_PRICE_SINGLE=price_REPLACE_ME
NEXT_PUBLIC_STRIPE_PRICE_SIXPACK=price_REPLACE_ME
NEXT_PUBLIC_STRIPE_PRICE_TWELVE=price_REPLACE_ME
NEXT_PUBLIC_PRICE_SINGLE=$12
NEXT_PUBLIC_PRICE_SIXPACK=$64
NEXT_PUBLIC_PRICE_TWELVE=$119
HUBSPOT_API_KEY=pat-na1-REPLACE_ME
BREVO_API_KEY=xkeysib-REPLACE_ME
BREVO_LIST_ID=1
MAILERLITE_API_KEY=REPLACE_ME
MAILERLITE_GROUP_ID=REPLACE_ME
'''

FILES["CHECKPOINT.md"] = '''# Brewing Brothers — Phase Checkpoint v2.0
Last updated: 2026-03

## LIVE SYSTEMS
| System | Status |
|--------|--------|
| Production site | LIVE: https://brewing-brothers-funnel.vercel.app |
| GitHub | LIVE: https://github.com/Brewing-Brothers/brewing-brothers-funnel |
| Google Sheets | LIVE: Sheet ID 17A5PlAa_1z5BnbOhCJ1qc-i_cHC5CbNdc5go2q9X750 |
| Apps Script | LIVE: shamelessbrewingbrothers@gmail.com |

## IMMEDIATE ACTIONS (M1 + M2)
1. Add to Vercel env vars: NEXT_PUBLIC_THEME=rustic, NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_STRIPE_ENABLED=false, APPS_SCRIPT_WEB_APP_URL
2. Redeploy site
3. Test pickup form on live URL → verify Google Sheet row

## PHASE 2 BLOCKERS
- M3: Real prices from client → BLOCKED
- M4-M8: Stripe setup → BLOCKED on M3

## MARCUS RULES
Branch = master. No Stripe until prices confirmed. Stop + wait after each milestone.
'''

FILES["README.md"] = '''# Brewing Brothers Funnel

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
cd C:\\Users\\necha\\Desktop\\brewing-brothers-funnel
git add . && git commit -m "description" && git push origin master
```
'''

# ─── Write all files ──────────────────────────────────────────────────────────
def write_files(base_dir):
    created = []
    for rel_path, content in FILES.items():
        full_path = os.path.join(base_dir, rel_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(content)
        created.append(rel_path)
        print(f"  ✅ {rel_path}")
    return created

# ─── Main ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    base = os.path.dirname(os.path.abspath(__file__))
    print(f"\n🍊 Brewing Brothers Repo Builder v2.0")
    print(f"   Directory: {base}\n")

    print("Writing files...")
    created = write_files(base)
    print(f"\n✅ {len(created)} files written\n")

    print("Running git commands...")
    import subprocess

    def run(cmd):
        result = subprocess.run(cmd, shell=True, cwd=base, capture_output=True, text=True)
        if result.stdout.strip(): print(f"   {result.stdout.strip()}")
        if result.stderr.strip(): print(f"   {result.stderr.strip()}")
        return result.returncode

    run("git add .")
    run('git commit -m "feat: v2.0 full build — website + CRM + admin customize form"')
    rc = run("git push origin master")

    if rc == 0:
        print("\n🚀 Successfully pushed to GitHub master branch!")
        print("   Vercel will auto-deploy within ~60 seconds")
        print("   Live: https://brewing-brothers-funnel.vercel.app")
    else:
        print("\n⚠️  Push had issues — check output above.")
        print("   Try: git push origin master  manually")

    print("\n📋 Next steps:")
    print("  1. Add env vars in Vercel dashboard (see .env.local.example)")
    print("  2. Redeploy in Vercel")
    print("  3. Test pickup form on live URL")
    print("  4. Visit /admin/customize locally to configure brand settings")

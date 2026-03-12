"use client";
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
          <p className="mt-2 text-slate-600">No payment required. We'll confirm timing within 24 hours.</p>
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

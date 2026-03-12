import { NextRequest, NextResponse } from "next/server";
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

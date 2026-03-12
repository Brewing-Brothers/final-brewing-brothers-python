import { NextRequest, NextResponse } from "next/server";
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

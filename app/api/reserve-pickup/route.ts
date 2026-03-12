import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ ok:false, error:"Invalid request body." }, { status:400 });
    const { name, email, phone, quantity } = body as Record<string,string>;
    if (!name?.trim())     return NextResponse.json({ ok:false, error:"Name is required."     }, { status:400 });
    if (!email?.trim())    return NextResponse.json({ ok:false, error:"Email is required."    }, { status:400 });
    if (!phone?.trim())    return NextResponse.json({ ok:false, error:"Phone is required."    }, { status:400 });
    if (!quantity?.trim()) return NextResponse.json({ ok:false, error:"Quantity is required." }, { status:400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ ok:false, error:"Please enter a valid email." }, { status:400 });
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

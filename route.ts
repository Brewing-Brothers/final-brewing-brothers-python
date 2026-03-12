import { NextRequest, NextResponse } from "next/server";

// ── Pickup Reservation API ────────────────────────────────────────────────────
// POST /api/reserve-pickup
// Validates 4 fields → forwards to Google Apps Script → writes Google Sheet row
// Apps Script URL set in APPS_SCRIPT_WEB_APP_URL env var (Vercel + .env.local)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }

    const { name, email, phone, quantity } = body as Record<string, string>;

    // ── Field validation ──────────────────────────────────────────────────────
    if (!name?.trim())     return NextResponse.json({ ok: false, error: "Name is required." },     { status: 400 });
    if (!email?.trim())    return NextResponse.json({ ok: false, error: "Email is required." },    { status: 400 });
    if (!phone?.trim())    return NextResponse.json({ ok: false, error: "Phone is required." },    { status: 400 });
    if (!quantity?.trim()) return NextResponse.json({ ok: false, error: "Quantity is required." }, { status: 400 });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    // ── Apps Script forwarding ────────────────────────────────────────────────
    const appsScriptUrl = process.env.APPS_SCRIPT_WEB_APP_URL;
    if (!appsScriptUrl) {
      console.error("APPS_SCRIPT_WEB_APP_URL is not set");
      return NextResponse.json(
        { ok: false, error: "Backend not configured. Contact us directly at brewingbrothers@gmail.com" },
        { status: 500 }
      );
    }

    const payload = {
      action:    "reservePickup",
      name:      name.trim(),
      email:     email.trim().toLowerCase(),
      phone:     phone.trim(),
      quantity:  quantity.trim(),
      timestamp: new Date().toISOString(),
      source:    "website",
    };

    const appsResponse = await fetch(appsScriptUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });

    // Apps Script always returns 200 even on error — parse the body
    const appsData = await appsResponse.json().catch(() => ({ status: "error" }));

    if (!appsResponse.ok || appsData.status === "error") {
      console.error("Apps Script error:", appsData);
      return NextResponse.json(
        { ok: false, error: "Could not save reservation. Please try again or call us directly." },
        { status: 500 }
      );
    }

    // ── Optional: HubSpot CRM contact creation (Phase 3) ─────────────────────
    // If HUBSPOT_API_KEY is set, create/update a contact in HubSpot
    const hubspotKey = process.env.HUBSPOT_API_KEY;
    if (hubspotKey) {
      try {
        await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
          method:  "POST",
          headers: {
            "Content-Type":  "application/json",
            "Authorization": `Bearer ${hubspotKey}`,
          },
          body: JSON.stringify({
            properties: {
              firstname:      name.trim().split(" ")[0] || name.trim(),
              lastname:       name.trim().split(" ").slice(1).join(" ") || "",
              email:          email.trim().toLowerCase(),
              phone:          phone.trim(),
              hs_lead_status: "NEW",
              // Custom properties (must be created in HubSpot portal first)
              quantity_requested: quantity.trim(),
              lead_source:        "Website Pickup Form",
            },
          }),
        });
      } catch (hubErr) {
        // Non-fatal — reservation still saved to Google Sheets
        console.warn("HubSpot sync failed (non-fatal):", hubErr);
      }
    }

    return NextResponse.json({ ok: true, message: "Reservation confirmed." });

  } catch (err) {
    console.error("reserve-pickup unexpected error:", err);
    return NextResponse.json(
      { ok: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

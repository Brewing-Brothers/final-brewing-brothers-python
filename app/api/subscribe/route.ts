import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
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

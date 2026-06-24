import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\(\d{2}\) \d{4,5}-\d{4}$/;
const MAX_STR  = 200;

function sanitize(v: unknown): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, MAX_STR);
}

export async function POST(req: NextRequest) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const companyName  = sanitize(data.companyName);
  const role         = sanitize(data.role);
  const revenue      = sanitize(data.revenue);
  const contactName  = sanitize(data.contactName);
  const email        = sanitize(data.email);
  const phone        = sanitize(data.phone);

  if (!companyName || !revenue || !contactName) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 });
  }

  const payload = {
    empresa:      companyName,
    cargo:        role,
    faturamento:  revenue,
    nome:         contactName,
    email,
    telefone:     phone,
    utm_source:   sanitize(data.utm_source),
    utm_medium:   sanitize(data.utm_medium),
    utm_campaign: sanitize(data.utm_campaign),
    utm_term:     sanitize(data.utm_term),
    data_envio:   new Date().toISOString(),
  };

  const makeUrl = process.env.MAKE_WEBHOOK_URL;
  if (makeUrl) {
    try {
      const res = await fetch(makeUrl, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("Make webhook returned", res.status);
      }
    } catch (err) {
      console.error("Make webhook error:", err);
    }
  }

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa:      data.companyName,
          faturamento:  data.revenue,
          nome:         data.contactName,
          email:        data.email,
          telefone:     data.phone,
          utm_source:   data.utm_source   || "",
          utm_medium:   data.utm_medium   || "",
          utm_campaign: data.utm_campaign || "",
          utm_term:     data.utm_term     || "",
          data_envio:   new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Zapier webhook error:", err);
    }
  }

  return NextResponse.json({ ok: true });
}

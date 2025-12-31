import { NextResponse } from "next/server";
import { findServiceById } from "@/lib/catalog";

const PAYPAL_ENV = process.env.PAYPAL_ENV ?? "SANDBOX";
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID ?? "";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET ?? "";
const PAYPAL_CURRENCY = process.env.PAYPAL_CURRENCY ?? "EUR";

function paypalBase() {
  return PAYPAL_ENV === "PRODUCTION"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getAccessToken() {
  const res = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PayPal token error: ${res.status} ${t}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cart: { serviceId: string; quantity: number }[] = body?.cart ?? [];

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "EMPTY_CART" }, { status: 400 });
    }

    // Calcule total à partir du catalogue statique (pas Prisma)
    let totalCents = 0;
    for (const it of cart) {
      const svc = findServiceById(it.serviceId);
      if (!svc) return NextResponse.json({ error: "SERVICE_NOT_FOUND", serviceId: it.serviceId }, { status: 400 });
      const qty = Math.max(1, Math.min(99, Number(it.quantity ?? 1)));
      totalCents += svc.priceCents * qty;
    }

    const accessToken = await getAccessToken();

    const total = (totalCents / 100).toFixed(2);

    const createRes = await fetch(`${paypalBase()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: PAYPAL_CURRENCY,
              value: total,
            },
          },
        ],
      }),
    });

    const data = await createRes.json();

    if (!createRes.ok) {
      return NextResponse.json({ error: "PAYPAL_CREATE_FAILED", details: data }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (e: any) {
    return NextResponse.json({ error: "SERVER_ERROR", message: e?.message ?? "unknown" }, { status: 500 });
  }
}

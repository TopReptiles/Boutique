import { prisma } from "../../../../lib/prisma";

async function getAccessToken() {
  const env = process.env.PAYPAL_ENV ?? "SANDBOX";
  const base =
    env === "LIVE" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_CLIENT_SECRET!;
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error("PayPal token error");
  const data = await res.json();
  return { accessToken: data.access_token as string, base };
}

export async function POST(req: Request) {
  const { cart } = await req.json();

  const services = await prisma.service.findMany({ where: { active: true } });
  const map = new Map(services.map((s) => [s.id, s]));

  let totalCents = 0;
  const items = (cart ?? [])
    .map((ci: any) => {
      const svc = map.get(ci.serviceId);
      if (!svc) return null;
      const qty = Math.max(1, Math.min(99, Number(ci.quantity) || 1));
      totalCents += svc.priceCents * qty;
      return { svc, qty };
    })
    .filter(Boolean);

  if (!items.length) return Response.json({ error: "EMPTY_CART" }, { status: 400 });

  const currency = process.env.PAYPAL_CURRENCY ?? "EUR";
  const value = (totalCents / 100).toFixed(2);

  const { accessToken, base } = await getAccessToken();

  const ppRes = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: currency, value } }],
    }),
  });

  const ppData = await ppRes.json();
  if (!ppRes.ok) {
    return Response.json({ error: "PAYPAL_CREATE_FAILED", details: ppData }, { status: 500 });
  }

  return Response.json({ id: ppData.id });
}

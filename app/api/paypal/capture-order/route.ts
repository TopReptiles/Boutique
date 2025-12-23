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
  const { orderID } = await req.json();
  const { accessToken, base } = await getAccessToken();

  const res = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok) {
    return Response.json({ error: "PAYPAL_CAPTURE_FAILED", details: data }, { status: 500 });
  }

  return Response.json({ status: data.status, data });
}

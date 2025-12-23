import { prisma } from "../../../../lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { cart, customer, paypal } = await req.json();

  if (!customer?.name || !customer?.email) {
    return Response.json({ error: "MISSING_CUSTOMER" }, { status: 400 });
  }

  const services = await prisma.service.findMany({ where: { active: true } });
  const map = new Map(services.map((s) => [s.id, s]));

  let totalCents = 0;

  const items = (cart ?? [])
    .map((ci: any) => {
      const svc = map.get(ci.serviceId);
      if (!svc) return null;

      const qty = Math.max(1, Math.min(99, Number(ci.quantity) || 1));
      totalCents += svc.priceCents * qty;

      return {
        serviceId: svc.id,
        title: svc.title,
        unitCents: svc.priceCents,
        quantity: qty,
      };
    })
    .filter(Boolean) as any[];

  if (!items.length) {
    return Response.json({ error: "EMPTY_CART" }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      status: "PAID",
      currency: "EUR",
      totalCents,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone || null,
      customerMessage: customer.note || null,
      paypalOrderId: paypal?.orderID || null,
      items: { create: items },
    },
    include: { items: true },
  });

  // 📧 Email client
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customer.email,
    subject: "Confirmation de votre commande",
    html: `
      <h2>Merci ${customer.name} 👋</h2>
      <p>Nous avons bien reçu votre commande.</p>
      <p><b>Montant :</b> ${(order.totalCents / 100).toFixed(2)} €</p>
      <p>Nous vous recontactons rapidement.</p>
    `,
  });

  // 📧 Email admin
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: process.env.EMAIL_ADMIN!,
    subject: "Nouvelle commande reçue",
    html: `
      <h2>Nouvelle commande</h2>
      <p><b>Client :</b> ${customer.name}</p>
      <p><b>Email :</b> ${customer.email}</p>
      <p><b>Total :</b> ${(order.totalCents / 100).toFixed(2)} €</p>
      <pre>${JSON.stringify(items, null, 2)}</pre>
    `,
  });

  return Response.json({ ok: true, orderId: order.id });
}

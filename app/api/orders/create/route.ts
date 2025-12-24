import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

/**
 * ⚠️ IMPORTANT
 * On ne crée JAMAIS Resend au top-level
 * sinon Vercel crash au build
 */
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cart, customer, paypal } = body;

    if (!cart || !cart.length) {
      return NextResponse.json({ error: "EMPTY_CART" }, { status: 400 });
    }

    if (!customer?.name || !customer?.email) {
      return NextResponse.json({ error: "INVALID_CUSTOMER" }, { status: 400 });
    }

    // 🔢 Récupération des services
    const services = await prisma.service.findMany({
      where: { id: { in: cart.map((c: any) => c.serviceId) } },
    });

    let totalCents = 0;

    const items = cart.map((c: any) => {
      const svc = services.find((s) => s.id === c.serviceId);
      if (!svc) throw new Error("SERVICE_NOT_FOUND");

      totalCents += svc.priceCents * c.quantity;

      return {
        serviceId: svc.id,
        title: svc.title,
        priceCents: svc.priceCents,
        quantity: c.quantity,
      };
    });

    // 🧾 Création commande
    const order = await prisma.order.create({
      data: {
        status: "PAID",
        totalCents,
        currency: "EUR",
        paypalOrderId: paypal?.orderID ?? null,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone || null,
        customerMessage: customer.note || null,
        items: {
          create: items,
        },
      },
      include: { items: true },
    });

    // 📧 EMAIL (uniquement à l’exécution, jamais au build)
    const resend = getResend();

    if (resend && process.env.EMAIL_FROM && process.env.EMAIL_ADMIN) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_ADMIN,
        subject: "Nouvelle commande reçue",
        html: `
          <h2>Nouvelle commande</h2>
          <p><b>Client :</b> ${order.customerName}</p>
          <p><b>Email :</b> ${order.customerEmail}</p>
          <p><b>Total :</b> ${(order.totalCents / 100).toFixed(2)} €</p>
        `,
      });
    }

    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    console.error("ORDER CREATE ERROR", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

import { prisma } from "../../../../lib/prisma";
import { z } from "zod";
import { Resend } from "resend";

const BodySchema = z.object({
  cart: z.array(
    z.object({
      serviceId: z.string(),
      quantity: z.number().int().min(1).max(99),
    })
  ),
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
  }),
  paypal: z.object({
    orderID: z.string().optional().nullable(),
  }),
});

function eur(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ error: "BAD_BODY", details: parsed.error.flatten() }, { status: 400 });
    }

    const { cart, customer, paypal } = parsed.data;

    // Récupère les services en base
    const serviceIds = cart.map((c) => c.serviceId);
    const services = await prisma.service.findMany({ where: { id: { in: serviceIds } } });

    const items = cart
      .map((c) => {
        const s = services.find((x) => x.id === c.serviceId);
        if (!s) return null;
        return {
          serviceId: s.id,
          title: s.title,
          priceCents: s.priceCents,
          quantity: c.quantity,
        };
      })
      .filter(Boolean) as Array<{ serviceId: string; title: string; priceCents: number; quantity: number }>;

    if (!items.length) return Response.json({ error: "EMPTY_CART" }, { status: 400 });

    const totalCents = items.reduce((sum, it) => sum + it.priceCents * it.quantity, 0);

    // ✅ Enregistre la commande
    const order = await prisma.order.create({
      data: {
        status: "PAID",
        totalCents,
        currency: "EUR",
        paypalOrderId: paypal.orderID ?? null,

        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone || null,
        customerMessage: customer.note || null,

        items: {
          create: items.map((it) => ({
            serviceId: it.serviceId,
            title: it.title,
            unitCents: it.priceCents,
            quantity: it.quantity,
          })),
        },
      },
      include: { items: true },
    });

    // ✅ Envoi email (optionnel, ne casse JAMAIS le build)
    const RESEND_KEY = process.env.RESEND_API_KEY;
    const EMAIL_FROM = process.env.EMAIL_FROM;
    const EMAIL_ADMIN = process.env.EMAIL_ADMIN;

    if (RESEND_KEY && EMAIL_FROM && EMAIL_ADMIN) {
      try {
        const resend = new Resend(RESEND_KEY);

        const lines = order.items
          .map((it) => `• ${it.title} — ${eur(it.unitCents)} × ${it.quantity}`)
          .join("\n");

        await resend.emails.send({
          from: EMAIL_FROM,
          to: [EMAIL_ADMIN],
          subject: `🧾 Nouvelle commande (${order.id})`,
          text:
            `Commande: ${order.id}\n` +
            `Client: ${order.customerName} <${order.customerEmail}>\n` +
            `Tel: ${order.customerPhone ?? "-"}\n` +
            `Message: ${order.customerMessage ?? "-"}\n\n` +
            `Items:\n${lines}\n\n` +
            `Total: ${eur(order.totalCents)}\n` +
            `PayPal OrderID: ${order.paypalOrderId ?? "-"}`,
        });
      } catch (e) {
        console.error("Resend send failed (ignored):", e);
      }
    } else {
      console.warn("Resend env missing (ignored): RESEND_API_KEY / EMAIL_FROM / EMAIL_ADMIN");
    }

    return Response.json({ ok: true, orderId: order.id });
  } catch (e: any) {
    console.error("orders/create error", e);
    return Response.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

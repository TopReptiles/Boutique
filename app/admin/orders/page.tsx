import { headers } from "next/headers";
import { prisma } from "../../../lib/prisma";

function eur(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default async function AdminOrdersPage() {
  const h = await headers();
  const auth = h.get("authorization") || "";

  const expectedUser = process.env.ADMIN_USER || "admin";
  const expectedPass = process.env.ADMIN_PASSWORD || "";

  if (!expectedPass) {
    return (
      <div style={{ padding: 16 }}>
        <h1>Admin</h1>
        <p style={{ color: "crimson" }}>ADMIN_PASSWORD manquant dans .env</p>
      </div>
    );
  }

  if (!auth.startsWith("Basic ")) {
    return (
      <div style={{ padding: 16 }}>
        <h1>Admin — Auth requise</h1>
        <p>
          Page protégée (Basic Auth).
          <br />
          Test local (si ton navigateur l’accepte) :
          <br />
          <code>http://admin:TON_MDP@localhost:3000/admin/orders</code>
        </p>
      </div>
    );
  }

  const encoded = auth.slice("Basic ".length);
  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const [user, pass] = decoded.split(":");

  if (user !== expectedUser || pass !== expectedPass) {
    return (
      <div style={{ padding: 16 }}>
        <h1>Admin — Accès refusé</h1>
        <p>Mauvais identifiant ou mot de passe.</p>
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 50,
  });

  return (
    <div style={{ padding: 16 }}>
      <h1>Admin — Commandes</h1>
      <p style={{ opacity: 0.8 }}>Dernières {orders.length} commandes (max 50).</p>

      <div style={{ display: "grid", gap: 12 }}>
        {orders.map((o) => (
          <div key={o.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <b>Commande</b> : {o.id}
                <div>
                  <b>Date</b> : {new Date(o.createdAt).toLocaleString("fr-FR")}
                </div>
                <div>
                  <b>Status</b> : {o.status} — <b>Total</b> : {eur(o.totalCents)}
                </div>
                <div>
                  <b>PayPal OrderID</b> : {o.paypalOrderId ?? "—"}
                </div>
              </div>

              <div>
                <div><b>Client</b> : {o.customerName}</div>
                <div><b>Email</b> : {o.customerEmail}</div>
                <div><b>Tél</b> : {o.customerPhone ?? "—"}</div>
              </div>
            </div>

            {o.customerMessage && (
              <div style={{ marginTop: 10, padding: 10, background: "#fafafa", borderRadius: 8 }}>
                <b>Message :</b>
                <div>{o.customerMessage}</div>
              </div>
            )}

            <div style={{ marginTop: 10 }}>
              <b>Items :</b>
              <ul>
                {o.items.map((it) => (
                  <li key={it.id}>
                    {it.title} — {eur(it.unitCents)} × {it.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

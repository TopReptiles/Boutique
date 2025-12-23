"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/CartContext";
import PayPalCheckout from "@/components/PayPalCheckout";

type Service = { id: string; title: string; priceCents: number };

function eur(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default function CartClient({
  paypalClientId,
}: {
  paypalClientId: string;
}) {
  const { cart, remove, setQty, clear } = useCart();

  const [services, setServices] = useState<Service[]>([]);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
  });
  const [orderSaved, setOrderSaved] = useState<string>("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data.services ?? []);
    })();
  }, []);

  const rows = useMemo(() => {
    return cart.map((ci) => ({
      ...ci,
      svc: services.find((s) => s.id === ci.serviceId),
    }));
  }, [cart, services]);

  const totalCents = rows.reduce(
    (sum, r) => sum + (r.svc ? r.svc.priceCents * r.quantity : 0),
    0
  );

  if (cart.length === 0) {
    return (
      <div style={{ padding: 16 }}>
        <h1>Panier</h1>
        <p>Ton panier est vide.</p>
        <a href="/services">Voir les offres</a>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Panier</h1>

      {orderSaved && (
        <p style={{ color: "green" }}>
          <b>✅ Commande enregistrée : {orderSaved}</b>
        </p>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {rows.map((r) => (
          <div
            key={r.serviceId}
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <b>{r.svc?.title ?? "Service"}</b>
                <div>{r.svc ? eur(r.svc.priceCents) : "—"}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={r.quantity}
                  onChange={(e) =>
                    setQty(r.serviceId, Number(e.target.value))
                  }
                  style={{ width: 80 }}
                />
                <button onClick={() => remove(r.serviceId)}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 16 }}>Total : {eur(totalCents)}</h3>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button onClick={() => clear()}>Vider</button>
        <a href="/services">Ajouter d’autres offres</a>
      </div>

      {/* Coordonnées client */}
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 12,
          maxWidth: 520,
          marginBottom: 16,
        }}
      >
        <h3 style={{ marginTop: 0 }}>Tes coordonnées</h3>

        <label>Nom</label>
        <input
          value={customer.name}
          onChange={(e) =>
            setCustomer({ ...customer, name: e.target.value })
          }
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />

        <label>Email</label>
        <input
          value={customer.email}
          onChange={(e) =>
            setCustomer({ ...customer, email: e.target.value })
          }
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />

        <label>Téléphone (optionnel)</label>
        <input
          value={customer.phone}
          onChange={(e) =>
            setCustomer({ ...customer, phone: e.target.value })
          }
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />

        <label>Message / besoin (optionnel)</label>
        <textarea
          value={customer.note}
          onChange={(e) =>
            setCustomer({ ...customer, note: e.target.value })
          }
          style={{ display: "block", width: "100%", marginBottom: 8 }}
          rows={3}
        />

        <p style={{ margin: 0, opacity: 0.8 }}>
          Ces infos servent à te recontacter après le paiement.
        </p>
      </div>

      {/* PayPal */}
      {!paypalClientId ? (
        <p style={{ color: "crimson" }}>
          ❌ PayPal Client ID manquant.
        </p>
      ) : !customer.name || !customer.email ? (
        <p style={{ color: "crimson" }}>
          ⚠️ Renseigne au minimum Nom + Email avant de payer.
        </p>
      ) : (
        <PayPalCheckout
          clientId={paypalClientId}
          cart={cart}
          onPaid={async (paypalOrderID?: string) => {
            const res = await fetch("/api/orders/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                cart,
                customer,
                paypal: { orderID: paypalOrderID ?? null },
              }),
            });

            let data: any = null;
            try {
              data = await res.json();
            } catch {}

            if (!res.ok) {
              console.error("orders/create failed", res.status, data);
              alert(
                "Paiement OK mais erreur lors de l’enregistrement de la commande"
              );
              return;
            }

            setOrderSaved(data?.orderId ?? "OK");
            clear();
          }}
        />
      )}
    </div>
  );
}

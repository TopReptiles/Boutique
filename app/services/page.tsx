"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/CartContext";

type Service = {
  id: string;
  title: string;
  description: string;
  priceCents: number;
};

function eur(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { add, cart } = useCart();

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data.services ?? []);
      setLoading(false);
    })();
  }, []);

  const count = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div style={{ padding: 16 }}>
      <h1>Offres IA</h1>
      <p>
        Panier : <b>{count}</b> article(s) — <a href="/cart">Voir le panier</a>
      </p>

      {loading ? (
        <p>Chargement…</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {services.map((s) => (
            <div key={s.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
              <h3 style={{ marginTop: 0 }}>{s.title}</h3>
              <p>{s.description}</p>
              <b>{eur(s.priceCents)}</b>
              <div style={{ marginTop: 10 }}>
                <button onClick={() => add(s.id)}>Ajouter au panier</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

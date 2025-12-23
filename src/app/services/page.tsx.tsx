"use client";

import { useEffect, useState } from "react";

type Service = {
  id: string;
  title: string;
  description: string;
  priceCents: number;
};

function eur(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data.services ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>Offres IA</h1>
      {loading ? (
        <p>Chargement…</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {services.map((s) => (
            <div
              key={s.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <b>{eur(s.priceCents)}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

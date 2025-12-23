"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";

type CartItem = { serviceId: string; quantity: number };

export default function PayPalCheckout({
  clientId,
  cart,
  onPaid,
}: {
  clientId: string;
  cart: CartItem[];
  onPaid: (paypalOrderID?: string) => void;
}) {
  const [msg, setMsg] = useState("");

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, maxWidth: 480 }}>
      <h3 style={{ marginTop: 0 }}>Paiement</h3>
      {!!msg && <p><b>{msg}</b></p>}

      <PayPalScriptProvider options={{ clientId, currency: "EUR", intent: "capture" }}>
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={async () => {
            setMsg("");
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cart }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error ?? "create-order failed");
            return data.id;
          }}
          onApprove={async (data) => {
            setMsg("Paiement en cours…");
            const res = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderID: data.orderID }),
            });
            const out = await res.json();
            if (!res.ok) throw new Error(out?.error ?? "capture failed");
            setMsg("✅ Paiement accepté !");
            onPaid(data.orderID);
          }}
          onError={(err) => {
            console.error(err);
            setMsg("❌ Erreur PayPal (regarde la console).");
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}

"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartItem = { serviceId: string; quantity: number };

type CartCtx = {
  cart: CartItem[];
  add: (serviceId: string) => void;
  remove: (serviceId: string) => void;
  setQty: (serviceId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartCtx | null>(null);
const KEY = "ia_shop_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(cart));
  }, [cart]);

  const api = useMemo<CartCtx>(
    () => ({
      cart,
      add(serviceId) {
        setCart((prev) => {
          const found = prev.find((p) => p.serviceId === serviceId);
          if (found) {
            return prev.map((p) => (p.serviceId === serviceId ? { ...p, quantity: p.quantity + 1 } : p));
          }
          return [...prev, { serviceId, quantity: 1 }];
        });
      },
      remove(serviceId) {
        setCart((prev) => prev.filter((p) => p.serviceId !== serviceId));
      },
      setQty(serviceId, quantity) {
        const q = Math.max(1, Math.min(99, Number(quantity) || 1));
        setCart((prev) => prev.map((p) => (p.serviceId === serviceId ? { ...p, quantity: q } : p)));
      },
      clear() {
        setCart([]);
      },
    }),
    [cart]
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

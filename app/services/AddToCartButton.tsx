"use client";

import { useCart } from "@/components/CartContext";

export default function AddToCartButton({ serviceId }: { serviceId: string }) {
  const { add } = useCart();

  return (
    <button
      onClick={() => add(serviceId)}
      className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
    >
      Ajouter
    </button>
  );
}

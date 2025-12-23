import CartClient from "./CartClient";

export default function CartPage() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
  return <CartClient paypalClientId={clientId} />;
}

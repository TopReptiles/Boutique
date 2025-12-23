import { CartProvider } from "@/components/CartContext";

export const metadata = {
  title: "IA Services Shop",
  description: "Vente de services IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: "Arial, sans-serif" }}>
        <CartProvider>
          <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
            <a href="/" style={{ marginRight: 12 }}>Accueil</a>
            <a href="/services" style={{ marginRight: 12 }}>Offres</a>
            <a href="/cart">Panier</a>
          </header>
          <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}

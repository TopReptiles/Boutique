import "./globals.css";
import Link from "next/link";
import { CartProvider } from "@/components/CartContext";

export const metadata = {
  title: "IA Services Shop",
  description: "Vente de services IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <CartProvider>
          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
                <span className="inline-block h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_24px_rgba(139,92,246,0.55)]" />
                <span>
                  IA <span className="text-violet-300">Services</span>
                </span>
              </Link>

              <nav className="flex items-center gap-2 text-sm">
                <Link
                  href="/"
                  className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50"
                >
                  Accueil
                </Link>
                <Link
                  href="/services"
                  className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50"
                >
                  Offres
                </Link>
                <Link
                  href="/cart"
                  className="rounded-lg bg-violet-600 px-3 py-2 font-medium text-white hover:bg-violet-500"
                >
                  Panier
                </Link>
              </nav>
            </div>
          </header>

          {/* Main */}
          <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>

          {/* Footer */}
          <footer className="border-t border-zinc-800/60">
            <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-zinc-400">
              © {new Date().getFullYear()} — <span className="text-zinc-200">Services IA</span>
              <span className="mx-2">•</span>
              <span className="text-violet-300">Paiement sécurisé</span>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}

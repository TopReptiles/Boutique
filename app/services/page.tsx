import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

type Service = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
};

function eur(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

// ✅ Catalogue statique (OK pour Vercel)
const SERVICES: Service[] = [
  {
    id: "cmjhqd6p80000d1g4zxy6z27r",
    slug: "audit-ia",
    title: "Audit IA & opportunités (1h)",
    description: "Analyse de ton activité + recommandations concrètes + plan d’action.",
    priceCents: 9900,
  },
  {
    id: "cmjhqd6q10001d1g4fu1knrx0",
    slug: "chatbot-site",
    title: "Chatbot IA pour site web",
    description: "Chatbot entraîné sur tes contenus + intégration + support.",
    priceCents: 39900,
  },
  {
    id: "cmjhqd6qa0002d1g4y9mud64q",
    slug: "automation",
    title: "Automatisation IA",
    description: "Automatisation de tâches avec IA (emails, CRM, devis, etc).",
    priceCents: 29900,
  },
];

export default async function ServicesPage() {
  const services = SERVICES;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero */}
      <section className="px-6 pt-24 pb-12 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-sm text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-violet-400" />
          Boutique de services IA
        </div>

        <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
          Des services <span className="text-violet-400">IA</span> concrets, livrés vite.
        </h1>

        <p className="mt-6 text-lg text-zinc-400 max-w-2xl">
          Audit, automatisation et mise en place de solutions IA adaptées à ton activité. Un process clair, un résultat mesurable.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/cart"
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition"
          >
            Voir le panier
          </Link>
          <a
            href="#offres"
            className="rounded-xl border border-zinc-700 bg-zinc-900/40 px-5 py-3 text-sm font-semibold text-zinc-100 hover:border-zinc-500 transition"
          >
            Découvrir les offres
          </a>
        </div>
      </section>

      {/* Cards */}
      <section id="offres" className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-lg transition hover:border-violet-500/40 hover:shadow-violet-500/10"
            >
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-violet-500/10 to-transparent opacity-0 hover:opacity-100 transition pointer-events-none" />

              <h2 className="text-xl font-semibold">{s.title}</h2>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{s.description}</p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-lg font-bold">{eur(s.priceCents)}</span>

                {/* ✅ bouton client (cart context) */}
                <AddToCartButton serviceId={s.id} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-zinc-900 pt-8 text-sm text-zinc-500 flex items-center justify-between">
          <span>© 2025 — Services IA</span>
          <div className="flex gap-4">
            <Link className="hover:text-zinc-300" href="/services">Offres</Link>
            <Link className="hover:text-zinc-300" href="/cart">Panier</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

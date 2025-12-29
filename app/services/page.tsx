import Link from "next/link";

export const dynamic = "force-dynamic";

async function getServices() {
  const res = await fetch("http://localhost:3000/api/services", { cache: "no-store" });
  if (!res.ok) return { services: [] };
  return res.json();
}

export default async function Page() {
  const { services } = await getServices();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-violet-400" />
          Boutique de services IA
        </div>

        <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight">
          Des services <span className="text-violet-400">IA</span> concrets, livrés vite.
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          Audit, automatisation et mise en place de solutions IA adaptées à ton activité.
          Un process clair, un résultat mesurable.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="/cart"
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-violet-500 transition"
          >
            Voir le panier
          </a>
          <a
            href="#offres"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-3 text-sm font-medium text-zinc-200 hover:border-violet-500/40 transition"
          >
            Découvrir les offres
          </a>
        </div>
      </section>

      {/* Cards */}
      <section id="offres" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(services ?? []).map((s: any) => (
            <div
              key={s.id}
              className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-lg"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl" />
              </div>

              <div className="relative">
                <h2 className="text-xl font-semibold text-zinc-50">{s.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {s.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-lg font-semibold">
                    {(s.priceCents / 100).toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </div>

                  <Link
                    href="/cart"
                    className="rounded-xl bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-white transition"
                  >
                    Ajouter
                  </Link>
                </div>

                <div className="mt-4 text-xs text-zinc-500">
                  Paiement sécurisé • Livraison rapide • Support inclus
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-zinc-500 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} — Services IA</div>
          <div className="flex gap-4">
            <a className="hover:text-zinc-300" href="/services">Offres</a>
            <a className="hover:text-zinc-300" href="/cart">Panier</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

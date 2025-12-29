import Link from "next/link";

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-lg">
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-violet-500/10" />
      <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{desc}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="absolute right-[-200px] top-[240px] h-[360px] w-[560px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-violet-400" />
          Boutique de services IA
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
          Des services <span className="text-violet-400">IA</span> concrets,
          <br className="hidden md:block" /> livrés vite.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
          Audit, automatisation, chatbots et intégrations IA adaptées à ton activité.
          Un process clair, un résultat mesurable.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/services"
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/10 transition hover:bg-violet-500"
          >
            Découvrir les offres
          </Link>
          <Link
            href="/cart"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-violet-500/40"
          >
            Voir le panier
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          <Card
            title="Rapide & carré"
            desc="Livraison et étapes claires. Tu sais exactement ce que tu achètes."
          />
          <Card
            title="Focus ROI"
            desc="On priorise ce qui fait gagner du temps ou augmente le chiffre."
          />
          <Card
            title="Support inclus"
            desc="Tu repars avec un plan d’action + accompagnement pour l’exécution."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/60 to-zinc-950 p-8">
          <h2 className="text-2xl font-bold">Prêt à démarrer ?</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Choisis une offre, règle via PayPal et je te recontacte après paiement
            pour lancer la prestation.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/services"
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Voir les offres
            </Link>
            <Link
              href="/admin/login"
              className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-violet-500/40"
            >
              Admin
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-900/80 py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-sm text-zinc-500">
          <span>© {new Date().getFullYear()} — Services IA</span>
          <div className="flex gap-4">
            <Link className="hover:text-zinc-300" href="/services">
              Offres
            </Link>
            <Link className="hover:text-zinc-300" href="/cart">
              Panier
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

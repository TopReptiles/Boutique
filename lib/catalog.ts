export type CatalogService = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  active: boolean;
};

export const CATALOG: CatalogService[] = [
  {
    id: "audit-ia-1h",
    slug: "audit-ia-1h",
    title: "Audit IA & opportunités (1h)",
    description: "Analyse de ton activité + recommandations concrètes + plan d’action.",
    priceCents: 9900,
    active: true,
  },
  {
    id: "chatbot-site",
    slug: "chatbot-site",
    title: "Chatbot IA pour site web",
    description: "Chatbot entraîné sur tes contenus + intégration + support.",
    priceCents: 39900,
    active: true,
  },
  {
    id: "automatisation-ia",
    slug: "automatisation-ia",
    title: "Automatisation IA",
    description: "Automatisation de tâches avec IA (emails, CRM, devis, etc.).",
    priceCents: 29900,
    active: true,
  },
];

export function findServiceById(serviceId: string) {
  return CATALOG.find((s) => s.id === serviceId && s.active);
}

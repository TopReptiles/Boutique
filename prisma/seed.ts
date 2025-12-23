import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const services = [
    {
      slug: "audit-ia",
      title: "Audit IA & opportunités (1h)",
      description: "Analyse de ton activité + recommandations concrètes + plan d’action.",
      priceCents: 9900,
    },
    {
      slug: "chatbot-site",
      title: "Chatbot IA pour site web",
      description: "Chatbot entraîné sur tes contenus + intégration + support.",
      priceCents: 39900,
    },
    {
      slug: "automation",
      title: "Automatisation IA",
      description: "Automatisation de tâches avec IA (emails, CRM, devis, etc).",
      priceCents: 29900,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  console.log("Seed OK");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

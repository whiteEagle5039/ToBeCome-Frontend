/**
 * Peuple uniquement ce qui est réellement nouveau : la banque de questions
 * RIASEC et le badge "Explorateur". Vos Metier, Mission et MissionEtape
 * existants ne sont pas touchés — ce sont vos données réelles.
 *
 * Exécution : npx tsx prisma/seed-quetes.ts
 */
import { PrismaClient } from "@prisma/client";
import { RIASEC_QUESTIONS } from "../lib/eleve/riasec-questions";

const prisma = new PrismaClient();

async function seedRiasecQuestions() {
  const existant = await prisma.questionRiasec.count();
  if (existant > 0) {
    console.log(`QuestionRiasec déjà peuplée (${existant} questions) — ignoré.`);
    return;
  }

  for (let i = 0; i < RIASEC_QUESTIONS.length; i++) {
    const q = RIASEC_QUESTIONS[i];
    await prisma.questionRiasec.create({
      data: { dimension: q.dimension, label: q.label, ordre: i },
    });
  }
  console.log(`RIASEC : ${RIASEC_QUESTIONS.length} questions créées.`);
}

async function seedBadges() {
  await prisma.badge.upsert({
    where: { nom: "Explorateur" },
    create: {
      nom: "Explorateur",
      description: "A découvert son profil RIASEC.",
      imageUrl: "/badges/explorateur.svg",
      type: "OBJECTIF",
    },
    update: {},
  });

  await prisma.badge.upsert({
    where: { nom: "Série de 7 jours" },
    create: {
      nom: "Série de 7 jours",
      description: "A relevé le défi du jour 7 jours de suite.",
      imageUrl: "/badges/streak-7.svg",
      type: "STREAK",
    },
    update: {},
  });

  console.log("Badges Quêtes créés (ou déjà existants).");
}

async function main() {
  await seedBadges();
  await seedRiasecQuestions();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

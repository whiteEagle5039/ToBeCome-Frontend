/**
 * Crée automatiquement une communauté de type DOMAINE pour chaque Domaine
 * existant, et une communauté de type METIER pour chaque Metier existant.
 * Aucun nom n'est codé en dur : tout est dérivé de vos données réelles.
 *
 * Exécution : npx tsx prisma/seed-communautes.ts
 * (à lancer après avoir peuplé vos Domaine et Metier existants)
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(texte: string): string {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function seedCommunautesDomaine() {
  const domaines = await prisma.domaine.findMany();
  for (const domaine of domaines) {
    const slug = `domaine-${slugify(domaine.nom)}`;
    await prisma.communaute.upsert({
      where: { slug },
      create: {
        type: "DOMAINE",
        nom: domaine.nom,
        slug,
        description: domaine.description ?? `Échange autour du domaine ${domaine.nom}.`,
        imageUrl: domaine.iconUrl,
        domaineId: domaine.id,
      },
      update: {},
    });
  }
  console.log(`${domaines.length} communauté(s) de domaine synchronisée(s).`);
}

async function seedCommunautesMetier() {
  const metiers = await prisma.metier.findMany();
  for (const metier of metiers) {
    const slug = `metier-${metier.slug}`;
    await prisma.communaute.upsert({
      where: { slug },
      create: {
        type: "METIER",
        nom: metier.nom,
        slug,
        description: metier.descriptionCourte ?? metier.description,
        imageUrl: metier.imageUrl,
        metierId: metier.id,
      },
      update: {},
    });
  }
  console.log(`${metiers.length} communauté(s) de métier synchronisée(s).`);
}

async function main() {
  await seedCommunautesDomaine();
  await seedCommunautesMetier();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

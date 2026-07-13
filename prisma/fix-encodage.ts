import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Répare les textes saisis avec un mauvais encodage lors des tests. */
async function main() {
  const etab = await prisma.etablissementProfile.findUnique({
    where: { slug: "college-sainte-marie" },
    include: { pagePublique: true },
  });
  if (!etab) {
    console.log("Établissement introuvable — rien à faire.");
    return;
  }

  await prisma.etablissementProfile.update({
    where: { id: etab.id },
    data: {
      description:
        "Collège d'excellence à Porto-Novo : accompagnement personnalisé de la 6e à la 3e, ouverture aux métiers du numérique et suivi d'orientation avec To Be.Come.",
    },
  });

  if (etab.pagePublique) {
    await prisma.pagePublique.update({
      where: { id: etab.pagePublique.id },
      data: { filieres: ["Général", "Scientifique", "Littéraire"] },
    });
  }

  console.log("Encodage réparé pour College Sainte-Marie.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

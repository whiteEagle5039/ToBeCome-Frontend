import path from "path";
import dotenv from "dotenv";
// Charge backend/.env quel que soit le répertoire d'exécution (racine ou backend/)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { BLOCS_RIASEC, QUESTIONS_RIASEC, ARCHETYPES_RIASEC } from "./data/riasec";
import { chapitresParDefaut, banqueQuestionsParDefaut } from "./data/aventure";
import { metiers as FICHES_METIERS, matieresList } from "../data/college/metiers";
import { VIDEOS_METIERS } from "../data/college/videos-metiers";

const prisma = new PrismaClient();

// Lettres RIASEC associées à chaque domaine de métier (recommandations)
const DOMAINE_RIASEC: Record<string, string[]> = {
  "Numérique": ["I", "R", "C"],
  "Infrastructure Informatique": ["R", "I", "C"],
  "Intelligence Artificielle": ["I", "C"],
  "Data": ["I", "C"],
  "Design Numérique": ["A", "S"],
  "Création Numérique": ["A", "I"],
  "Marketing Digital": ["S", "E", "A"],
  "Gestion de Produit": ["E", "C", "S"],
  "Gestion de Projet": ["C", "E"],
  "Développement Commercial": ["E", "S"],
  "Entrepreneuriat": ["E", "A"],
  "Cybersécurité": ["I", "R", "C"],
};

async function main() {
  console.log("Seed démarré...");

  // ── Admin ─────────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("Admin@ToBecome2024!", 12);
  await prisma.user.upsert({
    where: { email: "admin@tobecome.africa" },
    update: {},
    create: {
      email: "admin@tobecome.africa",
      password: adminHash,
      role: "ADMIN",
      adminProfile: { create: { prenom: "Admin", nom: "To Be.Come" } },
    },
  });

  // ── Matières (avec slug, alignées sur les fiches Explorer) ────────────────
  for (const m of matieresList) {
    await prisma.matiere.upsert({
      where: { nom: m.nom },
      update: { slug: m.slug, emoji: m.emoji },
      create: { nom: m.nom, slug: m.slug, emoji: m.emoji },
    });
  }
  console.log(`OK — ${matieresList.length} matières`);

  // ── Domaines (issus des fiches métiers) ───────────────────────────────────
  const domainesFiches = [...new Set(FICHES_METIERS.map((f) => f.domaine))];
  const domaineIds = new Map<string, string>();
  for (const nom of domainesFiches) {
    const d = await prisma.domaine.upsert({
      where: { nom },
      update: {},
      create: { nom },
    });
    domaineIds.set(nom, d.id);
  }
  console.log(`OK — ${domainesFiches.length} domaines`);

  // ── Métiers (fiches Explorer = catalogue de jeu) + campagne Aventure ─────
  for (const fiche of FICHES_METIERS) {
    const metier = await prisma.metier.upsert({
      where: { slug: fiche.slug },
      update: {
        domaineId: domaineIds.get(fiche.domaine),
        riasecTypes: DOMAINE_RIASEC[fiche.domaine] ?? ["I"],
        videoUrl: VIDEOS_METIERS[fiche.slug] || null,
      },
      create: {
        slug: fiche.slug,
        nom: fiche.nom,
        domaineId: domaineIds.get(fiche.domaine),
        description: fiche.presentation,
        descriptionCourte: fiche.descriptionCourte,
        riasecTypes: DOMAINE_RIASEC[fiche.domaine] ?? ["I"],
        videoUrl: VIDEOS_METIERS[fiche.slug] || null,
      },
    });

    // Liens métier ↔ matières
    for (const matiereSlug of fiche.matieres) {
      const matiere = await prisma.matiere.findUnique({ where: { slug: matiereSlug } });
      if (matiere) {
        await prisma.metierMatiere.upsert({
          where: { metierId_matiereId: { metierId: metier.id, matiereId: matiere.id } },
          update: {},
          create: { metierId: metier.id, matiereId: matiere.id },
        });
      }
    }

    // Campagne Aventure : 3 chapitres + boss (si pas déjà en base)
    const nbMissions = await prisma.mission.count({ where: { metierId: metier.id } });
    if (nbMissions === 0) {
      for (const ch of chapitresParDefaut(metier.nom)) {
        await prisma.mission.create({
          data: {
            metierId: metier.id,
            titre: ch.titre,
            description: ch.description,
            ordre: ch.ordre,
            estBoss: ch.estBoss,
            xpRecompense: ch.xpRecompense,
            etapes: {
              create: ch.etapes.map((e) => ({
                ordre: e.ordre,
                type: e.type,
                titre: e.titre,
                xpRecompense: e.xpRecompense,
                contenu: e.contenu as object,
              })),
            },
          },
        });
      }
    }

    // Banque de questions (Défi du jour + Battle)
    const nbQuestions = await prisma.questionMetier.count({ where: { metierId: metier.id } });
    if (nbQuestions === 0) {
      await prisma.questionMetier.createMany({
        data: banqueQuestionsParDefaut(metier.nom).map((q) => ({
          metierId: metier.id,
          type: q.type,
          question: q.question,
          choix: q.choix,
          bonneReponseIndex: q.bonneReponseIndex,
        })),
      });
    }
  }
  console.log(`OK — ${FICHES_METIERS.length} métiers (campagne Aventure + banque de questions)`);

  // ── RIASEC : blocs, 36 questions pondérées, archétypes ───────────────────
  for (const bloc of BLOCS_RIASEC) {
    await prisma.riasecBloc.upsert({
      where: { numero: bloc.numero },
      update: { titre: bloc.titre, description: bloc.description, couleur: bloc.couleur },
      create: bloc,
    });
  }

  const nbQuestionsRiasec = await prisma.questionRiasec.count();
  if (nbQuestionsRiasec === 0) {
    let ordre = 0;
    for (const q of QUESTIONS_RIASEC) {
      ordre += 1;
      const bloc = await prisma.riasecBloc.findUniqueOrThrow({ where: { numero: q.bloc } });
      await prisma.questionRiasec.create({
        data: {
          blocId: bloc.id,
          ordre,
          type: q.type,
          intitule: q.intitule,
          dimension: q.dimension ?? null,
          options: {
            create: q.options.map((o, i) => ({
              ordre: i + 1,
              texte: o.texte,
              poids: o.poids as object,
            })),
          },
        },
      });
    }
    console.log(`OK — ${QUESTIONS_RIASEC.length} questions RIASEC (6 blocs)`);
  } else {
    console.log(`Questions RIASEC déjà présentes (${nbQuestionsRiasec}) — ignoré`);
  }

  for (const a of ARCHETYPES_RIASEC) {
    await prisma.archetypeRiasec.upsert({
      where: { lettre: a.lettre },
      update: a,
      create: a,
    });
  }
  console.log("OK — 6 archétypes RIASEC");

  // ── Badges ────────────────────────────────────────────────────────────────
  const badges = [
    { nom: "Explorateur", description: "A découvert son profil RIASEC.", type: "OBJECTIF" },
    { nom: "Premier chapitre", description: "A terminé son premier chapitre d'aventure.", type: "NIVEAU" },
    { nom: "Série de 3 jours", description: "A relevé le défi du jour 3 jours de suite.", type: "STREAK" },
    { nom: "Série de 7 jours", description: "A relevé le défi du jour 7 jours de suite.", type: "STREAK" },
  ];
  for (const b of badges) {
    await prisma.badge.upsert({ where: { nom: b.nom }, update: {}, create: b });
  }
  console.log("OK — badges");

  // ── Établissement + classe + matricule + élève de démonstration ──────────
  const etabHash = await bcrypt.hash("Etab@Demo2026!", 12);
  const etabUser = await prisma.user.upsert({
    where: { email: "etablissement@demo.tobecome.bj" },
    update: {},
    create: { email: "etablissement@demo.tobecome.bj", password: etabHash, role: "ETABLISSEMENT" },
  });

  const etab = await prisma.etablissementProfile.upsert({
    where: { slug: "college-demo" },
    update: {},
    create: {
      userId: etabUser.id,
      nom: "Collège Démo To Be.Come",
      type: "collège",
      ville: "Cotonou",
      slug: "college-demo",
      status: "ACTIVE",
    },
  });

  let classe = await prisma.classe.findFirst({ where: { etablissementId: etab.id, nom: "5ème A" } });
  if (!classe) {
    classe = await prisma.classe.create({
      data: { etablissementId: etab.id, nom: "5ème A", niveau: "CINQUIEME", anneesScolaire: "2025-2026" },
    });
  }

  const matricule = await prisma.matricule.upsert({
    where: { code: "TBC-2026-0001" },
    update: {},
    create: { code: "TBC-2026-0001", etablissementId: etab.id, classeId: classe.id, status: "UTILISE" },
  });

  const eleveHash = await bcrypt.hash("eleve123", 12);
  const eleveUser = await prisma.user.upsert({
    where: { email: "tbc20260001@eleve.tobecome.bj" },
    update: {},
    create: { email: "tbc20260001@eleve.tobecome.bj", password: eleveHash, role: "ELEVE_COLLEGE" },
  });

  const eleve = await prisma.eleveProfile.upsert({
    where: { userId: eleveUser.id },
    update: {},
    create: {
      userId: eleveUser.id,
      matriculeId: matricule.id,
      etablissementId: etab.id,
      classeId: classe.id,
      prenom: "Gio",
      nom: "Demo",
      dateNaissance: new Date("2013-04-15"),
      niveauCollege: "CINQUIEME",
      estVerifie: true,
    },
  });
  console.log("OK — établissement + élève de test (TBC-2026-0001 / eleve123)");

  // ── Communautés : une par matière (bouton flottant de l'accueil) ──────────
  for (const m of matieresList) {
    const matiere = await prisma.matiere.findUnique({ where: { slug: m.slug } });
    if (!matiere) continue;
    await prisma.communaute.upsert({
      where: { slug: m.slug },
      update: { matiereId: matiere.id },
      create: {
        type: "MATIERE",
        nom: m.nom,
        slug: m.slug,
        description: `La communauté ${m.nom} : questions, entraide, ressources et découvertes des métiers liés à cette matière.`,
        matiereId: matiere.id,
      },
    });
  }

  const commMaths = await prisma.communaute.findUnique({ where: { slug: "mathematiques" } });
  if (commMaths) {
    await prisma.communauteMembre.upsert({
      where: { communauteId_eleveId: { communauteId: commMaths.id, eleveId: eleve.id } },
      update: {},
      create: { communauteId: commMaths.id, eleveId: eleve.id, role: "MEMBRE" },
    });
    const nbPubs = await prisma.publication.count({ where: { communauteId: commMaths.id } });
    if (nbPubs === 0) {
      await prisma.publication.create({
        data: {
          communauteId: commMaths.id,
          auteurId: eleve.id,
          contenu:
            "Bienvenue dans la communauté Mathématiques. Ici on partage nos questions, nos astuces et les métiers qu'on découvre grâce aux maths.",
        },
      });
    }
  }
  console.log(`OK — ${matieresList.length} communautés de matières`);

  console.log("");
  console.log("Seed terminé.");
  console.log("Connexion espace collège : matricule TBC-2026-0001 / mot de passe eleve123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

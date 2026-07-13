import { PrismaClient, NiveauCollege, NiveauLycee } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PARENT_PASSWORD = "Parent@123!";
const ELEVE_PASSWORD = "Eleve@123!";

async function upsertDomaine(nom: string, description: string, iconUrl: string) {
  return prisma.domaine.upsert({
    where: { nom },
    update: {},
    create: { nom, description, iconUrl },
  });
}

async function upsertMetier(opts: {
  nom: string;
  slug: string;
  domaineId: string;
  description: string;
  descriptionCourte: string;
  riasecTypes: string[];
}) {
  return prisma.metier.upsert({
    where: { slug: opts.slug },
    update: {},
    create: opts,
  });
}

async function upsertBadge(nom: string, description: string, type: string) {
  return prisma.badge.upsert({
    where: { nom },
    update: {},
    create: { nom, description, imageUrl: "", type },
  });
}

async function getOrCreateClasse(etablissementId: string, nom: string, niveau: string) {
  const existing = await prisma.classe.findFirst({ where: { etablissementId, nom } });
  if (existing) return existing;
  return prisma.classe.create({
    data: { etablissementId, nom, niveau, anneesScolaire: "2025-2026" },
  });
}

async function getOrCreateMatricule(code: string, etablissementId: string, classeId: string) {
  const existing = await prisma.matricule.findUnique({ where: { code } });
  if (existing) return existing;
  return prisma.matricule.create({
    data: { code, etablissementId, classeId, status: "UTILISE" },
  });
}

async function main() {
  console.log("🌱 Recréation du compte démo Prosper Zinsou...");

  // ── Domaines & métiers (pour que l'exploration / favoris aient de quoi pointer) ──
  const dNumerique = await upsertDomaine("Numérique", "Développement, design digital, data.", "💻");
  const dAgro = await upsertDomaine("Agro-transformation", "Transformation des produits agricoles.", "🌱");
  const dSante = await upsertDomaine("Santé", "Soin et suivi médical.", "🏥");
  const dBusiness = await upsertDomaine("Business", "Entrepreneuriat, gestion, vente.", "💼");
  const dGenie = await upsertDomaine("Génie", "Construction, infrastructures, ingénierie.", "🏗️");

  const metierDefs = [
    { nom: "Développeuse web", slug: "developpeuse-web", domaineId: dNumerique.id, riasec: ["I", "R"] },
    { nom: "Ingénieure agro-transformation", slug: "ingenieure-agro", domaineId: dAgro.id, riasec: ["R", "I"] },
    { nom: "Designer graphique", slug: "designer-graphique", domaineId: dNumerique.id, riasec: ["A", "E"] },
    { nom: "Infirmière", slug: "infirmiere", domaineId: dSante.id, riasec: ["S", "R"] },
    { nom: "Entrepreneure", slug: "entrepreneure", domaineId: dBusiness.id, riasec: ["E", "A"] },
    { nom: "Technicien génie civil", slug: "technicien-genie-civil", domaineId: dGenie.id, riasec: ["R", "C"] },
  ];

  const metiers: Record<string, Awaited<ReturnType<typeof upsertMetier>>> = {};
  for (const m of metierDefs) {
    metiers[m.slug] = await upsertMetier({
      nom: m.nom,
      slug: m.slug,
      domaineId: m.domaineId,
      description: m.nom,
      descriptionCourte: m.nom,
      riasecTypes: m.riasec,
    });
  }

  // ── Établissement démo (avec son propre compte de connexion) ──
  const etabEmail = "college-cotonou-demo@tobecome.africa";
  const etabHash = await bcrypt.hash("Etablissement@123!", 12);
  const etabUser = await prisma.user.upsert({
    where: { email: etabEmail },
    update: {},
    create: { email: etabEmail, password: etabHash, role: "ETABLISSEMENT" },
  });
  const etablissement = await prisma.etablissementProfile.upsert({
    where: { userId: etabUser.id },
    update: {},
    create: {
      userId: etabUser.id,
      nom: "Collège Public de Cotonou",
      type: "Collège",
      ville: "Cotonou",
      slug: "college-public-cotonou-demo",
      status: "ACTIVE",
    },
  });

  const classe4B = await getOrCreateClasse(etablissement.id, "4ème B", "QUATRIEME");
  const classe2C = await getOrCreateClasse(etablissement.id, "2nde C", "SECONDE");
  const classe6A = await getOrCreateClasse(etablissement.id, "6ème A", "SIXIEME");

  const mat1 = await getOrCreateMatricule("COT-2026-0142", etablissement.id, classe4B.id);
  const mat2 = await getOrCreateMatricule("COT-2026-0143", etablissement.id, classe2C.id);
  const mat3 = await getOrCreateMatricule("COT-2026-0144", etablissement.id, classe6A.id);

  // ── Compte parent ──
  const parentHash = await bcrypt.hash(PARENT_PASSWORD, 12);
  const parentUser = await prisma.user.upsert({
    where: { email: "prosper.zinsou@example.com" },
    update: { password: parentHash },
    create: {
      email: "prosper.zinsou@example.com",
      password: parentHash,
      phone: "+229 97 00 00 00",
      role: "PARENT",
    },
  });
  const parentProfile = await prisma.parentProfile.upsert({
    where: { userId: parentUser.id },
    update: {},
    create: {
      userId: parentUser.id,
      prenom: "Prosper",
      nom: "Zinsou",
      telephone: "+229 97 00 00 00",
    },
  });
  await prisma.notifConfig.upsert({
    where: { parentId: parentProfile.id },
    update: {},
    create: { parentId: parentProfile.id, canal: "WHATSAPP", frequence: "WEEKLY" },
  });

  // ── Enfants ──
  async function createEleveIfMissing(opts: {
    email: string;
    prenom: string;
    nom: string;
    dateNaissance: string;
    matriculeId: string;
    classeId: string;
    niveauCollege?: NiveauCollege;
    niveauLycee?: NiveauLycee;
    isLycee: boolean;
    xpTotal: number;
    role: "ELEVE_COLLEGE" | "ELEVE_LYCEE";
    avatarUrl: string;
  }) {
    const existingProfile = await prisma.eleveProfile.findFirst({
      where: { matriculeId: opts.matriculeId },
    });
    if (existingProfile) return existingProfile;

    const hash = await bcrypt.hash(ELEVE_PASSWORD, 12);
    const user = await prisma.user.create({
      data: { email: opts.email, password: hash, role: opts.role },
    });

    return prisma.eleveProfile.create({
      data: {
        userId: user.id,
        matriculeId: opts.matriculeId,
        etablissementId: etablissement.id,
        classeId: opts.classeId,
        prenom: opts.prenom,
        nom: opts.nom,
        dateNaissance: new Date(opts.dateNaissance),
        avatarUrl: opts.avatarUrl,
        niveauCollege: opts.niveauCollege,
        niveauLycee: opts.niveauLycee,
        isLycee: opts.isLycee,
        xpTotal: opts.xpTotal,
      },
    });
  }

  const aicha = await createEleveIfMissing({
    email: "aicha.zinsou.demo@tobecome.africa",
    prenom: "Aïcha",
    nom: "Zinsou",
    dateNaissance: "2012-03-14",
    matriculeId: mat1.id,
    classeId: classe4B.id,
    niveauCollege: "QUATRIEME",
    isLycee: false,
    xpTotal: 620,
    role: "ELEVE_COLLEGE",
    avatarUrl: "sun",
  });

  const kevin = await createEleveIfMissing({
    email: "kevin.zinsou.demo@tobecome.africa",
    prenom: "Kévin",
    nom: "Zinsou",
    dateNaissance: "2010-11-02",
    matriculeId: mat2.id,
    classeId: classe2C.id,
    niveauLycee: "SECONDE",
    isLycee: true,
    xpTotal: 350,
    role: "ELEVE_LYCEE",
    avatarUrl: "zap",
  });

  const rachelle = await createEleveIfMissing({
    email: "rachelle.zinsou.demo@tobecome.africa",
    prenom: "Rachelle",
    nom: "Zinsou",
    dateNaissance: "2014-07-22",
    matriculeId: mat3.id,
    classeId: classe6A.id,
    niveauCollege: "SIXIEME",
    isLycee: false,
    xpTotal: 50,
    role: "ELEVE_COLLEGE",
    avatarUrl: "palette",
  });

  // ── Lien parent ↔ enfants ──
  for (const eleve of [aicha, kevin, rachelle]) {
    await prisma.parentEnfant.upsert({
      where: { parentId_eleveId: { parentId: parentProfile.id, eleveId: eleve.id } },
      update: {},
      create: { parentId: parentProfile.id, eleveId: eleve.id, lienParente: "Père" },
    });
  }

  // ── Résultats RIASEC ──
  await prisma.riasecResultat.upsert({
    where: { eleveId: aicha.id },
    update: {},
    create: {
      eleveId: aicha.id,
      scoreR: 78,
      scoreI: 72,
      scoreA: 65,
      scoreS: 40,
      scoreE: 35,
      scoreC: 28,
      typesPrincipaux: ["R", "I", "A"],
    },
  });
  await prisma.riasecResultat.upsert({
    where: { eleveId: kevin.id },
    update: {},
    create: {
      eleveId: kevin.id,
      scoreR: 44,
      scoreI: 38,
      scoreA: 55,
      scoreS: 74,
      scoreE: 80,
      scoreC: 30,
      typesPrincipaux: ["E", "S"],
    },
  });
  // Rachelle : pas de test RIASEC encore (comme dans les données de départ)

  // ── Badges ──
  const badgeMaitrise = await upsertBadge("Métier maîtrisé", "A validé toutes les étapes d'une mission.", "METIER");
  const badgeExplorateur = await upsertBadge("Explorateur curieux", "A exploré au moins 4 métiers différents.", "OBJECTIF");
  const badgeProfil = await upsertBadge("Profil dévoilé", "A complété son test RIASEC.", "OBJECTIF");
  const badgePremiere = await upsertBadge("Première mission", "A démarré sa toute première mission métier.", "NIVEAU");

  async function giveBadge(eleveId: string, badgeId: string) {
    await prisma.eleveBadge.upsert({
      where: { eleveId_badgeId: { eleveId, badgeId } },
      update: {},
      create: { eleveId, badgeId },
    });
  }
  await giveBadge(aicha.id, badgeMaitrise.id);
  await giveBadge(aicha.id, badgeExplorateur.id);
  await giveBadge(aicha.id, badgeProfil.id);
  await giveBadge(aicha.id, badgePremiere.id);
  await giveBadge(kevin.id, badgeProfil.id);

  // ── Métiers explorés / maîtrisés / favoris ──
  async function explore(eleveId: string, metierId: string) {
    await prisma.metierExplore.upsert({
      where: { eleveId_metierId: { eleveId, metierId } },
      update: {},
      create: { eleveId, metierId },
    });
  }
  async function maitrise(eleveId: string, metierId: string) {
    await prisma.metierMaitrise.upsert({
      where: { eleveId_metierId: { eleveId, metierId } },
      update: {},
      create: { eleveId, metierId },
    });
  }
  async function favori(eleveId: string, metierId: string) {
    await prisma.favori.upsert({
      where: { eleveId_metierId: { eleveId, metierId } },
      update: {},
      create: { eleveId, metierId },
    });
  }

  await explore(aicha.id, metiers["developpeuse-web"].id);
  await explore(aicha.id, metiers["ingenieure-agro"].id);
  await explore(aicha.id, metiers["designer-graphique"].id);
  await explore(aicha.id, metiers["technicien-genie-civil"].id);
  await maitrise(aicha.id, metiers["developpeuse-web"].id);
  await favori(aicha.id, metiers["developpeuse-web"].id);
  await favori(aicha.id, metiers["designer-graphique"].id);

  await explore(kevin.id, metiers["entrepreneure"].id);
  await explore(kevin.id, metiers["infirmiere"].id);
  await favori(kevin.id, metiers["entrepreneure"].id);

  // ── Commentaire du parent sur Aïcha ──
  const existingComment = await prisma.commentaireParent.findFirst({
    where: { parentId: parentProfile.id, eleveId: aicha.id },
  });
  if (!existingComment) {
    await prisma.commentaireParent.create({
      data: {
        parentId: parentProfile.id,
        eleveId: aicha.id,
        contenu:
          "Fière de voir qu'elle s'intéresse au développement web, on en a discuté ce week-end.",
      },
    });
  }

  // ── Notifications du parent ──
  const parentNotifs = [
    {
      titre: "Nouveau badge débloqué",
      message: "Aïcha a obtenu le badge « Métier maîtrisé » pour Développeuse web.",
      isRead: false,
      type: "BADGE",
    },
    {
      titre: "Profil RIASEC complété",
      message: "Kévin a terminé son test RIASEC. Profil dominant : Entreprenant.",
      isRead: false,
      type: "RIASEC",
    },
    {
      titre: "Nouvelle mission disponible",
      message: "Une nouvelle mission métier a été débloquée pour Aïcha.",
      isRead: true,
      type: "MISSION",
    },
    {
      titre: "Bienvenue sur To be.come",
      message: "Le compte de Rachelle a été activé. Elle peut commencer son parcours.",
      isRead: true,
      type: "SYSTEME",
    },
  ];
  const existingParentNotifs = await prisma.parentNotification.count({
    where: { parentId: parentProfile.id },
  });
  if (existingParentNotifs === 0) {
    for (const n of parentNotifs) {
      await prisma.parentNotification.create({ data: { parentId: parentProfile.id, ...n } });
    }
  }

  console.log("✅ Compte démo recréé !");
  console.log("   Parent : prosper.zinsou@example.com / " + PARENT_PASSWORD);
  console.log("   (comptes élèves créés aussi, mot de passe : " + ELEVE_PASSWORD + ", non utilisés côté app parent)");
}

main()
  .catch((err) => {
    console.error("❌ Erreur :", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
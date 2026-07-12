import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";

const NB_QUESTIONS_DEFI = 5;
const BADGES_STREAK: Record<number, string> = {
  3: "Série de 3 jours",
  7: "Série de 7 jours",
};

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * GET /api/college/quetes/defi?metier=slug
 * Retourne le défi du jour du métier. S'il n'existe pas encore, il est
 * généré automatiquement à partir de la banque de questions du métier
 * (table questions_metier, modifiable en base).
 */
export async function GET(req: NextRequest) {
  const eleve = await getCurrentEleve();
  const metierSlug = req.nextUrl.searchParams.get("metier");

  if (!metierSlug) {
    return NextResponse.json({ error: "Paramètre metier requis" }, { status: 400 });
  }

  const metier = await prisma.metier.findUnique({ where: { slug: metierSlug } });
  if (!metier) {
    return NextResponse.json({ error: "Métier introuvable" }, { status: 404 });
  }

  const aujourdhui = startOfToday();

  let defi = await prisma.defiQuotidien.findUnique({
    where: { date_metierId: { date: aujourdhui, metierId: metier.id } },
    include: { metier: true },
  });

  if (!defi) {
    // Génération du défi du jour depuis la banque de questions du métier
    const banque = await prisma.questionMetier.findMany({
      where: { metierId: metier.id, active: true },
    });
    if (banque.length === 0) {
      return NextResponse.json({ defi: null });
    }

    const questions = banque
      .map((q) => ({ q, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .slice(0, NB_QUESTIONS_DEFI)
      .map(({ q }) => ({
        question: q.question,
        choix: q.choix,
        bonneReponseIndex: q.bonneReponseIndex,
      }));

    defi = await prisma.defiQuotidien.create({
      data: { date: aujourdhui, metierId: metier.id, contenu: questions },
      include: { metier: true },
    });
  }

  let dejaFait = false;
  if (eleve) {
    const attempt = await prisma.defiAttempt.findUnique({
      where: { eleveId_defiId: { eleveId: eleve.id, defiId: defi.id } },
    });
    dejaFait = !!attempt;
  }

  return NextResponse.json({ defi, dejaFait });
}

/**
 * POST — enregistre la tentative, crédite l'XP, met à jour la série (streak)
 * et attribue les badges de série (3 jours, 7 jours).
 */
export async function POST(req: NextRequest) {
  const eleve = await getCurrentEleve();
  if (!eleve) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { defiId, score, dureeSecondes } = await req.json();

  const defi = await prisma.defiQuotidien.findUnique({ where: { id: defiId } });
  if (!defi) {
    return NextResponse.json({ error: "Défi introuvable" }, { status: 404 });
  }

  const existant = await prisma.defiAttempt.findUnique({
    where: { eleveId_defiId: { eleveId: eleve.id, defiId } },
  });
  if (existant) {
    return NextResponse.json({ error: "Défi déjà réalisé aujourd'hui" }, { status: 409 });
  }

  await prisma.defiAttempt.create({
    data: { eleveId: eleve.id, defiId, score: score ?? 0, dureeSecondes: dureeSecondes ?? 0 },
  });

  // Série : un défi réalisé la veille (n'importe quel métier) prolonge la série
  const hier = startOfToday();
  hier.setDate(hier.getDate() - 1);
  const demain = startOfToday();
  demain.setDate(demain.getDate() + 1);

  const tentativeHier = await prisma.defiAttempt.findFirst({
    where: {
      eleveId: eleve.id,
      defi: { date: { gte: hier, lt: startOfToday() } },
    },
  });

  const profil = await prisma.eleveProfile.findUniqueOrThrow({ where: { id: eleve.id } });
  const nouveauStreak = tentativeHier ? profil.streakJours + 1 : 1;

  await prisma.$transaction([
    prisma.xpHistorique.create({
      data: { eleveId: eleve.id, points: defi.xpRecompense, raison: "Défi du jour relevé" },
    }),
    prisma.eleveProfile.update({
      where: { id: eleve.id },
      data: { xpTotal: { increment: defi.xpRecompense }, streakJours: nouveauStreak },
    }),
  ]);

  // Badges de série
  const nomBadge = BADGES_STREAK[nouveauStreak];
  if (nomBadge) {
    const badge = await prisma.badge.findUnique({ where: { nom: nomBadge } });
    if (badge) {
      await prisma.eleveBadge.upsert({
        where: { eleveId_badgeId: { eleveId: eleve.id, badgeId: badge.id } },
        update: {},
        create: { eleveId: eleve.id, badgeId: badge.id },
      });
    }
  }

  return NextResponse.json({ xpGagne: defi.xpRecompense, streak: nouveauStreak });
}

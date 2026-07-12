import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";
import { computeProfile, type Poids, type ReponseInput } from "@/lib/college/riasec/scoring";

const XP_RIASEC = 500;

export async function POST(req: NextRequest) {
  const eleve = await getCurrentEleve();
  if (!eleve) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const reponses: ReponseInput[] = body.reponses;

  if (!Array.isArray(reponses) || reponses.length === 0) {
    return NextResponse.json({ error: "Réponses manquantes" }, { status: 400 });
  }

  // Les pondérations restent côté serveur : on recharge les questions en base.
  const questions = await prisma.questionRiasec.findMany({
    where: { active: true },
    include: { bloc: true, options: true },
  });

  const profil = computeProfile(
    questions.map((q) => ({
      id: q.id,
      type: q.type,
      dimension: q.dimension,
      blocNumero: q.bloc.numero,
      options: q.options.map((o) => ({ id: o.id, poids: o.poids as Poids })),
    })),
    reponses
  );

  const resultat = await prisma.riasecResultat.upsert({
    where: { eleveId: eleve.id },
    create: {
      eleveId: eleve.id,
      scoreR: profil.scores.R,
      scoreI: profil.scores.I,
      scoreA: profil.scores.A,
      scoreS: profil.scores.S,
      scoreE: profil.scores.E,
      scoreC: profil.scores.C,
      typesPrincipaux: profil.ranking,
      hollandCode: profil.hollandCode,
      profilType: profil.profilType,
      fiabilite: profil.fiabilite,
    },
    update: {
      scoreR: profil.scores.R,
      scoreI: profil.scores.I,
      scoreA: profil.scores.A,
      scoreS: profil.scores.S,
      scoreE: profil.scores.E,
      scoreC: profil.scores.C,
      typesPrincipaux: profil.ranking,
      hollandCode: profil.hollandCode,
      profilType: profil.profilType,
      fiabilite: profil.fiabilite,
    },
  });

  // Récompenses : XP + badge Explorateur (première fois uniquement)
  const badge = await prisma.badge.findUnique({ where: { nom: "Explorateur" } });
  const dejaObtenu = badge
    ? await prisma.eleveBadge.findUnique({
        where: { eleveId_badgeId: { eleveId: eleve.id, badgeId: badge.id } },
      })
    : null;

  await prisma.$transaction([
    prisma.xpHistorique.create({
      data: { eleveId: eleve.id, points: XP_RIASEC, raison: "Découverte du profil RIASEC" },
    }),
    prisma.eleveProfile.update({
      where: { id: eleve.id },
      data: { xpTotal: { increment: XP_RIASEC } },
    }),
    ...(badge && !dejaObtenu
      ? [prisma.eleveBadge.create({ data: { eleveId: eleve.id, badgeId: badge.id } })]
      : []),
  ]);

  return NextResponse.json({
    resultat,
    hollandCode: profil.hollandCode,
    profilType: profil.profilType,
    fiabilite: profil.fiabilite,
    xpGagne: XP_RIASEC,
  });
}

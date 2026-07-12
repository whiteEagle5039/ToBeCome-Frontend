import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";

type EtapeResultat = { etapeId: string; isComplete: boolean; score?: number };

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ missionId: string }> }
) {
  const eleve = await getCurrentEleve();
  if (!eleve) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { missionId } = await params;
  const body = await req.json();
  const etapes: EtapeResultat[] = body.etapes ?? [];

  const mission = await prisma.mission.findUnique({ where: { id: missionId } });
  if (!mission) {
    return NextResponse.json({ error: "Chapitre introuvable" }, { status: 404 });
  }

  const dejaComplete = await prisma.missionProgress.findUnique({
    where: { eleveId_missionId: { eleveId: eleve.id, missionId: mission.id } },
  });

  const progress = await prisma.missionProgress.upsert({
    where: { eleveId_missionId: { eleveId: eleve.id, missionId: mission.id } },
    create: { eleveId: eleve.id, missionId: mission.id, isComplete: true, completedAt: new Date() },
    update: { isComplete: true, completedAt: new Date() },
  });

  for (const etape of etapes) {
    await prisma.missionStepProgress.upsert({
      where: { progresId_etapeId: { progresId: progress.id, etapeId: etape.etapeId } },
      create: {
        progresId: progress.id,
        etapeId: etape.etapeId,
        isComplete: etape.isComplete,
        score: etape.score ?? null,
        completedAt: new Date(),
      },
      update: { isComplete: etape.isComplete, score: etape.score ?? null, completedAt: new Date() },
    });
  }

  // XP uniquement à la première complétion du chapitre
  let xpGagne = 0;
  if (!dejaComplete?.isComplete) {
    xpGagne = mission.xpRecompense;
    await prisma.$transaction([
      prisma.xpHistorique.create({
        data: { eleveId: eleve.id, points: xpGagne, raison: `Chapitre terminé : ${mission.titre}` },
      }),
      prisma.eleveProfile.update({
        where: { id: eleve.id },
        data: { xpTotal: { increment: xpGagne } },
      }),
    ]);

    const badge = await prisma.badge.findUnique({ where: { nom: "Premier chapitre" } });
    if (badge) {
      await prisma.eleveBadge.upsert({
        where: { eleveId_badgeId: { eleveId: eleve.id, badgeId: badge.id } },
        update: {},
        create: { eleveId: eleve.id, badgeId: badge.id },
      });
    }
  }

  return NextResponse.json({ progress, xpGagne });
}

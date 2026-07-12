import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; defiId: string }> }
) {
  const eleve = await getCurrentEleve();
  if (!eleve) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const defi = await prisma.defiCommunaute.findUnique({ where: { id: (await params).defiId } });
  if (!defi) {
    return NextResponse.json({ error: "Défi introuvable" }, { status: 404 });
  }

  const existante = await prisma.defiCommunauteParticipation.findUnique({
    where: { defiId_eleveId: { defiId: defi.id, eleveId: eleve.id } },
  });
  if (existante?.statut === "TERMINE") {
    return NextResponse.json({ error: "Défi déjà terminé." }, { status: 409 });
  }

  await prisma.$transaction([
    prisma.defiCommunauteParticipation.upsert({
      where: { defiId_eleveId: { defiId: defi.id, eleveId: eleve.id } },
      create: { defiId: defi.id, eleveId: eleve.id, statut: "TERMINE", completedAt: new Date() },
      update: { statut: "TERMINE", completedAt: new Date() },
    }),
    prisma.xpHistorique.create({
      data: { eleveId: eleve.id, points: defi.xpRecompense, raison: `Défi communauté : ${defi.titre}` },
    }),
    prisma.eleveProfile.update({
      where: { id: eleve.id },
      data: { xpTotal: { increment: defi.xpRecompense } },
    }),
  ]);

  return NextResponse.json({ success: true, xpGagne: defi.xpRecompense });
}

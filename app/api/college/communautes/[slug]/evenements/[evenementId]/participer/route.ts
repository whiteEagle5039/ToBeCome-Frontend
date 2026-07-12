import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; evenementId: string }> }
) {
  const eleve = await getCurrentEleve();
  if (!eleve) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { statut } = await req.json(); // "INTERESSE" | "PARTICIPE"

  const participation = await prisma.evenementParticipant.upsert({
    where: {
      evenementId_eleveId: { evenementId: (await params).evenementId, eleveId: eleve.id },
    },
    create: { evenementId: (await params).evenementId, eleveId: eleve.id, statut },
    update: { statut },
  });

  return NextResponse.json({ participation });
}

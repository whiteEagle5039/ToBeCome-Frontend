import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const eleve = await getCurrentEleve();
  const { slug } = await params;

  const metier = await prisma.metier.findUnique({
    where: { slug },
    include: {
      domaine: true,
      missions: {
        orderBy: { ordre: "asc" },
        include: { etapes: { orderBy: { ordre: "asc" } } },
      },
    },
  });

  if (!metier) {
    return NextResponse.json({ error: "Métier introuvable" }, { status: 404 });
  }

  let progression: Record<string, boolean> = {};
  if (eleve) {
    const rows = await prisma.missionProgress.findMany({
      where: { eleveId: eleve.id, mission: { metierId: metier.id } },
    });
    progression = Object.fromEntries(rows.map((r) => [r.missionId, r.isComplete]));
  }

  return NextResponse.json({ metier, progression });
}

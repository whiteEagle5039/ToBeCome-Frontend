import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";

/** Communautés dont l'élève courant est membre (pour le partage d'invitations). */
export async function GET() {
  const eleve = await getCurrentEleve();
  if (!eleve) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const memberships = await prisma.communauteMembre.findMany({
    where: { eleveId: eleve.id },
    include: { communaute: { select: { slug: true, nom: true } } },
    orderBy: { joinedAt: "desc" },
  });

  return NextResponse.json({
    communautes: memberships.map((m) => ({
      slug: m.communaute.slug,
      nom: m.communaute.nom,
    })),
  });
}

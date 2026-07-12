import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { EtablissementStatus } from "@prisma/client";

/** Liste des établissements (filtrable par statut) pour l'espace admin. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as EtablissementStatus | null;

  const etablissements = await prisma.etablissementProfile.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true } },
      _count: { select: { eleveProfiles: true } },
    },
  });

  return NextResponse.json(
    etablissements.map((e) => ({
      id: e.id,
      nom: e.nom,
      status: e.status,
      ville: e.ville,
      type: e.type,
      createdAt: e.createdAt,
      user: { email: e.user.email },
      _count: e._count,
    }))
  );
}

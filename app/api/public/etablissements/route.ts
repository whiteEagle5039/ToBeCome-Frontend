import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Catalogue public : les établissements actifs dont la page vitrine est
 * publiée (gérée depuis Espace établissement > Paramètres).
 */
export async function GET() {
  const etablissements = await prisma.etablissementProfile.findMany({
    where: { status: "ACTIVE", pagePublique: { isPublished: true } },
    orderBy: { createdAt: "desc" },
    include: { pagePublique: true, _count: { select: { eleveProfiles: true } } },
  });

  return NextResponse.json(
    etablissements.map((e) => ({
      id: e.id,
      nom: e.nom,
      type: e.type,
      ville: e.ville ?? "",
      image: e.logoUrl ?? undefined,
      siteUrl: `/etablissements/${e.slug}`,
      nbEleves: e._count.eleveProfiles,
    }))
  );
}

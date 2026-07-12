import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) {
    return NextResponse.json({ error: "Communauté introuvable" }, { status: 404 });
  }

  const classement = await prisma.communauteMembre.findMany({
    where: { communauteId: communaute.id },
    orderBy: { xpGuilde: "desc" },
    take: 50,
    include: { eleve: true },
  });

  return NextResponse.json({
    classement: classement.map((m, i) => ({
      rang: i + 1,
      eleveId: m.eleveId,
      prenom: m.eleve.prenom,
      nom: m.eleve.nom,
      xpGuilde: m.xpGuilde,
      role: m.role,
    })),
  });
}

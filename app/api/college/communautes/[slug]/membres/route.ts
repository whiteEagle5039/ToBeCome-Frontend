import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) {
    return NextResponse.json({ error: "Communauté introuvable" }, { status: 404 });
  }

  const membres = await prisma.communauteMembre.findMany({
    where: { communauteId: communaute.id },
    orderBy: [{ role: "asc" }, { joinedAt: "asc" }],
    include: { eleve: true },
  });

  return NextResponse.json({ membres });
}

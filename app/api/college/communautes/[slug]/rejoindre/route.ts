import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const eleve = await getCurrentEleve();
  if (!eleve) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) {
    return NextResponse.json({ error: "Communauté introuvable" }, { status: 404 });
  }

  if (communaute.estPrivee) {
    const { codeInvitation } = await req.json().catch(() => ({ codeInvitation: undefined }));
    if (codeInvitation !== communaute.codeInvitation) {
      return NextResponse.json({ error: "Code d'invitation incorrect." }, { status: 403 });
    }
  }

  const membre = await prisma.communauteMembre.upsert({
    where: { communauteId_eleveId: { communauteId: communaute.id, eleveId: eleve.id } },
    create: { communauteId: communaute.id, eleveId: eleve.id },
    update: {},
  });

  return NextResponse.json({ membre });
}

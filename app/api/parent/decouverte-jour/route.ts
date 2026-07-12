import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const decouverte = await prisma.decouverteJour.findFirst({
      where: { dateAffiche: { gte: startOfDay, lt: endOfDay } },
      include: { metier: true },
      orderBy: { dateAffiche: "desc" },
    });

    if (!decouverte) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json({
      saviez_vous: decouverte.saviez_vous,
      prenom: decouverte.prenom,
      nom: decouverte.nom,
      photoUrl: decouverte.photoUrl,
      metier: {
        nom: decouverte.metier.nom,
        slug: decouverte.metier.slug,
      },
    });
  } catch (err) {
    console.error("[decouverte-jour] Erreur:", err);
    return NextResponse.json(null, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
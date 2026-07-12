import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { creerSession } from "@/lib/auth";

/**
 * Connexion espace collège : matricule (ou email) + mot de passe.
 * Crée une session en base et pose le cookie httpOnly `tbc_session`.
 */
export async function POST(req: NextRequest) {
  const { identifiant, password } = await req.json();

  if (!identifiant || !password) {
    return NextResponse.json({ error: "Identifiant et mot de passe requis." }, { status: 400 });
  }

  let user = null;

  if (String(identifiant).includes("@")) {
    user = await prisma.user.findUnique({
      where: { email: String(identifiant).trim().toLowerCase() },
      include: { eleveProfile: true },
    });
  } else {
    const matricule = await prisma.matricule.findUnique({
      where: { code: String(identifiant).trim().toUpperCase() },
      include: { eleveProfile: { include: { user: { include: { eleveProfile: true } } } } },
    });
    user = matricule?.eleveProfile?.user ?? null;
  }

  if (!user || !user.eleveProfile) {
    return NextResponse.json({ error: "Matricule ou mot de passe incorrect." }, { status: 401 });
  }

  const passwordOk = await bcrypt.compare(password, user.password);
  if (!passwordOk) {
    return NextResponse.json({ error: "Matricule ou mot de passe incorrect." }, { status: 401 });
  }

  await creerSession(user.id);

  await prisma.eleveProfile.update({
    where: { id: user.eleveProfile.id },
    data: { derniereConnexion: new Date() },
  });

  return NextResponse.json({
    user: {
      id: user.id,
      prenom: user.eleveProfile.prenom,
      nom: user.eleveProfile.nom,
    },
  });
}

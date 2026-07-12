import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

function slugify(nom: string): string {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Demande d'inscription d'un établissement (depuis la landing).
 * Crée le compte en statut PENDING avec un mot de passe temporaire aléatoire
 * (non communiqué). Les identifiants réels sont générés et envoyés par
 * e-mail quand l'admin approuve la demande.
 */
export async function POST(req: Request) {
  const body = await req.json();

  if (!body.nomEtablissement || !body.ville || !body.email) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const email = String(body.email).trim().toLowerCase();

  const existant = await prisma.user.findUnique({ where: { email } });
  if (existant) {
    return NextResponse.json(
      { error: "Un compte existe déjà avec cet e-mail." },
      { status: 409 }
    );
  }

  // Mot de passe temporaire inutilisable : remplacé à l'approbation
  const motDePasseTemporaire = await bcrypt.hash(randomBytes(24).toString("hex"), 12);

  const baseSlug = slugify(body.nomEtablissement) || "etablissement";
  let slug = baseSlug;
  let n = 1;
  while (await prisma.etablissementProfile.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++n}`;
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: motDePasseTemporaire,
      role: "ETABLISSEMENT",
      etablissementProfile: {
        create: {
          nom: body.nomEtablissement,
          type: body.type || "collège",
          ville: body.ville,
          telephone: body.telephone || null,
          email,
          description: body.message || null,
          slug,
          status: "PENDING",
        },
      },
    },
    include: { etablissementProfile: true },
  });

  return NextResponse.json({ id: user.etablissementProfile!.id }, { status: 201 });
}

import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { envoyerMail } from "@/lib/server/mail";

function genererMotDePasse(): string {
  // Lisible et suffisamment fort pour une première connexion (à changer ensuite)
  return `Tbc-${randomBytes(4).toString("hex")}-${Math.floor(100 + Math.random() * 900)}`;
}

/**
 * Traitement d'une demande d'établissement par l'admin.
 * À l'approbation (status ACTIVE) : génération d'identifiants de connexion,
 * mise à jour du mot de passe et envoi automatique par e-mail. L'établissement
 * pourra changer son mot de passe après sa première connexion (Paramètres).
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  if (!status) {
    return NextResponse.json({ error: "Statut manquant" }, { status: 400 });
  }

  const etablissement = await prisma.etablissementProfile.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!etablissement) {
    return NextResponse.json({ error: "Établissement introuvable" }, { status: 404 });
  }

  await prisma.etablissementProfile.update({
    where: { id },
    data: { status },
  });

  // Approbation : identifiants générés + envoyés par e-mail
  if (status === "ACTIVE") {
    const motDePasse = genererMotDePasse();
    await prisma.user.update({
      where: { id: etablissement.userId },
      data: { password: await bcrypt.hash(motDePasse, 12) },
    });

    const email = etablissement.user.email ?? etablissement.email;
    let emailEnvoye = false;

    if (email) {
      emailEnvoye = await envoyerMail({
        to: email,
        subject: "To Be.Come — Votre compte établissement est approuvé",
        text: [
          `Bonjour ${etablissement.nom},`,
          "",
          "Votre demande d'inscription sur To Be.Come a été approuvée.",
          "Voici vos identifiants de connexion :",
          "",
          `E-mail : ${email}`,
          `Mot de passe : ${motDePasse}`,
          "",
          "Connectez-vous sur la page « Établissement » puis changez votre mot de passe depuis les Paramètres après votre première connexion.",
          "",
          "L'équipe To Be.Come",
        ].join("\n"),
      });
    }

    // Si le SMTP n'est pas configuré, les identifiants sont retournés à
    // l'admin pour transmission manuelle — la demande n'est jamais bloquée.
    return NextResponse.json({
      ok: true,
      emailEnvoye,
      identifiants: emailEnvoye ? undefined : { email, motDePasse },
    });
  }

  return NextResponse.json({ ok: true });
}

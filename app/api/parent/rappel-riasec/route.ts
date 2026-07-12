import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { childId, channel } = await req.json();

    if (!childId || typeof childId !== "string") {
      return NextResponse.json({ error: "childId manquant" }, { status: 400 });
    }

    // TODO : remplacez ceci par la récupération du parent connecté
    // (session / JWT) selon votre middleware d'auth existant — ici on
    // suppose que le parent qui appelle cette route est bien lié à
    // l'enfant, à vérifier côté serveur avant d'envoyer quoi que ce soit.
    const eleve = await prisma.eleveProfile.findUnique({
      where: { id: childId },
      include: {
        parentsLies: { include: { parent: { include: { user: true } } } },
      },
    });

    if (!eleve) {
      return NextResponse.json({ error: "Enfant introuvable" }, { status: 404 });
    }

    const parentLink = eleve.parentsLies[0];
    const parentEmail = parentLink?.parent.user.email;

    if (channel === "email") {
      const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SUGGESTIONS_FROM_EMAIL } = process.env;
      if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !parentEmail) {
        return NextResponse.json({ error: "Configuration email manquante" }, { status: 500 });
      }

      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
      });

      await transporter.sendMail({
        from: `"To be.come" <${SUGGESTIONS_FROM_EMAIL || SMTP_USER}>`,
        to: parentEmail,
        subject: `Petit rappel pour ${eleve.prenom}`,
        html: `
          <div style="font-family: sans-serif; font-size: 14px; color: #1f2937;">
            <p>Bonjour,</p>
            <p>${eleve.prenom} n'a pas encore complété son test RIASEC sur To be.come.</p>
            <p>N'hésitez pas à lui rappeler d'y jeter un œil quand il/elle a un moment 🙂</p>
          </div>
        `,
      });

      return NextResponse.json({ ok: true, channel: "email" });
    }

    if (channel === "whatsapp") {
      // TODO : brancher un fournisseur WhatsApp (ex: Twilio, Meta Cloud API).
      // Pour l'instant on journalise seulement pour ne pas bloquer le flux.
      console.log(`[rappel-riasec] WhatsApp non branché — rappel prévu pour ${eleve.prenom} (${childId})`);
      return NextResponse.json({ ok: true, channel: "whatsapp", note: "Envoi WhatsApp pas encore branché" });
    }

    return NextResponse.json({ error: "Canal inconnu" }, { status: 400 });
  } catch (err) {
    console.error("[rappel-riasec] Erreur:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
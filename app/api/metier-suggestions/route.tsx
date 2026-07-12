import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { title, message } = await req.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Titre manquant" }, { status: 400 });
    }

    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASSWORD,
      SUGGESTIONS_TEAM_EMAIL,
      SUGGESTIONS_FROM_EMAIL,
    } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SUGGESTIONS_TEAM_EMAIL) {
      console.error("[metier-suggestion] Variables SMTP manquantes dans .env.local");
      return NextResponse.json({ error: "Configuration email manquante" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true pour le port 465, false pour 587/25
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });

    const safeTitle = escapeHtml(title.trim());
    const safeMessage = message ? escapeHtml(String(message).trim()) : "";

    await transporter.sendMail({
      from: `"To be.come" <${SUGGESTIONS_FROM_EMAIL || SMTP_USER}>`,
      to: SUGGESTIONS_TEAM_EMAIL,
      subject: `Nouvelle suggestion de métier : ${title.trim()}`,
      html: `
        <div style="font-family: sans-serif; font-size: 14px; color: #1f2937;">
          <h2 style="margin-bottom: 8px;">Nouvelle suggestion de métier</h2>
          <p><strong>Métier proposé :</strong> ${safeTitle}</p>
          ${safeMessage ? `<p><strong>Message du parent :</strong><br />${safeMessage}</p>` : ""}
          <p style="margin-top: 16px; color: #6b7280; font-size: 12px;">
            Envoyé automatiquement depuis l'espace parent To be.come.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[metier-suggestion] Erreur envoi SMTP:", err);
    return NextResponse.json({ error: "Échec de l'envoi" }, { status: 500 });
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
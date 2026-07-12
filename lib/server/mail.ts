import nodemailer from "nodemailer";

/**
 * Envoi d'e-mails côté Next.js (SMTP configuré dans .env.local :
 * SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM).
 * Retourne false (sans lever d'erreur) si le SMTP n'est pas configuré ou
 * si l'envoi échoue — l'appelant décide du comportement de repli.
 */
export async function envoyerMail(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    console.warn("SMTP non configuré — e-mail non envoyé :", options.subject);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 587),
      secure: Number(SMTP_PORT ?? 587) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });

    await transporter.sendMail({
      from: EMAIL_FROM ?? SMTP_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    return true;
  } catch (err) {
    console.error("Échec d'envoi d'e-mail :", err);
    return false;
  }
}

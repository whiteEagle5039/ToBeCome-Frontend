// app/api/suggest-metier/route.ts
import { NextResponse } from "next/server";

// Ce endpoint reçoit les suggestions de métiers manquants envoyées
// depuis le formulaire de recherche (components/metiers/metier-search.tsx).
//
// Pour l'instant il se contente de logger la suggestion côté serveur.
// À toi de brancher une vraie destination, par exemple :
//   - écrire dans une base de données (Postgres, Supabase, etc.)
//   - envoyer un email (Resend, Nodemailer...)
//   - notifier un webhook Slack / Discord
//   - ajouter une ligne dans une Google Sheet via son API
//
// Exemple avec Resend (à décommenter et adapter) :
//
// import { Resend } from "resend";
// const resend = new Resend(process.env.RESEND_API_KEY);
// await resend.emails.send({
//   from: "suggestions@tondomaine.com",
//   to: "toi@tondomaine.com",
//   subject: `Nouveau métier suggéré : ${titre}`,
//   text: description,
// });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const titre = typeof body?.titre === "string" ? body.titre.trim() : "";
    const description =
      typeof body?.description === "string" ? body.description.trim() : "";

    if (!titre) {
      return NextResponse.json(
        { error: "Le titre du métier est requis." },
        { status: 400 }
      );
    }

    // TODO: remplace ce console.log par un vrai enregistrement (DB, email, etc.)
    console.log("[suggest-metier] Nouvelle suggestion:", {
      titre,
      description,
      date: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Requête invalide." },
      { status: 400 }
    );
  }
}
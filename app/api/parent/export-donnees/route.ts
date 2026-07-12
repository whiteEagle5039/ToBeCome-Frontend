import { NextResponse } from "next/server";

export async function POST() {
  // TODO : brancher la vraie génération d'export (JSON/PDF récapitulatif
  // des données du parent + de ses enfants liés) et l'envoi par email,
  // en s'appuyant sur le parent identifié via la session/JWT en cours.
  console.log("[export-donnees] Demande d'export reçue — génération à implémenter.");
  return NextResponse.json({ ok: true });
}
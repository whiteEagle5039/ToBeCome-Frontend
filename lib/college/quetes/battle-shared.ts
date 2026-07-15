/** Utilitaires partagés entre les routes API Battle (créer/rejoindre/terminer). */

export function nomParticipant(p: {
  eleve: { prenom: string; nom: string } | null;
  guestNom: string | null;
}) {
  return p.eleve ? `${p.eleve.prenom} ${p.eleve.nom}`.trim() : p.guestNom ?? "Invité";
}

export function capaciteMax(type: "DUEL" | "BATTLE_ROYALE") {
  return type === "DUEL" ? 2 : 5;
}

/**
 * Identité de siège Battle côté navigateur : persistée en localStorage pour
 * survivre à un rafraîchissement, que le siège soit un élève connecté ou un
 * invité sans compte (tous deux reçoivent un participantId + guestToken à la
 * création/adhésion du salon).
 */

export type SiegeBattle = {
  sessionId: string;
  participantId: string;
  guestToken: string;
  nom: string;
};

const PREFIXE = "tbc_battle_siege_";

export function sauvegarderSiege(siege: SiegeBattle) {
  try {
    localStorage.setItem(PREFIXE + siege.sessionId, JSON.stringify(siege));
  } catch {
    // localStorage indisponible (navigation privée stricte, etc.) — tant pis
  }
}

export function chargerSiege(sessionId: string): SiegeBattle | null {
  try {
    const brut = localStorage.getItem(PREFIXE + sessionId);
    return brut ? (JSON.parse(brut) as SiegeBattle) : null;
  } catch {
    return null;
  }
}

export function effacerSiege(sessionId: string) {
  try {
    localStorage.removeItem(PREFIXE + sessionId);
  } catch {
    // rien à faire
  }
}

const ANIMAUX = ["Panda", "Lynx", "Faucon", "Renard", "Loutre", "Tigre", "Corbeau", "Dauphin", "Aigle", "Lion"];
const ADJECTIFS = ["Curieux", "Rapide", "Malin", "Audacieux", "Discret", "Vif", "Créatif", "Solide", "Agile", "Futé"];

export function genererPseudoAleatoire(): string {
  const animal = ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)];
  const adjectif = ADJECTIFS[Math.floor(Math.random() * ADJECTIFS.length)];
  const numero = Math.floor(Math.random() * 90 + 10);
  return `${animal} ${adjectif} ${numero}`;
}

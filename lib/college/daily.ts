// lib/college/daily.ts
// Rotation automatique « toutes les 24 h » : renvoie toujours le MÊME item
// pour une journée donnée, puis change tout seul le lendemain.
// Aucune interaction requise — c'est le numéro du jour qui pilote l'index.

export function jourIndex(date: Date = new Date()): number {
  // nombre de jours écoulés depuis l'epoch (change à minuit local)
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(local.getTime() / 86_400_000);
}

// Choisit l'élément du jour dans un tableau (rotation cyclique).
export function itemDuJour<T>(liste: T[], offset = 0): T {
  if (liste.length === 0) throw new Error("Liste vide pour itemDuJour");
  return liste[(jourIndex() + offset) % liste.length];
}

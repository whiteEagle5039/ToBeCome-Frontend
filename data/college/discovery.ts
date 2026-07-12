/**
 * 📍 SECTION "DÉCOUVERTE DU JOUR" 📍
 * -------------------------------------------------
 * Utilisé par : components/college/DiscoveryCarousel.tsx sur l'Accueil.
 *
 * Deux listes de contenus. Chaque jour (toutes les 24h), on affiche
 * UN "Le saviez-vous ?" et UN "Métier du jour", choisis automatiquement
 * dans ces listes — pas besoin de les changer à la main tous les jours,
 * ajoute juste du contenu ici et la rotation se fait toute seule.
 */

export type LeSaviezVous = {
  id: string;
  emoji: string;
  texte: string;
};

export type MetierDuJour = {
  id: string;
  metierSlug: string; // doit exister dans metiers.ts
  nom: string;
  image: string;      // 👉 mets ton image ici
  descriptionCourte: string;
};

export const leSaviezVousList: LeSaviezVous[] = [
  {
    id: "lsv-001",
    emoji: "💡",
    texte: "Un développeur web peut travailler depuis n'importe quel pays du monde.",
  },
  {
    id: "lsv-002",
    emoji: "🌍",
    texte: "Plus de 80% des métiers de demain nécessiteront des compétences numériques.",
  },
  {
    id: "lsv-003",
    emoji: "🤝",
    texte:
      "Les développeurs web travaillent souvent en équipe avec des designers et des spécialistes UX.",
  },
  // 👉 Ajoute autant de faits que tu veux, ils tournent automatiquement.
];

export const metierDuJourList: MetierDuJour[] = [
  {
    id: "mdj-001",
    metierSlug: "developpeur-web",
    nom: "Développeur web",
    image: "",
    descriptionCourte: "Il construit les sites et applications que tu utilises chaque jour.",
  },
  {
    id: "mdj-002",
    metierSlug: "medecin",
    nom: "Médecin",
    image: "",
    descriptionCourte: "Il examine, soigne et accompagne ses patients au quotidien.",
  },
  // 👉 Ajoute d'autres métiers du jour ici.
];

/**
 * Choisit un élément "du jour" de façon stable : le même élément est
 * renvoyé toute la journée, et change automatiquement à minuit,
 * en tournant dans la liste (jour 1 → item 0, jour 2 → item 1, etc.)
 */
function pickForToday<T>(list: T[]): T | null {
  if (list.length === 0) return null;
  const dayNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const index = dayNumber % list.length;
  return list[index];
}

export function getTodayLeSaviezVous(): LeSaviezVous | null {
  return pickForToday(leSaviezVousList);
}

export function getTodayMetierDuJour(): MetierDuJour | null {
  return pickForToday(metierDuJourList);
}

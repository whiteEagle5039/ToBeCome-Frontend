/**
 * 📍 SECTION "DÉCOUVERTE DU JOUR" 📍
 * -------------------------------------------------
 * Utilisé par : components/college/DiscoveryCarousel.tsx sur l'Accueil.
 *
 * Deux listes de contenus. Chaque jour (toutes les 24h), on affiche
 * UN "Le saviez-vous ?" et UNE "Personnalité du jour", choisis
 * automatiquement dans ces listes — pas besoin de les changer à la main
 * tous les jours, ajoute juste du contenu ici et la rotation se fait
 * toute seule.
 */

import type { Matiere } from "@/data/college/metiers";

export type LeSaviezVous = {
  id: string;
  emoji: string;
  texte: string;
};

export type PersonnaliteDuJour = {
  id: string;
  prenom: string;
  nom: string;
  photo: string;    // 👉 mets la photo ici
  metier: string;   // métier exercé par la personnalité
  matiere: Matiere; // matière scolaire associée (doit exister dans metiers.ts)
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

export const personnaliteDuJourList: PersonnaliteDuJour[] = [
  {
    id: "pdj-001",
    prenom: "Thomas",
    nom: "Pesquet",
    photo: "",
    metier: "Astronaute",
    matiere: "physique-chimie",
    descriptionCourte:
      "Ingénieur devenu astronaute, il a piloté la Station spatiale internationale et réalisé plusieurs sorties dans l'espace.",
  },
  {
    id: "pdj-002",
    prenom: "Cédric",
    nom: "Villani",
    photo: "",
    metier: "Mathématicien",
    matiere: "mathematiques",
    descriptionCourte:
      "Chercheur en mathématiques, lauréat de la médaille Fields pour ses travaux sur la physique statistique.",
  },
  {
    id: "pdj-003",
    prenom: "Malala",
    nom: "Yousafzai",
    photo: "",
    metier: "Militante pour l'éducation",
    matiere: "anglais",
    descriptionCourte:
      "Militante pakistanaise pour le droit des filles à l'éducation, la plus jeune lauréate du prix Nobel de la paix.",
  },
  {
    id: "pdj-004",
    prenom: "Teddy",
    nom: "Riner",
    photo: "",
    metier: "Judoka professionnel",
    matiere: "eps",
    descriptionCourte:
      "Champion olympique et multiple champion du monde de judo, considéré comme l'un des plus grands judokas de l'histoire.",
  },
  // 👉 Ajoute d'autres personnalités du jour ici.
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

export function getTodayPersonnaliteDuJour(): PersonnaliteDuJour | null {
  return pickForToday(personnaliteDuJourList);
}

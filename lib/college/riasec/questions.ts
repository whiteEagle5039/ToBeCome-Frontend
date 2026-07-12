/**
 * Types partagés du questionnaire RIASEC.
 * Le contenu (blocs, questions, options, pondérations) vit en base de
 * données — voir backend/prisma/data/riasec.ts pour la source du seed.
 */

export type RiasecLetter = "R" | "I" | "A" | "S" | "E" | "C";

export const RIASEC_ORDER: RiasecLetter[] = ["R", "I", "A", "S", "E", "C"];

export type QuestionRiasecClient = {
  id: string;
  ordre: number;
  type: "SCENARIO" | "ECHELLE";
  intitule: string;
  bloc: { numero: number; titre: string; couleur: string };
  options: { id: string; texte: string }[];
};

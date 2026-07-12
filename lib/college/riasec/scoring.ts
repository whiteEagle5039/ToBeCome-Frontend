import { RIASEC_ORDER, type RiasecLetter } from "./questions";

/**
 * Moteur de scoring RIASEC à 3 étages :
 *   1. scores bruts pondérés, normalisés 0-100 par dimension
 *      (le maximum atteignable est calculé dynamiquement depuis les
 *      questions en base — aucune constante à recalibrer à la main)
 *   2. code Holland à 3 lettres (partageable)
 *   3. archétype dominant + type de profil (dominant / hybride / polyvalent)
 * Plus un contrôle de cohérence entre les blocs compétences et identité.
 */

export type Poids = Partial<Record<RiasecLetter, number>>;

export type QuestionPourScoring = {
  id: string;
  type: "SCENARIO" | "ECHELLE";
  dimension: string | null;
  blocNumero: number;
  options: { id: string; poids: Poids }[];
};

export type ReponseInput = { questionId: string; optionId: string };

export type RiasecScores = Record<RiasecLetter, number>;

export type ProfilCalcule = {
  scores: RiasecScores; // normalisés 0-100
  ranking: RiasecLetter[]; // 6 lettres, de la plus forte à la plus faible
  hollandCode: string; // 3 premières lettres, ex "IAC"
  dominant: RiasecLetter;
  secondary: RiasecLetter;
  ecart: number; // écart de score entre dominant et secondaire
  profilType: "dominant" | "hybride" | "polyvalent";
  fiabilite: number; // 0-100, cohérence blocs compétences (4) vs identité (5)
};

export function computeProfile(
  questions: QuestionPourScoring[],
  reponses: ReponseInput[]
): ProfilCalcule {
  const parQuestion = new Map(questions.map((q) => [q.id, q]));

  // Étage 1 — scores bruts
  const bruts: Record<RiasecLetter, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  // Pour la fiabilité : points par dimension dans les blocs 4 et 5
  const bloc4: Partial<Record<RiasecLetter, number>> = {};
  const bloc5: Partial<Record<RiasecLetter, number>> = {};

  for (const r of reponses) {
    const q = parQuestion.get(r.questionId);
    if (!q) continue;
    const option = q.options.find((o) => o.id === r.optionId);
    if (!option) continue;

    for (const [lettre, points] of Object.entries(option.poids) as [RiasecLetter, number][]) {
      bruts[lettre] += points;
      if (q.type === "ECHELLE" && q.dimension === lettre) {
        if (q.blocNumero === 4) bloc4[lettre] = points;
        if (q.blocNumero === 5) bloc5[lettre] = points;
      }
    }
  }

  // Maximum atteignable par dimension, calculé depuis les questions elles-mêmes
  const maxima: Record<RiasecLetter, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (const q of questions) {
    for (const lettre of RIASEC_ORDER) {
      let maxOption = 0;
      for (const o of q.options) {
        maxOption = Math.max(maxOption, o.poids[lettre] ?? 0);
      }
      maxima[lettre] += maxOption;
    }
  }

  const scores = {} as RiasecScores;
  for (const lettre of RIASEC_ORDER) {
    scores[lettre] =
      maxima[lettre] > 0 ? Math.min(100, Math.round((bruts[lettre] / maxima[lettre]) * 100)) : 0;
  }

  // Étage 2 — classement et code Holland
  const ranking = RIASEC_ORDER.slice().sort((a, b) => scores[b] - scores[a]);
  const hollandCode = ranking.slice(0, 3).join("");

  // Étage 3 — type de profil
  const ecart = scores[ranking[0]] - scores[ranking[1]];
  const profilType = ecart >= 18 ? "dominant" : ecart >= 8 ? "hybride" : "polyvalent";

  // Contrôle de cohérence (blocs miroir 4 ↔ 5, échelle 0-3)
  let diffTotale = 0;
  let nbPaires = 0;
  for (const lettre of RIASEC_ORDER) {
    if (bloc4[lettre] !== undefined && bloc5[lettre] !== undefined) {
      diffTotale += Math.abs((bloc4[lettre] ?? 0) - (bloc5[lettre] ?? 0));
      nbPaires += 1;
    }
  }
  const fiabilite =
    nbPaires > 0 ? Math.round(100 - (diffTotale / (nbPaires * 3)) * 100) : 100;

  return {
    scores,
    ranking,
    hollandCode,
    dominant: ranking[0],
    secondary: ranking[1],
    ecart,
    profilType,
    fiabilite,
  };
}

/** Libellés des 6 dimensions (l'archétype complet vit en base : ArchetypeRiasec). */
export const RIASEC_LABELS: Record<RiasecLetter, { label: string; description: string }> = {
  R: { label: "Réaliste", description: "Concret, technique, aime fabriquer et réparer." },
  I: { label: "Investigateur", description: "Analytique, curieux, aime comprendre et résoudre des problèmes." },
  A: { label: "Artistique", description: "Créatif, sensible, aime imaginer et concevoir." },
  S: { label: "Social", description: "À l'écoute, aime aider, expliquer et coopérer." },
  E: { label: "Entreprenant", description: "Meneur, persuasif, aime organiser et convaincre." },
  C: { label: "Conventionnel", description: "Méthodique, rigoureux, aime structurer et organiser." },
};

/** Message dédié aux profils plats — valorisant, jamais une erreur. */
export const PROFIL_POLYVALENT_MESSAGE =
  "Ton profil est équilibré : tu es un vrai touche-à-tout. Plusieurs univers te correspondent — explore-les librement, c'est une force.";

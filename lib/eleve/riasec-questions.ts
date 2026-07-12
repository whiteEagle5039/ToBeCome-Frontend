import type { RiasecType } from "@/lib/parent/types"

export interface RiasecQuestion {
  id: number
  text: string
  type: RiasecType
}

/** Questionnaire RIASEC progressif — 18 items (3 par dimension Holland) */
export const RIASEC_QUESTIONS: RiasecQuestion[] = [
  { id: 1, text: "J'aime réparer des objets ou bricoler avec mes mains.", type: "R" },
  { id: 2, text: "Je préfère travailler dehors plutôt qu'au bureau.", type: "R" },
  { id: 3, text: "Utiliser des outils ou des machines m'attire.", type: "R" },
  { id: 4, text: "J'aime comprendre comment les choses fonctionnent.", type: "I" },
  { id: 5, text: "Résoudre des énigmes ou des problèmes complexes me plaît.", type: "I" },
  { id: 6, text: "Lire des articles scientifiques ou faire des recherches m'intéresse.", type: "I" },
  { id: 7, text: "Dessiner, écrire ou créer quelque chose d'original me passionne.", type: "A" },
  { id: 8, text: "J'exprime mes idées de façon créative (musique, art, design…).", type: "A" },
  { id: 9, text: "Je n'aime pas les tâches trop répétitives et prévisibles.", type: "A" },
  { id: 10, text: "Aider les autres et les écouter me rend heureux/se.", type: "S" },
  { id: 11, text: "Travailler en équipe et en contact avec les gens me convient.", type: "S" },
  { id: 12, text: "Enseigner ou former quelqu'un me motive.", type: "S" },
  { id: 13, text: "Prendre des décisions et diriger un projet m'attire.", type: "E" },
  { id: 14, text: "Convaincre les autres ou vendre une idée me plaît.", type: "E" },
  { id: 15, text: "Je me vois créer ma propre entreprise un jour.", type: "E" },
  { id: 16, text: "Organiser, classer et suivre des dossiers me convient.", type: "C" },
  { id: 17, text: "Respecter des règles et des procédures me rassure.", type: "C" },
  { id: 18, text: "Travailler avec des chiffres et des tableaux ne me dérange pas.", type: "C" },
]

export const RIASEC_LABELS: Record<RiasecType, string> = {
  R: "Réaliste",
  I: "Investigateur",
  A: "Artistique",
  S: "Social",
  E: "Entreprenant",
  C: "Conventionnel",
}

export const LIKERT_OPTIONS = [
  { value: 1, label: "Pas du tout" },
  { value: 2, label: "Un peu" },
  { value: 3, label: "Moyennement" },
  { value: 4, label: "Beaucoup" },
  { value: 5, label: "Totalement" },
]

export function computeRiasecScores(answers: Record<number, number>) {
  const totals: Record<RiasecType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  const counts: Record<RiasecType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }

  for (const q of RIASEC_QUESTIONS) {
    const val = answers[q.id]
    if (val) {
      totals[q.type] += val
      counts[q.type] += 1
    }
  }

  const scores = (Object.keys(totals) as RiasecType[]).map((type) => ({
    type,
    label: RIASEC_LABELS[type],
    score: counts[type] ? Math.round((totals[type] / (counts[type] * 5)) * 100) : 0,
  }))

  const sorted = [...scores].sort((a, b) => b.score - a.score)
  const dominant = sorted.slice(0, 3).map((s) => s.type)

  return { scores, dominant }
}

/** Utilitaires partagés des sessions Battle. */

export type QuestionBattle = {
  question: string;
  choix: string[];
  bonneReponseIndex: number;
};

export const NB_QUESTIONS_BATTLE = 10;
export const SECONDES_PAR_QUESTION = 15;

export function tirerQuestions(
  banque: QuestionBattle[],
  nb = NB_QUESTIONS_BATTLE
): QuestionBattle[] {
  return banque
    .map((q) => ({ q, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .slice(0, nb)
    .map(({ q }) => ({
      question: q.question,
      choix: q.choix,
      bonneReponseIndex: q.bonneReponseIndex,
    }));
}

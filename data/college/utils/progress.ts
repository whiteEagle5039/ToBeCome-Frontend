/**
 * Couleur de la barre de progression selon le pourcentage :
 * - 0–33 %  : rouge (démarrage)
 * - 34–66 % : orange (en cours)
 * - 67–100 %: teal (presque terminé)
 * (voir les variables du thème dans app/college/college-theme.css)
 */
export function getProgressColor(pourcent: number): string {
  if (pourcent <= 33) return "var(--college-red-500)";
  if (pourcent <= 66) return "var(--college-orange-500)";
  return "var(--college-green-600)";
}

import Link from "next/link";
import { MessagesSquare } from "lucide-react";

/**
 * Bouton flottant d'accès aux Communautés (une par matière).
 * Affiché sur l'accueil de l'espace collège, au-dessus de la barre de
 * navigation basse.
 */
export default function CommunautesFlottant() {
  return (
    <Link
      href="/college/communautes"
      aria-label="Ouvrir les communautés"
      className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full px-4 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105"
      style={{ background: "#0F766E", boxShadow: "0 8px 30px rgba(15, 118, 110, 0.35)" }}
    >
      <MessagesSquare className="h-5 w-5" />
      <span className="text-sm">Communautés</span>
    </Link>
  );
}

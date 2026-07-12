// components/metiers/metier-card.tsx
"use client";

import { ArrowRight } from "lucide-react";
import type { Domaine, Metier } from "@/lib/metiers-data";

/**
 * Métier affiché comme un bouton-carte : tuile centrée, sobre, qui passe
 * aux couleurs de la marque au survol. Le clic ouvre la fiche complète.
 */
export function MetierCard({
  metier,
  domaine,
  onSelect,
}: {
  metier: Metier;
  domaine?: Domaine;
  onSelect: (metier: Metier) => void;
}) {
  const Icon = domaine?.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(metier)}
      className="group flex flex-col items-center gap-2.5 rounded-2xl border-2 border-[#0F766E]/15 bg-white px-4 py-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-[#0F766E] hover:bg-[#0F766E] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCB05]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DFF6F3] text-[#0F766E] transition-colors group-hover:bg-[#FFCB05]">
        {Icon ? <Icon className="h-6 w-6" /> : <ArrowRight className="h-6 w-6" />}
      </span>

      <span className="text-base font-bold leading-snug text-neutral-900 transition-colors group-hover:text-white">
        {metier.titre}
      </span>

      {domaine && (
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#0F766E] transition-colors group-hover:text-[#FFCB05]">
          {domaine.nom}
        </span>
      )}

      <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#0F766E] px-4 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-[#FFCB05] group-hover:text-neutral-900">
        Voir la fiche
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}

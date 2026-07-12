// components/metiers/domain-card.tsx
"use client";

import { getMetiersByDomaine, type Domaine } from "@/lib/metiers-data";

export function DomainCard({
  domaine,
  metierCount,
  onSelect,
}: {
  domaine: Domaine;
  metierCount?: number;
  onSelect: (id: string) => void;
}) {
  const Icon = domaine.icon;
  const count = metierCount ?? getMetiersByDomaine(domaine.id).length;
  const gradId = `folder-grad-${domaine.id}`;

  return (
    <button
      type="button"
      onClick={() => onSelect(domaine.id)}
      className="group relative block w-full text-left focus-visible:outline-none"
    >
      <div className="relative aspect-[6/5] w-full drop-shadow-md transition-transform duration-300 group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5">
        {/* Fiches "rangées dans" le dossier : positionnées derrière, elles ne
            dépassent que par le haut, le reste est masqué par la silhouette
            du dossier dessinée par-dessus juste après. */}
        <div className="absolute -top-[9%] left-[9%] z-0 h-[32%] w-[44%]">
          <div className="absolute inset-x-2 top-2 h-full rotate-[-4deg] rounded-md bg-white/35" />
          <div className="absolute inset-x-1 top-1 h-full rotate-[3deg] rounded-md bg-white/65" />
          <div className="absolute inset-0 rounded-md bg-white shadow-sm" />
        </div>

        {/* Forme "dossier" en SVG : dégradé + silhouette avec onglet, par-dessus les fiches */}
        <svg
          viewBox="0 0 336 280"
          preserveAspectRatio="none"
          className="absolute inset-0 z-10 h-full w-full"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={domaine.gradFrom} />
              <stop offset="100%" stopColor={domaine.gradTo} />
            </linearGradient>
            <linearGradient id={`${gradId}-gloss`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M20 0 L150 0 Q174 0 178 20 Q182 40 206 44 L310 44 Q336 44 336 70
               L336 254 Q336 280 310 280 L26 280 Q0 280 0 254
               L0 20 Q0 0 20 0 Z"
            fill={`url(#${gradId})`}
          />
          <path
            d="M20 0 L150 0 Q174 0 178 20 Q182 40 206 44 L310 44 Q336 44 336 70
               L336 254 Q336 280 310 280 L26 280 Q0 280 0 254
               L0 20 Q0 0 20 0 Z"
            fill={`url(#${gradId}-gloss)`}
          />
        </svg>

        {/* Icône du domaine, en haut à droite */}
        <div className="absolute right-[6%] top-[18%] z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-sm">
          <Icon className="h-4 w-4" />
        </div>

        {/* Titre + sous-titre, ancrés dans la partie basse du dossier */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-[8%] pb-[9%] pt-[42%]">
          <h3 className="text-lg font-semibold text-white drop-shadow-sm">
            {domaine.nom}
          </h3>
          <p className="mt-1 text-sm text-white/85">
            {count} métier{count > 1 ? "s" : ""}
          </p>
          <p className="mt-4 text-xs text-white/70">{domaine.description}</p>
        </div>
      </div>
    </button>
  );
}
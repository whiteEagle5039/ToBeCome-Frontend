// components/etablissements/etablissement-card.tsx
"use client";

import { ArrowUpRight } from "lucide-react";
import { getInitials, type Etablissement } from "@/lib/etablissements-data";

export function EtablissementCard({
  etablissement,
}: {
  etablissement: Etablissement;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[28px] bg-white p-3 shadow-[0_1px_2px_rgba(15,118,110,0.08)] ring-1 ring-[#0F766E]/8 transition-shadow hover:shadow-[0_12px_28px_-14px_rgba(15,118,110,0.35)]">
      {/* En-tête */}
      <div className="px-2 pt-1">
        <h3 className="text-lg font-semibold leading-snug text-[#0F172A]">
          {etablissement.nom}
        </h3>
        <p className="text-sm text-[#0F172A]/50">{etablissement.type}</p>
      </div>

      {/* Visuel */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-[#0F766E]">
        {etablissement.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={etablissement.image}
            alt={etablissement.nom}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0F766E] to-[#0b5b55]">
            <span className="font-serif text-4xl font-semibold text-[#FFCB05]">
              {getInitials(etablissement.nom)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />

        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
          <span className="text-xl font-semibold text-white">
            {etablissement.ville}
          </span>
          <a
            href={etablissement.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visiter le site de ${etablissement.nom}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0F766E] transition-transform hover:scale-105 active:scale-95"
          >
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
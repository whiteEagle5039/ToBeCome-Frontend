"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getIcon } from "@/lib/parent/icons";

export interface CarouselDomain {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

interface DomainCarouselProps {
  domains: CarouselDomain[];
  countBySlug: Record<string, number>;
  onSelect: (slug: string) => void;
}

/**
 * Empile les domaines comme des fiches de musée : une carte centrale
 * bien visible, des cartes voisines réduites et estompées de part et
 * d'autre. Cliquer sur une carte latérale fait glisser le focus vers
 * elle ; cliquer sur la carte centrale ouvre la liste des métiers.
 */
export function DomainCarousel({ domains, countBySlug, onSelect }: DomainCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = domains.length;

  // Si la liste filtrée change (recherche), on recadre l'index.
  useEffect(() => {
    if (index >= total) setIndex(0);
  }, [total, index]);

  if (!total) return null;

  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);
  const current = domains[index];
  const CurrentIcon = getIcon(current.icon);

  return (
    <div className="mx-auto w-full max-w-xl select-none">
      {/* Scène : pile de cartes */}
      <div className="relative flex h-[400px] items-center justify-center [perspective:1200px]">
        {domains.map((d, i) => {
          const offset = signedOffset(i, index, total);
          if (Math.abs(offset) > 2) return null;

          const isActive = offset === 0;
          const Icon = getIcon(d.icon);
          const count = countBySlug[d.slug] ?? 0;

          return (
            <button
              key={d.slug}
              type="button"
              onClick={() => (isActive ? onSelect(d.slug) : setIndex(i))}
              aria-label={isActive ? `Voir les métiers de ${d.name}` : `Afficher le domaine ${d.name}`}
              style={{
                transform: `translateX(${offset * 148}px) translateY(${Math.abs(offset) * 14}px) scale(${
                  1 - Math.abs(offset) * 0.16
                })`,
                zIndex: 10 - Math.abs(offset),
                opacity: 1 - Math.abs(offset) * 0.32,
              }}
              className={`focus-ring absolute top-1/2 w-[270px] -translate-y-1/2 overflow-hidden rounded-[28px] border border-line bg-white text-left shadow-xl transition-all duration-500 ease-out ${
                isActive ? "h-[360px] cursor-pointer" : "h-[320px] cursor-pointer"
              }`}
            >
              <div className="flex h-full flex-col justify-between bg-gradient-to-br from-teal-50 to-white p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-teal-950">{d.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate">{d.description}</p>
                  <p className="mt-3 text-xs font-medium text-teal-700">{count} métier{count > 1 ? "s" : ""}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Barre de navigation façon "auteur" */}
      <div className="mx-auto mt-5 flex max-w-sm items-center justify-between gap-3 rounded-full border border-line bg-white/90 px-3 py-2.5 shadow-sm backdrop-blur">
        <button
          type="button"
          onClick={() => go(-1)}
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-teal-700 hover:bg-teal-50"
          aria-label="Domaine précédent"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          onClick={() => onSelect(current.slug)}
          className="focus-ring flex flex-1 items-center gap-2.5 rounded-full px-1 py-1 text-left hover:bg-teal-50/60"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-teal-700">
            <CurrentIcon size={16} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-teal-950">{current.name}</span>
            <span className="block text-xs text-slate">{countBySlug[current.slug] ?? 0} métiers</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => go(1)}
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-teal-700 hover:bg-teal-50"
          aria-label="Domaine suivant"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Points de pagination */}
      <div className="mt-3 flex justify-center gap-1.5">
        {domains.map((d, i) => (
          <button
            key={d.slug}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Aller au domaine ${d.name}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-teal-700" : "w-1.5 bg-line"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/** Distance signée la plus courte entre i et index sur un cercle de `total` éléments. */
function signedOffset(i: number, index: number, total: number) {
  let diff = i - index;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}
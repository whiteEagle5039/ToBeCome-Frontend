"use client";

import { useEffect, useRef, useState } from "react";
import { getTodayLeSaviezVous, getTodayPersonnaliteDuJour } from "@/data/college/discovery";
import { matieresList } from "@/data/college/metiers";

/**
 * Carrousel horizontal AUTOMATIQUE : il avance tout seul même sans
 * interaction au doigt, et boucle en continu entre les 2 cartes du jour
 * (Le saviez-vous ? / Personnalité du jour), renouvelées toutes les 24h
 * (voir data/college/discovery.ts pour la logique de rotation).
 */
export default function DiscoveryCarousel() {
  const leSaviezVous = getTodayLeSaviezVous();
  const personnaliteDuJour = getTodayPersonnaliteDuJour();
  const [index, setIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const slides = [
    leSaviezVous && { type: "saviez-vous" as const, data: leSaviezVous },
    personnaliteDuJour && { type: "personnalite-jour" as const, data: personnaliteDuJour },
  ].filter(Boolean) as { type: "saviez-vous" | "personnalite-jour"; data: any }[];

  // Auto-scroll : avance toutes les 4 secondes, boucle indéfiniment
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, [index]);

  if (slides.length === 0) return null;

  return (
    <div>
      <h3 className="college-title text-base mb-2">✨ Découverte du jour</h3>
      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="college-card snap-start shrink-0 w-[85%] p-4"
          >
            {slide.type === "saviez-vous" ? (
              <>
                <p className="text-xs font-bold" style={{ color: "var(--college-teal-700)" }}>
                  {slide.data.emoji} Le saviez-vous ?
                </p>
                <p className="text-sm mt-2">{slide.data.texte}</p>
              </>
            ) : (
              <>
                {/* Bandeau coloré : la photo vient chevaucher son bord bas */}
                <div
                  className="-mx-4 -mt-4 h-12 px-4 pt-2"
                  style={{
                    background: "var(--college-yellow-100)",
                    borderTopLeftRadius: "var(--college-radius-md)",
                    borderTopRightRadius: "var(--college-radius-md)",
                  }}
                >
                  <p className="text-xs font-bold" style={{ color: "var(--college-yellow-600)" }}>
                    🌟 Personnalité du jour
                  </p>
                </div>
                <div className="flex gap-3 items-end -mt-8">
                  <div
                    className="h-16 w-16 shrink-0 rounded-full bg-cover bg-center overflow-hidden flex items-center justify-center border-4"
                    style={{
                      background: "var(--college-teal-100)",
                      borderColor: "var(--college-surface)",
                      backgroundImage: slide.data.photo ? `url(${slide.data.photo})` : undefined,
                      boxShadow: "var(--college-shadow-card)",
                    }}
                  >
                    {!slide.data.photo && (
                      <span className="text-base font-bold" style={{ color: "var(--college-teal-700)" }}>
                        {slide.data.prenom.charAt(0)}
                        {slide.data.nom.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 pb-1">
                    <p className="text-sm font-semibold truncate">
                      {slide.data.prenom} {slide.data.nom}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--college-teal-700)" }}>
                      {slide.data.metier}
                    </p>
                  </div>
                </div>
                <span
                  className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ background: "var(--college-teal-100)", color: "var(--college-teal-700)" }}
                >
                  {matieresList.find((m) => m.slug === slide.data.matiere)?.nom ?? slide.data.matiere}
                </span>
                <p className="text-xs mt-2 line-clamp-3" style={{ color: "var(--college-ink-600)" }}>
                  {slide.data.descriptionCourte}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
      {/* Indicateurs */}
      <div className="flex justify-center gap-1.5 mt-2">
        {slides.map((_, i) => (
          <span
            key={i}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === index ? 16 : 6,
              background: i === index ? "var(--college-teal-700)" : "var(--college-border)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

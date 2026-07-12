"use client";

import { useEffect, useRef, useState } from "react";
import { getTodayLeSaviezVous, getTodayMetierDuJour } from "@/data/college/discovery";

/**
 * Carrousel horizontal AUTOMATIQUE : il avance tout seul même sans
 * interaction au doigt, et boucle en continu entre les 2 cartes du jour
 * (Le saviez-vous ? / Métier du jour), renouvelées toutes les 24h
 * (voir data/college/discovery.ts pour la logique de rotation).
 */
export default function DiscoveryCarousel() {
  const leSaviezVous = getTodayLeSaviezVous();
  const metierDuJour = getTodayMetierDuJour();
  const [index, setIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const slides = [
    leSaviezVous && { type: "saviez-vous" as const, data: leSaviezVous },
    metierDuJour && { type: "metier-jour" as const, data: metierDuJour },
  ].filter(Boolean) as { type: "saviez-vous" | "metier-jour"; data: any }[];

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
                <p className="text-xs font-bold" style={{ color: "var(--college-yellow-600)" }}>
                  🏆 Métier du jour
                </p>
                <p className="text-sm font-semibold mt-2">{slide.data.nom}</p>
                <p className="text-xs mt-1" style={{ color: "var(--college-ink-600)" }}>
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

"use client";

import { useEffect, useState } from "react";
import { RIASEC_LABELS } from "@/lib/college/riasec/scoring";
import type { RiasecLetter } from "@/lib/college/riasec/questions";

type ScoreBarsProps = {
  scores: Record<RiasecLetter, number>;
  dominant?: RiasecLetter;
};

const ORDER: RiasecLetter[] = ["R", "I", "A", "S", "E", "C"];

export function ScoreBars({ scores, dominant }: ScoreBarsProps) {
  // Les barres démarrent à 0 puis s'animent vers leur valeur réelle.
  const [animees, setAnimees] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimees(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {ORDER.map((dim) => {
        const value = scores[dim] ?? 0;
        const isDominant = dim === dominant;
        return (
          <div key={dim} className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-semibold ${
                isDominant ? "bg-espace-primary text-white" : "bg-espace-surface text-espace-primary"
              }`}
            >
              {dim}
            </div>
            <div className="min-w-[120px] text-sm text-espace-ink">{RIASEC_LABELS[dim].label}</div>
            <div className="h-2.5 flex-1 rounded-full bg-espace-border">
              <div
                className="h-full rounded-full bg-espace-primary transition-all duration-700 ease-out"
                style={{ width: animees ? `${value}%` : "0%" }}
              />
            </div>
            <div className="w-10 shrink-0 text-right text-sm font-medium text-espace-ink">{value}%</div>
          </div>
        );
      })}
    </div>
  );
}

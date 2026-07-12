"use client";

import { useState } from "react";
import { RIASEC_LABELS } from "@/lib/college/riasec/scoring";
import type { RiasecLetter } from "@/lib/college/riasec/questions";

type ArchetypeInfo = { nom: string; qualites: string[]; couleur: string };

type RiasecRadarProps = {
  scores: Record<RiasecLetter, number>;
  /** Archétypes chargés depuis la base — affichés au clic sur une branche. */
  archetypes?: Partial<Record<RiasecLetter, ArchetypeInfo>>;
};

const ORDER: RiasecLetter[] = ["R", "I", "A", "S", "E", "C"];

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 100;

function pointOnAxis(index: number, total: number, value: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const r = (value / 100) * RADIUS;
  return { x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle) };
}

function labelPoint(index: number, total: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const r = RADIUS + 24;
  return { x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle) };
}

export function RiasecRadar({ scores, archetypes }: RiasecRadarProps) {
  const [selected, setSelected] = useState<RiasecLetter | null>(null);

  const points = ORDER.map((dim, i) => pointOnAxis(i, ORDER.length, scores[dim] ?? 0));
  const polygon = points.map((p) => `${p.x},${p.y}`).join(" ");
  const gridLevels = [25, 50, 75, 100];
  const archetype = selected ? archetypes?.[selected] : undefined;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="shrink-0">
        {gridLevels.map((level) => {
          const gridPoints = ORDER.map((_, i) => pointOnAxis(i, ORDER.length, level));
          return (
            <polygon
              key={level}
              points={gridPoints.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="#BFE6E1"
              strokeWidth={1}
            />
          );
        })}

        {ORDER.map((_, i) => {
          const edge = pointOnAxis(i, ORDER.length, 100);
          return (
            <line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={edge.x}
              y2={edge.y}
              stroke="#BFE6E1"
              strokeWidth={1}
            />
          );
        })}

        <polygon points={polygon} fill="#0F766E" fillOpacity={0.25} stroke="#0F766E" strokeWidth={2} />

        {ORDER.map((dim, i) => {
          const p = points[i];
          const isSelected = selected === dim;
          return (
            <circle
              key={dim}
              cx={p.x}
              cy={p.y}
              r={isSelected ? 7 : 5}
              fill={isSelected ? "#FFCB05" : "#0F766E"}
              stroke="#FFFFFF"
              strokeWidth={1.5}
              style={{ cursor: "pointer" }}
              onClick={() => setSelected(dim)}
            />
          );
        })}

        {ORDER.map((dim, i) => {
          const p = labelPoint(i, ORDER.length);
          return (
            <text
              key={dim}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={13}
              fontWeight={600}
              fill="#0B2C2A"
              style={{ cursor: "pointer" }}
              onClick={() => setSelected(dim)}
            >
              {dim}
            </text>
          );
        })}
      </svg>

      <div className="min-h-[160px] w-full max-w-xs rounded-lg border border-espace-border bg-espace-surface p-4">
        {selected ? (
          <>
            <p className="text-sm font-semibold text-espace-primary">
              {RIASEC_LABELS[selected].label} — {scores[selected]}%
            </p>
            <p className="mt-1 text-sm text-espace-ink">{RIASEC_LABELS[selected].description}</p>
            {archetype && (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-espace-muted">
                  {archetype.nom} — qualités
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {archetype.qualites.map((q) => (
                    <span
                      key={q}
                      className="rounded-full border border-espace-border bg-white px-2 py-0.5 text-xs text-espace-ink"
                    >
                      {q}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-espace-muted">
            Sélectionne une branche du radar pour voir le détail de la dimension.
          </p>
        )}
      </div>
    </div>
  );
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Lock, CheckCircle2, PlayCircle, ArrowRight } from "lucide-react"
import { useEleveStore } from "@/lib/eleve/store"
import type { EleveMission } from "@/lib/eleve/types"

export default function MissionsPage() {
  const { missions, progress, profile } = useEleveStore()
  const isLudique = profile?.niveau === "collegien"

  const riasecDone = progress?.riasecCompleted ?? false

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#0F766E]">
          {isLudique ? "Tes missions 🎯" : "Missions gamifiées"}
        </h1>
        <p className="text-sm text-black/60">
          Complète les étapes pour débloquer des badges « Métier maîtrisé ».
        </p>
      </header>

      {!riasecDone && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Le test RIASEC est requis avant de débloquer les missions métiers.{" "}
          <Link href="/eleve/riasec" className="font-semibold underline">
            Faire le test
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {missions.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-black/20 p-8 text-center text-sm text-black/50">
            Aucune mission disponible pour le moment.
          </p>
        ) : (
          missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} riasecDone={riasecDone} />
          ))
        )}
      </div>
    </div>
  )
}

function MissionCard({ mission, riasecDone }: { mission: EleveMission; riasecDone: boolean }) {
  const locked = mission.status === "locked" || (mission.type !== "riasec" && !riasecDone)
  const done = mission.status === "completed"

  return (
    <div
      className={`rounded-2xl border-2 bg-white p-5 shadow-sm ${
        done ? "border-[#0F766E]/30" : locked ? "border-black/10 opacity-60" : "border-[#FFCB05]/40"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {locked ? (
              <Lock className="size-4 text-black/40" />
            ) : done ? (
              <CheckCircle2 className="size-4 text-[#0F766E]" />
            ) : (
              <PlayCircle className="size-4 text-[#FFCB05]" />
            )}
            <span className="text-xs font-semibold uppercase tracking-wide text-black/40">
              {mission.type.replace("_", " ")}
            </span>
          </div>
          <h3 className="mt-1 font-semibold text-black">{mission.title}</h3>
          <p className="mt-1 text-sm text-black/60">{mission.description}</p>
          {mission.careerTitle && (
            <p className="mt-1 text-xs text-[#0F766E]">Métier : {mission.careerTitle}</p>
          )}
          <div className="mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-black/10">
            <div
              className="h-full bg-[#FFCB05]"
              style={{
                width: `${mission.stepsTotal ? (mission.stepsCompleted / mission.stepsTotal) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
        {!locked && !done && (
          <Link
            href={`/eleve/missions/${mission.id}`}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#0F766E] px-4 py-2 text-xs font-semibold text-white"
          >
            Jouer <ArrowRight size={14} />
          </Link>
        )}
        {done && mission.badgeName && (
          <span className="shrink-0 rounded-full bg-[#FFCB05]/30 px-3 py-1 text-xs font-semibold">
            🏆 {mission.badgeName}
          </span>
        )}
      </div>
    </div>
  )
}

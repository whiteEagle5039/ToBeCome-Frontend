"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, PlayCircle } from "lucide-react"
import { fetchMetiers } from "@/lib/api/metiers"
import { getApiErrorMessage } from "@/lib/api/client"
import { useEleveStore } from "@/lib/eleve/store"
import { metiers as localMetiers, domaines } from "@/lib/metiers-data"
import { RIASEC_LABELS } from "@/lib/eleve/riasec-questions"
import type { RiasecType } from "@/lib/parent/types"

interface FeedItem {
  id: string
  slug: string
  title: string
  domain: string
  summary: string
  videoLength: string
  riasec: RiasecType[]
  favorited: boolean
}

export default function EleveMetiersPage() {
  const { progress, toggleFavorite } = useEleveStore()
  const [items, setItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"video" | "fiche">("video")

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMetiers()
        setItems(
          data.map((m) => ({
            id: m.id,
            slug: m.slug ?? m.id,
            title: m.titre,
            domain: m.domaineNom ?? domaines.find((d) => d.id === m.domaineId)?.nom ?? "",
            summary: m.description,
            videoLength: "45s",
            riasec: [] as RiasecType[],
            favorited: progress?.favoriteCareerIds.includes(m.id) ?? false,
          })),
        )
      } catch {
        setItems(
          localMetiers.map((m) => ({
            id: m.id,
            slug: m.id,
            title: m.titre,
            domain: domaines.find((d) => d.id === m.domaineId)?.nom ?? "",
            summary: m.description,
            videoLength: "45s",
            riasec: [] as RiasecType[],
            favorited: progress?.favoriteCareerIds.includes(m.id) ?? false,
          })),
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [progress?.favoriteCareerIds])

  if (loading) {
    return <p className="text-sm text-black/50">Chargement des métiers…</p>
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F766E]">Explorer les métiers</h1>
          <p className="text-sm text-black/60">Scroll, découvre, ajoute à tes favoris.</p>
        </div>
        <div className="flex rounded-full border border-[#FFCB05]/40 bg-white p-1 text-xs">
          <button
            type="button"
            onClick={() => setViewMode("video")}
            className={`rounded-full px-3 py-1.5 font-medium ${viewMode === "video" ? "bg-[#FFCB05] text-black" : ""}`}
          >
            Vidéo
          </button>
          <button
            type="button"
            onClick={() => setViewMode("fiche")}
            className={`rounded-full px-3 py-1.5 font-medium ${viewMode === "fiche" ? "bg-[#FFCB05] text-black" : ""}`}
          >
            Fiches
          </button>
        </div>
      </header>

      {viewMode === "video" ? (
        <div className="scrollbar-none h-[calc(100vh-200px)] min-h-[420px] snap-y snap-mandatory overflow-y-auto rounded-3xl border border-[#0F766E]/20 bg-[#0F766E]">
          {items.map((career) => (
            <div
              key={career.id}
              className="relative flex h-[calc(100vh-200px)] min-h-[420px] w-full shrink-0 snap-start flex-col justify-end overflow-hidden p-6 text-white"
            >
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <PlayCircle size={64} className="text-white/20" />
              </div>
              <div className="relative z-10">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs">{career.domain}</span>
                <h2 className="mt-3 font-display text-2xl font-semibold">{career.title}</h2>
                <p className="mt-1 text-sm text-white/80">{career.summary}</p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/eleve/metiers/${career.slug}`}
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0F766E]"
                  >
                    Voir la fiche
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(career.id)}
                    className="rounded-full bg-white/15 p-2 backdrop-blur"
                    aria-label="Favori"
                  >
                    <Heart
                      size={20}
                      className={career.favorited ? "fill-[#FFCB05] text-[#FFCB05]" : ""}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((career) => (
            <Link
              key={career.id}
              href={`/eleve/metiers/${career.slug}`}
              className="rounded-2xl border border-[#FFCB05]/30 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <p className="text-xs font-medium text-[#0F766E]">{career.domain}</p>
              <h3 className="mt-1 font-semibold text-black">{career.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-black/60">{career.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

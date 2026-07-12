"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Maximize2, PlayCircle, X } from "lucide-react";
import { Career } from "@/lib/parent/types";
import { RIASEC_LABELS } from "@/lib/parent/mockData";
import { getDomain, slugify } from "@/lib/parent/utils";
import { getIcon } from "@/lib/parent/icons";
import { videos as videosMetiers } from "@/data/college/videos";
import { metiers as fichesCollege } from "@/data/college/metiers";

/** Retrouve la vidéo réelle d'un métier (par slug, puis par nom). */
function videoForCareer(career: Career): string | null {
  const norm = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const direct = videosMetiers.find((v) => v.metierSlug === career.slug && v.url);
  if (direct) return direct.url;
  const fiche = fichesCollege.find((m) => norm(m.nom) === norm(career.title));
  if (fiche) {
    const parFiche = videosMetiers.find((v) => v.metierSlug === fiche.slug && v.url);
    if (parFiche) return parFiche.url;
  }
  return null;
}

const PALETTE = [
  "from-rose-500 to-rose-700",
  "from-sky-600 to-blue-800",
  "from-emerald-500 to-teal-700",
  "from-indigo-500 to-violet-700",
  "from-amber-500 to-orange-700",
];

export function VideoFeed({ careers }: { careers: Career[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Effet "éventail" : chaque carte s'incline et descend légèrement en
  // fonction de sa distance au centre du rail, pour former un arc doux
  // façon galerie de photos, comme sur la référence.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    function update() {
      const rect = track!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;

      cardRefs.current.forEach((el) => {
        if (!el) return;
        const cardRect = el.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = (cardCenter - centerX) / (rect.width / 2);
        const clamped = Math.max(-1, Math.min(1, distance));
        const rotate = clamped * 10;
        const translateY = Math.abs(clamped) * 22;
        const scale = 1 - Math.abs(clamped) * 0.08;
        el.style.transform = `rotate(${rotate}deg) translateY(${translateY}px) scale(${scale})`;
      });
      raf = 0;
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [careers.length]);

  if (careers.length === 0) return null;

  return (
    <>
      <div className="relative rounded-3xl border border-line bg-white/60 pb-16 pt-16">
        <Link
          href={`/parent/metiers/${careers[0].slug}`}
          className="focus-ring absolute left-1/2 top-4 z-20 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-teal-950 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-teal-900"
        >
          Découvrir un métier
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
            <ChevronRight size={12} />
          </span>
        </Link>

        <div
          ref={trackRef}
          className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-10 py-6"
        >
          {careers.map((career, i) => {
            const domain = getDomain(slugify(career.domain));
            const DomainIcon = getIcon(domain?.icon);
            const palette = PALETTE[i % PALETTE.length];
            return (
              <button
                key={`${career.id}-${i}`}
                type="button"
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                onClick={() => setExpandedIndex(i)}
                className={`focus-ring relative h-56 w-36 shrink-0 snap-center overflow-hidden rounded-2xl bg-gradient-to-b text-left shadow-md transition-transform duration-200 sm:h-64 sm:w-44 ${palette}`}
              >
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <PlayCircle size={40} className="text-white/25" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                    <DomainIcon size={10} /> {career.domain}
                  </span>
                  <p className="font-display text-sm font-semibold leading-tight text-white">
                    {career.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setExpandedIndex(0)}
          aria-label="Voir en plein écran"
          title="Voir en plein écran"
          className="focus-ring absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-teal-900 shadow-lg hover:bg-teal-50"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {expandedIndex !== null && (
        <ImmersiveFeed
          careers={careers}
          startIndex={expandedIndex}
          onClose={() => setExpandedIndex(null)}
        />
      )}
    </>
  );
}

/** Le fil vertical plein écran, façon feed élève, ouvert depuis l'éventail. */
function ImmersiveFeed({
  careers,
  startIndex,
  onClose,
}: {
  careers: Career[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);

  function go(dir: number) {
    setIndex((i) => (i + dir + careers.length) % careers.length);
  }

  const career = careers[index];
  const domain = getDomain(slugify(career.domain));
  const DomainIcon = getIcon(domain?.icon);
  const videoUrl = videoForCareer(career);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <button
        onClick={onClose}
        aria-label="Fermer"
        className="focus-ring absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
      >
        <X size={18} />
      </button>

      <button
        onClick={() => go(-1)}
        aria-label="Métier précédent"
        className="focus-ring absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:left-6"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Métier suivant"
        className="focus-ring absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:right-6"
      >
        <ChevronRight size={20} />
      </button>

      <div className="relative flex h-[calc(100vh-96px)] max-h-[720px] w-full max-w-sm flex-col justify-end overflow-hidden rounded-3xl bg-teal-950 p-6 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full border border-white/10"
        />
        {videoUrl ? (
          <video
            key={videoUrl}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
            src={videoUrl}
          />
        ) : (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <PlayCircle size={64} className="text-white/25" />
          </div>
        )}

        <div className="pointer-events-none relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <DomainIcon size={13} /> {career.domain}
            </span>
            <span className="rounded-full bg-black/30 px-2.5 py-1 text-xs">
              Vidéo · {career.videoLength}
            </span>
          </div>
          <h2 className="font-display text-2xl font-semibold leading-tight">{career.title}</h2>
          <p className="mt-1.5 text-sm text-white/80">{career.summary}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {career.riasec.map((t) => (
              <span
                key={t}
                className="rounded-full bg-yellow-500/90 px-2.5 py-1 text-xs font-semibold text-teal-950"
              >
                {RIASEC_LABELS[t]}
              </span>
            ))}
          </div>
          <Link
            href={`/parent/metiers/${career.slug}`}
            className="focus-ring pointer-events-auto mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-teal-900 hover:bg-white/90"
          >
            Voir la fiche complète
          </Link>
        </div>
      </div>
    </div>
  );
}
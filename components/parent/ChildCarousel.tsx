"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bell, ChevronLeft, ChevronRight, Trophy, X } from "lucide-react";
import { Child } from "@/lib/parent/types";
import { RIASEC_LABELS } from "@/lib/parent/mockData";
import { ChildAvatar } from "./ChildAvatar";
import { Pill } from "./ui";
import { RiasecReminderDialog } from "./RiasecReminderDialog";

// Une couleur par enfant, on boucle sur la palette si besoin.
const PALETTE = [
  { card: "from-rose-500 to-rose-600", ring: "ring-rose-200" },
  { card: "from-sky-600 to-blue-700", ring: "ring-sky-200" },
  { card: "from-emerald-500 to-teal-600", ring: "ring-emerald-200" },
  { card: "from-indigo-500 to-violet-600", ring: "ring-indigo-200" },
  { card: "from-amber-500 to-orange-600", ring: "ring-amber-200" },
];

const INACTIVITY_THRESHOLD_DAYS = 3;

/**
 * Nombre de jours depuis la dernière connexion, si le champ existe.
 * `lastActiveAt` n'est pas encore dans le type Child officiel — tant
 * qu'il n'est pas ajouté (et mappé depuis eleve.derniereConnexion côté
 * mappers.ts), cette fonction renvoie toujours null et l'alerte reste
 * simplement masquée, sans rien casser.
 */
function daysSinceLastActive(child: Child): number | null {
  const lastActiveAt = (child as { lastActiveAt?: string }).lastActiveAt;
  if (!lastActiveAt) return null;
  const diffMs = Date.now() - new Date(lastActiveAt).getTime();
  return Math.floor(diffMs / (24 * 60 * 60 * 1000));
}

interface ChildCarouselProps {
  children: Child[];
}

export function ChildCarousel({ children }: ChildCarouselProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const avatarRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Effet "vent" : plus une carte s'approche du centre du rail au scroll,
  // plus son avatar sort et se soulève, comme poussé par un souffle.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    function update() {
      const rect = track!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;

      avatarRefs.current.forEach((el) => {
        if (!el) return;
        const cardRect = el.parentElement!.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = (cardCenter - centerX) / (rect.width / 2);
        const clamped = Math.max(-1, Math.min(1, distance));
        const lift = 10 - Math.abs(clamped) * 6;
        const tilt = clamped * 6;
        el.style.transform = `translateY(-${lift}px) rotate(${tilt}deg)`;
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
  }, [children.length]);

  if (children.length === 0) return null;

  return (
    <>
      <div
        ref={trackRef}
        className="scrollbar-none -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 pt-8"
      >
        {children.map((child, i) => {
          const palette = PALETTE[i % PALETTE.length];
          const inactiveDays = daysSinceLastActive(child);
          const isInactive = inactiveDays !== null && inactiveDays >= INACTIVITY_THRESHOLD_DAYS;

          return (
            <button
              key={child.id}
              type="button"
              onClick={() => setOpenIndex(i)}
              className={`focus-ring group relative w-44 shrink-0 snap-start overflow-visible rounded-3xl bg-gradient-to-b p-0 text-left shadow-md transition-transform hover:-translate-y-1 sm:w-52 ${palette.card}`}
            >
              {isInactive && (
                <span className="absolute -top-2 right-2 z-10 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                  Inactif {inactiveDays}j
                </span>
              )}

              {/* Avatar qui déborde en haut de la carte */}
              <div
                ref={(el) => {
                  avatarRefs.current[i] = el;
                }}
                className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-white p-1.5 shadow-lg transition-transform duration-300"
              >
                <ChildAvatar icon={child.avatarIcon} size="lg" />
              </div>

              <div className="flex h-44 flex-col justify-end rounded-3xl bg-black/5 px-4 pb-4 pt-10 sm:h-52">
                <p className="font-display text-base font-semibold text-white">
                  {child.firstName}
                </p>
                <p className="text-xs text-white/80">{child.className}</p>
                {!child.riasecCompleted && (
                  <span className="mt-2 inline-block w-fit rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white">
                    Test à faire
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {openIndex !== null && (
        <ChildDetailOverlay
          children={children}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}

function ChildDetailOverlay({
  children,
  index,
  onIndexChange,
  onClose,
}: {
  children: Child[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const child = children[index];
  const palette = PALETTE[index % PALETTE.length];
  const [reminderOpen, setReminderOpen] = useState(false);

  function go(dir: number) {
    onIndexChange((index + dir + children.length) % children.length);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 bg-teal-950/50 backdrop-blur-sm"
      />

      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl sm:flex-row">
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="focus-ring absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-teal-950 shadow"
        >
          <X size={16} />
        </button>

        {/* Volet coloré avec l'avatar */}
        <div
          className={`relative flex shrink-0 items-center justify-center bg-gradient-to-br p-8 sm:w-64 ${palette.card}`}
        >
          <div className="rounded-full bg-white p-3 shadow-xl">
            <ChildAvatar icon={child.avatarIcon} size="lg" />
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-semibold text-teal-950">
              {child.firstName} {child.lastName}
            </h2>
            <Pill tone="slate">{child.className}</Pill>
          </div>
          <p className="mt-1 text-sm text-slate">{child.school}</p>

          {child.riasecCompleted ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {child.riasecDominant.map((t) => (
                <Pill key={t} tone="teal">
                  {RIASEC_LABELS[t]}
                </Pill>
              ))}
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium text-yellow-700">
                Test RIASEC pas encore réalisé
              </p>
              <button
                onClick={() => setReminderOpen(true)}
                className="focus-ring inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800 hover:bg-yellow-200"
              >
                <Bell size={12} /> Envoyer un rappel
              </button>
            </div>
          )}

          <div className="mt-5 flex items-center gap-4">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-black/5">
              <div
                className="h-full rounded-full bg-teal-600"
                style={{ width: `${child.progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-slate">{child.progressPercent}% du parcours</span>
            <span className="flex items-center gap-1 text-xs text-slate">
              <Trophy size={14} className="text-yellow-500" /> {child.badges.length}
            </span>
          </div>

          <Link
            href={`/parent/enfant/${child.id}`}
            className="focus-ring mt-6 inline-flex items-center gap-1.5 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Voir le profil complet <ArrowRight size={15} />
          </Link>

          {children.length > 1 && (
            <div className="mt-6 flex items-center gap-2 border-t border-line pt-4">
              <button
                onClick={() => go(-1)}
                aria-label="Enfant précédent"
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-full text-slate hover:bg-teal-50 hover:text-teal-700"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-slate">
                {index + 1} / {children.length}
              </span>
              <button
                onClick={() => go(1)}
                aria-label="Enfant suivant"
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-full text-slate hover:bg-teal-50 hover:text-teal-700"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <RiasecReminderDialog
        open={reminderOpen}
        childId={child.id}
        childName={child.firstName}
        onClose={() => setReminderOpen(false)}
      />
    </div>
  );
}
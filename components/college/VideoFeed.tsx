"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Heart, FileText, Share2 } from "lucide-react";
import { videos } from "@/data/college/videos";

export default function VideoFeed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [mutedMap, setMutedMap] = useState<Record<number, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [errorMap, setErrorMap] = useState<Record<number, boolean>>({});

  if (videos.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-[70vh] text-sm"
        style={{ color: "var(--college-ink-600)" }}
      >
        Aucune vidéo pour le moment — ajoute des liens dans data/college/videos.ts
      </div>
    );
  }

  const loopedVideos = Array.from({ length: 20 }).flatMap(() => videos);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { root: container, threshold: [0, 0.6, 1] }
    );

    videoRefs.current.forEach((v) => v && observer.observe(v));
    return () => observer.disconnect();
  }, []);

  const toggleMute = useCallback((index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    video.muted = !video.muted;
    setMutedMap((prev) => ({ ...prev, [index]: video.muted }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleShare = useCallback(async (titre: string, slug?: string) => {
    const url = slug
      ? `${window.location.origin}/college/explorer/fiches/metier/${slug}`
      : window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: titre, url });
      } catch {
        // annulé par l'utilisateur, on ignore
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="no-scrollbar h-[calc(100dvh-64px)] overflow-y-scroll snap-y snap-mandatory scroll-smooth"
    >
      {loopedVideos.map((video, i) => (
        <div
          key={`${video.id}-${i}`}
          className="relative h-[calc(100dvh-64px)] snap-start snap-always overflow-hidden"
          style={{ background: "#000" }}
        >
          {video.url && !errorMap[i] ? (
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              src={video.url}
              poster={video.poster}
              className="absolute inset-0 w-full h-full object-cover"
              loop
              muted={mutedMap[i] ?? true}
              playsInline
              preload="metadata"
              onClick={() => toggleMute(i)}
              onError={() => setErrorMap((prev) => ({ ...prev, [i]: true }))}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 text-sm px-6 text-center gap-2">
              <span>🎬</span>
              <span>
                {video.url
                  ? `Impossible de lire la vidéo de « ${video.titre} » — vérifie que le lien pointe vers un fichier .mp4 direct.`
                  : `Lien vidéo manquant pour « ${video.titre} »`}
              </span>
            </div>
          )}

          {/* Badge domaine */}
          {video.domaine && (
            <span
              className="absolute top-5 left-5 z-20 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "var(--college-accent, #FFC107)", color: "#111" }}
            >
              {video.domaine}
            </span>
          )}

          {/* Rail d'icônes à droite, façon TikTok */}
          <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-5">
            <Link
              href={`/college/explorer/fiches/metier/${video.metierSlug}`}
              className="flex flex-col items-center gap-1 text-white"
              aria-label="Voir la fiche métier"
            >
              <span className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <FileText size={20} />
              </span>
              <span className="text-[10px] font-medium">Fiche</span>
            </Link>

            <button
              onClick={() => toggleFavorite(video.id)}
              className="flex flex-col items-center gap-1 text-white"
              aria-label="Ajouter aux favoris"
            >
              <span className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <Heart
                  size={20}
                  fill={favorites[video.id] ? "#ef4444" : "none"}
                  color={favorites[video.id] ? "#ef4444" : "white"}
                />
              </span>
              <span className="text-[10px] font-medium">Favoris</span>
            </button>

            <button
              onClick={() => handleShare(video.titre, video.metierSlug)}
              className="flex flex-col items-center gap-1 text-white"
              aria-label="Partager"
            >
              <span className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <Share2 size={20} />
              </span>
              <span className="text-[10px] font-medium">Partager</span>
            </button>
          </div>

          {/* Titre + description en bas */}
          <div
            className="absolute bottom-0 left-0 right-0 z-10 px-5 pt-16"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0) 100%)",
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 28px)",
            }}
          >
            <p className="font-bold text-white text-lg leading-snug pr-16">
              {video.titre}
            </p>
            {video.extraitTemoignage && (
              <p className="text-sm text-white/80 mt-2 leading-relaxed pr-16 max-w-md">
                {video.extraitTemoignage}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
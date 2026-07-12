import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { videos } from "@/data/college/videos";
import { getMetierBySlug } from "@/data/college/metiers";

export const metadata = {
  title: "Vidéos métiers | Espace Parent",
};

/**
 * Les mêmes vidéos métiers que celles vues par les élèves, pour que les
 * parents découvrent ce que leur enfant explore.
 */
export default function VideosParentPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/parent/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0F766E] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Tableau de bord
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Vidéos métiers</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Découvrez les métiers présentés à votre enfant, en vidéo.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos
          .filter((v) => v.url)
          .map((v) => {
            const metier = getMetierBySlug(v.metierSlug);
            return (
              <div
                key={v.id}
                className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
              >
                <video
                  controls
                  preload="metadata"
                  playsInline
                  className="aspect-video w-full bg-black"
                  src={v.url}
                  poster={v.poster || undefined}
                />
                <div className="p-4">
                  <h2 className="font-bold text-neutral-900">
                    {metier?.nom ?? v.metierSlug}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{v.titre}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

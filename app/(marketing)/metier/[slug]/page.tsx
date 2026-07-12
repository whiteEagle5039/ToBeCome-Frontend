import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getMetierBySlug, metiers } from "@/data/college/metiers";
import { getMetierImage } from "@/data/college/images-metiers";
import { VIDEOS_METIERS } from "@/data/college/videos-metiers";

export function generateStaticParams() {
  return metiers.map((m) => ({ slug: m.slug }));
}

/**
 * Fiche métier publique (landing) — même contenu que la fiche de l'espace
 * collège : image, présentation, activités, qualités requises, vidéo.
 */
export default async function FicheMetierPublique({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const metier = getMetierBySlug(slug);
  if (!metier) notFound();

  const video = VIDEOS_METIERS[metier.slug];

  return (
    <div className="bg-[#DFF6F3] pb-16">
      {/* Image du métier */}
      <div
        className="h-64 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${getMetierImage(metier)})` }}
        role="img"
        aria-label={`Illustration du métier ${metier.nom}`}
      />

      <div className="mx-auto max-w-3xl px-4">
        <div className="-mt-10 rounded-3xl bg-white p-6 shadow-lg sm:p-8">
          <Link
            href="/metier"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0F766E] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Tous les métiers
          </Link>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
            {metier.domaine}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-neutral-900">{metier.nom}</h1>

          <section className="mt-6">
            <h2 className="text-base font-bold text-[#0F766E]">Présentation</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {metier.presentation}
            </p>
          </section>

          {video && (
            <section className="mt-6">
              <h2 className="text-base font-bold text-[#0F766E]">Le métier en vidéo</h2>
              <video
                controls
                preload="metadata"
                playsInline
                className="mt-2 w-full rounded-2xl bg-black"
                src={video}
              />
            </section>
          )}

          <section className="mt-6">
            <h2 className="text-base font-bold text-[#0F766E]">
              Ce que fait le professionnel
            </h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-neutral-600">
              {metier.activites.map((activite, i) => (
                <li key={i}>{activite}</li>
              ))}
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="text-base font-bold text-[#0F766E]">Qualités requises</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {metier.qualitesRequises.map((qualite, i) => (
                <span
                  key={i}
                  className="rounded-full bg-[#FFCB05]/25 px-3 py-1 text-xs font-semibold text-neutral-900"
                >
                  {qualite}
                </span>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

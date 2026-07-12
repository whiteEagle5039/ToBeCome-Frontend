import Link from "next/link";
import { notFound } from "next/navigation";
import { getMetierBySlug } from "@/data/college/metiers";
import { getMetierImage } from "@/data/college/images-metiers";

interface Props {
  params: Promise<{
    matiere: string;
    metier: string;
  }>;
}

export default async function FicheMetierPage({ params }: Props) {
  const { matiere, metier: metierSlug } = await params;

  const metier = getMetierBySlug(metierSlug);

  if (!metier) {
    notFound();
  }

  return (
    <div className="pb-8">
      {/* Grande image du métier (image propre ou image du domaine) */}
      <div
        className="h-52 w-full bg-cover bg-center"
        style={{
          backgroundColor: "var(--college-teal-100)",
          backgroundImage: `url(${getMetierImage(metier)})`,
        }}
        role="img"
        aria-label={`Illustration du métier ${metier.nom}`}
      />

      <div className="px-4 pt-4 space-y-5">
        <div>
          <p
            className="text-xs font-semibold"
            style={{ color: "var(--college-teal-700)" }}
          >
            {metier.domaine}
          </p>

          <h1 className="college-title text-2xl">
            {metier.nom}
          </h1>
        </div>

        <section>
          <h2 className="college-title text-base mb-1">
            Présentation
          </h2>

          <p
            className="text-sm"
            style={{ color: "var(--college-ink-600)" }}
          >
            {metier.presentation}
          </p>
        </section>

        <section>
          <h2 className="college-title text-base mb-1">
            Ce que fait le professionnel
          </h2>

          <ul
            className="list-disc list-inside text-sm space-y-1"
            style={{ color: "var(--college-ink-600)" }}
          >
            {metier.activites.map((activite, index) => (
              <li key={index}>{activite}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="college-title text-base mb-1">
            Qualités requises
          </h2>

          <div className="flex flex-wrap gap-2">
            {metier.qualitesRequises.map((qualite, index) => (
              <span
                key={index}
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  background: "var(--college-yellow-100)",
                  color: "var(--college-ink-900)",
                }}
              >
                {qualite}
              </span>
            ))}
          </div>
        </section>

        <Link
          href={`/college/quetes/metiers/${metier.slug}`}
          className="college-btn-primary block text-center py-3"
        >
          Commencer les missions 🚀
        </Link>
      </div>
    </div>
  );
}
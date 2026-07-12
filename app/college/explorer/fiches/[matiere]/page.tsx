import Link from "next/link";
import {
  getMetiersByMatiere,
  matieresList,
  type Matiere,
} from "@/data/college/metiers";
import MetierCard from "@/components/college/MetierCard";

export default async function MetiersParMatierePage({
  params,
}: {
  params: Promise<{ matiere: Matiere }>;
}) {
  const { matiere } = await params;

  const matiereInfo = matieresList.find((m) => m.slug === matiere);
  const metiers = getMetiersByMatiere(matiere);

  return (
    <div className="px-4 pt-6 pb-6">
      <Link
        href="/college/explorer/fiches"
        className="text-sm"
        style={{ color: "var(--college-teal-700)" }}
      >
        ← Toutes les matières
      </Link>

      <h1 className="college-title text-xl mt-2 mb-4">
        {matiereInfo?.emoji} Métiers en {matiereInfo?.nom}
      </h1>

      {metiers.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--college-ink-600)" }}>
          Aucun métier n'est encore associé à cette matière — ajoute-en dans
          data/college/metiers.ts
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {metiers.map((m) => (
            <MetierCard
              key={m.slug}
              metier={m}
              href={`/college/explorer/fiches/${matiere}/${m.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
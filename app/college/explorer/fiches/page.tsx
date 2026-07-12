import Link from "next/link";
import { matieresList } from "@/data/college/metiers";

export default function FichesPage() {
  return (
    <div className="px-4 pt-6 pb-6">
      <h1 className="college-title text-xl mb-4">Choisis une matière</h1>
      <div className="grid grid-cols-2 gap-3">
        {matieresList.map((m) => (
          <Link
            key={m.slug}
            href={`/college/explorer/fiches/${m.slug}`}
            className="college-card p-4 flex flex-col items-center justify-center gap-2 aspect-square"
          >
            <span className="text-3xl">{m.emoji}</span>
            <span className="text-sm font-semibold text-center">{m.nom}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

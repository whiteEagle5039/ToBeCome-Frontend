import Link from "next/link";
import { Play } from "lucide-react";

type MetierCardProps = {
  slug: string;
  nom: string;
  descriptionCourte?: string | null;
  domaineNom?: string | null;
  recommande?: boolean;
};

export function MetierCard({ slug, nom, descriptionCourte, domaineNom, recommande }: MetierCardProps) {
  return (
    <Link
      href={`/college/quetes/metiers/${slug}`}
      className="group flex items-center justify-between gap-3 rounded-xl border border-espace-border bg-white p-4 transition hover:border-espace-primary hover:shadow-sm"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-espace-ink">{nom}</h3>
          {recommande && (
            <span className="rounded-full bg-espace-accent/20 px-2 py-0.5 text-xs font-medium text-espace-ink">
              Recommandé
            </span>
          )}
        </div>
        {descriptionCourte && <p className="mt-1 text-sm text-espace-muted">{descriptionCourte}</p>}
        {domaineNom && (
          <p className="mt-2 text-xs uppercase tracking-wide text-espace-primary">{domaineNom}</p>
        )}
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-espace-primary px-3.5 py-1.5 text-sm font-medium text-white transition group-hover:bg-espace-primaryDark">
        <Play className="h-3.5 w-3.5" />
        Jouer
      </span>
    </Link>
  );
}

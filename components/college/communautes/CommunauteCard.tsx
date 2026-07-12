import Link from "next/link";

type CommunauteCardProps = {
  slug: string;
  nom: string;
  description: string;
  nbMembres: number;
  estMembre: boolean;
};

export function CommunauteCard({ slug, nom, description, nbMembres, estMembre }: CommunauteCardProps) {
  return (
    <Link
      href={`/college/communautes/${slug}`}
      className="flex items-center justify-between rounded-xl border border-espace-border bg-white p-4 transition hover:border-espace-primary"
    >
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-espace-ink">{nom}</h3>
          {estMembre && (
            <span className="rounded-full bg-espace-surface px-2 py-0.5 text-xs font-medium text-espace-primary">
              Membre
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-espace-muted">{description}</p>
        <p className="mt-2 text-xs text-espace-muted">{nbMembres} membres</p>
      </div>
    </Link>
  );
}

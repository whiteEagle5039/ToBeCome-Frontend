type RessourceCardProps = {
  titre: string;
  url: string;
  description?: string | null;
  auteur: { prenom: string; nom: string };
};

export function RessourceCard({ titre, url, description, auteur }: RessourceCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl border border-espace-border bg-white p-4 transition hover:border-espace-primary"
    >
      <h3 className="font-semibold text-espace-ink">{titre}</h3>
      {description && <p className="mt-1 text-sm text-espace-muted">{description}</p>}
      <p className="mt-2 text-xs text-espace-muted">
        Partagé par {auteur.prenom} {auteur.nom}
      </p>
    </a>
  );
}

type PhotoCardProps = {
  imageUrl: string;
  legende?: string | null;
  auteur: { prenom: string; nom: string };
};

export function PhotoCard({ imageUrl, legende, auteur }: PhotoCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-espace-border bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt={legende ?? ""} className="aspect-square w-full object-cover" />
      <div className="p-3">
        {legende && <p className="text-sm text-espace-ink">{legende}</p>}
        <p className="mt-1 text-xs text-espace-muted">
          {auteur.prenom} {auteur.nom}
        </p>
      </div>
    </div>
  );
}

type MembreRowProps = {
  prenom: string;
  nom: string;
  role: string;
  joinedAt: string;
};

const LIBELLES_ROLE: Record<string, string> = {
  MEMBRE: "Membre",
  MODERATEUR: "Modérateur",
  ADMIN: "Administrateur",
};

export function MembreRow({ prenom, nom, role, joinedAt }: MembreRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-espace-border bg-white px-4 py-3">
      <span className="text-espace-ink">
        {prenom} {nom}
      </span>
      <div className="flex items-center gap-3">
        <span className="text-xs text-espace-muted">
          Depuis le {new Date(joinedAt).toLocaleDateString("fr-FR")}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            role === "ADMIN"
              ? "bg-espace-accent text-espace-ink"
              : role === "MODERATEUR"
              ? "bg-espace-surface text-espace-primary"
              : "bg-gray-100 text-espace-muted"
          }`}
        >
          {LIBELLES_ROLE[role] ?? role}
        </span>
      </div>
    </div>
  );
}

type ClassementRowProps = {
  rang: number;
  prenom: string;
  nom: string;
  xpGuilde: number;
};

export function ClassementRow({ rang, prenom, nom, xpGuilde }: ClassementRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-espace-border bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-espace-surface text-sm font-semibold text-espace-primary">
          {rang}
        </span>
        <span className="text-espace-ink">
          {prenom} {nom}
        </span>
      </div>
      <span className="text-sm font-medium text-espace-primary">{xpGuilde} XP</span>
    </div>
  );
}

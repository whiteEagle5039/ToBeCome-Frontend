import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";
import { CommunauteCard } from "@/components/college/communautes/CommunauteCard";
import { BackButton } from "@/components/college/BackButton";
import type { CommunauteType } from "@prisma/client";

const TYPES: { valeur: CommunauteType; label: string }[] = [
  { valeur: "MATIERE", label: "Matières" },
  { valeur: "DOMAINE", label: "Domaines" },
  { valeur: "METIER", label: "Métiers" },
  { valeur: "GUILDE", label: "Guildes" },
  { valeur: "CLUB_SCOLAIRE", label: "Clubs scolaires" },
  { valeur: "PRIVEE", label: "Privées" },
];

export default async function CommunautesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const eleve = await getCurrentEleve();
  const typeFiltre = (await searchParams).type as CommunauteType | undefined;

  const communautes = await prisma.communaute.findMany({
    where: typeFiltre ? { type: typeFiltre } : undefined,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { membres: true } } },
  });

  let mesAdhesions = new Set<string>();
  if (eleve) {
    const memberships = await prisma.communauteMembre.findMany({
      where: { eleveId: eleve.id },
      select: { communauteId: true },
    });
    mesAdhesions = new Set(memberships.map((m) => m.communauteId));
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <BackButton href="/college/accueil" label="Accueil" />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-espace-ink">Communautés</h1>
        <Link
          href="/college/communautes/nouvelle"
          className="rounded-lg border border-espace-primary px-4 py-2 text-sm font-medium text-espace-primary transition hover:bg-espace-surface"
        >
          Créer une communauté privée
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/college/communautes"
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
            !typeFiltre ? "bg-espace-primary text-white" : "border border-espace-border text-espace-ink"
          }`}
        >
          Toutes
        </Link>
        {TYPES.map((t) => (
          <Link
            key={t.valeur}
            href={`/college/communautes?type=${t.valeur}`}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              typeFiltre === t.valeur
                ? "bg-espace-primary text-white"
                : "border border-espace-border text-espace-ink"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {communautes.map((c) => (
          <CommunauteCard
            key={c.id}
            slug={c.slug}
            nom={c.nom}
            description={c.description}
            nbMembres={c._count.membres}
            estMembre={mesAdhesions.has(c.id)}
          />
        ))}

        {communautes.length === 0 && (
          <p className="text-sm text-espace-muted">Aucune communauté dans cette catégorie pour le moment.</p>
        )}
      </div>
    </main>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";
import { MetierCard } from "@/components/college/quetes/MetierCard";
import { XpHeader } from "@/components/college/quetes/XpHeader";
import type { RiasecLetter } from "@/lib/college/riasec/questions";

/**
 * Interface 4 — Hub Quêtes : profil, recommandations, accès au catalogue.
 * Pas de Battle / Studio / Défi ici : le joueur choisit d'abord un métier.
 */
export default async function HubQuetesPage() {
  const eleve = await getCurrentEleve();
  if (!eleve) redirect("/college/connexion");

  const resultat = await prisma.riasecResultat.findUnique({ where: { eleveId: eleve.id } });
  if (!resultat) redirect("/college/quetes");

  const typesPrincipaux = resultat.typesPrincipaux as RiasecLetter[];
  const dominant = typesPrincipaux[0];
  const secondary = typesPrincipaux[1];
  const hollandCode = resultat.hollandCode ?? typesPrincipaux.slice(0, 3).join("");

  const archetype = await prisma.archetypeRiasec.findUnique({ where: { lettre: dominant } });

  const recommandations = await prisma.metier.findMany({
    where: { riasecTypes: { hasSome: [dominant, secondary].filter(Boolean) } },
    take: 3,
    include: { domaine: true },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold text-espace-ink">Quêtes</h1>

      <div className="mt-4">
        <XpHeader xpTotal={eleve.xpTotal} streakJours={eleve.streakJours} />
      </div>

      {/* Ton profil */}
      <section className="mt-6 rounded-2xl border border-espace-border bg-white p-5">
        <p className="text-xs uppercase tracking-wide text-espace-muted">Ton profil</p>
        <p className="mt-1 text-lg font-semibold text-espace-ink">
          {archetype?.nom ?? dominant} ({hollandCode})
        </p>
        <Link
          href="/college/quetes/resultats"
          className="mt-2 inline-block text-sm font-medium text-espace-primary hover:underline"
        >
          Revoir mon profil complet
        </Link>
      </section>

      {/* Recommandés pour toi */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-espace-muted">
          Recommandés pour toi
        </h2>
        <div className="flex flex-col gap-3">
          {recommandations.map((m) => (
            <MetierCard
              key={m.slug}
              slug={m.slug}
              nom={m.nom}
              descriptionCourte={m.descriptionCourte}
              domaineNom={m.domaine?.nom}
              recommande
            />
          ))}
        </div>
      </section>

      <div className="mt-6">
        <Link
          href="/college/quetes/metiers"
          className="inline-flex items-center justify-center rounded-lg border border-espace-primary px-5 py-3 font-medium text-espace-primary transition hover:bg-espace-surface"
        >
          Voir tous les métiers
        </Link>
      </div>
    </main>
  );
}

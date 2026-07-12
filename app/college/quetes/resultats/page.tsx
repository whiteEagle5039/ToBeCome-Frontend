import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";
import { PROFIL_POLYVALENT_MESSAGE } from "@/lib/college/riasec/scoring";
import { RiasecRadar } from "@/components/college/quetes/RiasecRadar";
import { ScoreBars } from "@/components/college/quetes/ScoreBars";
import { MetierCard } from "@/components/college/quetes/MetierCard";
import type { RiasecLetter } from "@/lib/college/riasec/questions";

/**
 * Interface 3 — Résultats : félicitations, profil dominant, radar interactif,
 * barres animées, explication, points forts, métiers recommandés.
 */
export default async function ResultatsPage() {
  const eleve = await getCurrentEleve();
  if (!eleve) redirect("/college/connexion");

  const resultat = await prisma.riasecResultat.findUnique({ where: { eleveId: eleve.id } });
  if (!resultat) redirect("/college/quetes/riasec");

  const scores: Record<RiasecLetter, number> = {
    R: resultat.scoreR,
    I: resultat.scoreI,
    A: resultat.scoreA,
    S: resultat.scoreS,
    E: resultat.scoreE,
    C: resultat.scoreC,
  };

  const typesPrincipaux = resultat.typesPrincipaux as RiasecLetter[];
  const dominant = typesPrincipaux[0];
  const secondary = typesPrincipaux[1];
  const hollandCode = resultat.hollandCode ?? typesPrincipaux.slice(0, 3).join("");

  // Archétypes chargés depuis la base (modifiables sans toucher au code)
  const archetypes = await prisma.archetypeRiasec.findMany();
  const parLettre = Object.fromEntries(archetypes.map((a) => [a.lettre, a]));
  const profil = parLettre[dominant];

  const recommandations = await prisma.metier.findMany({
    where: { riasecTypes: { hasSome: [dominant, secondary].filter(Boolean) } },
    take: 3,
    include: { domaine: true },
  });

  const radarArchetypes = Object.fromEntries(
    archetypes.map((a) => [a.lettre, { nom: a.nom, qualites: a.qualites, couleur: a.couleur }])
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {/* Félicitations + récompenses */}
      <p className="text-sm font-medium uppercase tracking-wide text-espace-primary">
        Félicitations, ton profil est prêt
      </p>
      <div className="mt-2 flex items-center gap-3">
        <span className="rounded-full bg-espace-accent px-3 py-1 text-xs font-bold text-espace-ink">
          +500 XP
        </span>
        <span className="text-sm text-espace-muted">Badge Explorateur obtenu</span>
      </div>

      {/* Profil dominant */}
      <section className="mt-8 rounded-2xl border border-espace-border bg-white p-6">
        <p className="text-sm text-espace-muted">Code Holland — {hollandCode}</p>
        <h1 className="mt-1 text-2xl font-bold text-espace-ink">{profil?.nom ?? dominant}</h1>
        <p className="mt-2 text-espace-muted">{profil?.accroche}</p>
        {resultat.profilType === "polyvalent" && (
          <p className="mt-3 rounded-lg bg-espace-surface px-4 py-3 text-sm text-espace-ink">
            {PROFIL_POLYVALENT_MESSAGE}
          </p>
        )}
      </section>

      {/* Radar interactif */}
      <section className="mt-6 rounded-2xl border border-espace-border bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-espace-muted">
          Radar RIASEC
        </h2>
        <RiasecRadar scores={scores} archetypes={radarArchetypes} />
      </section>

      {/* Les six scores */}
      <section className="mt-6 rounded-2xl border border-espace-border bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-espace-muted">
          Répartition des scores
        </h2>
        <ScoreBars scores={scores} dominant={dominant} />
      </section>

      {/* Explication du profil */}
      <section className="mt-6 rounded-2xl border border-espace-border bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-espace-muted">
          Ton profil
        </h2>
        <p className="text-espace-ink">{profil?.explication}</p>
      </section>

      {/* Points forts */}
      <section className="mt-6 rounded-2xl border border-espace-border bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-espace-muted">
          Points forts
        </h2>
        <div className="flex flex-wrap gap-2">
          {(profil?.qualites ?? []).map((q) => (
            <span
              key={q}
              className="rounded-full border border-espace-border bg-espace-surface px-3 py-1 text-sm text-espace-ink"
            >
              {q}
            </span>
          ))}
        </div>
      </section>

      {/* Métiers recommandés */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-espace-muted">
          Métiers recommandés
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

      {/* Les deux boutons */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/college/quetes/metiers"
          className="flex-1 rounded-lg border border-espace-primary px-5 py-3 text-center font-medium text-espace-primary transition hover:bg-espace-surface"
        >
          Explorer les métiers
        </Link>
        <Link
          href="/college/quetes/hub"
          className="flex-1 rounded-lg bg-espace-primary px-5 py-3 text-center font-medium text-white transition hover:bg-espace-primaryDark"
        >
          Continuer l'aventure
        </Link>
      </div>
    </main>
  );
}

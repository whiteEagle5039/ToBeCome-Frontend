import Link from "next/link";
import { notFound } from "next/navigation";
import { Crown, CheckCircle2, Circle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";
import { BackButton } from "@/components/college/BackButton";

/**
 * Interface 7 (Aventure) — Liste des chapitres du métier.
 * Chapitre = Mission ; ses quêtes = MissionEtape (Quiz, Situation, Défi,
 * Projet final pour le boss).
 */
export default async function AventurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const eleve = await getCurrentEleve();

  const metier = await prisma.metier.findUnique({
    where: { slug },
    include: { missions: { orderBy: { ordre: "asc" }, include: { etapes: true } } },
  });
  if (!metier) notFound();

  let progression: Record<string, boolean> = {};
  if (eleve) {
    const rows = await prisma.missionProgress.findMany({
      where: { eleveId: eleve.id, mission: { metierId: metier.id } },
    });
    progression = Object.fromEntries(rows.map((r) => [r.missionId, r.isComplete]));
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <BackButton href={`/college/quetes/metiers/${metier.slug}`} />
      <p className="text-xs uppercase tracking-wide text-espace-muted">Mode Aventure</p>
      <h1 className="mt-1 text-2xl font-bold text-espace-ink">{metier.nom}</h1>

      {metier.missions.length === 0 ? (
        <p className="mt-6 text-sm text-espace-muted">
          Aucun chapitre n'est encore disponible pour ce métier.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {metier.missions.map((mission) => {
            const termine = progression[mission.id] ?? false;

            return (
              <Link
                key={mission.id}
                href={`/college/quetes/metiers/${metier.slug}/aventure/mission/${mission.id}`}
                className="flex items-center justify-between rounded-xl border border-espace-border bg-white p-4 transition hover:border-espace-primary"
              >
                <div className="flex items-center gap-3">
                  {mission.estBoss ? (
                    <Crown className="h-5 w-5 text-espace-accent" />
                  ) : termine ? (
                    <CheckCircle2 className="h-5 w-5 text-espace-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-espace-muted" />
                  )}
                  <div>
                    <p className="font-semibold text-espace-ink">
                      {mission.estBoss ? "Boss final" : `Chapitre ${mission.ordre}`} — {mission.titre}
                    </p>
                    <p className="text-sm text-espace-muted">{mission.description}</p>
                    <p className="mt-1 text-xs text-espace-muted">
                      {mission.etapes.length} quête{mission.etapes.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-medium text-espace-primary">
                  +{mission.xpRecompense} XP
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

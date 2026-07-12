import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChapterRunner } from "@/components/college/quetes/ChapterRunner";
import { BackButton } from "@/components/college/BackButton";

/**
 * Déroulé d'un chapitre : enchaîne ses quêtes (Quiz, Situation, Défi rapide,
 * Projet final) puis enregistre la progression et crédite l'XP.
 */
export default async function MissionPage({
  params,
}: {
  params: Promise<{ slug: string; missionId: string }>;
}) {
  const { slug, missionId } = await params;

  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
    include: { etapes: { orderBy: { ordre: "asc" } } },
  });

  if (!mission) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <BackButton href={`/college/quetes/metiers/${slug}/aventure`} label="Chapitres" />
      <p className="text-xs uppercase tracking-wide text-espace-muted">
        {mission.estBoss ? "Boss final" : `Chapitre ${mission.ordre}`}
      </p>
      <h1 className="mt-1 text-2xl font-bold text-espace-ink">{mission.titre}</h1>
      <p className="mt-2 text-espace-muted">{mission.description}</p>

      <div className="mt-8">
        <ChapterRunner
          missionId={mission.id}
          metierSlug={slug}
          etapes={mission.etapes as never}
        />
      </div>
    </main>
  );
}

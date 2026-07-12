import { notFound } from "next/navigation";
import { BookOpen, Swords, Users, Flame } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ModeCard } from "@/components/college/quetes/ModeCard";
import { BackButton } from "@/components/college/BackButton";

/**
 * Interface 6 — Page métier : choix du mode de jeu.
 */
export default async function MetierPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const metier = await prisma.metier.findUnique({ where: { slug } });
  if (!metier) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <BackButton href="/college/quetes/metiers" label="Tous les métiers" />
      <p className="text-xs uppercase tracking-wide text-espace-muted">Métier</p>
      <h1 className="mt-1 text-2xl font-bold text-espace-ink">{metier.nom}</h1>
      <p className="mt-2 text-espace-muted">{metier.descriptionCourte ?? metier.description}</p>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-espace-muted">
        Comment veux-tu découvrir le métier de {metier.nom} ?
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <ModeCard
          href={`/college/quetes/metiers/${metier.slug}/aventure`}
          icon={BookOpen}
          titre="Aventure"
          description="Découvre progressivement le métier à travers des chapitres, des quêtes et des défis. Tu progresses à ton rythme, gagnes de l'XP et développes tes compétences."
        />
        <ModeCard
          href={`/college/quetes/metiers/${metier.slug}/battle`}
          icon={Swords}
          titre="Battle"
          description="Affronte un autre joueur en duel ou participe à un Battle Royale. Les défis portent sur les connaissances du métier choisi."
        />
        <ModeCard
          href={`/college/quetes/metiers/${metier.slug}/studio`}
          icon={Users}
          titre="Studio"
          description="Forme une équipe avec d'autres joueurs. Chacun choisit librement un rôle parmi les métiers du numérique afin de réaliser ensemble un projet, comme un site web ou une application."
        />
        <ModeCard
          href={`/college/quetes/metiers/${metier.slug}/defi`}
          icon={Flame}
          titre="Défi du jour"
          description="Relève un défi rapide en lien avec ce métier pour gagner des points d'expérience supplémentaires."
        />
      </div>
    </main>
  );
}

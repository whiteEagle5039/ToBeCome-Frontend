import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";
import { DefiCard } from "@/components/college/communautes/DefiCard";

export default async function DefisPage({ params }: { params: Promise<{ slug: string }> }) {
  const eleve = await getCurrentEleve();

  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) notFound();

  const defis = await prisma.defiCommunaute.findMany({
    where: { communauteId: communaute.id },
    orderBy: { createdAt: "desc" },
    include: {
      participations: eleve ? { where: { eleveId: eleve.id } } : false,
      _count: { select: { participations: true } },
    },
  });

  return (
    <div className="flex flex-col gap-3">
      {defis.map((d) => (
        <DefiCard
          key={d.id}
          slug={communaute.slug}
          defiId={d.id}
          titre={d.titre}
          description={d.description}
          xpRecompense={d.xpRecompense}
          dejaTermine={
            Array.isArray(d.participations) &&
            d.participations.some((p) => p.statut === "TERMINE")
          }
          nbParticipants={d._count.participations}
        />
      ))}

      {defis.length === 0 && (
        <p className="text-center text-sm text-espace-muted">Aucun défi de communauté pour le moment.</p>
      )}
    </div>
  );
}

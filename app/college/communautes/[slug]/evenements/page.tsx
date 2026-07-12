import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EvenementCard } from "@/components/college/communautes/EvenementCard";

export default async function EvenementsPage({ params }: { params: Promise<{ slug: string }> }) {
  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) notFound();

  const evenements = await prisma.evenement.findMany({
    where: { communauteId: communaute.id },
    orderBy: { dateDebut: "asc" },
    include: { _count: { select: { participants: true } } },
  });

  return (
    <div className="flex flex-col gap-3">
      {evenements.map((e) => (
        <EvenementCard
          key={e.id}
          slug={communaute.slug}
          evenementId={e.id}
          titre={e.titre}
          description={e.description}
          lieu={e.lieu}
          dateDebut={e.dateDebut.toISOString()}
          nbParticipants={e._count.participants}
        />
      ))}

      {evenements.length === 0 && (
        <p className="text-center text-sm text-espace-muted">Aucun événement à venir.</p>
      )}
    </div>
  );
}

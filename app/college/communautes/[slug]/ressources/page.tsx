import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RessourceCard } from "@/components/college/communautes/ListItems";
import { AjouterRessourceForm } from "@/components/college/communautes/AjouterRessourceForm";

export default async function RessourcesPage({ params }: { params: Promise<{ slug: string }> }) {
  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) notFound();

  const ressources = await prisma.ressource.findMany({
    where: { communauteId: communaute.id },
    orderBy: { createdAt: "desc" },
    include: { auteur: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <AjouterRessourceForm slug={communaute.slug} />

      <div className="flex flex-col gap-3">
        {ressources.map((r) => (
          <RessourceCard
            key={r.id}
            titre={r.titre}
            url={r.url}
            description={r.description}
            auteur={r.auteur}
          />
        ))}

        {ressources.length === 0 && (
          <p className="text-center text-sm text-espace-muted">Aucune ressource partagée pour le moment.</p>
        )}
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PhotoCard } from "@/components/college/communautes/ListItems";
import { AjouterPhotoForm } from "@/components/college/communautes/AjouterPhotoForm";

export default async function GaleriePage({ params }: { params: Promise<{ slug: string }> }) {
  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) notFound();

  const photos = await prisma.photoGalerie.findMany({
    where: { communauteId: communaute.id },
    orderBy: { createdAt: "desc" },
    include: { auteur: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <AjouterPhotoForm slug={communaute.slug} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((p) => (
          <PhotoCard key={p.id} imageUrl={p.imageUrl} legende={p.legende} auteur={p.auteur} />
        ))}
      </div>

      {photos.length === 0 && (
        <p className="text-center text-sm text-espace-muted">Aucune photo pour le moment.</p>
      )}
    </div>
  );
}

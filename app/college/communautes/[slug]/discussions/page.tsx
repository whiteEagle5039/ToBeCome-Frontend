import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";
import { FilDiscussion } from "@/components/college/communautes/FilDiscussion";

export default async function DiscussionsPage({ params }: { params: Promise<{ slug: string }> }) {
  const eleve = await getCurrentEleve();

  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) notFound();

  const publications = await prisma.publication.findMany({
    where: { communauteId: communaute.id },
    orderBy: { createdAt: "desc" },
    include: {
      auteur: true,
      reponses: { include: { auteur: true }, orderBy: { createdAt: "asc" } },
      reactions: true,
    },
  });

  return (
    <FilDiscussion
      slug={communaute.slug}
      publicationsInitiales={publications.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        reponses: p.reponses.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
      }))}
      eleveIdCourant={eleve?.id}
    />
  );
}

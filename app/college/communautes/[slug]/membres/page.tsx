import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MembreRow } from "@/components/college/communautes/ListItems";

export default async function MembresPage({ params }: { params: Promise<{ slug: string }> }) {
  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) notFound();

  const membres = await prisma.communauteMembre.findMany({
    where: { communauteId: communaute.id },
    orderBy: [{ role: "asc" }, { joinedAt: "asc" }],
    include: { eleve: true },
  });

  return (
    <div className="flex flex-col gap-2">
      {membres.map((m) => (
        <MembreRow
          key={m.id}
          prenom={m.eleve.prenom}
          nom={m.eleve.nom}
          role={m.role}
          joinedAt={m.joinedAt.toISOString()}
        />
      ))}

      {membres.length === 0 && (
        <p className="text-center text-sm text-espace-muted">Aucun membre pour le moment.</p>
      )}
    </div>
  );
}

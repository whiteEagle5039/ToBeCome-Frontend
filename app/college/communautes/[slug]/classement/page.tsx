import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClassementRow } from "@/components/college/communautes/ListItems";

export default async function ClassementPage({ params }: { params: Promise<{ slug: string }> }) {
  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) notFound();

  const membres = await prisma.communauteMembre.findMany({
    where: { communauteId: communaute.id },
    orderBy: { xpGuilde: "desc" },
    take: 50,
    include: { eleve: true },
  });

  return (
    <div className="flex flex-col gap-2">
      {membres.map((m, i) => (
        <ClassementRow
          key={m.id}
          rang={i + 1}
          prenom={m.eleve.prenom}
          nom={m.eleve.nom}
          xpGuilde={m.xpGuilde}
        />
      ))}

      {membres.length === 0 && (
        <p className="text-center text-sm text-espace-muted">Aucun membre classé pour le moment.</p>
      )}
    </div>
  );
}

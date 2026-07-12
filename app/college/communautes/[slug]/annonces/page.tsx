import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AnnoncesPage({ params }: { params: Promise<{ slug: string }> }) {
  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) notFound();

  const annonces = await prisma.annonce.findMany({
    where: { communauteId: communaute.id },
    orderBy: { createdAt: "desc" },
    include: { auteur: true },
  });

  return (
    <div className="flex flex-col gap-3">
      {annonces.map((a) => (
        <article key={a.id} className="rounded-xl border border-espace-border bg-white p-4">
          <p className="text-xs text-espace-muted">
            {new Date(a.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
          </p>
          <h3 className="mt-1 font-semibold text-espace-ink">{a.titre}</h3>
          <p className="mt-1 text-sm text-espace-ink">{a.contenu}</p>
          <p className="mt-2 text-xs text-espace-muted">
            Par {a.auteur.prenom} {a.auteur.nom}
          </p>
        </article>
      ))}

      {annonces.length === 0 && (
        <p className="text-center text-sm text-espace-muted">Aucune annonce pour le moment.</p>
      )}
    </div>
  );
}

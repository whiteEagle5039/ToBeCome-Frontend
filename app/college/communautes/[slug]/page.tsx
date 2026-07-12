import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function CommunauteAccueilPage({ params }: { params: Promise<{ slug: string }> }) {
  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) notFound();

  const [dernieresPublications, prochainEvenement, defisEnCours] = await Promise.all([
    prisma.publication.findMany({
      where: { communauteId: communaute.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { auteur: true, _count: { select: { reponses: true, reactions: true } } },
    }),
    prisma.evenement.findFirst({
      where: { communauteId: communaute.id, dateDebut: { gte: new Date() } },
      orderBy: { dateDebut: "asc" },
    }),
    prisma.defiCommunaute.findMany({
      where: { communauteId: communaute.id },
      orderBy: { createdAt: "desc" },
      take: 2,
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-espace-muted">
            Discussions récentes
          </h2>
          <Link
            href={`/college/communautes/${communaute.slug}/discussions`}
            className="text-sm text-espace-primary hover:underline"
          >
            Voir tout
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {dernieresPublications.map((p) => (
            <div key={p.id} className="rounded-lg border border-espace-border bg-white p-3">
              <p className="text-sm font-semibold text-espace-ink">
                {p.auteur.prenom} {p.auteur.nom}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-espace-ink">{p.contenu}</p>
              <p className="mt-1 text-xs text-espace-muted">
                {p._count.reponses} réponse(s) · {p._count.reactions} réaction(s)
              </p>
            </div>
          ))}
          {dernieresPublications.length === 0 && (
            <p className="text-sm text-espace-muted">Aucune discussion pour le moment.</p>
          )}
        </div>
      </section>

      {prochainEvenement && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-espace-muted">
            Prochain événement
          </h2>
          <div className="rounded-lg border border-espace-border bg-white p-3">
            <p className="font-semibold text-espace-ink">{prochainEvenement.titre}</p>
            <p className="mt-1 text-sm text-espace-muted">
              {new Date(prochainEvenement.dateDebut).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </section>
      )}

      {defisEnCours.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-espace-muted">
              Défis en cours
            </h2>
            <Link
              href={`/college/communautes/${communaute.slug}/defis`}
              className="text-sm text-espace-primary hover:underline"
            >
              Voir tout
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {defisEnCours.map((d) => (
              <div key={d.id} className="rounded-lg border border-espace-border bg-white p-3">
                <p className="font-semibold text-espace-ink">{d.titre}</p>
                <p className="mt-1 text-sm text-espace-muted">{d.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

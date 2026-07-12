import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";
import { MetierCard } from "@/components/college/quetes/MetierCard";
import { BackButton } from "@/components/college/BackButton";
import type { RiasecLetter } from "@/lib/college/riasec/questions";

export default async function TousLesMetiersPage() {
  const eleve = await getCurrentEleve();

  const domaines = await prisma.domaine.findMany({
    orderBy: { nom: "asc" },
    include: { metiers: { orderBy: { nom: "asc" } } },
  });

  let recommandes: Set<string> = new Set();
  if (eleve) {
    const resultat = await prisma.riasecResultat.findUnique({ where: { eleveId: eleve.id } });
    if (resultat) {
      const typesPrincipaux = resultat.typesPrincipaux as RiasecLetter[];
      const recos = await prisma.metier.findMany({
        where: { riasecTypes: { hasSome: typesPrincipaux.slice(0, 2) } },
        select: { slug: true },
      });
      recommandes = new Set(recos.map((r) => r.slug));
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <BackButton href="/college/quetes/hub" label="Hub Quêtes" />
      <h1 className="text-2xl font-bold text-espace-ink">Tous les métiers</h1>
      <p className="mt-2 text-sm text-espace-muted">
        Chaque métier est un univers de jeu accessible librement. Aucun n'est
        verrouillé.
      </p>

      {domaines.map((domaine) => {
        if (domaine.metiers.length === 0) return null;
        return (
          <section key={domaine.id} className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-espace-muted">
              {domaine.nom}
            </h2>
            <div className="flex flex-col gap-3">
              {domaine.metiers.map((m) => (
                <MetierCard
                  key={m.slug}
                  slug={m.slug}
                  nom={m.nom}
                  descriptionCourte={m.descriptionCourte}
                  domaineNom={domaine.nom}
                  recommande={recommandes.has(m.slug)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}

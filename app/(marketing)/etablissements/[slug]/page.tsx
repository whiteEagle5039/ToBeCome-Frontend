import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Mail, GraduationCap } from "lucide-react";

// Ordre et libellés d'affichage des niveaux (de la 6e à la Terminale)
const NIVEAUX: { code: string; label: string }[] = [
  { code: "SIXIEME", label: "6e" },
  { code: "CINQUIEME", label: "5e" },
  { code: "QUATRIEME", label: "4e" },
  { code: "TROISIEME", label: "3e" },
  { code: "SECONDE", label: "2nde" },
  { code: "PREMIERE", label: "1ère" },
  { code: "TERMINALE", label: "Tle" },
];
import { prisma } from "@/lib/prisma";

/**
 * Site vitrine d'un établissement abonné : logo, identité, description,
 * coordonnées, filières — alimenté par Espace établissement > Paramètres.
 */
export default async function SiteEtablissementPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const etab = await prisma.etablissementProfile.findUnique({
    where: { slug },
    include: {
      pagePublique: true,
      classes: { orderBy: [{ niveau: "asc" }, { nom: "asc" }] },
    },
  });

  if (!etab || etab.status !== "ACTIVE" || !etab.pagePublique?.isPublished) notFound();

  const monogramme = etab.nom
    .split(" ")
    .map((m) => m[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-[#DFF6F3] pb-16">
      {/* Bandeau identité */}
      <div className="bg-[#0F766E] px-4 pb-16 pt-10 text-white">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/etablissements"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Tous les établissements
          </Link>

          <div className="mt-6 flex items-center gap-5">
            {etab.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={etab.logoUrl}
                alt={`Logo ${etab.nom}`}
                className="h-20 w-20 rounded-2xl bg-white object-contain p-1"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FFCB05] text-2xl font-extrabold text-[#0F766E]">
                {monogramme}
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFCB05]">
                {etab.type}
              </p>
              <h1 className="mt-1 text-3xl font-bold">{etab.nom}</h1>
              {etab.ville && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                  <MapPin className="h-4 w-4" />
                  {etab.ville}, {etab.pays}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4">
        {etab.description && (
          <section className="-mt-8 rounded-3xl bg-white p-6 shadow-md sm:p-8">
            <h2 className="text-base font-bold text-[#0F766E]">À propos</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{etab.description}</p>
          </section>
        )}

        {etab.classes.length > 0 && (
          <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="flex items-center gap-2 text-base font-bold text-[#0F766E]">
              <GraduationCap className="h-5 w-5" />
              Classes et séries
            </h2>
            <div className="mt-4 space-y-4">
              {NIVEAUX.map((niveau) => {
                const classesNiveau = etab.classes.filter((c) => c.niveau === niveau.code);
                if (classesNiveau.length === 0) return null;
                return (
                  <div key={niveau.code} className="flex flex-wrap items-center gap-2">
                    <span className="w-12 shrink-0 rounded-lg bg-[#0F766E] px-2 py-1 text-center text-sm font-bold text-white">
                      {niveau.label}
                    </span>
                    {classesNiveau.map((c) => (
                      <span
                        key={c.id}
                        className="rounded-full border border-[#0F766E]/20 bg-[#DFF6F3] px-3 py-1 text-sm font-medium text-neutral-800"
                      >
                        {c.nom}
                      </span>
                    ))}
                  </div>
                );
              })}
              {/* Niveaux hors nomenclature standard (saisie libre) */}
              {etab.classes.filter((c) => !NIVEAUX.some((n) => n.code === c.niveau)).length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {etab.classes
                    .filter((c) => !NIVEAUX.some((n) => n.code === c.niveau))
                    .map((c) => (
                      <span
                        key={c.id}
                        className="rounded-full border border-[#0F766E]/20 bg-[#DFF6F3] px-3 py-1 text-sm font-medium text-neutral-800"
                      >
                        {c.nom} ({c.niveau})
                      </span>
                    ))}
                </div>
              )}
            </div>
          </section>
        )}

        {(() => {
          const stats = etab.pagePublique?.statsPubliques as {
            resultatsExamens?: { examen: string; annee: string; tauxReussite: number }[];
          } | null;
          const resultats = stats?.resultatsExamens ?? [];
          if (resultats.length === 0) return null;
          return (
            <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-base font-bold text-[#0F766E]">Résultats aux examens</h2>
              <div className="mt-4 space-y-3">
                {resultats.map((r, i) => (
                  <div key={`${r.examen}-${r.annee}-${i}`}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-semibold text-neutral-800">
                        {r.examen} {r.annee}
                      </span>
                      <span className="font-bold text-[#0F766E]">{r.tauxReussite} %</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[#DFF6F3]">
                      <div
                        className="h-full rounded-full bg-[#0F766E]"
                        style={{ width: `${Math.min(100, Math.max(0, r.tauxReussite))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })()}

        {(etab.pagePublique.filieres?.length ?? 0) > 0 && (
          <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-base font-bold text-[#0F766E]">Filières proposées</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {etab.pagePublique.filieres.map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-[#FFCB05]/25 px-3 py-1 text-sm font-semibold text-neutral-900"
                >
                  {f}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-base font-bold text-[#0F766E]">Contact</h2>
          <div className="mt-3 space-y-2 text-sm text-neutral-600">
            {etab.telephone && (
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#0F766E]" />
                {etab.telephone}
              </p>
            )}
            {etab.email && (
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#0F766E]" />
                {etab.email}
              </p>
            )}
            {etab.adresse && (
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#0F766E]" />
                {etab.adresse}
              </p>
            )}
            {!etab.telephone && !etab.email && !etab.adresse && (
              <p className="text-neutral-400">Coordonnées non renseignées.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

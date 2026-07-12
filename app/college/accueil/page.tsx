import Link from "next/link";
import { redirect } from "next/navigation";
import MissionStatusCard from "@/components/college/MissionStatusCard";
import DiscoveryCarousel from "@/components/college/DiscoveryCarousel";
import CommunautesFlottant from "@/components/college/CommunautesFlottant";
import { metiers } from "@/data/college/metiers";
import MetierCard from "@/components/college/MetierCard";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";

export default async function AccueilPage() {
  const eleve = await getCurrentEleve();
  if (!eleve) redirect("/college/connexion");

  const [resultat, archetypes, nbMissionsFaites, nbMissionsTotal, badges, activites] =
    await Promise.all([
      prisma.riasecResultat.findUnique({ where: { eleveId: eleve.id } }),
      prisma.archetypeRiasec.findMany(),
      prisma.missionProgress.count({ where: { eleveId: eleve.id, isComplete: true } }),
      prisma.mission.count(),
      prisma.eleveBadge.count({ where: { eleveId: eleve.id } }),
      prisma.xpHistorique.findMany({
        where: { eleveId: eleve.id },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

  const aFaitLeTest = !!resultat;
  const dominant = resultat?.typesPrincipaux?.[0];
  const profilNom = archetypes.find((a) => a.lettre === dominant)?.nom;
  const progressionPourcent =
    nbMissionsTotal > 0 ? Math.round((nbMissionsFaites / nbMissionsTotal) * 100) : 0;

  const formatDate = (d: Date) => {
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    const jour = new Date(d);
    jour.setHours(0, 0, 0, 0);
    const diff = Math.round((aujourdhui.getTime() - jour.getTime()) / 86400000);
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return "Hier";
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  return (
    <div className="px-4 pt-6 space-y-6">
      {/* Header personnalisé */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold"
            style={{ background: "var(--college-yellow-100)", color: "var(--college-teal-700)" }}
          >
            {eleve.prenom.charAt(0).toUpperCase()}
          </div>
          <div className="college-card px-3 py-1.5 text-sm">Bonjour {eleve.prenom} !</div>
        </div>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <Link href="/college/profil/parametres" aria-label="Paramètres" style={{ color: "var(--college-ink-600)" }}>
            Paramètres
          </Link>
        </div>
      </div>

      {/* Mission Status */}
      <MissionStatusCard
        aucuneActivite={!aFaitLeTest}
        profilNom={aFaitLeTest ? profilNom : undefined}
        prochaineEtape={aFaitLeTest ? "Continuer ta quête métier" : "Découvrir ton profil"}
        progressionPourcent={progressionPourcent}
        missionsTerminees={nbMissionsFaites}
        missionsTotal={nbMissionsTotal}
        xpGagnes={eleve.xpTotal}
        badgesObtenus={badges}
        ctaHref={aFaitLeTest ? "/college/quetes/hub" : "/college/quetes"}
        ctaLabel={aFaitLeTest ? "Continuer ma quête" : "Commencer le test"}
      />

      {/* Discovery */}
      <DiscoveryCarousel />

      {/* Dernières activités */}
      <div>
        <h3 className="college-title text-base mb-2">Dernières activités</h3>
        <div className="college-card divide-y" style={{ borderColor: "var(--college-border)" }}>
          {activites.length === 0 && (
            <p className="px-4 py-3 text-sm" style={{ color: "var(--college-ink-600)" }}>
              Aucune activité pour le moment. Lance ta première quête !
            </p>
          )}
          {activites.map((a) => (
            <div key={a.id} className="flex justify-between px-4 py-3 text-sm">
              <span>
                {a.raison} (+{a.points} XP)
              </span>
              <span style={{ color: "var(--college-ink-600)" }}>{formatDate(a.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Métiers recommandés */}
      <div>
        <h3 className="college-title text-base mb-2">Métiers recommandés pour toi</h3>
        <div className="grid grid-cols-2 gap-3">
          {metiers.slice(0, 4).map((m) => (
            <MetierCard
              key={m.slug}
              metier={m}
              href={`/college/explorer/fiches/${m.matieres[0]}/${m.slug}`}
            />
          ))}
        </div>
      </div>

      {/* Accès flottant aux communautés par matière */}
      <CommunautesFlottant />
    </div>
  );
}

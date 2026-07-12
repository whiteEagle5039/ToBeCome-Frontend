"use client";

import { getProgressColor } from "@/data/college/utils/progress";

type MissionStatusProps = {
  /** true si l'élève n'a encore rien fait (invite à commencer le RIASEC) */
  aucuneActivite?: boolean;
  profilNom?: string;             // ex: "L'Analyste"
  prochaineEtape: string;         // texte de la prochaine action à réaliser
  progressionPourcent?: number;    // 0-100
  missionsTerminees?: number;
  missionsTotal?: number;
  xpGagnes?: number;
  badgesObtenus?: number;
  ctaHref: string;
  ctaLabel: string;
};

export default function MissionStatusCard({
  aucuneActivite,
  profilNom,
  prochaineEtape,
  progressionPourcent = 0,
  missionsTerminees = 0,
  missionsTotal = 0,
  xpGagnes = 0,
  badgesObtenus = 0,
  ctaHref,
  ctaLabel,
}: MissionStatusProps) {
  return (
    <div className="college-card p-5">
      {aucuneActivite ? (
        <>
          <p className="text-sm font-semibold" style={{ color: "var(--college-teal-700)" }}>
            🚀 Première étape
          </p>
          <h3 className="college-title text-lg mt-1">Découvre ton profil !</h3>
          <p className="text-sm mt-1" style={{ color: "var(--college-ink-600)" }}>
            Réponds à quelques questions pour révéler ton profil d'orientation.
          </p>
        </>
      ) : (
        <>
          {profilNom && (
            <p className="text-sm font-semibold" style={{ color: "var(--college-teal-700)" }}>
              Ton profil : {profilNom}
            </p>
          )}
          <p className="text-sm mt-1" style={{ color: "var(--college-ink-600)" }}>
            Prochaine étape : {prochaineEtape}
          </p>

          <div className="college-progress-track mt-3">
            <div
              className="college-progress-fill"
              style={{
                width: `${progressionPourcent}%`,
                background: getProgressColor(progressionPourcent),
              }}
            />
          </div>
          <div className="flex justify-between text-xs mt-2" style={{ color: "var(--college-ink-600)" }}>
            <span>{missionsTerminees}/{missionsTotal} missions</span>
            <span>⭐ {xpGagnes} XP</span>
            <span>🏅 {badgesObtenus} badges</span>
          </div>
        </>
      )}

      <a
        href={ctaHref}
        className="college-btn-primary inline-block text-center w-full mt-4 py-2.5 text-sm"
      >
        {ctaLabel}
      </a>
    </div>
  );
}

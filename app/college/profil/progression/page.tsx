import { getProgressColor } from "@/data/college/utils/progress";

// TODO: remplacer par les vraies statistiques de l'élève
const stats = {
  niveau: 3,
  xpTotal: 420,
  xpPourNiveauSuivant: 600,
  metiersExplores: 6,
  metiersMaitrises: 2,
  missionsRealisees: 9,
  videosVisionnees: 14,
  badgesObtenus: 4,
};

export default function ProgressionPage() {
  const pourcentageNiveau = Math.round((stats.xpTotal / stats.xpPourNiveauSuivant) * 100);

  return (
    <div className="px-4 pt-6 pb-6 space-y-5">
      <h1 className="college-title text-xl">Progression détaillée</h1>

      <div className="college-card p-5">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-semibold">Niveau {stats.niveau}</span>
          <span>{stats.xpTotal}/{stats.xpPourNiveauSuivant} XP</span>
        </div>
        <div className="college-progress-track">
          <div
            className="college-progress-fill"
            style={{ width: `${pourcentageNiveau}%`, background: getProgressColor(pourcentageNiveau) }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Métiers explorés", val: stats.metiersExplores, emoji: "🧭" },
          { label: "Métiers maîtrisés", val: stats.metiersMaitrises, emoji: "🎓" },
          { label: "Missions réalisées", val: stats.missionsRealisees, emoji: "✅" },
          { label: "Vidéos visionnées", val: stats.videosVisionnees, emoji: "🎬" },
          { label: "Badges obtenus", val: stats.badgesObtenus, emoji: "🏅" },
        ].map((s, i) => (
          <div key={i} className="college-card p-4 text-center">
            <p className="text-2xl">{s.emoji}</p>
            <p className="college-title text-lg mt-1">{s.val}</p>
            <p className="text-xs" style={{ color: "var(--college-ink-600)" }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

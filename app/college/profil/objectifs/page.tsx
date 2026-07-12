// TODO: remplacer par les vrais objectifs de l'élève
const objectifs = [
  { titre: "Explorer 5 nouveaux métiers", description: "Découvre des métiers que tu ne connais pas encore.", progression: 60, recompense: "+30 XP" },
  { titre: "Terminer un parcours métier", description: "Va au bout des 3 missions d'un métier.", progression: 100, recompense: "Badge spécial" },
  { titre: "Gagner 100 XP supplémentaires", description: "Continue tes quêtes pour gagner de l'expérience.", progression: 45, recompense: "+1 niveau" },
];

export default function ObjectifsPage() {
  return (
    <div className="px-4 pt-6 pb-6 space-y-3">
      <h1 className="college-title text-xl mb-2">Objectifs</h1>
      {objectifs.map((o, i) => (
        <div key={i} className="college-card p-4">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-sm">{o.titre}</p>
            {o.progression >= 100 && <span className="text-xs">✅</span>}
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--college-ink-600)" }}>{o.description}</p>
          <div className="college-progress-track mt-2">
            <div
              className="college-progress-fill"
              style={{ width: `${o.progression}%`, background: "var(--college-teal-700)" }}
            />
          </div>
          <p className="text-xs mt-1 text-right" style={{ color: "var(--college-yellow-600)" }}>
            🎁 {o.recompense}
          </p>
        </div>
      ))}
    </div>
  );
}

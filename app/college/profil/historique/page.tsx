// TODO: remplacer par le vrai historique de l'élève (le plus récent en premier)
const historique = [
  { type: "Test RIASEC", date: "3 juillet 2026", heure: "14:32", resume: "Test RIASEC terminé." },
  { type: "Parcours métier", date: "2 juillet 2026", heure: "18:10", resume: "Parcours Développeur Web terminé." },
  { type: "Badge", date: "2 juillet 2026", heure: "18:10", resume: "Badge obtenu." },
  { type: "Vidéo", date: "1 juillet 2026", heure: "20:05", resume: "Vidéo visionnée." },
];

export default function HistoriquePage() {
  return (
    <div className="px-4 pt-6 pb-6">
      <h1 className="college-title text-xl mb-4">Historique</h1>
      <div className="college-card divide-y" style={{ borderColor: "var(--college-border)" }}>
        {historique.map((h, i) => (
          <div key={i} className="p-4">
            <div className="flex justify-between text-xs" style={{ color: "var(--college-ink-600)" }}>
              <span className="font-semibold" style={{ color: "var(--college-teal-700)" }}>{h.type}</span>
              <span>{h.date} · {h.heure}</span>
            </div>
            <p className="text-sm mt-1">{h.resume}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

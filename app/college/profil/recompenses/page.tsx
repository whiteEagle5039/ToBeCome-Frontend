// TODO: remplacer par les vraies récompenses de l'élève
const badges = [
  { nom: "Premier pas", description: "Terminer le test RIASEC", obtenu: true, date: "3 juil. 2026" },
  { nom: "Explorateur", description: "Regarder 5 vidéos métiers", obtenu: true, date: "2 juil. 2026" },
  { nom: "Expert Numérique", description: "Terminer le parcours Développeur Web", obtenu: false },
  { nom: "Collectionneur", description: "Obtenir 10 badges", obtenu: false },
];

export default function RecompensesPage() {
  const pourcentage = Math.round((badges.filter((b) => b.obtenu).length / badges.length) * 100);

  return (
    <div className="px-4 pt-6 pb-6">
      <h1 className="college-title text-xl mb-1">Récompenses</h1>
      <p className="text-sm mb-4" style={{ color: "var(--college-ink-600)" }}>
        {pourcentage}% de la collection complétée
      </p>

      <div className="grid grid-cols-2 gap-3">
        {badges.map((b, i) => (
          <div
            key={i}
            className="college-card p-4 text-center"
            style={{ opacity: b.obtenu ? 1 : 0.5 }}
          >
            <p className="text-3xl mb-1">{b.obtenu ? "🏅" : "🔒"}</p>
            <p className="font-semibold text-sm">{b.nom}</p>
            <p className="text-xs mt-1" style={{ color: "var(--college-ink-600)" }}>{b.description}</p>
            {b.obtenu && b.date && (
              <p className="text-[10px] mt-1" style={{ color: "var(--college-ink-300)" }}>{b.date}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

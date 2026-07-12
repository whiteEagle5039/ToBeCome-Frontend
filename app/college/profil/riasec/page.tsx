import Link from "next/link";

// TODO: remplacer par les vrais résultats du dernier test
const resultat = {
  profilNom: "L'Analyste",
  codeHolland: "IRC",
  description:
    "Tu aimes comprendre comment les choses fonctionnent et résoudre des problèmes avec logique.",
  scores: { R: 70, I: 90, A: 30, S: 40, E: 20, C: 60 },
  dateDernierTest: "3 juillet 2026",
};

const dimensionsLabels: Record<string, string> = {
  R: "Réaliste", I: "Investigateur", A: "Artistique", S: "Social", E: "Entrepreneur", C: "Conventionnel",
};

export default function ProfilRiasecPage() {
  return (
    <div className="px-4 pt-6 pb-6 space-y-5">
      <h1 className="college-title text-xl">Mon profil RIASEC</h1>

      <div className="college-card p-5">
        <p className="font-semibold">{resultat.profilNom}</p>
        <p className="text-xs" style={{ color: "var(--college-ink-600)" }}>
          Code Holland : {resultat.codeHolland}
        </p>
        <p className="text-sm mt-2">{resultat.description}</p>
        <p className="text-xs mt-2" style={{ color: "var(--college-ink-600)" }}>
          Dernier test : {resultat.dateDernierTest}
        </p>
      </div>

      <div className="college-card p-5 space-y-3">
        {Object.entries(resultat.scores).map(([dim, val]) => (
          <div key={dim}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold">{dimensionsLabels[dim]}</span>
              <span>{val}%</span>
            </div>
            <div className="college-progress-track">
              <div className="college-progress-fill" style={{ width: `${val}%`, background: "var(--college-teal-700)" }} />
            </div>
          </div>
        ))}
      </div>

      <Link href="/college/quetes/riasec" className="college-btn-primary block text-center py-3">
        Refaire le test
      </Link>
    </div>
  );
}

const liens = [
  { label: "Mentions légales" },
  { label: "Politique de confidentialité" },
  { label: "Conditions d'utilisation" },
];

export default function AProposPage() {
  return (
    <div className="px-4 pt-6 pb-6 space-y-3">
      <h1 className="college-title text-xl mb-2">À propos</h1>
      <div className="college-card p-4 text-sm text-center" style={{ color: "var(--college-ink-600)" }}>
        To Be.Come — version 1.0.0
      </div>
      {liens.map((l, i) => (
        <button key={i} className="college-card w-full flex justify-between p-4 text-sm font-medium text-left">
          {l.label} <span>→</span>
        </button>
      ))}
    </div>
  );
}

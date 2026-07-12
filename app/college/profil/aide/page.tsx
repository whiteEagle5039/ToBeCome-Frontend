const liens = [
  { label: "FAQ", emoji: "❓" },
  { label: "Guide d'utilisation", emoji: "📘" },
  { label: "Formulaire de contact", emoji: "✉️" },
  { label: "Signaler un problème", emoji: "🚩" },
];

export default function AidePage() {
  return (
    <div className="px-4 pt-6 pb-6 space-y-3">
      <h1 className="college-title text-xl mb-2">Aide</h1>
      {liens.map((l, i) => (
        <button key={i} className="college-card w-full flex justify-between p-4 text-sm font-medium text-left">
          <span className="flex items-center gap-2"><span>{l.emoji}</span>{l.label}</span>
          <span>→</span>
        </button>
      ))}
    </div>
  );
}

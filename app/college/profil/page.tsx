import Link from "next/link";

// TODO: remplacer par les vraies données de l'élève
const eleve = {
  prenom: "Gio",
  nom: "Dupont",
  classe: "4ème B",
  etablissement: "Collège Jean Moulin",
  niveau: 3,
  dateInscription: "12 septembre 2025",
};

const liensSection = [
  { href: "/college/profil/riasec", label: "Mon profil RIASEC", emoji: "🧭" },
  { href: "/college/profil/historique", label: "Historique", emoji: "🕓" },
  { href: "/college/profil/favoris", label: "Favoris", emoji: "⭐" },
  { href: "/college/profil/recompenses", label: "Récompenses", emoji: "🏅" },
  { href: "/college/profil/progression", label: "Progression détaillée", emoji: "📈" },
  { href: "/college/profil/objectifs", label: "Objectifs", emoji: "🎯" },
  { href: "/college/profil/parametres", label: "Paramètres", emoji: "⚙️" },
  { href: "/college/profil/aide", label: "Aide", emoji: "❓" },
  { href: "/college/profil/a-propos", label: "À propos", emoji: "ℹ️" },
];

export default function ProfilPage() {
  return (
    <div className="px-4 pt-6 pb-6 space-y-6">
      <div className="college-card p-5 flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
          style={{ background: "var(--college-yellow-100)" }}
        >
          🧑
        </div>
        <div className="flex-1">
          <p className="font-semibold">{eleve.prenom} {eleve.nom}</p>
          <p className="text-xs" style={{ color: "var(--college-ink-600)" }}>
            {eleve.classe} · {eleve.etablissement}
          </p>
          <p className="text-xs" style={{ color: "var(--college-ink-600)" }}>
            Niveau {eleve.niveau} · Inscrit le {eleve.dateInscription}
          </p>
        </div>
      </div>

      <Link href="/college/profil/modifier" className="college-btn-primary block text-center py-2.5 text-sm">
        Modifier le profil
      </Link>

      <div className="space-y-2">
        {liensSection.map((l) => (
          <Link key={l.href} href={l.href} className="college-card flex items-center justify-between p-4">
            <span className="flex items-center gap-3 text-sm font-medium">
              <span>{l.emoji}</span> {l.label}
            </span>
            <span>→</span>
          </Link>
        ))}
      </div>

      <button
        className="w-full py-3 text-sm font-semibold rounded-full"
        style={{ color: "var(--college-red-500)", border: "1px solid var(--college-red-500)" }}
      >
        Déconnexion
      </button>
    </div>
  );
}

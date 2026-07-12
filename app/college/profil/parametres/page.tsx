"use client";

import { useState } from "react";
import Link from "next/link";

export default function ParametresPage() {
  const [notifications, setNotifications] = useState(true);
  const [sons, setSons] = useState(true);
  const [themeSombre, setThemeSombre] = useState(false);

  return (
    <div className="px-4 pt-6 pb-6 space-y-3">
      <h1 className="college-title text-xl mb-2">Paramètres</h1>

      <Link href="/college/profil/modifier" className="college-card flex justify-between p-4 text-sm font-medium">
        Modifier le profil <span>→</span>
      </Link>
      <Link href="/college/profil/modifier-avatar" className="college-card flex justify-between p-4 text-sm font-medium">
        Modifier l'avatar <span>→</span>
      </Link>
      <Link href="/college/profil/mot-de-passe" className="college-card flex justify-between p-4 text-sm font-medium">
        Changer le mot de passe <span>→</span>
      </Link>

      <ToggleRow label="Notifications" value={notifications} onChange={setNotifications} />
      <ToggleRow label="Effets sonores" value={sons} onChange={setSons} />
      <ToggleRow label="Thème sombre" value={themeSombre} onChange={setThemeSombre} />

      <Link href="/college/profil/langue" className="college-card flex justify-between p-4 text-sm font-medium">
        Langue de l'application <span>Français →</span>
      </Link>
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="college-card flex justify-between items-center p-4">
      <span className="text-sm font-medium">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className="w-11 h-6 rounded-full relative transition-colors"
        style={{ background: value ? "var(--college-teal-700)" : "var(--college-border)" }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
          style={{ transform: value ? "translateX(22px)" : "translateX(2px)" }}
        />
      </button>
    </div>
  );
}

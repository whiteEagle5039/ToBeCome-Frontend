"use client";

import { Check, Laptop, Moon, Palette, Sun } from "lucide-react";
import { Card } from "@/components/parent/ui";
import { SettingsSubHeader } from "@/components/parent/SettingsSubHeader";
import { useLocalSetting } from "@/lib/parent/useLocalSetting";

const THEMES = [
  { id: "light", label: "Clair", icon: Sun },
  { id: "dark", label: "Sombre", icon: Moon },
  { id: "system", label: "Système", icon: Laptop },
] as const;

export default function ApparencePage() {
  const { value: theme, setValue: setTheme } = useLocalSetting<"light" | "dark" | "system">(
    "tobecome_theme",
    "system",
  );

  return (
    <div>
      <SettingsSubHeader
        icon={Palette}
        title="Apparence"
        subtitle="Choisis comment To be.come s'affiche sur cet appareil."
      />

      <Card className="mx-auto mt-6 max-w-2xl p-2">
        {THEMES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTheme(id)}
            className="focus-ring flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-ink hover:bg-teal-50"
          >
            <Icon size={17} className="text-teal-700" />
            <span className="flex-1">{label}</span>
            {theme === id && <Check size={16} className="text-teal-700" />}
          </button>
        ))}
      </Card>

      <p className="mx-auto mt-4 max-w-2xl text-xs text-slate">
        Le mode sombre visuel n&apos;est pas encore branché sur toutes les pages — ton choix est
        déjà enregistré, l&apos;affichage complet arrive dans une prochaine mise à jour.
      </p>
    </div>
  );
}
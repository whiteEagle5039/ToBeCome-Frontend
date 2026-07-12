"use client";

import { Check, Globe } from "lucide-react";
import { Card } from "@/components/parent/ui";
import { SettingsSubHeader } from "@/components/parent/SettingsSubHeader";
import { useLocalSetting } from "@/lib/parent/useLocalSetting";

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
] as const;

export default function LanguagePage() {
  const { value: language, setValue: setLanguage } = useLocalSetting<"fr" | "en">(
    "tobecome_language",
    "fr",
  );

  return (
    <div>
      <SettingsSubHeader
        icon={Globe}
        title="Langue"
        subtitle="Choisis la langue d'affichage de ton espace parent."
      />

      <Card className="mx-auto mt-6 max-w-2xl p-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="focus-ring flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium text-ink hover:bg-teal-50"
          >
            {lang.label}
            {language === lang.code && <Check size={16} className="text-teal-700" />}
          </button>
        ))}
      </Card>

      <p className="mx-auto mt-4 max-w-2xl text-xs text-slate">
        Pour l&apos;instant, seule l&apos;interface parent en français est disponible partout —
        la traduction anglaise complète arrive bientôt.
      </p>
    </div>
  );
}
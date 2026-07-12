"use client";

import { Accessibility } from "lucide-react";
import { Card } from "@/components/parent/ui";
import { SettingsSubHeader } from "@/components/parent/SettingsSubHeader";
import { useLocalSetting } from "@/lib/parent/useLocalSetting";

const TEXT_SIZES = [
  { id: "normal", label: "Normale" },
  { id: "large", label: "Grande" },
  { id: "xlarge", label: "Très grande" },
] as const;

export default function AccessibilitePage() {
  const { value: textSize, setValue: setTextSize } = useLocalSetting<"normal" | "large" | "xlarge">(
    "tobecome_text_size",
    "normal",
  );
  const { value: highContrast, setValue: setHighContrast } = useLocalSetting<"on" | "off">(
    "tobecome_high_contrast",
    "off",
  );
  const { value: reduceMotion, setValue: setReduceMotion } = useLocalSetting<"on" | "off">(
    "tobecome_reduce_motion",
    "off",
  );

  return (
    <div>
      <SettingsSubHeader
        icon={Accessibility}
        title="Accessibilité"
        subtitle="Adapte l'affichage à ton confort de lecture."
      />

      <Card className="mx-auto mt-6 max-w-2xl p-5">
        <p className="mb-2 text-sm font-medium text-ink">Taille du texte</p>
        <div className="flex flex-wrap gap-2">
          {TEXT_SIZES.map((s) => (
            <button
              key={s.id}
              onClick={() => setTextSize(s.id)}
              className={`focus-ring rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                textSize === s.id
                  ? "bg-teal-700 text-white"
                  : "border border-line bg-white text-ink hover:bg-teal-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mx-auto mt-4 max-w-2xl p-2">
        <ToggleRow
          label="Contraste élevé"
          description="Renforce les contrastes de couleur pour une meilleure lisibilité."
          checked={highContrast === "on"}
          onChange={(v) => setHighContrast(v ? "on" : "off")}
        />
        <ToggleRow
          label="Réduire les animations"
          description="Diminue les transitions et effets de mouvement dans l'app."
          checked={reduceMotion === "on"}
          onChange={(v) => setReduceMotion(v ? "on" : "off")}
        />
      </Card>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="focus-ring flex items-center justify-between gap-4 rounded-xl px-4 py-3 hover:bg-teal-50">
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="block text-xs text-slate">{description}</span>
      </span>
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="h-6 w-11 rounded-full bg-black/10 transition-colors peer-checked:bg-teal-700" />
        <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
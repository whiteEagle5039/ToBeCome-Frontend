type ProgressBarProps = {
  value: number;
  label?: string;
  compact?: boolean;
  /** Couleur de remplissage (hex) — change par bloc dans le questionnaire RIASEC. */
  couleur?: string;
};

export function ProgressBar({ value, label, compact = false, couleur }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {label && !compact && (
        <div className="mb-1 flex items-center justify-between text-sm text-espace-muted">
          <span>{label}</span>
          <span className="font-medium text-espace-ink">{clamped}%</span>
        </div>
      )}
      <div
        className={`w-full rounded-full bg-espace-border ${compact ? "h-1.5" : "h-2.5"}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${clamped}%`, background: couleur ?? "#0F766E" }}
        />
      </div>
    </div>
  );
}

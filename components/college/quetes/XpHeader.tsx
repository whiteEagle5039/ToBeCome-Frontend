import { levelFromXp } from "@/lib/college/quetes/xp";
import { ProgressBar } from "./ProgressBar";

type XpHeaderProps = {
  xpTotal: number;
  streakJours?: number;
};

export function XpHeader({ xpTotal, streakJours }: XpHeaderProps) {
  const { level, xpIntoLevel, xpForNextLevel, progressPercent } = levelFromXp(xpTotal);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-espace-border bg-white px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-espace-accent text-sm font-bold text-espace-ink">
        {level}
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between text-xs text-espace-muted">
          <span>Niveau {level}</span>
          <span>
            {xpIntoLevel} / {xpForNextLevel} XP
          </span>
        </div>
        <ProgressBar value={progressPercent} compact />
      </div>
      {typeof streakJours === "number" && streakJours > 0 && (
        <div className="shrink-0 rounded-full bg-espace-surface px-3 py-1 text-xs font-medium text-espace-primary">
          Série : {streakJours} j.
        </div>
      )}
    </div>
  );
}

import { Award, Gauge, Sparkles } from "lucide-react";
import { Child } from "@/lib/parent/types";
import { Card } from "@/components/parent/ui";

interface WeeklySummaryCardProps {
  children: Child[];
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Petit résumé "Cette semaine", basé uniquement sur des données déjà
 * disponibles côté frontend (badges avec dateEarned, progressPercent,
 * riasecCompleted). Le "temps passé" n'est pas encore exposé par
 * l'API (pas de champ équivalent dans BackendEleveProfile) — dès que
 * ce sera le cas, on pourra l'ajouter ici facilement.
 */
export function WeeklySummaryCard({ children }: WeeklySummaryCardProps) {
  if (children.length === 0) return null;

  const now = Date.now();
  const badgesThisWeek = children.reduce((count, child) => {
    return (
      count +
      child.badges.filter((b) => now - new Date(b.dateEarned).getTime() <= WEEK_MS).length
    );
  }, 0);

  const avgProgress = Math.round(
    children.reduce((sum, c) => sum + c.progressPercent, 0) / children.length,
  );

  const riasecDone = children.filter((c) => c.riasecCompleted).length;

  const stats = [
    {
      icon: Award,
      value: badgesThisWeek,
      label: badgesThisWeek > 1 ? "Badges cette semaine" : "Badge cette semaine",
    },
    {
      icon: Gauge,
      value: `${avgProgress}%`,
      label: "Progression moyenne",
    },
    {
      icon: Sparkles,
      value: `${riasecDone}/${children.length}`,
      label: "Tests RIASEC complétés",
    },
  ];

  return (
    <Card className="mt-4 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate">Cette semaine</p>
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
              <Icon size={16} />
            </div>
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold leading-none text-teal-950">{value}</p>
              <p className="mt-0.5 truncate text-[11px] text-slate">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
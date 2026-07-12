import { Child } from "@/lib/parent/types";
import { Card } from "@/components/parent/ui";

interface ChildrenComparisonCardProps {
  children: Child[];
}

const BAR_COLORS = ["bg-rose-500", "bg-sky-600", "bg-emerald-500", "bg-indigo-500", "bg-amber-500"];

export function ChildrenComparisonCard({ children }: ChildrenComparisonCardProps) {
  if (children.length < 2) return null;

  return (
    <Card className="mt-4 p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate">
        Progression comparée
      </p>
      <div className="space-y-3">
        {children.map((child, i) => (
          <div key={child.id} className="flex items-center gap-3">
            <span className="w-20 shrink-0 truncate text-sm font-medium text-ink">
              {child.firstName}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/5">
              <div
                className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                style={{ width: `${child.progressPercent}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-xs text-slate">
              {child.progressPercent}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
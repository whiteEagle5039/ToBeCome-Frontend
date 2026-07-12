import { ActivityItem } from "@/lib/parent/types";
import { ACTIVITY_META } from "@/lib/parent/activity";
import { getIcon } from "@/lib/parent/icons";
import { formatDateTime } from "@/lib/parent/utils";

const TONE_CLASSES: Record<string, string> = {
  teal: "bg-teal-100 text-teal-700",
  yellow: "bg-yellow-100 text-yellow-700",
  slate: "bg-black/5 text-slate",
};

export function ActivityTimeline({ items, limit }: { items: ActivityItem[]; limit?: number }) {
  const sorted = [...items].sort((a, b) => (a.date < b.date ? 1 : -1));
  const shown = limit ? sorted.slice(0, limit) : sorted;

  if (shown.length === 0) {
    return <p className="text-sm text-slate">Aucune activité enregistrée pour le moment.</p>;
  }

  return (
    <ol className="space-y-4">
      {shown.map((item, i) => {
        const meta = ACTIVITY_META[item.type];
        const Icon = getIcon(meta.icon);
        return (
          <li key={item.id} className="relative flex gap-3 pl-1">
            {i < shown.length - 1 && (
              <span className="absolute left-[19px] top-9 h-[calc(100%-8px)] w-px bg-line" aria-hidden />
            )}
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${TONE_CLASSES[meta.tone]}`}>
              <Icon size={16} />
            </div>
            <div className="flex-1 pb-1">
              <p className="text-sm text-ink">{item.label}</p>
              <p className="mt-0.5 text-xs text-slate">{formatDateTime(item.date)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

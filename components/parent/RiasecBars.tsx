import { RiasecScore } from "@/lib/parent/types";

export function RiasecBars({ scores }: { scores: RiasecScore[] }) {
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  return (
    <div className="space-y-3">
      {sorted.map((s, i) => (
        <div key={s.type} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-sm text-ink">{s.label}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/5">
            <div
              className={`h-full rounded-full ${i === 0 ? "bg-yellow-500" : "bg-teal-600"}`}
              style={{ width: `${s.score}%` }}
            />
          </div>
          <span className="w-9 shrink-0 text-right text-sm font-medium text-slate">{s.score}</span>
        </div>
      ))}
    </div>
  );
}

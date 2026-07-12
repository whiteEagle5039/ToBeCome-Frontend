import { LucideIcon } from "lucide-react";
import { Skeleton } from "./Skeleton";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number | null; // null = chargement
  suffix?: string;
  accent?: "teal" | "yellow";
}

export function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  accent = "teal",
}: StatCardProps) {
  const accentClasses =
    accent === "teal" ? "bg-[#0F766E]/10 text-[#0F766E]" : "bg-[#FFCB05]/20 text-[#8a6d00]";

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentClasses}`}>
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
      <div className="mt-4">
        {value === null ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <p className="text-2xl font-semibold text-slate-900">
            {value}
            {suffix && <span className="ml-1 text-base font-medium text-slate-400">{suffix}</span>}
          </p>
        )}
      </div>
    </div>
  );
}

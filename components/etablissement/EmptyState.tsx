import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F766E]/10">
        <Icon className="h-6 w-6 text-[#0F766E]" strokeWidth={1.75} />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="max-w-sm text-sm text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 rounded-full bg-[#0F766E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0c5f59]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

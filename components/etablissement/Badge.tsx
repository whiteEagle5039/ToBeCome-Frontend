type BadgeTone = "success" | "neutral" | "warning" | "danger";

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  neutral: "bg-slate-100 text-slate-600 ring-slate-500/20",
  warning: "bg-[#FFCB05]/20 text-[#8a6d00] ring-[#FFCB05]/40",
  danger: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export function Badge({ label, tone = "neutral" }: { label: string; tone?: BadgeTone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${TONE_CLASSES[tone]}`}
    >
      {label}
    </span>
  );
}

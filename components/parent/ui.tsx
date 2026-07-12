import { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  const base =
    "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    primary: "bg-teal-700 text-white hover:bg-teal-800",
    secondary: "bg-yellow-500 text-teal-950 hover:bg-yellow-400",
    ghost: "bg-transparent text-teal-700 hover:bg-teal-50 border border-line",
    danger: "bg-transparent text-red-600 hover:bg-red-50 border border-red-200",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Card({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-2xl border border-line bg-white ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && !error ? <span className="mt-1 block text-xs text-slate">{hint}</span> : null}
      {error ? <span className="mt-1 block text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`focus-ring w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-slate/70 ${props.className ?? ""}`}
    />
  );
}

export function Pill({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "yellow" | "slate" }) {
  const tones: Record<string, string> = {
    teal: "bg-teal-100 text-teal-800",
    yellow: "bg-yellow-100 text-yellow-700",
    slate: "bg-black/5 text-slate",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-white/60 px-6 py-14 text-center">
      <h3 className="font-display text-lg font-semibold text-teal-900">{title}</h3>
      <p className="max-w-sm text-sm text-slate">{description}</p>
      {action}
    </div>
  );
}
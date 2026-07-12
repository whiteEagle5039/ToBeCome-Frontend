export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <div className="font-display flex items-baseline gap-0.5 text-2xl font-bold leading-none">
      <span className={dark ? "text-white" : "text-teal-900"}>To </span>
      <span className="text-yellow-500 italic">be.</span>
      <span className={dark ? "text-white" : "text-teal-900"}>come</span>
    </div>
  );
}

import Link from "next/link";
import { getCareer } from "@/lib/parent/utils";

export function CareerChip({ careerId, tone = "default" }: { careerId: string; tone?: "default" | "gold" }) {
  const career = getCareer(careerId);
  if (!career) return null;
  return (
    <Link
      href={`/parent/metiers/${career.slug}`}
      className={`focus-ring inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-teal-50 ${
        tone === "gold" ? "border-yellow-300 bg-yellow-50 text-yellow-800" : "border-line bg-white text-ink"
      }`}
    >
      {career.title}
    </Link>
  );
}

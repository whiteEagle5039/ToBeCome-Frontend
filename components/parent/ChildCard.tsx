import Link from "next/link";
import { ChevronRight, Trophy } from "lucide-react";
import { Child } from "@/lib/parent/types";
import { Card, Pill } from "./ui";
import { ChildAvatar } from "./ChildAvatar";
import { RIASEC_LABELS } from "@/lib/parent/mockData";

export function ChildCard({ child }: { child: Child }) {
  return (
    <Link href={`/parent/enfant/${child.id}`} className="focus-ring block">
      <Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-md sm:p-5">
        <ChildAvatar icon={child.avatarIcon} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display font-semibold text-teal-950">
              {child.firstName} {child.lastName}
            </p>
            <Pill tone="slate">{child.className}</Pill>
          </div>
          <p className="mt-0.5 truncate text-xs text-slate">{child.school}</p>

          {child.riasecCompleted ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {child.riasecDominant.map((t) => (
                <Pill key={t} tone="teal">
                  {RIASEC_LABELS[t]}
                </Pill>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs font-medium text-yellow-700">
              Test RIASEC pas encore réalisé
            </p>
          )}

          <div className="mt-3 flex items-center gap-4">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-black/5">
              <div
                className="h-full rounded-full bg-teal-600"
                style={{ width: `${child.progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-slate">{child.progressPercent}% du parcours</span>
            <span className="flex items-center gap-1 text-xs text-slate">
              <Trophy size={14} className="text-yellow-500" /> {child.badges.length}
            </span>
          </div>
        </div>
        <ChevronRight className="shrink-0 text-slate" size={20} />
      </Card>
    </Link>
  );
}

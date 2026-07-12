import { Trophy } from "lucide-react";
import { Child } from "@/lib/parent/types";
import { Card } from "@/components/parent/ui";
import { formatDateTime } from "@/lib/parent/utils";

interface RecentActivityFeedProps {
  children: Child[];
  limit?: number;
}

/**
 * Le champ `activity` du type Child est actuellement toujours vide
 * côté mapper (mapEleveToChild renvoie `activity: []`), donc on ne
 * peut pas encore afficher un vrai fil d'événements (missions,
 * explorations, etc.). En attendant que ce soit branché côté
 * backend, on construit un flux à partir des badges (qui, eux, ont
 * une vraie date `dateEarned`) — c'est un vrai sous-ensemble de
 * l'activité, pas une donnée inventée.
 */
export function RecentActivityFeed({ children, limit = 4 }: RecentActivityFeedProps) {
  const events = children
    .flatMap((child) =>
      child.badges.map((b) => ({
        id: `${child.id}-${b.id}`,
        date: b.dateEarned,
        label: `${child.firstName} a obtenu le badge « ${b.name} ».`,
      })),
    )
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);

  if (events.length === 0) return null;

  return (
    <Card className="mt-4 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate">
        Activité récente
      </p>
      <ul className="space-y-3">
        {events.map((e) => (
          <li key={e.id} className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              <Trophy size={13} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">{e.label}</p>
              <p className="text-[11px] text-slate">{formatDateTime(e.date)}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
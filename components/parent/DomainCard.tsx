import { useMemo } from "react";
import { Domain } from "@/lib/parent/types";
import { getIcon } from "@/lib/parent/icons";
import { Card } from "./ui";
import { ChevronRight } from "lucide-react";

export function DomainCard({
  domain,
  count,
  onClick,
}: {
  domain: Domain;
  count: number;
  onClick: () => void;
}) {
  const Icon = useMemo(() => getIcon(domain.icon), [domain.icon]);
  return (
    <button onClick={onClick} className="focus-ring block w-full text-left">
      <Card className="flex h-full items-start gap-4 p-5 transition-shadow hover:shadow-md">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
          {/* eslint-disable-next-line react-hooks/static-components -- intentional dynamic icon-by-key lookup */}
          <Icon size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display font-semibold text-teal-950">{domain.name}</h2>
          <p className="mt-1 text-sm text-slate">{domain.description}</p>
          <p className="mt-2 text-xs font-medium text-teal-700">
            {count} métier{count > 1 ? "s" : ""}
          </p>
        </div>
        <ChevronRight className="mt-1 shrink-0 text-slate" size={18} />
      </Card>
    </button>
  );
}

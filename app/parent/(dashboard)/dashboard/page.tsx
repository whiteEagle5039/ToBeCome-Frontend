"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useStore } from "@/lib/parent/store";
import { ChildCarousel } from "@/components/parent/ChildCarousel";
import { ChildrenComparisonCard } from "@/components/parent/ChildrenComparisonCard";
import { DiscoveryOfDayCard } from "@/components/parent/DiscoveryOfDayCard";
import { GreetingCard } from "@/components/parent/GreetingCard";
import { RecentActivityFeed } from "@/components/parent/RecentActivityFeed";
import { WeeklySummaryCard } from "@/components/parent/WeeklySummaryCard";
import { Button, EmptyState } from "@/components/parent/ui";

export default function DashboardPage() {
  const { children, profile } = useStore();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return children;
    return children.filter((c) =>
      `${c.firstName} ${c.lastName} ${c.className}`.toLowerCase().includes(q)
    );
  }, [children, query]);

  const initials = `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div>
      <GreetingCard
        firstName={profile.firstName}
        subtitle={`${children.length} enfant${children.length > 1 ? "s" : ""} relié${
          children.length > 1 ? "s" : ""
        } à ton compte.`}
        photoUrl={(profile as { avatarUrl?: string }).avatarUrl}
        initials={initials || undefined}
      />

      {children.length > 0 && (
        <>
          <WeeklySummaryCard children={children} />
          <DiscoveryOfDayCard />
        </>
      )}

      <div className="mt-2">
        {children.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="Aucun enfant relié pour l'instant"
              description="Ajoute ton premier enfant grâce au matricule fourni par son établissement pour commencer à suivre son parcours."
              action={
                <Link href="/parent/ajouter-enfant">
                  <Button variant="secondary">
                    <Plus size={16} /> Ajouter un enfant
                  </Button>
                </Link>
              }
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="Aucun résultat" description="Essaie un autre nom ou une autre classe." />
          </div>
        ) : (
          <ChildCarousel children={filtered} />
        )}
      </div>

      {children.length > 0 && (
        <>
          <ChildrenComparisonCard children={children} />
          <RecentActivityFeed children={children} />
        </>
      )}
    </div>
  );
}
"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { useStore } from "@/lib/parent/store";
import { Button, Card, EmptyState } from "@/components/parent/ui";
import { formatDateTime } from "@/lib/parent/utils";

export default function NotificationsPage() {
  const { notifications, children, markNotificationRead, markAllNotificationsRead } = useStore();

  const sorted = [...notifications].sort((a, b) => (a.date < b.date ? 1 : -1));
  const unreadCount = notifications.filter((n) => !n.read).length;

  function childName(childId: string) {
    const c = children.find((c) => c.id === childId);
    return c ? `${c.firstName} ${c.lastName}` : "Ton enfant";
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-teal-950">Notifications</h1>
          <p className="mt-1 text-sm text-slate">
            L&apos;historique des évènements liés au parcours de tes enfants.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" onClick={markAllNotificationsRead}>
              Tout marquer comme lu
            </Button>
          )}
          <Link href="/parent/parametres">
            <Button variant="ghost">
              <Settings size={16} /> Préférences
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {sorted.length === 0 ? (
          <EmptyState title="Rien à signaler" description="Tu seras notifié dès qu'il y a du nouveau." />
        ) : (
          sorted.map((n) => (
            <Card
              key={n.id}
              className={`flex items-start gap-3 p-4 ${!n.read ? "border-teal-200 bg-teal-50/60" : ""}`}
            >
              <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${!n.read ? "bg-yellow-500" : "bg-transparent"}`} />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <p className="text-sm font-semibold text-teal-950">{n.title}</p>
                  <span className="text-[11px] text-slate">{formatDateTime(n.date)}</span>
                </div>
                <p className="mt-0.5 text-sm text-ink">{n.message}</p>
                <p className="mt-1 text-xs text-slate">Concerne : {childName(n.childId)}</p>
              </div>
              {!n.read && (
                <button
                  onClick={() => markNotificationRead(n.id)}
                  className="focus-ring shrink-0 text-xs font-semibold text-teal-700 hover:underline"
                >
                  Marquer comme lue
                </button>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

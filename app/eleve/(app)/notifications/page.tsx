"use client"

import { useEleveStore } from "@/lib/eleve/store"
import { formatDateTime } from "@/lib/parent/utils"

export default function EleveNotificationsPage() {
  const { notifications, markNotificationRead } = useEleveStore()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#0F766E]">Notifications</h1>
        <p className="text-sm text-black/60">Nouvelles missions, badges et rappels.</p>
      </header>

      {notifications.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-black/20 p-8 text-center text-sm text-black/50">
          Aucune notification pour le moment.
        </p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => markNotificationRead(n.id)}
              className={`w-full rounded-2xl border p-4 text-left transition-all ${
                n.read ? "border-black/10 bg-white/50" : "border-[#FFCB05]/40 bg-white shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-black">{n.title}</p>
                {!n.read && <span className="size-2 shrink-0 rounded-full bg-[#FFCB05]" />}
              </div>
              <p className="mt-1 text-sm text-black/60">{n.message}</p>
              <p className="mt-2 text-xs text-black/40">{formatDateTime(n.date)}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

"use client";

import { Bell, ChevronDown } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4 md:px-8">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="relative rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <button className="flex items-center gap-2 rounded-full border border-slate-100 py-1.5 pl-1.5 pr-3 hover:bg-slate-50">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFCB05]/30 text-xs font-semibold text-[#8a6d00]">
            ÉT
          </div>
          <span className="text-sm font-medium text-slate-700">Mon établissement</span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
      </div>
    </header>
  );
}

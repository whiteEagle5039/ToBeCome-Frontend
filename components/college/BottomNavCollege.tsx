"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Trophy, User, MessagesSquare, Settings } from "lucide-react";

const items = [
  { href: "/college/accueil", label: "Accueil", icon: Home },
  { href: "/college/explorer", label: "Explorer", icon: Compass },
  { href: "/college/quetes", label: "Quêtes", icon: Trophy },
  { href: "/college/communautes", label: "Communautés", icon: MessagesSquare },
  { href: "/college/profil", label: "Profil", icon: User },
  { href: "/college/profil/parametres", label: "Paramètres", icon: Settings },
];

export default function BottomNavCollege() {
  const pathname = usePathname();

  if (pathname?.startsWith("/college/connexion")) {
    return null;
  }

  return (
    <nav
      className="
        fixed z-50 flex border-t
        bottom-0 left-0 right-0 justify-around items-center px-2 py-2
        pb-[max(0.5rem,env(safe-area-inset-bottom))]

        md:top-0 md:bottom-0 md:right-auto md:w-60
        md:flex-col md:items-stretch md:justify-start md:gap-1
        md:border-t-0 md:border-r md:px-3 md:py-6
      "
      style={{
        background: "var(--college-surface)",
        borderColor: "var(--college-border)",
      }}
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className="
              flex flex-col items-center gap-1 px-1.5 py-1 rounded-2xl transition-colors

              md:flex-row md:justify-start md:gap-3 md:px-4 md:py-3
            "
            style={{
              color: active ? "var(--college-teal-700)" : "var(--college-ink-600)",
              background: active ? "var(--college-teal-100)" : "transparent",
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            <span className="hidden text-[11px] font-semibold sm:inline md:text-sm">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

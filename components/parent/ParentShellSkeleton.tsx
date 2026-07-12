import { Skeleton } from "./Skeleton";

/**
 * Reproduit la structure du ParentShell + du dashboard pendant que
 * `hydrated` est encore false, pour éviter l'écran vide "Chargement…"
 * et donner l'impression que la page est déjà là.
 */
export function ParentShellSkeleton() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>

      {/* Rail d'icônes flottant (desktop) */}
      <div className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-1.5 rounded-full border border-line bg-white/95 p-2 shadow-lg lg:flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-11 rounded-full" />
        ))}
      </div>

      {/* Barre du haut (desktop) */}
      <div className="hidden px-4 pb-3 pt-4 lg:block lg:pl-28">
        <div className="mx-auto flex max-w-4xl items-center gap-2 rounded-full border border-line bg-white px-2 py-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 flex-1 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>

      {/* Contenu : carte de bienvenue + cartes enfants */}
      <main className="min-h-screen px-4 py-6 sm:px-8 sm:py-10 lg:pl-28 lg:pt-4">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 sm:p-8">
            <Skeleton className="h-7 w-52" />
            <Skeleton className="mt-2 h-4 w-64" />
            <Skeleton className="absolute right-6 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full sm:right-10 sm:h-24 sm:w-24" />
          </div>

          <div className="mt-8 flex gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-44 shrink-0 pt-7 sm:w-52">
                <Skeleton className="mx-auto h-14 w-14 rounded-full" />
                <Skeleton className="mt-2 h-44 w-full rounded-3xl sm:h-52" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
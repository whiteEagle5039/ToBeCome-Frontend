import { ReactNode } from "react";
import { Brand } from "./Brand";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-teal-950 px-12 py-12 text-white lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full border border-white/10"
        />
        <Brand dark />
        <div className="relative z-10 max-w-sm">
          <p className="font-display text-3xl font-semibold leading-snug">
            Une fenêtre bienveillante sur le parcours de ton enfant.
          </p>
          <p className="mt-4 text-sm text-white/70">
            Suis sa découverte de soi, ses métiers explorés et ses progrès — sans jamais
            prendre sa place.
          </p>
        </div>
        <p className="relative z-10 text-xs uppercase tracking-widest text-white/50">
          Explore. Choisis. Deviens.
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Brand />
          </div>
          <h1 className="font-display text-2xl font-semibold text-teal-950">{title}</h1>
          <p className="mt-1.5 text-sm text-slate">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

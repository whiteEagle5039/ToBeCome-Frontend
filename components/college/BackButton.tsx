"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  /** Destination explicite ; sinon retour à la page précédente. */
  href?: string;
  label?: string;
};

export function BackButton({ href, label = "Retour" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => (href ? router.push(href) : router.back())}
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-espace-muted transition hover:text-espace-primary"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}

// components/etablissements/etablissements-catalogue.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { etablissements as exemples, type Etablissement } from "@/lib/etablissements-data";
import { EtablissementCard } from "./etablissement-card";

export function EtablissementsCatalogue() {
  const [query, setQuery] = useState("");
  // Les vrais établissements abonnés (page publiée) remplacent les exemples
  // dès qu'il y en a au moins un en base.
  const [etablissements, setEtablissements] = useState<Etablissement[]>(exemples);

  useEffect(() => {
    fetch("/api/public/etablissements")
      .then((res) => res.json())
      .then((data: Etablissement[]) => {
        if (Array.isArray(data) && data.length > 0) setEtablissements(data);
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return etablissements;
    return etablissements.filter(
      (e) =>
        e.nom.toLowerCase().includes(q) ||
        e.ville.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q)
    );
  }, [query, etablissements]);

  return (
    <div className="space-y-8">
      <div className="relative mx-auto w-full max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0F766E]/50" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un établissement, une ville..."
          className="h-11 w-full rounded-full border border-[#0F766E]/15 bg-white pl-11 pr-4 text-sm text-[#0F766E] shadow-sm outline-none transition-colors placeholder:text-[#0F766E]/40 focus:border-[#FFCB05] focus:ring-2 focus:ring-[#FFCB05]/40"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((etablissement) => (
            <EtablissementCard
              key={etablissement.id}
              etablissement={etablissement}
            />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-[#0F766E]/60">
          Aucun établissement ne correspond à ta recherche.
        </p>
      )}
    </div>
  );
}
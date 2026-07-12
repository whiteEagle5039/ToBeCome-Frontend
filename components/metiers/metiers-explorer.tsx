// components/metiers/metiers-explorer.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getMetierBySlug as getFicheCollege } from "@/data/college/metiers";
import { Button } from "@/components/ui/button";
import { MetierSearch } from "./metier-search";
import { DomainCard } from "./domain-card";
import { MetierCard } from "./metier-card";
import { MetierDialog } from "./metier-dialog";
import {
  domaines as staticDomaines,
  metiers as staticMetiers,
  getDomaineById,
  getMetiersByDomaine,
  searchMetiers,
  type Domaine,
  type Metier,
} from "@/lib/metiers-data";
import { fetchPublicDomaines, fetchPublicMetiers } from "@/lib/api/metiers";
import { mapMetierPublic } from "@/lib/api/mappers";

// Le slug est conservé pour ouvrir la fiche métier complète (/metier/[slug]),
// identique à celle de l'espace collège.
type MetierAvecSlug = Metier & { slug?: string };

function mapApiMetierToLocal(m: ReturnType<typeof mapMetierPublic>): MetierAvecSlug {
  return {
    id: m.id,
    domaineId: m.domaineId,
    titre: m.titre,
    description: m.description,
    ceQuIlFait: m.ceQuIlFait,
    tachesQuotidiennes: m.tachesQuotidiennes,
    competences: m.competences,
    slug: m.slug,
  };
}

export function MetiersExplorer() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedDomaineId, setSelectedDomaineId] = useState<string | null>(null);
  const [selectedMetier, setSelectedMetier] = useState<Metier | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [domaines, setDomaines] = useState<Domaine[]>(staticDomaines);
  const [allMetiers, setAllMetiers] = useState<Metier[]>(staticMetiers);
  const [domainMetiers, setDomainMetiers] = useState<Metier[]>([]);
  const [searchResults, setSearchResults] = useState<Metier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadCatalog() {
      try {
        const data = await fetchPublicDomaines();
        if (!active || !data.length) return;

        const mappedMetiers = data.flatMap((d) =>
          (d.metiers ?? []).map((m) =>
            mapApiMetierToLocal(
              mapMetierPublic({
                id: m.id,
                nom: m.nom,
                slug: m.slug,
                domaineId: d.id,
                description: m.descriptionCourte ?? "",
                descriptionCourte: m.descriptionCourte ?? "",
                domaine: { id: d.id, nom: d.nom },
              }),
            ),
          ),
        );

        const apiDomaines = data.map((d) => {
          const staticMatch = staticDomaines.find((s) => s.id === d.id);
          return staticMatch ?? {
            id: d.id,
            nom: d.nom,
            description: d.description ?? "",
            icon: staticDomaines[0]?.icon,
            couleur: staticDomaines[0]?.couleur ?? "from-neutral-500 to-neutral-400",
            gradFrom: staticDomaines[0]?.gradFrom ?? "#64748b",
            gradTo: staticDomaines[0]?.gradTo ?? "#94a3b8",
          };
        }) as Domaine[];

        setDomaines(apiDomaines);
        setAllMetiers(mappedMetiers.length ? mappedMetiers : staticMetiers);
      } catch {
        // keep static fallback
      } finally {
        if (active) setLoading(false);
      }
    }
    loadCatalog();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedDomaineId) {
      setDomainMetiers([]);
      return;
    }
    let active = true;
    async function loadDomain() {
      try {
        const data = await fetchPublicMetiers({ domaineId: selectedDomaineId! });
        if (!active) return;
        setDomainMetiers(data.map(mapApiMetierToLocal));
      } catch {
        if (active) setDomainMetiers(getMetiersByDomaine(selectedDomaineId!));
      }
    }
    loadDomain();
    return () => {
      active = false;
    };
  }, [selectedDomaineId]);

  const isSearching = query.trim().length > 1;

  useEffect(() => {
    if (!isSearching) {
      setSearchResults([]);
      return;
    }
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const data = await fetchPublicMetiers({ search: query.trim() });
        if (active) setSearchResults(data.map(mapApiMetierToLocal));
      } catch {
        if (active) setSearchResults(searchMetiers(query));
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, isSearching]);

  const visibleMetiers = useMemo(() => {
    if (selectedDomaineId) {
      return domainMetiers.length ? domainMetiers : getMetiersByDomaine(selectedDomaineId);
    }
    return [];
  }, [selectedDomaineId, domainMetiers]);

  const metierCountByDomain = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of allMetiers) {
      counts.set(m.domaineId, (counts.get(m.domaineId) ?? 0) + 1);
    }
    return counts;
  }, [allMetiers]);

  function openMetier(metier: MetierAvecSlug) {
    // Fiche métier complète (comme dans l'espace collège) quand elle existe ;
    // sinon, aperçu en dialogue en secours.
    const slug = metier.slug ?? metier.id;
    if (getFicheCollege(slug)) {
      router.push(`/metier/${slug}`);
      return;
    }
    setSelectedMetier(metier);
    setDialogOpen(true);
  }

  if (loading) {
    return <p className="text-center text-sm text-muted-foreground">Chargement du catalogue…</p>;
  }

  return (
    <div className="space-y-10">
      <MetierSearch
        query={query}
        onQueryChange={(q) => {
          setQuery(q);
          setSelectedDomaineId(null);
        }}
        hasResults={searchResults.length > 0}
      />

      {isSearching ? (
        searchResults.length > 0 && (
          <div className="mx-auto grid w-full max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((metier) => (
              <MetierCard
                key={metier.id}
                metier={metier}
                domaine={getDomaineById(metier.domaineId) ?? domaines.find((d) => d.id === metier.domaineId)}
                onSelect={openMetier}
              />
            ))}
          </div>
        )
      ) : selectedDomaineId ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDomaineId(null)}
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Tous les domaines
            </Button>
            <h2 className="text-lg font-semibold text-foreground">
              {getDomaineById(selectedDomaineId)?.nom ?? domaines.find((d) => d.id === selectedDomaineId)?.nom}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleMetiers.map((metier) => (
              <MetierCard
                key={metier.id}
                metier={metier}
                domaine={getDomaineById(metier.domaineId) ?? domaines.find((d) => d.id === metier.domaineId)}
                onSelect={openMetier}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-center text-lg font-semibold text-foreground">
            Choisis un domaine pour explorer ses métiers
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {domaines.map((domaine) => (
              <DomainCard
                key={domaine.id}
                domaine={domaine}
                metierCount={metierCountByDomain.get(domaine.id)}
                onSelect={setSelectedDomaineId}
              />
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            {allMetiers.length} métiers référencés pour l&apos;instant.
          </p>
        </div>
      )}

      <MetierDialog
        metier={selectedMetier}
        domaine={
          selectedMetier
            ? getDomaineById(selectedMetier.domaineId) ?? domaines.find((d) => d.id === selectedMetier.domaineId)
            : undefined
        }
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}

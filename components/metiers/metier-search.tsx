// components/metiers/metier-search.tsx
"use client";

import { useState } from "react";
import { Search, SendHorizonal, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function MetierSearch({
  query,
  onQueryChange,
  hasResults,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  hasResults: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Rechercher par métier (ex : plombier, comptable...)"
          className="h-12 pl-10 text-base"
        />
      </div>

      {/* Si une recherche est en cours et qu'aucun métier ne correspond */}
      {query.trim().length > 1 && !hasResults ? (
        <SuggestMetierForm query={query} />
      ) : null}
    </div>
  );
}

function SuggestMetierForm({ query }: { query: string }) {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/suggest-metier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre: query, description }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-4 flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p>
          Merci ! Le métier <strong>« {query} »</strong> a bien été transmis à
          notre équipe. Nous l&apos;ajouterons prochainement au catalogue.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-3 rounded-xl border border-dashed border-border bg-muted/40 p-4"
    >
      <p className="text-sm text-foreground">
        Aucun métier ne correspond à{" "}
        <strong>&laquo; {query} &raquo;</strong>. Dites-nous en un mot ce que
        fait ce métier, on l&apos;ajoutera au catalogue.
      </p>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Ex : Un plombier installe et répare les canalisations d'eau..."
        className="min-h-20 bg-background"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {status === "error"
            ? "Une erreur est survenue, réessaie."
            : "Optionnel mais ça nous aide beaucoup."}
        </p>
        <Button type="submit" size="sm" disabled={status === "sending"}>
          {status === "sending" ? "Envoi..." : "Envoyer"}
          <SendHorizonal className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
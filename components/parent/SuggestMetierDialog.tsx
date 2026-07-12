"use client";

import { FormEvent, useEffect, useState } from "react";
import { Lightbulb, Loader2, X } from "lucide-react";

interface SuggestMetierDialogProps {
  open: boolean;
  initialQuery: string;
  onClose: () => void;
}

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Modale déclenchée quand une recherche de métier ne renvoie aucun
 * résultat : le parent peut proposer le(s) métier(s) qu'il aimerait
 * voir ajoutés au catalogue.
 */
export function SuggestMetierDialog({ open, initialQuery, onClose }: SuggestMetierDialogProps) {
  const [title, setTitle] = useState(initialQuery);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (open) {
      setTitle(initialQuery);
      setMessage("");
      setStatus("idle");
    }
  }, [open, initialQuery]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/metier-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), message: message.trim() }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 bg-teal-950/40 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Fermer la fenêtre"
          className="focus-ring absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate hover:bg-teal-50"
        >
          <X size={16} />
        </button>

        {status === "success" ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              <Lightbulb size={22} />
            </div>
            <h2 className="font-display text-lg font-semibold text-teal-950">Merci pour la suggestion !</h2>
            <p className="mt-1 text-sm text-slate">
              Nous avons bien reçu votre proposition et l&apos;étudierons pour l&apos;ajouter au catalogue.
            </p>
            <button
              onClick={onClose}
              className="focus-ring mt-5 rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
              <Lightbulb size={20} />
            </div>
            <h2 className="font-display text-lg font-semibold text-teal-950">Proposer un métier</h2>
            <p className="mt-1 text-sm text-slate">
              Ce métier n&apos;est pas encore dans notre catalogue. Dites-nous lequel vous aimeriez voir ajouté.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label htmlFor="metier-title" className="mb-1 block text-xs font-semibold text-ink">
                  Nom du métier
                </label>
                <input
                  id="metier-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex : Ingénieur son"
                  required
                  className="focus-ring w-full rounded-xl border border-line px-3 py-2.5 text-sm text-ink placeholder:text-slate"
                />
              </div>

              <div>
                <label htmlFor="metier-message" className="mb-1 block text-xs font-semibold text-ink">
                  Message (facultatif)
                </label>
                <textarea
                  id="metier-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Pourquoi ce métier vous intéresse-t-il pour votre enfant ?"
                  rows={3}
                  className="focus-ring w-full resize-none rounded-xl border border-line px-3 py-2.5 text-sm text-ink placeholder:text-slate"
                />
              </div>

              {status === "error" ? (
                <p className="text-xs font-medium text-red-600">
                  Un problème est survenu. Réessayez dans un instant.
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting" || !title.trim()}
                className="focus-ring flex w-full items-center justify-center gap-2 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? <Loader2 size={16} className="animate-spin" /> : null}
                Envoyer la suggestion
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
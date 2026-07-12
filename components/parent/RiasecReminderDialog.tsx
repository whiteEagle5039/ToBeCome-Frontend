"use client";

import { useState } from "react";
import { Loader2, Mail, MessageSquare, Send, X } from "lucide-react";

interface RiasecReminderDialogProps {
  open: boolean;
  childId: string | null;
  childName: string;
  onClose: () => void;
}

type Channel = "email" | "whatsapp";
type Status = "idle" | "sending" | "success" | "error";

export function RiasecReminderDialog({ open, childId, childName, onClose }: RiasecReminderDialogProps) {
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [status, setStatus] = useState<Status>("idle");

  if (!open || !childId) return null;

  async function handleSend() {
    setStatus("sending");
    try {
      const res = await fetch("/api/parent/rappel-riasec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, channel }),
      });
      if (!res.ok) throw new Error("failed");
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
      <div className="relative w-full max-w-sm rounded-3xl border border-line bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="focus-ring absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate hover:bg-teal-50"
        >
          <X size={16} />
        </button>

        {status === "success" ? (
          <div className="py-2 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              <Send size={18} />
            </div>
            <h2 className="font-display text-lg font-semibold text-teal-950">Rappel envoyé !</h2>
            <p className="mt-1 text-sm text-slate">{childName} va recevoir une petite relance.</p>
            <button
              onClick={onClose}
              className="focus-ring mt-5 rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-display text-lg font-semibold text-teal-950">
              Rappeler à {childName} de faire son test
            </h2>
            <p className="mt-1 text-sm text-slate">
              Un petit message l&apos;encourageant à compléter son test RIASEC.
            </p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setChannel("whatsapp")}
                className={`focus-ring flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                  channel === "whatsapp"
                    ? "border-teal-700 bg-teal-50 text-teal-700"
                    : "border-line text-ink hover:bg-teal-50"
                }`}
              >
                <MessageSquare size={15} /> WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setChannel("email")}
                className={`focus-ring flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                  channel === "email"
                    ? "border-teal-700 bg-teal-50 text-teal-700"
                    : "border-line text-ink hover:bg-teal-50"
                }`}
              >
                <Mail size={15} /> Email
              </button>
            </div>

            {status === "error" && (
              <p className="mt-3 text-xs font-medium text-red-600">
                Un problème est survenu. Réessayez dans un instant.
              </p>
            )}

            <button
              onClick={handleSend}
              disabled={status === "sending"}
              className="focus-ring mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
            >
              {status === "sending" ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
              Envoyer le rappel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
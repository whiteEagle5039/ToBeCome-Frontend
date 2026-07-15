"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button, Field, Input } from "@/components/parent/ui";
import { forgotPasswordParent } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";

export function ForgotPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const isResetMode = Boolean(token);

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleForgotSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await forgotPasswordParent(email);
      setSent(true);
    } catch (err) {
      setError(getApiErrorMessage(err, "Envoi du lien impossible."));
    } finally {
      setLoading(false);
    }
  }

  async function handleResetSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("La confirmation ne correspond pas au mot de passe.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/parent/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Réinitialisation impossible.");
      }

      setDone(true);
    } catch (err) {
      setError(getApiErrorMessage(err, "Réinitialisation impossible."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {isResetMode ? (
        done ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-6 py-8 text-center">
            <CheckCircle2 className="text-teal-700" size={32} />
            <p className="text-sm text-teal-900">
              Ton mot de passe a bien été mis à jour. Tu peux maintenant te connecter.
            </p>
            <Link href="/parent/login" className="focus-ring text-sm font-semibold text-teal-700 hover:underline">
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleResetSubmit}>
            <Field label="Nouveau mot de passe">
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Au moins 8 caractères"
              />
            </Field>
            <Field label="Confirmer le mot de passe" error={error ?? undefined}>
              <Input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répète le mot de passe"
              />
            </Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Mise à jour…" : "Définir le mot de passe"}
            </Button>
            <p className="text-center text-sm text-slate">
              <Link href="/parent/login" className="focus-ring font-semibold text-teal-700 hover:underline">
                Retour à la connexion
              </Link>
            </p>
            {!error ? null : (
              <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </form>
        )
      ) : sent ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-6 py-8 text-center">
          <CheckCircle2 className="text-teal-700" size={32} />
          <p className="text-sm text-teal-900">
            Si un compte existe pour <strong>{email}</strong>, un email vient d’être envoyé avec les instructions.
          </p>
          <Link href="/parent/login" className="focus-ring text-sm font-semibold text-teal-700 hover:underline">
            Retour à la connexion
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleForgotSubmit}>
          <Field label="Adresse email" error={error ?? undefined}>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="toi@exemple.com"
            />
          </Field>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Envoi…" : "Envoyer le lien de réinitialisation"}
          </Button>
          <p className="text-center text-sm text-slate">
            <Link href="/parent/login" className="focus-ring font-semibold text-teal-700 hover:underline">
              Retour à la connexion
            </Link>
          </p>
        </form>
      )}
    </>
  );
}

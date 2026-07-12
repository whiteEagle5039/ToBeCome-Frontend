"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/parent/AuthLayout";
import { Button, Field, Input } from "@/components/parent/ui";
import { CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <AuthLayout
      title="Mot de passe oublié"
      subtitle="Indique ton email, on t'envoie un lien de réinitialisation."
    >
      {sent ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-6 py-8 text-center">
          <CheckCircle2 className="text-teal-700" size={32} />
          <p className="text-sm text-teal-900">
            Si un compte existe pour <strong>{email}</strong>, un email vient de partir avec les
            instructions de réinitialisation.
          </p>
          <Link href="/parent/login" className="focus-ring text-sm font-semibold text-teal-700 hover:underline">
            Retour à la connexion
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field label="Adresse email">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="toi@exemple.com"
            />
          </Field>
          <Button type="submit" className="w-full">
            Envoyer le lien de réinitialisation
          </Button>
          <p className="text-center text-sm text-slate">
            <Link href="/parent/login" className="focus-ring font-semibold text-teal-700 hover:underline">
              Retour à la connexion
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}

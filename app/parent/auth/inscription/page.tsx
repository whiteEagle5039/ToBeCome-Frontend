"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/parent/AuthLayout";
import { Button, Field, Input } from "@/components/parent/ui";
import { useStore } from "@/lib/parent/store";

export default function SignupPage() {
  const { signup } = useStore();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    void (async () => {
      const result = await signup({ firstName, lastName, email, phone }, password);
      setLoading(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.replace("/parent/ajouter-enfant?onboarding=1");
    })();
  }

  return (
    <AuthLayout
      title="Crée ton compte parent"
      subtitle="Quelques informations, et tu pourras relier le compte de ton enfant."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prénom">
            <Input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Prosper" />
          </Field>
          <Field label="Nom">
            <Input required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Zinsou" />
          </Field>
        </div>
        <Field label="Adresse email">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="toi@exemple.com"
          />
        </Field>
        <Field label="Téléphone (WhatsApp)" hint="Utilisé pour recevoir les rapports de tes enfants.">
          <Input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+229 97 00 00 00"
          />
        </Field>
        <Field label="Mot de passe" error={error}>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="4 caractères minimum"
          />
        </Field>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Création…" : "Créer mon compte"}
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-slate">
        Déjà un compte ?{" "}
        <Link href="/parent/login" className="focus-ring font-semibold text-teal-700 hover:underline">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}

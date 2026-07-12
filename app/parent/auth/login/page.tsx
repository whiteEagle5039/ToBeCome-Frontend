"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/parent/AuthLayout";
import { Button, Field, Input } from "@/components/parent/ui";
import { useStore } from "@/lib/parent/store";

export default function LoginPage() {
  const { login } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("prosper.zinsou@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    void (async () => {
      const result = await login(email, password);
      setLoading(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.replace("/parent/dashboard");
    })();
  }

  return (
    <AuthLayout
      title="Content de te revoir"
      subtitle="Connecte-toi pour suivre le parcours d'orientation de tes enfants."
    >
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
        <Field label="Mot de passe" error={error}>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        <div className="flex justify-end">
          <Link href="/parent/auth/mot-de-passe-oublie" className="focus-ring text-sm font-medium text-teal-700 hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </Button>
        <p className="text-center text-xs text-slate">
          Connecte-toi avec ton compte parent To Be.Come.
        </p>
      </form>
      <p className="mt-8 text-center text-sm text-slate">
        Pas encore de compte ?{" "}
        <Link href="/parent/auth/inscription" className="focus-ring font-semibold text-teal-700 hover:underline">
          Créer un compte parent
        </Link>
      </p>
    </AuthLayout>
  );
}

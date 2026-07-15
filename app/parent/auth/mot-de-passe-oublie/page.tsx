import { Suspense } from "react";
import { AuthLayout } from "@/components/parent/AuthLayout";
import { ForgotPasswordClient } from "./ForgotPasswordClient";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Mot de passe oublié"
      subtitle="Indique ton email, on t'envoie un lien de réinitialisation."
    >
      <Suspense fallback={<div className="rounded-2xl border border-slate-100 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">Chargement…</div>}>
        <ForgotPasswordClient />
      </Suspense>
    </AuthLayout>
  );
}

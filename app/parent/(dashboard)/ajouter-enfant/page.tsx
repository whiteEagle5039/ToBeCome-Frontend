"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  FileImage,
  Loader2,
  ShieldCheck,
  UploadCloud,
  UserPlus,
  X,
  XCircle,
} from "lucide-react";
import { AddChildErrorField, useStore } from "@/lib/parent/store";
import { Button, Card, Field, Input } from "@/components/parent/ui";
import { Child } from "@/lib/parent/types";

type Stage = "form" | "checking" | "done";

const CHECK_STEPS = [
  { key: "matricule", label: "Matricule reconnu par l'établissement" },
  { key: "identity", label: "Nom, prénom et date de naissance vérifiés" },
  { key: "document", label: "Acte de naissance analysé et rapproché" },
] as const;

export default function AddChildPage() {
  const { addChild } = useStore();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [matricule, setMatricule] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [file, setFile] = useState<File | undefined>();
  const [filePreview, setFilePreview] = useState<string | undefined>();

  const [stage, setStage] = useState<Stage>("form");
  const [checkedSteps, setCheckedSteps] = useState<number>(0);
  const [error, setError] = useState<string | undefined>();
  const [errorField, setErrorField] = useState<AddChildErrorField | undefined>();
  const [added, setAdded] = useState<Child | undefined>();

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(f);
    setFilePreview(URL.createObjectURL(f));
  }

  function clearFile() {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(undefined);
    setFilePreview(undefined);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(undefined);
    setErrorField(undefined);
    setStage("checking");
    setCheckedSteps(0);

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setCheckedSteps(1), 500));
    timers.push(setTimeout(() => setCheckedSteps(2), 1100));
    timers.push(
      setTimeout(async () => {
        setCheckedSteps(3);
        const result = await addChild({
          matricule,
          firstName,
          lastName,
          birthDate,
          hasBirthCertificate: !!file,
        });
        if (!result.ok) {
          setError(result.error);
          setErrorField(result.errorField);
          setStage("form");
          return;
        }
        setAdded(result.child);
        setStage("done");
      }, 1700),
    );
    return () => timers.forEach(clearTimeout);
  }

  if (stage === "done" && added) {
    return (
      <div className="mx-auto max-w-md">
        <Card className="flex flex-col items-center gap-3 p-8 text-center">
          <CheckCircle2 className="text-teal-700" size={40} />
          <h1 className="font-display text-xl font-semibold text-teal-950">
            Association confirmée
          </h1>
          <p className="text-sm text-slate">
            <strong>
              {added.firstName} {added.lastName}
            </strong>{" "}
            ({added.className}, {added.school}) est maintenant relié·e à ton compte. Son identité
            et son acte de naissance ont été vérifiés auprès de l&apos;établissement. Tu peux
            suivre son parcours d&apos;orientation dès maintenant.
          </p>
          <div className="mt-2 flex gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setAdded(undefined);
                setStage("form");
                setFirstName("");
                setLastName("");
                setMatricule("");
                setBirthDate("");
                clearFile();
              }}
            >
              Ajouter un autre enfant
            </Button>
            <Button onClick={() => router.push(`/parent/enfant/${added.id}`)}>Voir son profil</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (stage === "checking") {
    return (
      <div className="mx-auto max-w-md">
        <Card className="p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <ShieldCheck className="text-teal-700" size={36} />
            <h1 className="font-display text-lg font-semibold text-teal-950">
              Vérification en cours
            </h1>
            <p className="text-sm text-slate">
              On s&apos;assure que {firstName || "cet enfant"} est bien relié·e à ton compte, en
              toute sécurité.
            </p>
          </div>
          <ul className="mt-6 space-y-3">
            {CHECK_STEPS.map((step, i) => {
              const done = checkedSteps > i;
              const active = checkedSteps === i;
              return (
                <li key={step.key} className="flex items-center gap-3 text-sm">
                  {done ? (
                    <CheckCircle2 size={18} className="shrink-0 text-teal-700" />
                  ) : active ? (
                    <Loader2 size={18} className="shrink-0 animate-spin text-yellow-600" />
                  ) : (
                    <span className="h-[18px] w-[18px] shrink-0 rounded-full border border-line" />
                  )}
                  <span className={done ? "text-ink" : "text-slate"}>{step.label}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
          <UserPlus size={20} />
        </div>
        <div>
          <h1 className="font-display text-xl font-semibold text-teal-950">Ajouter un enfant</h1>
          <p className="text-sm text-slate">
            Pour confirmer que c&apos;est bien ton enfant, renseigne ses informations telles que
            connues de l&apos;établissement et joins une photo de son acte de naissance.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <XCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card className="p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom de l'enfant">
              <Input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ex : Dorothée"
              />
            </Field>
            <Field label="Nom de l'enfant">
              <Input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ex : Zinsou"
              />
            </Field>
          </div>

          <Field
            label="Matricule élève"
            hint="Communiqué par l'établissement à l'inscription."
            error={errorField === "matricule" ? "Ce matricule n'a pas été trouvé." : undefined}
          >
            <Input
              required
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              placeholder="Ex : COT-2026-0145"
            />
          </Field>

          <Field
            label="Date de naissance de l'enfant"
            error={errorField === "birthDate" ? "Ne correspond pas au matricule saisi." : undefined}
          >
            <Input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </Field>

          <Field
            label="Photo de l'acte de naissance"
            hint="Utilisée uniquement pour vérifier que l'enfant t'appartient bien."
          >
            {filePreview ? (
              <div className="flex items-center gap-3 rounded-xl border border-line bg-teal-50/50 p-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={filePreview} alt="Aperçu de l'acte de naissance" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{file?.name}</p>
                  <p className="text-xs text-slate">Document prêt à être vérifié</p>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="focus-ring shrink-0 rounded-lg p-1.5 text-slate hover:bg-black/5"
                  aria-label="Retirer le document"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="focus-ring flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-line bg-white px-4 py-6 text-center hover:bg-teal-50/50">
                <UploadCloud size={22} className="text-teal-700" />
                <span className="text-sm font-medium text-ink">Ajouter une photo</span>
                <span className="text-xs text-slate">JPG ou PNG, lisible et complet</span>
                <input required type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            )}
          </Field>

          <div className="flex items-start gap-2 rounded-xl bg-teal-50 px-3.5 py-3 text-xs text-teal-900">
            <FileImage size={15} className="mt-0.5 shrink-0" />
            <span>
              Le nom, le prénom et la date de naissance saisis sont comparés au dossier de
              l&apos;établissement puis à l&apos;acte de naissance fourni, afin de confirmer que
              l&apos;enfant associé est bien le tien.
            </span>
          </div>

          <Button type="submit" className="w-full">
            Vérifier et associer cet enfant
          </Button>
        </form>
      </Card>
    </div>
  );
}

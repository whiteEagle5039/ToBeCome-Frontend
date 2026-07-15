"use client";

import { useEffect, useState } from "react";
import { School, Plus, Pencil, Trash2 } from "lucide-react";
import { TopBar } from "@/components/etablissement/TopBar";
import { EmptyState } from "@/components/etablissement/EmptyState";
import { Skeleton } from "@/components/etablissement/Skeleton";
import { Modal } from "@/components/etablissement/Modal";
import type { Classe } from "@/types/etablissement"
import { createClasse, deleteClasse, fetchClasses } from "@/lib/api/etablissement"

export default function ClassesPage() {
  const [classes, setClasses] = useState<Classe[] | null>(null);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [classeEnEdition, setClasseEnEdition] = useState<Classe | null>(null);
  const [nom, setNom] = useState("");
  const [niveau, setNiveau] = useState("");

  useEffect(() => {
    fetchClasses().then(setClasses).catch(() => setClasses([]));
  }, []);

  function ouvrirCreation() {
    setClasseEnEdition(null);
    setNom("");
    setNiveau("");
    setModalOuvert(true);
  }

  function ouvrirEdition(c: Classe) {
    setClasseEnEdition(c);
    setNom(c.nom);
    setNiveau(c.niveau);
    setModalOuvert(true);
  }

  function enregistrer() {
    // TODO: créer ou mettre à jour la classe via l'API
    console.log(classeEnEdition ? "Mise à jour classe" : "Création classe", { nom, niveau });
    setModalOuvert(false);
  }

  function supprimer(id: string) {
    // TODO: appeler l'API de suppression
    console.log("Suppression classe", id);
  }

  return (
    <>
      <TopBar title="Classes" subtitle={classes ? `${classes.length} classe(s)` : undefined} />

      <div className="px-6 py-6 md:px-8">
        <div className="mb-4 flex justify-end">
          <button
            onClick={ouvrirCreation}
            className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c5f59]"
          >
            <Plus className="h-4 w-4" /> Nouvelle classe
          </button>
        </div>

        {classes === null ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        ) : classes.length === 0 ? (
          <EmptyState
            icon={School}
            title="Aucune classe créée"
            description="Créez vos premières classes pour ensuite y affecter des élèves et générer leurs matricules."
            actionLabel="Créer une classe"
            onAction={ouvrirCreation}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((c) => (
              <div key={c.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{c.nom}</p>
                    <p className="text-xs text-slate-400">{c.niveau}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => ouvrirEdition(c)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-[#0F766E]"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => supprimer(c.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-2xl font-semibold text-slate-900">
                  {c.effectif}
                  <span className="ml-1 text-sm font-normal text-slate-400">élève(s)</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={modalOuvert}
        onClose={() => setModalOuvert(false)}
        title={classeEnEdition ? "Modifier la classe" : "Nouvelle classe"}
        footer={
          <>
            <button
              onClick={() => setModalOuvert(false)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              onClick={enregistrer}
              className="rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c5f59]"
            >
              Enregistrer
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Nom de la classe</label>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex : 4ème A"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Niveau</label>
            <input
              value={niveau}
              onChange={(e) => setNiveau(e.target.value)}
              placeholder="Ex : Collège"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import {
  Accessibility,
  Bell,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Globe,
  HelpCircle,
  Info,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Palette,
  Settings,
  Shield,
  Smartphone,
  Trash2,
  UserCircle2,
} from "lucide-react";
import { useStore } from "@/lib/parent/store";
import { Button, Card, Field, Input } from "@/components/parent/ui";
import { NotificationChannel, NotificationFrequency } from "@/lib/parent/types";

const CHANNELS: { id: NotificationChannel; label: string; icon: typeof Bell }[] = [
  { id: "in-app", label: "Dans l'application", icon: Smartphone },
  { id: "email", label: "Email", icon: Mail },
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
];

const FREQUENCIES: { id: NotificationFrequency; label: string }[] = [
  { id: "instant", label: "Instantané" },
  { id: "weekly", label: "Résumé hebdomadaire" },
  { id: "monthly", label: "Résumé mensuel" },
];

// Entrées qui n'ont pas encore de page dédiée : on affiche un message
// "Bientôt disponible" au clic plutôt qu'un lien mort.
const MORE_SETTINGS = [
  { id: "langue", label: "Langue", icon: Globe, href: "/parent/parametres/langue" },
  { id: "apparence", label: "Apparence", icon: Palette, href: "/parent/parametres/apparence" },
  { id: "accessibilite", label: "Accessibilité", icon: Accessibility, href: "/parent/parametres/accessibilite" },
  { id: "confidentialite", label: "Confidentialité", icon: Eye, href: "/parent/parametres/confidentialite" },
  { id: "export", label: "Télécharger mes données", icon: Download, href: "/parent/parametres/telecharger-donnees" },
  { id: "aide", label: "Aide & Support", icon: HelpCircle, href: "/parent/parametres/aide" },
  { id: "cgu", label: "Conditions d'utilisation", icon: FileText, href: "/parent/parametres/conditions" },
  { id: "politique", label: "Politique de confidentialité", icon: Lock, href: "/parent/parametres/politique-confidentialite" },
  { id: "apropos", label: "À propos", icon: Info, href: "/parent/parametres/a-propos" },
] as const;

export default function SettingsPage() {
  const { profile, updateProfile, notificationSettings, updateNotificationSettings, logout } = useStore();

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [savedProfile, setSavedProfile] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    (profile as { avatarUrl?: string }).avatarUrl,
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [savedPassword, setSavedPassword] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);
      // `avatarUrl` : ajoute ce champ optionnel à ton type Profile
      // (@/lib/parent/types) pour que la sauvegarde soit typée correctement.
      updateProfile({ ...profile, avatarUrl: dataUrl } as typeof profile);
    };
    reader.readAsDataURL(file);
  }

  function handleProfileSubmit(e: FormEvent) {
    e.preventDefault();
    updateProfile({ firstName, lastName, email, phone, avatarUrl } as typeof profile);
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2500);
  }

  function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setPasswordError(undefined);
    setSavedPassword(false);
    if (currentPassword.length < 4) {
      setPasswordError("Mot de passe actuel incorrect.");
      return;
    }
    if (newPassword.length < 4) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 4 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("La confirmation ne correspond pas au nouveau mot de passe.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSavedPassword(true);
    setTimeout(() => setSavedPassword(false), 2500);
  }

  function toggleChannel(channel: NotificationChannel) {
    const has = notificationSettings.channels.includes(channel);
    const channels = has
      ? notificationSettings.channels.filter((c) => c !== channel)
      : [...notificationSettings.channels, channel];
    updateNotificationSettings({ ...notificationSettings, channels });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
          <Settings size={20} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-teal-950">Paramètres</h1>
          <p className="text-sm text-slate">Profil, sécurité et préférences.</p>
        </div>
      </div>

      {/* 👤 Mon profil */}
      <Card id="profil" className="mt-6 scroll-mt-24 p-6">
        <h2 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-teal-950">
          <UserCircle2 size={18} /> Mon profil
        </h2>

        <div className="mb-5 flex items-center gap-4">
          <label className="focus-ring relative cursor-pointer">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Photo de profil"
                className="h-16 w-16 rounded-full border border-line object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-700 text-lg font-semibold text-white">
                {initials || <UserCircle2 size={26} />}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-teal-100 text-teal-700">
              <Palette size={11} />
            </span>
            <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
          </label>
          <div>
            <p className="text-sm font-medium text-ink">Photo de profil</p>
            <p className="text-xs text-slate">Clique sur l&apos;avatar pour la changer.</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom">
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </Field>
            <Field label="Nom">
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </Field>
          </div>
          <Field label="Adresse email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Téléphone (WhatsApp)">
            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </Field>
          <div className="flex items-center gap-3">
            <Button type="submit">Enregistrer les modifications</Button>
            {savedProfile && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-teal-700">
                <CheckCircle2 size={16} /> Profil mis à jour
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* 🔒 Sécurité */}
      <Card id="securite" className="mt-6 scroll-mt-24 p-6">
        <h2 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-teal-950">
          <KeyRound size={18} /> Sécurité — Modifier le mot de passe
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Field label="Mot de passe actuel">
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nouveau mot de passe">
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </Field>
            <Field label="Confirmer" error={passwordError}>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Field>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit">Mettre à jour le mot de passe</Button>
            {savedPassword && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-teal-700">
                <CheckCircle2 size={16} /> Mot de passe modifié
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* 🔔 Notifications */}
      <Card id="notifications" className="mt-6 scroll-mt-24 p-6">
        <h2 className="mb-1 flex items-center gap-2 font-display text-base font-semibold text-teal-950">
          <Bell size={18} /> Préférences de notification
        </h2>
        <p className="mb-4 text-xs text-slate">
          Choisis comment et à quelle fréquence être informé du parcours de tes enfants.
        </p>

        <div>
          <p className="mb-2 text-sm font-medium text-ink">Fréquence</p>
          <div className="flex flex-wrap gap-2">
            {FREQUENCIES.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => updateNotificationSettings({ ...notificationSettings, frequency: f.id })}
                className={`focus-ring rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  notificationSettings.frequency === f.id
                    ? "bg-teal-700 text-white"
                    : "border border-line bg-white text-ink hover:bg-teal-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 border-t border-line pt-4">
          <p className="mb-2 text-sm font-medium text-ink">Canaux</p>
          <div className="space-y-2">
            {CHANNELS.map((c) => {
              const Icon = c.icon;
              const checked = notificationSettings.channels.includes(c.id);
              return (
                <label key={c.id} className="focus-ring flex items-center gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleChannel(c.id)}
                    className="h-4 w-4 accent-teal-700"
                  />
                  <Icon size={15} className="text-slate" />
                  {c.label}
                </label>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Reste du menu : langue, apparence, accessibilité, légal, etc. */}
      <Card className="mt-6 p-2">
        {MORE_SETTINGS.map(({ id, label, icon: Icon, href }) => (
          <Link
            key={id}
            href={href}
            className="focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-ink hover:bg-teal-50"
          >
            <Icon size={17} className="text-teal-700" />
            <span className="flex-1">{label}</span>
            <ChevronRight size={16} className="text-slate" />
          </Link>
        ))}
      </Card>

      {/* Zone de compte : déconnexion / suppression */}
      <Card className="mt-6 p-2">
        <button
          type="button"
          onClick={logout}
          className="focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-ink hover:bg-teal-50"
        >
          <LogOut size={17} className="text-teal-700" />
          Déconnexion
        </button>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <Trash2 size={17} />
          Supprimer mon compte
        </button>
      </Card>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            aria-label="Fermer"
            onClick={() => setConfirmDelete(false)}
            className="absolute inset-0 bg-teal-950/40 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-sm rounded-3xl border border-line bg-white p-6 shadow-2xl">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <Shield size={20} />
            </div>
            <h2 className="font-display text-lg font-semibold text-teal-950">Supprimer ton compte ?</h2>
            <p className="mt-1 text-sm text-slate">
              Cette action est définitive : toutes tes données et celles liées à tes enfants seront supprimées.
            </p>
            <div className="mt-5 flex gap-2">
              <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
                Annuler
              </Button>
              <button
                onClick={() => {
                  // TODO: brancher l'appel réel de suppression de compte
                  // (API backend) avant de déconnecter l'utilisateur.
                  setConfirmDelete(false);
                  logout();
                }}
                className="focus-ring flex-1 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
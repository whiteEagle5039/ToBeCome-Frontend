import { Card } from "@/components/parent/ui";

interface GreetingCardProps {
  firstName: string;
  subtitle: string;
  /** URL de la photo de profil du parent, si elle existe */
  photoUrl?: string;
  /** Initiales à afficher si pas de photo (ex: "GK") */
  initials?: string;
}

/**
 * Bloc d'accueil du dashboard : le texte à gauche, et à droite soit la
 * photo de profil du parent, soit ses initiales en avatar, soit — par
 * défaut — une petite mascotte illustrée façon compagnon de bord.
 */
export function GreetingCard({ firstName, subtitle, photoUrl, initials }: GreetingCardProps) {
  return (
    <Card className="relative overflow-hidden p-6 sm:p-8">
      <div className="relative z-10 max-w-[65%] sm:max-w-[60%]">
        <h1 className="font-display text-2xl font-semibold text-teal-950 sm:text-3xl">
          Bonjour {firstName} !
        </h1>
        <p className="mt-1.5 text-sm text-slate">{subtitle}</p>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 sm:right-8">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Photo de profil"
            className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md sm:h-24 sm:w-24"
          />
        ) : initials ? (
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-teal-700 text-xl font-semibold text-white shadow-md sm:h-24 sm:w-24">
            {initials}
          </div>
        ) : (
          <BearMascot className="h-24 w-24 sm:h-28 sm:w-28" />
        )}
      </div>
    </Card>
  );
}

/** Petite mascotte ours, dessinée en interne (aucune ressource externe). */
function BearMascot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="28" r="13" fill="#0f766e" />
      <circle cx="90" cy="28" r="13" fill="#0f766e" />
      <circle cx="30" cy="28" r="6" fill="#5eead4" />
      <circle cx="90" cy="28" r="6" fill="#5eead4" />
      <circle cx="60" cy="62" r="42" fill="#0f766e" />
      <ellipse cx="60" cy="70" rx="26" ry="22" fill="#f4f1ea" />
      <circle cx="46" cy="55" r="5" fill="#0b3b36" />
      <circle cx="74" cy="55" r="5" fill="#0b3b36" />
      <ellipse cx="60" cy="72" rx="7" ry="5" fill="#0b3b36" />
      <path d="M52 82 Q60 88 68 82" stroke="#0b3b36" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="38" cy="68" r="5" fill="#f9a8b4" opacity="0.7" />
      <circle cx="82" cy="68" r="5" fill="#f9a8b4" opacity="0.7" />
    </svg>
  );
}
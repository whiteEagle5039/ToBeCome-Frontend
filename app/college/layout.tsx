import "./college-theme.css";
import { getCurrentEleve } from "@/lib/college/auth/session";
import BottomNavCollege from "@/components/college/BottomNavCollege";

export const metadata = {
  title: "To Be.Come — Espace Collège",
  description: "Explore. Choisis. Deviens.",
  manifest: "/college-manifest.json", // 👉 voir public/college-manifest.json (PWA)
};

export default async function CollegeLayout({ children }: { children: React.ReactNode }) {
  // La nav n'a de sens que pour un élève connecté (Profil, Communautés...) —
  // un invité de salon Battle (ou tout visiteur non connecté) n'y a pas accès,
  // donc pas de barre, et le contenu ne réserve pas sa place.
  const eleve = await getCurrentEleve();
  const connecte = !!eleve;

  return (
    <div className="college-theme">
      {/* Mobile d'abord (PWA), mais confortable aussi sur grand écran */}
      <main
        className={`mx-auto min-h-dvh w-full max-w-md md:max-w-2xl lg:max-w-4xl ${
          connecte ? "pb-24 md:pb-0 md:pl-60" : ""
        }`}
      >
        {children}
      </main>
      {connecte && <BottomNavCollege />}
    </div>
  );
}

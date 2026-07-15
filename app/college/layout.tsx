import "./college-theme.css";
import BottomNavCollege from "@/components/college/BottomNavCollege";

export const metadata = {
  title: "To Be.Come — Espace Collège",
  description: "Explore. Choisis. Deviens.",
  manifest: "/college-manifest.json", // 👉 voir public/college-manifest.json (PWA)
};

export default function CollegeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="college-theme">
      {/* Mobile d'abord (PWA), mais confortable aussi sur grand écran */}
      <main className="pb-24 md:pb-0 mx-auto min-h-dvh w-full max-w-md md:max-w-2xl md:pl-60 lg:max-w-4xl">
        {children}
      </main>
      <BottomNavCollege />
    </div>
  );
}

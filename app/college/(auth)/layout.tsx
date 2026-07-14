import "../college-theme.css";

export const metadata = {
  title: "To Be.Come — Connexion Collège",
};

export default function CollegeAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="college-theme">
      <main className="pb-24 mx-auto min-h-dvh w-full max-w-md md:max-w-2xl lg:max-w-4xl">
        {children}
      </main>
    </div>
  );
}

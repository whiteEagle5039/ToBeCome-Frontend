import { EleveStoreProvider } from "@/lib/eleve/store"

export default function EleveRootLayout({ children }: { children: React.ReactNode }) {
  return <EleveStoreProvider>{children}</EleveStoreProvider>
}

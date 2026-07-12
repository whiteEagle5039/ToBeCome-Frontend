import { EleveShell } from "@/components/eleve/EleveShell"

export default function EleveAppLayout({ children }: { children: React.ReactNode }) {
  return <EleveShell>{children}</EleveShell>
}

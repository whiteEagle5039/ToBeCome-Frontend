import { Sidebar } from "@/components/etablissement/Sidebar"
import { EtablissementAuthGuard } from "@/components/etablissement/AuthGuard"

export default function EtablissementAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <EtablissementAuthGuard>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </EtablissementAuthGuard>
  )
}

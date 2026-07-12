"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getToken } from "@/lib/api/client"

export function EtablissementAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = getToken("etablissement")
    if (!token && pathname?.startsWith("/etablissement/")) {
      router.replace("/etablissement/connexion")
    }
  }, [router, pathname])

  return <>{children}</>
}

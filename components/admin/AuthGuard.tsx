"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getToken } from "@/lib/api/client"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = getToken("admin")
    if (!token && pathname?.startsWith("/admin/") && !pathname?.includes("/connexion")) {
      router.replace("/admin/connexion")
    }
  }, [router, pathname])

  return <>{children}</>
}

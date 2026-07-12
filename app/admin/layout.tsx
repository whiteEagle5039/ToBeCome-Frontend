import { AdminAuthGuard } from "@/components/admin/AuthGuard"

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>
}

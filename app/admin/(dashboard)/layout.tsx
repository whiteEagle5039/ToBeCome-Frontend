import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <div className="flex-1">{children}</div>
    </div>
  )
}

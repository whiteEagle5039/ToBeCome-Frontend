import { ParentShell } from "@/components/parent/ParentShell";

export default function ParentDashboardLayout({ children }: { children: React.ReactNode }) {
  return <ParentShell>{children}</ParentShell>;
}

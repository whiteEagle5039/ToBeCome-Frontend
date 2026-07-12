import { StoreProvider } from "@/lib/parent/store"

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <StoreProvider>{children}</StoreProvider>
}

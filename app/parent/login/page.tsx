import { redirect } from "next/navigation"

export default function ParentLoginRedirect() {
  redirect("/parent/auth/login")
}

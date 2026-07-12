import { redirect } from "next/navigation"

export default function ParentForgotRedirect() {
  redirect("/parent/auth/mot-de-passe-oublie")
}

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Dashboard } from "@/components/ops/Dashboard"

export default async function Home() {
  const session = await auth()
  if (!session) redirect("/login")

  return <Dashboard user={session.user} />
}

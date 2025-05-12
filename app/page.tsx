import { redirect } from "next/navigation"

export default function HomePage() {
  // Use a safer approach for redirecting that won't trigger the error
  return redirect("/dashboard")
}

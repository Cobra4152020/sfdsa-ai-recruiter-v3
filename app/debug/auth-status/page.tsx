import { AuthDebug } from "@/components/auth-debug"

export default function AuthStatusPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Status</h1>
      <AuthDebug />
    </div>
  )
}

import type { Metadata } from "next"
import LoginAuditDashboard from "@/components/login-audit-dashboard"

export const metadata: Metadata = {
  title: "Login Audit | Admin Dashboard",
  description: "Audit and monitor login activity across all user roles",
}

export default function LoginAuditPage() {
  return (
    <div className="container mx-auto py-8">
      <LoginAuditDashboard />
    </div>
  )
}

import type { Metadata } from "next"
import { LoginAuditDashboard } from "@/components/admin/login-audit-dashboard"
import { PageWrapper } from "@/components/page-wrapper"

export const metadata: Metadata = {
  title: "Login Audit | Admin Dashboard",
  description: "Audit and monitor login activity across all user roles",
}

export default function LoginAuditPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto py-8">
        <LoginAuditDashboard />
      </div>
    </PageWrapper>
  )
}

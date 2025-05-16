import { AdminLoginForm } from "@/components/admin/admin-login-form"
import { PageWrapper } from "@/components/page-wrapper"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Login | SF Deputy Sheriff's Association",
  description: "Secure login portal for SFDSA administrators",
}

export default function AdminLoginPage() {
  return (
    <PageWrapper>
      <div className="min-h-[calc(100vh-theme(spacing.16))] flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md">
          <AdminLoginForm />
        </div>
      </div>
    </PageWrapper>
  )
}

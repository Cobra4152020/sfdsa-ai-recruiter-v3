import { AdminLoginForm } from "@/components/admin-login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Login | SF Deputy Sheriff's Association",
  description: "Secure login portal for SFDSA administrators",
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <AdminLoginForm />
      </div>
    </div>
  )
}

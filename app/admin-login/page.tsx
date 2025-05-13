import { AdminDirectLogin } from "@/components/admin-direct-login"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Access | SF Deputy Sheriff's Association",
  description: "Secure admin access for authorized personnel only",
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <AdminDirectLogin />
      </div>
    </div>
  )
}

import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { AdminDirectLogin } from "@/components/admin-direct-login"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Login | SF Deputy Sheriff's Association",
  description: "Secure login portal for SFDSA administrators",
}

export default function AdminLoginPage() {
  return (
    <>
      <ImprovedHeader />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <AdminDirectLogin />
        </div>
      </main>
      <ImprovedFooter />
    </>
  )
}

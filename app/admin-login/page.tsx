import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLoginForm } from "@/components/admin-login-form"
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
          <Card className="border-t-4 border-t-[#0A3C1F] shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-[#0A3C1F]">Admin Login</CardTitle>
              <CardDescription className="text-center">
                Secure access for authorized administrators only
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <AdminLoginForm redirectTo="/admin/dashboard" />

              <div className="text-center text-sm text-gray-600">
                <p>This login is for authorized administrators only.</p>
                <p>If you need assistance, please contact the system administrator.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <ImprovedFooter />
    </>
  )
}

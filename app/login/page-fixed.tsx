import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <>
      <ImprovedHeader />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-t-4 border-t-[#0A3C1F] shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-[#0A3C1F]">Sign In</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <LoginForm redirectTo="/dashboard" />

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-[#0A3C1F] hover:underline font-medium">
                    Create an account
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <ImprovedFooter />
    </>
  )
}

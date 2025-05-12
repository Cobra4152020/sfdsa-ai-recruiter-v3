import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"
import Link from "next/link"
import { VolunteerLoginFormClient } from "@/components/volunteer-login-form-client"

export default function VolunteerLoginPage() {
  return (
    <>
      <ImprovedHeader />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-t-4 border-t-[#0A3C1F]">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-10 w-10 text-[#FFD700] mr-2" />
                <CardTitle className="text-2xl font-bold text-center text-[#0A3C1F]">
                  Volunteer Recruiter Login
                </CardTitle>
              </div>
              <CardDescription className="text-center">
                Sign in to access your volunteer recruiter dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VolunteerLoginFormClient />
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/volunteer-register" className="text-[#0A3C1F] hover:underline font-medium">
                Register as a Volunteer Recruiter
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <Link href="/resend-confirmation" className="text-[#0A3C1F] hover:underline">
                Resend confirmation email
              </Link>
            </p>
          </div>
        </div>
      </main>
      <ImprovedFooter />
    </>
  )
}

"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertCircle, InfoIcon } from "lucide-react"
import Link from "next/link"

export default function VolunteerLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const needsConfirmation = searchParams.get("needsConfirmation") === "true"
  const [error, setError] = useState<string | null>(null)

  return (
    <>
      <ImprovedHeader />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          {needsConfirmation && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Please check your email to confirm your account before logging in. The confirmation link will expire in
                24 hours.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
            <CardContent>{/* Existing login form component */}</CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/volunteer-register" className="text-[#0A3C1F] hover:underline font-medium">
                Register as a Volunteer Recruiter
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <Link href="/forgot-password" className="text-[#0A3C1F] hover:underline">
                Forgot your password?
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

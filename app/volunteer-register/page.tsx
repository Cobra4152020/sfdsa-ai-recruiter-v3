"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { VolunteerRegistrationForm } from "@/components/volunteer-registration-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft } from "lucide-react"

export default function VolunteerRegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  return (
    <>
      <ImprovedHeader />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/volunteer-login"
            className="inline-flex items-center text-[#0A3C1F] hover:text-[#0A3C1F]/80 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>

          <Card className="border-t-4 border-t-[#0A3C1F]">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-10 w-10 text-[#FFD700] mr-2" />
                <CardTitle className="text-2xl font-bold text-center text-[#0A3C1F]">
                  Volunteer Recruiter Registration
                </CardTitle>
              </div>
              <CardDescription className="text-center">
                Join our team of volunteer recruiters and help build the future of the San Francisco Sheriff&apos;s
                Department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VolunteerRegistrationForm isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} />
            </CardContent>
          </Card>

          <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-[#0A3C1F] mb-3">Why become a volunteer recruiter?</h3>
            <ul className="space-y-2 list-disc pl-5 text-gray-600 dark:text-gray-300">
              <li>Help strengthen our community by finding qualified candidates</li>
              <li>Gain valuable experience in recruitment and public service</li>
              <li>Network with law enforcement professionals</li>
              <li>Earn recognition through our badge and points system</li>
              <li>Make a meaningful impact on the future of public safety in San Francisco</li>
            </ul>
          </div>
        </div>
      </main>
      <ImprovedFooter />
    </>
  )
}

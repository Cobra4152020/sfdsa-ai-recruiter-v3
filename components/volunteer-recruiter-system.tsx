"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { VolunteerRecruiterHero } from "@/components/volunteer-recruiter-hero"
import { ReferralLinkGenerator } from "@/components/referral-link-generator"
import { RecruiterContactForm } from "@/components/recruiter-contact-form"
import { VolunteerRecruiterDashboard } from "@/components/volunteer-recruiter-dashboard"
import { RecruiterOnboarding } from "@/components/recruiter-onboarding"
import { useUser } from "@/context/user-context"

export function VolunteerRecruiterSystem() {
  const { currentUser, loading } = useUser()
  const [activeTab, setActiveTab] = useState("overview")

  // If there's no user, show the onboarding component
  if (!loading && !currentUser) {
    return <RecruiterOnboarding />
  }

  return (
    <div className="space-y-8">
      <VolunteerRecruiterHero />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="referrals">Referral Links</TabsTrigger>
          <TabsTrigger value="contacts">Contact Recruits</TabsTrigger>
          <TabsTrigger value="dashboard">Your Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="prose max-w-none dark:prose-invert">
            <h2>Welcome to the Volunteer Recruiter Portal</h2>
            <p>
              Thank you for joining our volunteer recruitment team! As a volunteer recruiter, you play a vital role in
              helping us build the future of the San Francisco Sheriff's Department.
            </p>
            <p>This portal provides you with all the tools you need to successfully refer potential recruits:</p>
            <ul>
              <li>
                <strong>Generate custom referral links</strong> - Create unique, trackable links that you can share via
                email, social media, or text message.
              </li>
              <li>
                <strong>Contact potential recruits</strong> - Send personalized emails directly from our official email
                address.
              </li>
              <li>
                <strong>Track your performance</strong> - Monitor your referrals and see how many have signed up or
                completed the application process.
              </li>
              <li>
                <strong>Earn rewards</strong> - Earn points, badges, and recognition for your recruitment efforts.
              </li>
            </ul>
            <p>Use the tabs above to navigate between different sections of the portal.</p>
          </div>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <ReferralLinkGenerator />
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <RecruiterContactForm />
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <VolunteerRecruiterDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}

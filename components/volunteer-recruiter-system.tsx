"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VolunteerRecruiterHero } from "@/components/volunteer-recruiter-hero";
import { ReferralLinkGenerator } from "@/components/referral-link-generator";
import { RecruiterContactForm } from "@/components/recruiter-contact-form";
import { VolunteerRecruiterDashboard } from "@/components/volunteer-recruiter-dashboard";
import { RecruiterOnboarding } from "@/components/recruiter-onboarding";
import { useUser } from "@/context/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, UserPlus, Info } from "lucide-react";

export function VolunteerRecruiterSystem() {
  const { currentUser, loading } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3C1F]"></div>
      </div>
    );
  }

  // If there's no user, show the onboarding component
  if (!currentUser) {
    return <RecruiterOnboarding />;
  }

  // Check if user is an approved volunteer recruiter
  // Only approved applications should have access
  const isVolunteerRecruiter = currentUser.user_metadata?.volunteer_status === "approved" || 
                              currentUser.app_metadata?.user_type === "volunteer" ||
                              currentUser.user_metadata?.is_volunteer_recruiter === true;

  if (!isVolunteerRecruiter) {
    return (
      <div className="max-w-3xl mx-auto">
        <VolunteerRecruiterHero />
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-600" />
              Volunteer Recruiter Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                You're signed in, but we need to verify your volunteer recruiter status 
                to access the full dashboard. This typically happens when:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You haven't completed the volunteer recruiter application yet</li>
                <li>Your volunteer recruiter application is pending approval</li>
                <li>There was an issue with your account setup</li>
              </ul>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">What can you do?</h4>
                <div className="space-y-3">
                  <Button 
                    className="w-full sm:w-auto mr-4"
                    onClick={() => window.location.href = "/volunteer-register"}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Apply to Become a Volunteer Recruiter
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto"
                    onClick={() => window.location.href = "/contact"}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                If you believe this is an error, please contact our support team at{" "}
                <a href="mailto:support@sfdeputysheriff.com" className="text-[#0A3C1F] hover:underline">
                  support@sfdeputysheriff.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <VolunteerRecruiterHero />

      {/* Success message for verified volunteer recruiters */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <Shield className="h-4 w-4 text-green-600 mr-2" />
          <span className="text-sm text-green-800">
            Welcome back, {currentUser.user_metadata?.first_name || currentUser.email}! 
            You have full access to the volunteer recruiter dashboard.
          </span>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
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
              Thank you for joining our volunteer recruitment team! As a
              volunteer recruiter, you play a vital role in helping us build the
              future of the San Francisco Sheriff&apos;s Department.
            </p>
            <p>
              This portal provides you with all the tools you need to
              successfully refer potential recruits:
            </p>
            <ul>
              <li>
                <strong>Generate custom referral links</strong> - Create unique,
                trackable links that you can share via email, social media, or
                text message.
              </li>
              <li>
                <strong>Contact potential recruits</strong> - Send personalized
                emails directly from our official email address.
              </li>
              <li>
                <strong>Track your performance</strong> - Monitor your referrals
                and see how many have signed up or completed the application
                process.
              </li>
              <li>
                <strong>Earn rewards</strong> - Earn points, badges, and
                recognition for your recruitment efforts.
              </li>
            </ul>
            <p>
              Use the tabs above to navigate between different sections of the
              portal.
            </p>

            {/* Quick Start Guide */}
            <div className="bg-[#0A3C1F]/5 border border-[#0A3C1F]/20 rounded-lg p-6 mt-6">
              <h3 className="text-[#0A3C1F] font-semibold mb-4">Quick Start Guide</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">1. Generate Your Referral Link</h4>
                  <p className="text-sm text-gray-600">
                    Go to the "Referral Links" tab to create your unique tracking link.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">2. Contact Potential Recruits</h4>
                  <p className="text-sm text-gray-600">
                    Use the "Contact Recruits" tab to send professional emails.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">3. Track Your Progress</h4>
                  <p className="text-sm text-gray-600">
                    Monitor your referrals and earnings in "Your Dashboard".
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">4. Earn Rewards</h4>
                  <p className="text-sm text-gray-600">
                    Complete activities to earn points, badges, and recognition.
                  </p>
                </div>
              </div>
            </div>
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
  );
}

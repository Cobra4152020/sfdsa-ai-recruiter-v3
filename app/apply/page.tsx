import { DeputySheriffApplicationForm } from "@/components/deputy-sheriff-application-form";
import { PageWrapper } from "@/components/page-wrapper";
import { AuthRequiredWrapper } from "@/components/auth-required-wrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply - Deputy Sheriff Application | SF Deputy Sheriff Recruitment",
  description:
    "Apply to become a San Francisco Deputy Sheriff. Submit your application interest form to start your journey in law enforcement.",
  keywords:
    "deputy sheriff application, law enforcement jobs, SF sheriff apply, police application, corrections officer application",
};

export default function ApplyPage() {
  return (
    <PageWrapper>
      <AuthRequiredWrapper
        requiredFeature="deputy_application"
        title="Deputy Sheriff Application"
        description="Submit your application to become a San Francisco Deputy Sheriff"
      >
        <div className="min-h-screen bg-background py-12">
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                Application Interest
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Take the first step toward becoming a San Francisco Deputy Sheriff. 
                Our streamlined application system captures your information, connects you with recruiters, and provides ongoing support throughout your journey.
              </p>
              <div className="mt-8 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-lg p-6 max-w-2xl mx-auto">
                <h2 className="text-lg font-semibold text-primary dark:text-primary mb-2">
                  🎯 Why apply through our platform?
                </h2>
                <ul className="text-left text-primary/80 dark:text-primary/90 space-y-2">
                  <li>• <strong>Direct recruiter contact</strong> - We personally connect you with SFSO recruiters</li>
                  <li>• <strong>Preparation resources</strong> - Access practice tests, study guides, and training materials</li>
                  <li>• <strong>Gamified experience</strong> - Earn points and badges while you prepare</li>
                  <li>• <strong>Community support</strong> - Connect with other candidates and mentors</li>
                  <li>• <strong>Ongoing guidance</strong> - We support you throughout the entire process</li>
                </ul>
              </div>
            </div>

            {/* Application Form */}
            <DeputySheriffApplicationForm />
          </div>
        </div>
      </AuthRequiredWrapper>
    </PageWrapper>
  );
} 
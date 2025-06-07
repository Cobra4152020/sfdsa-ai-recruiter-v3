import { DeputySheriffApplicationForm } from "@/components/deputy-sheriff-application-form";
import { PageWrapper } from "@/components/page-wrapper";
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0A3C1F] mb-4">
              Application Interest
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take the first step toward becoming a San Francisco Deputy Sheriff. 
              Submit your application interest form and let us help you build a rewarding career in law enforcement.
            </p>
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                🎯 What happens after you apply?
              </h2>
              <ul className="text-left text-blue-800 space-y-2">
                <li>• Our recruitment team will review your application</li>
                <li>• You'll receive a call during your selected availability window</li>
                <li>• We'll guide you through the next steps in the process</li>
                <li>• Connect you with resources to help you succeed</li>
              </ul>
            </div>
          </div>

          {/* Application Form */}
          <DeputySheriffApplicationForm />
        </div>
      </div>
    </PageWrapper>
  );
} 
import { ProcessExplainer } from "../content"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Application Process | SF Deputy Sheriff Recruitment",
  description: "Learn about the step-by-step application process to become a San Francisco Deputy Sheriff.",
  keywords: "deputy sheriff application, recruitment process, law enforcement career, San Francisco",
}

export default function ApplicationProcessPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <ImprovedHeader />
        <main className="flex-1 bg-white dark:bg-gray-900 pt-8 pb-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-[#0A3C1F] mb-4">Application Process</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Your step-by-step guide to becoming a San Francisco Deputy Sheriff.
            </p>
            <ProcessExplainer />
          </div>
        </main>
        <ImprovedFooter />
      </div>
    </>
  )
} 
"use client"

import { Loader2 } from "lucide-react"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"

export default function DailyBriefingLoading() {
  // Empty function for showOptInForm prop since we don't need it on this page
  const handleShowOptInForm = () => {}

  return (
    <>
      <ImprovedHeader showOptInForm={handleShowOptInForm} />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-[#0A3C1F] dark:text-[#FFD700] mb-4">
                Sgt. Ken's Daily Briefing
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Stay informed, earn points, and advance your journey to becoming a San Francisco Deputy Sheriff.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <Loader2 className="h-16 w-16 text-[#0A3C1F] dark:text-[#FFD700] animate-spin mb-6" />
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                Loading Sgt. Ken's Daily Briefing...
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Preparing today's important information for you...
              </p>
            </div>
          </div>
        </div>
      </main>
      <ImprovedFooter />
    </>
  )
}

import LaunchpadContent from "./content"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Deputy Launchpad | SF Deputy Sheriff Recruitment",
  description: "Earn points, unlock badges, and track your progress toward becoming a San Francisco Deputy Sheriff.",
  keywords: "deputy sheriff, recruitment, points system, badges, rewards, law enforcement career",
}

export default function DeputyLaunchpadPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <ImprovedHeader />
        <main className="flex-1 bg-white dark:bg-gray-900 pt-8 pb-12">
          <LaunchpadContent />
        </main>
        <ImprovedFooter />
      </div>
    </>
  )
}

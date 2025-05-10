import MissionBriefingContent from "./content"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mission Briefing | SF Deputy Sheriff Recruitment",
  description: "Learn about the San Francisco Deputy Sheriff role, requirements, and application process.",
  keywords: "deputy sheriff, mission briefing, recruitment, law enforcement career, San Francisco",
}

export default function MissionBriefingPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <ImprovedHeader />
        <main className="flex-1 bg-white dark:bg-gray-900 pt-8 pb-12">
          <MissionBriefingContent />
        </main>
        <ImprovedFooter />
      </div>
    </>
  )
}

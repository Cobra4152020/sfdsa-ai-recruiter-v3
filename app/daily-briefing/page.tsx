import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { BriefingCard } from "@/components/daily-briefing/briefing-card"
import { BriefingStats } from "@/components/daily-briefing/briefing-stats"
import { BriefingHistory } from "@/components/daily-briefing/briefing-history"

export const metadata = {
  title: "Sgt. Ken's Daily Briefing | SF Deputy Sheriff Recruitment",
  description:
    "Get your daily dose of wisdom and motivation from Sgt. Ken, veteran Sheriff Sergeant. Attend daily briefings to earn points and track your progress.",
}

export default function DailyBriefingPage() {
  return (
    <>
      <ImprovedHeader showOptInForm={() => {}} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#0A3C1F] mb-2 text-center">Sgt. Ken's Daily Briefing</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-8">
          Start your day with insights from a veteran Sheriff Sergeant. Check in daily to earn points and rise through
          the ranks.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BriefingCard />
          </div>

          <div className="space-y-6">
            <BriefingStats />
            <BriefingHistory />
          </div>
        </div>
      </main>

      <ImprovedFooter />
    </>
  )
}

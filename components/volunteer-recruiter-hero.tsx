import { Card, CardContent } from "@/components/ui/card"
import { UsersRound, Trophy, LineChartIcon as ChartLine, Mail } from "lucide-react"

export function VolunteerRecruiterHero() {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A3C1F]">Volunteer Recruiter Portal</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Help us build the future of the San Francisco Sheriff's Department by referring quality candidates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <Card className="border-[#0A3C1F]/20 hover:border-[#0A3C1F]/40 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center">
                <UsersRound className="w-7 h-7 text-[#0A3C1F]" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Refer Candidates</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Generate custom referral links and track conversions.
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#0A3C1F]/20 hover:border-[#0A3C1F]/40 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center">
                <Mail className="w-7 h-7 text-[#0A3C1F]" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Contact Recruits</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Send personalized emails from our official address.
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#0A3C1F]/20 hover:border-[#0A3C1F]/40 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center">
                <ChartLine className="w-7 h-7 text-[#0A3C1F]" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Track Performance</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Monitor your referrals and their progress.</p>
          </CardContent>
        </Card>

        <Card className="border-[#0A3C1F]/20 hover:border-[#0A3C1F]/40 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center">
                <Trophy className="w-7 h-7 text-[#0A3C1F]" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Earn Rewards</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Earn points, badges, and recognition for your efforts.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

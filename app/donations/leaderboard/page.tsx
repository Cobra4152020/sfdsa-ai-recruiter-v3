import { PageWrapper } from "@/components/page-wrapper"
import { DonationLeaderboard } from "@/components/donation-leaderboard"
import { DonationPointsCalculator } from "@/components/donation-points-calculator"

export const metadata = {
  title: "Donation Leaderboard | SFDSA Recruitment",
  description: "See the top donors supporting the San Francisco Deputy Sheriff's Association recruitment efforts",
}

export default function DonationLeaderboardPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#0A3C1F] mb-2">Donation Leaderboard</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Recognizing our generous supporters who are making a difference in our recruitment efforts. Every donation
              helps us reach more potential recruits and strengthen our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <DonationLeaderboard limit={10} showViewAll={false} />
            </div>
            <div>
              <DonationPointsCalculator />
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

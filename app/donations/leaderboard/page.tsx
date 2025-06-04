import { PageWrapper } from "@/components/page-wrapper";
import { DonationLeaderboard } from "@/components/donation-leaderboard";
import { DonationPointsCalculator } from "@/components/donation-points-calculator";

export const metadata = {
  title: "Donation Leaderboard | SFDSA Recruitment",
  description:
    "See the top donors supporting the San Francisco Deputy Sheriff's Association recruitment efforts",
};

export default function DonationLeaderboardPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Donation Leaderboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DonationLeaderboard />
          </div>
          <div>
            <DonationPointsCalculator />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

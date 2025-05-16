import { generateTikTokChallengeStaticParams } from "@/lib/static-params"
import { TikTokChallengePageClient } from "@/components/tiktok-challenge-page-client"

export async function generateStaticParams() {
  // Add dummy params for testing
  return [{ id: "1" }, { id: "2" }, { id: "3" }]
}

export default function ChallengePage({ params }: { params: { id: string } }) {
  return <TikTokChallengePageClient params={params} />
}

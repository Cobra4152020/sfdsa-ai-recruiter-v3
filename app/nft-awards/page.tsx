import { NFT_AWARD_TIERS } from "@/lib/nft-utils"
import { NFTAwardsShowcase } from "@/components/nft-awards-showcase"

export default function NFTAwardsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">NFT Awards</h1>
      <NFTAwardsShowcase awardTiers={NFT_AWARD_TIERS} />
    </div>
  )
} 
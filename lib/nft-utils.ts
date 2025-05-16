import { getServiceSupabase } from "@/lib/supabase-clients"

// Helper function to validate UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

// Helper function to ensure valid UUID
function ensureValidUUID(id: string): string {
  if (isValidUUID(id)) {
    return id
  }
  // For non-UUID strings, generate a deterministic UUID using the string
  const encoder = new TextEncoder()
  const data = encoder.encode(id)
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data[i]
    hash = hash & hash // Convert to 32-bit integer
  }
  return `00000000-0000-4000-8000-${hash.toString(16).padStart(12, '0')}`
}

export interface NFTAward {
  id: string
  name: string
  description: string
  imageUrl: string
  pointThreshold: number
  tokenId?: string
  contractAddress?: string
  blockchainExplorerUrl?: string
}

// Define NFT award tiers
export const NFT_AWARD_TIERS: NFTAward[] = [
  {
    id: "bronze",
    name: "Bronze Recruit",
    description: "Awarded for reaching 1,000 participation points",
    imageUrl: "/nft-awards/bronze-recruit.png",
    pointThreshold: 1000,
  },
  {
    id: "silver",
    name: "Silver Recruit",
    description: "Awarded for reaching 2,500 participation points",
    imageUrl: "/nft-awards/silver-recruit.png",
    pointThreshold: 2500,
  },
  {
    id: "gold",
    name: "Gold Recruit",
    description: "Awarded for reaching 5,000 participation points",
    imageUrl: "/nft-awards/gold-recruit.png",
    pointThreshold: 5000,
  },
  {
    id: "platinum",
    name: "Platinum Recruit",
    description: "Awarded for reaching 10,000 participation points",
    imageUrl: "/nft-awards/platinum-recruit.png",
    pointThreshold: 10000,
  },
]

/**
 * Check if a user has earned any new NFT awards based on their points
 */
export async function checkAndAwardNFTs(userId: string, currentPoints: number) {
  try {
    const validUserId = ensureValidUUID(userId)
    const serviceClient = getServiceSupabase()

    // Get user's existing NFT awards
    const { data: existingAwards, error: fetchError } = await serviceClient
      .from("user_nft_awards")
      .select("nft_award_id")
      .eq("user_id", validUserId)

    if (fetchError) {
      console.error("Error fetching existing NFT awards:", fetchError)
      return { success: false, message: "Failed to fetch existing NFT awards" }
    }

    const existingAwardIds = existingAwards?.map((award) => award.nft_award_id) || []

    // Find eligible awards that haven't been awarded yet
    const eligibleAwards = NFT_AWARD_TIERS.filter(
      (award) => award.pointThreshold <= currentPoints && !existingAwardIds.includes(award.id),
    )

    if (eligibleAwards.length === 0) {
      return { success: true, newAwards: [] }
    }

    // Award new NFTs
    const newAwards: NFTAward[] = []

    for (const award of eligibleAwards) {
      try {
        // In a real implementation, this would mint the NFT on the blockchain
        // For now, we'll just record it in the database
        const { data, error } = await serviceClient
          .from("user_nft_awards")
          .insert([
            {
              user_id: validUserId,
              nft_award_id: award.id,
              awarded_at: new Date().toISOString(),
              points_at_award: currentPoints,
              // In a real implementation, these would come from the blockchain
              token_id: `mock-token-${Math.floor(Math.random() * 1000000)}`,
              contract_address: "0x1234567890123456789012345678901234567890",
            },
          ])
          .select()

        if (error) {
          console.error(`Error awarding NFT ${award.id}:`, error)
          continue
        }

        newAwards.push({
          ...award,
          tokenId: data[0].token_id,
          contractAddress: data[0].contract_address,
          blockchainExplorerUrl: `https://etherscan.io/token/${data[0].contract_address}?a=${data[0].token_id}`,
        })

        // Send notification about the new NFT award
        await fetch("/api/send-nft-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: validUserId,
            nftAwardId: award.id,
          }),
        })
      } catch (awardError) {
        console.error(`Error processing NFT award ${award.id}:`, awardError)
      }
    }

    return { success: true, newAwards }
  } catch (error) {
    console.error("Error checking and awarding NFTs:", error)
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Get all NFT awards for a user
 */
export async function getUserNFTAwards(userId: string) {
  try {
    const validUserId = ensureValidUUID(userId)
    const serviceClient = getServiceSupabase()

    const { data, error } = await serviceClient
      .from("user_nft_awards")
      .select("*, nft_award:nft_award_id(*)")
      .eq("user_id", validUserId)
      .order("awarded_at", { ascending: false })

    if (error) {
      console.error("Error fetching user NFT awards:", error)
      return { success: false, message: "Failed to fetch NFT awards" }
    }

    // Format the awards
    const awards = data.map((item) => ({
      id: item.nft_award_id,
      name: NFT_AWARD_TIERS.find((tier) => tier.id === item.nft_award_id)?.name || "Unknown Award",
      description: NFT_AWARD_TIERS.find((tier) => tier.id === item.nft_award_id)?.description || "",
      imageUrl: NFT_AWARD_TIERS.find((tier) => tier.id === item.nft_award_id)?.imageUrl || "",
      pointThreshold: NFT_AWARD_TIERS.find((tier) => tier.id === item.nft_award_id)?.pointThreshold || 0,
      tokenId: item.token_id,
      contractAddress: item.contract_address,
      awardedAt: item.awarded_at,
      pointsAtAward: item.points_at_award,
      blockchainExplorerUrl: item.contract_address
        ? `https://etherscan.io/token/${item.contract_address}?a=${item.token_id}`
        : undefined,
    }))

    return { success: true, awards }
  } catch (error) {
    console.error("Error getting user NFT awards:", error)
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

import { checkAndAwardNFTs } from "@/lib/nft-utils"
import { awardBadgeToUser } from "@/lib/badge-utils"

export interface DonationPointRule {
  id: number
  name: string
  description: string
  minAmount: number
  maxAmount: number | null
  pointsPerDollar: number
  recurringMultiplier: number
  isActive: boolean
  campaignId: string | null
  createdAt: string
  updatedAt: string
}

export interface DonationCampaign {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string | null
  pointMultiplier: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DonationPointsAward {
  userId: string
  donationId: string
  points: number
  isRecurring: boolean
  amount: number
}

/**
 * Award points for a donation (server-only)
 */
export async function awardDonationPoints() {
  throw new Error('awardDonationPoints is server-only. Use from lib/donation-points-service-server.ts');
}

/**
 * Check and award donation-related badges
 */
async function checkDonationBadges(userId: string, amount: number, isRecurring: boolean) {
  try {
    // 'This function requires server-only logic and must be implemented in lib/donation-points-service-server.ts.'
    const { data: donationHistory, error } = await supabase
      .from("donation_points")
      .select("donation_id, points, is_recurring")
      .eq("user_id", userId)

    if (error) {
      console.error("Error fetching donation history:", error)
      return
    }

    // First donation badge
    if (donationHistory.length === 1) {
      await awardBadgeToUser(userId, "first-donation")
    }

    // Recurring donor badge
    if (isRecurring) {
      await awardBadgeToUser(userId, "recurring-donor")
    }

    // Generous donor badge (single donation of $100+)
    if (amount >= 100) {
      await awardBadgeToUser(userId, "generous-donor")
    }

    // Donation milestone badges
    const totalDonations = donationHistory.length
    if (totalDonations >= 5) {
      await awardBadgeToUser(userId, "donation-milestone-5")
    }
    if (totalDonations >= 10) {
      await awardBadgeToUser(userId, "donation-milestone-10")
    }
    if (totalDonations >= 25) {
      await awardBadgeToUser(userId, "donation-milestone-25")
    }

    // Calculate total donation amount
    const { data: totalData, error: totalError } = await supabase
      .from("donations")
      .select("amount")
      .eq("donor_id", userId)
      .eq("status", "completed")

    if (!totalError && totalData) {
      const totalAmount = totalData.reduce((sum, donation) => sum + (donation.amount || 0), 0)

      // Amount milestone badges
      if (totalAmount >= 250) {
        await awardBadgeToUser(userId, "donation-amount-250")
      }
      if (totalAmount >= 500) {
        await awardBadgeToUser(userId, "donation-amount-500")
      }
      if (totalAmount >= 1000) {
        await awardBadgeToUser(userId, "donation-amount-1000")
      }
    }
  } catch (error) {
    console.error("Error checking donation badges:", error)
  }
}

/**
 * Get donation point rules (server-only)
 */
export async function getDonationPointRules() {
  throw new Error('getDonationPointRules is server-only. Use from lib/donation-points-service-server.ts');
}

/**
 * Update a donation point rule (server-only)
 */
export async function updateDonationPointRule() {
  throw new Error('updateDonationPointRule is server-only. Use from lib/donation-points-service-server.ts');
}

/**
 * Get active donation campaigns (server-only)
 */
export async function getActiveDonationCampaigns() {
  throw new Error('getActiveDonationCampaigns is server-only. Use from lib/donation-points-service-server.ts');
}

/**
 * Get user donation points (server-only)
 */
export async function getUserDonationPoints() {
  throw new Error('getUserDonationPoints is server-only. Use from lib/donation-points-service-server.ts');
}

/**
 * Get donation leaderboard (server-only)
 */
export async function getDonationLeaderboard() {
  throw new Error('getDonationLeaderboard is server-only. Use from lib/donation-points-service-server.ts');
}

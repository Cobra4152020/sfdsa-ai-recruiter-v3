import { createClient } from "@/lib/supabase-clients"
import { getServiceSupabase } from "@/lib/supabase-service"
import { createNotification } from "@/lib/notification-service"
import { awardBadgeToUser } from "@/lib/badge-utils"

// Activity types for recruiters
export enum RecruiterActivityType {
  REFERRAL_SIGNUP = "referral_signup", // Someone signs up using recruiter's link
  REFERRAL_APPLICATION = "referral_application", // Referral submits an application
  REFERRAL_INTERVIEW = "referral_interview", // Referral gets an interview
  REFERRAL_HIRE = "referral_hire", // Referral gets hired
  CREATE_REFERRAL_LINK = "create_referral_link", // Recruiter creates a new referral link
  SEND_EMAIL_INVITE = "send_email_invite", // Recruiter sends an email invitation
  LOGIN_STREAK = "login_streak", // Recruiter logs in consistently
  COMPLETE_TRAINING = "complete_training", // Recruiter completes training
  REWARD_REDEMPTION = "reward_redemption", // Recruiter redeems a reward
  TIER_ACHIEVEMENT = "tier_achievement", // Recruiter reaches a new tier
  SOCIAL_SHARE = "social_share", // Recruiter shares on social media
  FEEDBACK_SUBMISSION = "feedback_submission", // Recruiter provides feedback
}

// Point values for different activities
export const ACTIVITY_POINTS: Record<RecruiterActivityType, number> = {
  [RecruiterActivityType.REFERRAL_SIGNUP]: 50,
  [RecruiterActivityType.REFERRAL_APPLICATION]: 150,
  [RecruiterActivityType.REFERRAL_INTERVIEW]: 300,
  [RecruiterActivityType.REFERRAL_HIRE]: 1000,
  [RecruiterActivityType.CREATE_REFERRAL_LINK]: 10,
  [RecruiterActivityType.SEND_EMAIL_INVITE]: 20,
  [RecruiterActivityType.LOGIN_STREAK]: 25,
  [RecruiterActivityType.COMPLETE_TRAINING]: 100,
  [RecruiterActivityType.REWARD_REDEMPTION]: 0,
  [RecruiterActivityType.TIER_ACHIEVEMENT]: 0,
  [RecruiterActivityType.SOCIAL_SHARE]: 30,
  [RecruiterActivityType.FEEDBACK_SUBMISSION]: 50,
}

// Interface for reward item
export interface RecruiterReward {
  id: number
  name: string
  description: string
  pointsRequired: number
  rewardType: string
  imageUrl: string
  isActive: boolean
  maxRedemptions: number | null
  redemptionsCount: number
}

// Interface for tier level
export interface RecruiterTier {
  id: number
  name: string
  description: string
  pointsRequired: number
  benefits: string[]
  imageUrl: string
  isActive: boolean
}

// Interface for redemption request
export interface RewardRedemptionRequest {
  recruiterId: string
  rewardId: number
  notes?: string
}

// Interface for recruiter stats
export interface RecruiterStats {
  totalPoints: number
  referralSignups: number
  referralApplications: number
  referralInterviews: number
  referralHires: number
  rewardsRedeemed: number
  currentTier: string
  nextTier: RecruiterTier | null
  pointsToNextTier: number
}

/**
 * Award points for recruiter activity
 */
export async function awardRecruiterPoints(
  recruiterId: string,
  activityType: RecruiterActivityType,
  description: string,
  recruitId?: string,
  metadata?: Record<string, any>,
): Promise<{ success: boolean; points?: number; message?: string }> {
  try {
    if (!recruiterId) {
      return { success: false, message: "Recruiter ID is required" }
    }

    const points = ACTIVITY_POINTS[activityType] || 0
    const supabase = getServiceSupabase()

    // Insert the activity and points
    const { data, error } = await supabase
      .from("recruiter_activities")
      .insert({
        recruiter_id: recruiterId,
        activity_type: activityType,
        description,
        points,
        recruit_id: recruitId,
        metadata,
      })
      .select()

    if (error) {
      console.error("Error awarding recruiter points:", error)
      return { success: false, message: error.message }
    }

    // Check for tier advancement
    await checkAndUpdateRecruiterTier(recruiterId)

    // For significant activities, create a notification
    if (points > 100) {
      await createNotification({
        user_id: recruiterId,
        type: "points",
        title: `You earned ${points} recruiter points!`,
        message: description,
        image_url: "/notification-icon.png",
        action_url: "/volunteer-dashboard",
        metadata: {
          points,
          activityType,
        },
      })
    }

    // Check for special badges based on activities
    if (activityType === "referral_hire") {
      await awardBadgeToUser(recruiterId, "successful-recruiter")
    }

    const totalActivities = await getRecruiterActivityCount(recruiterId)

    if (totalActivities >= 10) {
      await awardBadgeToUser(recruiterId, "active-recruiter")
    }

    if (totalActivities >= 50) {
      await awardBadgeToUser(recruiterId, "expert-recruiter")
    }

    return { success: true, points }
  } catch (error) {
    console.error("Exception in awardRecruiterPoints:", error)
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Get total points for a recruiter
 */
export async function getRecruiterPoints(recruiterId: string): Promise<{
  success: boolean
  totalPoints?: number
  message?: string
}> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("recruiter_activities").select("points").eq("recruiter_id", recruiterId)

    if (error) {
      console.error("Error fetching recruiter points:", error)
      return { success: false, message: error.message }
    }

    const totalPoints = data.reduce((sum, activity) => sum + activity.points, 0)

    return { success: true, totalPoints }
  } catch (error) {
    console.error("Exception in getRecruiterPoints:", error)
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Get recruiter activity count
 */
export async function getRecruiterActivityCount(recruiterId: string): Promise<number> {
  try {
    const supabase = createClient()

    const { count, error } = await supabase
      .from("recruiter_activities")
      .select("*", { count: "exact", head: true })
      .eq("recruiter_id", recruiterId)

    if (error) {
      console.error("Error fetching recruiter activity count:", error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error("Exception in getRecruiterActivityCount:", error)
    return 0
  }
}

/**
 * Get available rewards
 */
export async function getAvailableRewards(): Promise<{
  success: boolean
  rewards?: RecruiterReward[]
  message?: string
}> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("recruiter_rewards")
      .select("*")
      .eq("is_active", true)
      .order("points_required", { ascending: true })

    if (error) {
      console.error("Error fetching available rewards:", error)
      return { success: false, message: error.message }
    }

    const rewards = data.map((reward) => ({
      id: reward.id,
      name: reward.name,
      description: reward.description,
      pointsRequired: reward.points_required,
      rewardType: reward.reward_type,
      imageUrl: reward.image_url,
      isActive: reward.is_active,
      maxRedemptions: reward.max_redemptions,
      redemptionsCount: reward.redemptions_count,
    }))

    return { success: true, rewards }
  } catch (error) {
    console.error("Exception in getAvailableRewards:", error)
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Redeem a reward
 */
export async function redeemReward(request: RewardRedemptionRequest): Promise<{
  success: boolean
  message?: string
}> {
  try {
    const { recruiterId, rewardId, notes } = request
    const supabase = getServiceSupabase()

    // Get the reward details
    const { data: rewardData, error: rewardError } = await supabase
      .from("recruiter_rewards")
      .select("*")
      .eq("id", rewardId)
      .eq("is_active", true)
      .single()

    if (rewardError || !rewardData) {
      console.error("Error fetching reward:", rewardError)
      return { success: false, message: "Reward not found or inactive" }
    }

    // Check if max redemptions has been reached
    if (rewardData.max_redemptions !== null && rewardData.redemptions_count >= rewardData.max_redemptions) {
      return { success: false, message: "This reward has reached its maximum redemptions" }
    }

    // Check if recruiter has enough points
    const { data: pointsData, error: pointsError } = await supabase
      .from("recruiter_activities")
      .select("points")
      .eq("recruiter_id", recruiterId)

    if (pointsError) {
      console.error("Error fetching points:", pointsError)
      return { success: false, message: "Could not verify points balance" }
    }

    const totalPoints = pointsData.reduce((sum, activity) => sum + activity.points, 0)

    // Check if the recruiter has already redeemed rewards
    const { data: redemptionsData, error: redemptionsError } = await supabase
      .from("recruiter_reward_redemptions")
      .select("points_spent")
      .eq("recruiter_id", recruiterId)

    if (redemptionsError) {
      console.error("Error fetching redemptions:", redemptionsError)
      return { success: false, message: "Could not verify previous redemptions" }
    }

    const totalSpent = redemptionsData.reduce((sum, redemption) => sum + redemption.points_spent, 0)
    const availablePoints = totalPoints - totalSpent

    if (availablePoints < rewardData.points_required) {
      return {
        success: false,
        message: `Not enough points. Required: ${rewardData.points_required}, Available: ${availablePoints}`,
      }
    }

    // Create the redemption record
    const { error: redemptionError } = await supabase.from("recruiter_reward_redemptions").insert({
      recruiter_id: recruiterId,
      reward_id: rewardId,
      points_spent: rewardData.points_required,
      status: "pending",
      notes,
      metadata: {
        reward_name: rewardData.name,
        reward_type: rewardData.reward_type,
      },
    })

    if (redemptionError) {
      console.error("Error creating redemption:", redemptionError)
      return { success: false, message: "Failed to redeem reward" }
    }

    // Increment the redemptions count on the reward
    await supabase
      .from("recruiter_rewards")
      .update({ redemptions_count: rewardData.redemptions_count + 1 })
      .eq("id", rewardId)

    // Record the redemption activity
    await awardRecruiterPoints(recruiterId, "reward_redemption", `Redeemed reward: ${rewardData.name}`, undefined, {
      reward_id: rewardId,
      points_spent: rewardData.points_required,
    })

    // Create notification for the recruiter
    await createNotification({
      user_id: recruiterId,
      type: "reward",
      title: "Reward Redeemed!",
      message: `You've successfully redeemed: ${rewardData.name}. We'll process your reward soon.`,
      image_url: rewardData.image_url || "/notification-icon.png",
      action_url: "/volunteer-dashboard/rewards",
      metadata: {
        rewardId,
        rewardName: rewardData.name,
      },
    })

    // Create notification for admin - would be better to use a configurable admin list
    await createNotification({
      user_id: "admin", // This should be replaced with an actual admin user ID
      type: "admin_alert",
      title: "New Reward Redemption",
      message: `A recruiter has redeemed: ${rewardData.name}. Please review and process.`,
      image_url: "/notification-icon.png",
      action_url: "/admin/rewards/redemptions",
      metadata: {
        recruiterId,
        rewardId,
        rewardName: rewardData.name,
      },
    })

    return { success: true, message: "Reward redeemed successfully" }
  } catch (error) {
    console.error("Exception in redeemReward:", error)
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Get recruiter stats
 */
export async function getRecruiterStats(recruiterId: string): Promise<{
  success: boolean
  stats?: RecruiterStats
  message?: string
}> {
  try {
    const supabase = createClient()

    // Get stats from the leaderboard view
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from("recruiter_leaderboard")
      .select("*")
      .eq("recruiter_id", recruiterId)
      .single()

    if (leaderboardError) {
      console.error("Error fetching recruiter stats:", leaderboardError)
      return { success: false, message: leaderboardError.message }
    }

    // Get all tiers to determine next tier
    const { data: tierData, error: tierError } = await supabase
      .from("recruiter_tiers")
      .select("*")
      .eq("is_active", true)
      .order("points_required", { ascending: true })

    if (tierError) {
      console.error("Error fetching tiers:", tierError)
      return { success: false, message: tierError.message }
    }

    // Find current and next tier
    const currentTier =
      tierData.find(
        (tier) => tier.points_required <= leaderboardData.total_points && tier.name === leaderboardData.current_tier,
      ) || tierData[0]

    const nextTierIndex = tierData.findIndex((tier) => tier.id === currentTier.id) + 1
    const nextTier = nextTierIndex < tierData.length ? tierData[nextTierIndex] : null
    const pointsToNextTier = nextTier ? nextTier.points_required - leaderboardData.total_points : 0

    const stats: RecruiterStats = {
      totalPoints: leaderboardData.total_points || 0,
      referralSignups: leaderboardData.referral_signups || 0,
      referralApplications: leaderboardData.referral_applications || 0,
      referralInterviews: leaderboardData.referral_interviews || 0,
      referralHires: leaderboardData.referral_hires || 0,
      rewardsRedeemed: leaderboardData.rewards_redeemed || 0,
      currentTier: leaderboardData.current_tier || "Bronze Recruiter",
      nextTier: nextTier
        ? {
            id: nextTier.id,
            name: nextTier.name,
            description: nextTier.description,
            pointsRequired: nextTier.points_required,
            benefits: nextTier.benefits,
            imageUrl: nextTier.image_url,
            isActive: nextTier.is_active,
          }
        : null,
      pointsToNextTier,
    }

    return { success: true, stats }
  } catch (error) {
    console.error("Exception in getRecruiterStats:", error)
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Get recruiter tiers
 */
export async function getRecruiterTiers(): Promise<{
  success: boolean
  tiers?: RecruiterTier[]
  message?: string
}> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("recruiter_tiers")
      .select("*")
      .eq("is_active", true)
      .order("points_required", { ascending: true })

    if (error) {
      console.error("Error fetching recruiter tiers:", error)
      return { success: false, message: error.message }
    }

    const tiers = data.map((tier) => ({
      id: tier.id,
      name: tier.name,
      description: tier.description,
      pointsRequired: tier.points_required,
      benefits: tier.benefits,
      imageUrl: tier.image_url,
      isActive: tier.is_active,
    }))

    return { success: true, tiers }
  } catch (error) {
    console.error("Exception in getRecruiterTiers:", error)
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Check and update recruiter tier
 */
async function checkAndUpdateRecruiterTier(recruiterId: string): Promise<void> {
  try {
    const supabase = getServiceSupabase()

    // Get recruiter's total points
    const { data: pointsData, error: pointsError } = await supabase
      .from("recruiter_activities")
      .select("points")
      .eq("recruiter_id", recruiterId)

    if (pointsError) {
      console.error("Error fetching points for tier check:", pointsError)
      return
    }

    const totalPoints = pointsData.reduce((sum, activity) => sum + activity.points, 0)

    // Get all tiers
    const { data: tierData, error: tierError } = await supabase
      .from("recruiter_tiers")
      .select("*")
      .eq("is_active", true)
      .order("points_required", { ascending: true })

    if (tierError) {
      console.error("Error fetching tiers for tier check:", tierError)
      return
    }

    // Find the highest tier the recruiter qualifies for
    let currentTier = null
    for (const tier of tierData) {
      if (totalPoints >= tier.points_required) {
        currentTier = tier
      } else {
        break // Tiers are ordered, so we can break once we find one we don't qualify for
      }
    }

    if (!currentTier) return

    // Check if this is a new tier achievement
    const { data: activitiesData, error: activitiesError } = await supabase
      .from("recruiter_activities")
      .select("metadata")
      .eq("recruiter_id", recruiterId)
      .eq("activity_type", "tier_achievement")
      .order("created_at", { ascending: false })
      .limit(1)

    const lastTierAchievement = activitiesData && activitiesData.length > 0 ? activitiesData[0].metadata?.tier_id : null

    // If this is a new tier or the first tier
    if (!lastTierAchievement || lastTierAchievement !== currentTier.id) {
      // Record the tier achievement activity
      await awardRecruiterPoints(recruiterId, "tier_achievement", `Achieved ${currentTier.name} tier`, undefined, {
        tier_id: currentTier.id,
        tier_name: currentTier.name,
      })

      // Create a notification
      await createNotification({
        user_id: recruiterId,
        type: "achievement",
        title: "New Recruiter Tier Achieved!",
        message: `Congratulations! You've reached the ${currentTier.name} tier.`,
        image_url: currentTier.image_url || "/achievement-icon.png",
        action_url: "/volunteer-dashboard",
        metadata: {
          tierId: currentTier.id,
          tierName: currentTier.name,
        },
      })

      // For top tiers, award special badges
      if (currentTier.name === "Gold Recruiter") {
        await awardBadgeToUser(recruiterId, "gold-recruiter")
      } else if (currentTier.name === "Platinum Recruiter") {
        await awardBadgeToUser(recruiterId, "platinum-recruiter")
      }
    }
  } catch (error) {
    console.error("Exception in checkAndUpdateRecruiterTier:", error)
  }
}

/**
 * Get recruiter leaderboard
 */
export async function getRecruiterLeaderboard(
  limit = 10,
  offset = 0,
): Promise<{
  success: boolean
  leaderboard?: any[]
  message?: string
}> {
  try {
    const supabase = createClient()

    const { data, error, count } = await supabase
      .from("recruiter_leaderboard")
      .select("*", { count: "exact" })
      .order("total_points", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching recruiter leaderboard:", error)
      return { success: false, message: error.message }
    }

    return {
      success: true,
      leaderboard: data.map((item, index) => ({ ...item, rank: offset + index + 1 })),
    }
  } catch (error) {
    console.error("Exception in getRecruiterLeaderboard:", error)
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

import { getSupabaseClient } from "@/lib/supabase-core"
import type {
  Badge,
  BadgeCollection,
  BadgeTier,
  UserXP,
  BadgeChallenge,
  UserChallengeProgress,
  BadgeShowcaseSettings,
  BadgeAnalytics,
  BadgeReward,
  BadgeRewardType,
  UserBadgePreferences,
  BadgeLayoutType,
  BadgeDisplayStyle,
  BadgeWithProgress
} from "@/types/badge"
import { getBadge } from "./badges"

export class EnhancedBadgeError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = "EnhancedBadgeError"
  }
}

// Badge Collections
export async function getBadgeCollections(): Promise<BadgeCollection[]> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new EnhancedBadgeError("Database client not initialized")

  const { data, error } = await supabase
    .from("badge_collections")
    .select(`
      *,
      badges:badge_collection_memberships(
        badge:badges(*)
      )
    `)
    .order("created_at", { ascending: false })

  if (error) throw new EnhancedBadgeError("Failed to fetch badge collections")

  return data.map((collection: any) => ({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    theme: collection.theme,
    specialReward: collection.special_reward,
    badges: collection.badges.map((b: any) => b.badge),
    progress: 0, // Calculate based on user progress
    isComplete: false, // Calculate based on user progress
  }))
}

export async function createBadgeCollection(collection: Omit<BadgeCollection, 'id' | 'badges'>): Promise<BadgeCollection> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new EnhancedBadgeError("Database client not initialized")

    const { data, error } = await supabase
      .from("badge_collections")
      .insert([collection])
      .select()
      .single()

    if (error) throw new EnhancedBadgeError("Failed to create collection", error.code)
    if (!data) throw new EnhancedBadgeError("No data returned from collection creation")
    
    return {
      ...data,
      id: data.id,
      name: data.name,
      badges: []
    } as BadgeCollection
  } catch (error) {
    if (error instanceof EnhancedBadgeError) throw error
    throw new EnhancedBadgeError("Failed to create badge collection")
  }
}

export async function addBadgeToCollection(collectionId: string, badgeId: string, position?: number): Promise<void> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new EnhancedBadgeError("Database client not initialized")

    const { error } = await supabase
      .from("badge_collection_memberships")
      .insert([{
        collection_id: collectionId,
        badge_id: badgeId,
        position
      }])

    if (error) throw new EnhancedBadgeError("Failed to add badge to collection", error.code)
  } catch (error) {
    if (error instanceof EnhancedBadgeError) throw error
    throw new EnhancedBadgeError("Failed to add badge to collection")
  }
}

// Badge Tiers
export async function getBadgeTiers(badgeId: string): Promise<BadgeTier[]> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new EnhancedBadgeError("Database client not initialized")

  const { data, error } = await supabase
    .from("badge_tiers")
    .select("*")
    .eq("badge_id", badgeId)
    .order("tier_level", { ascending: true })

  if (error) throw new EnhancedBadgeError("Failed to fetch badge tiers")

  return data.map((tier: any) => ({
    id: tier.id,
    badgeId: tier.badge_id,
    tierLevel: tier.tier_level,
    name: tier.name,
    requirements: tier.requirements,
    xpRequired: tier.xp_required,
    createdAt: tier.created_at,
  }))
}

// User XP
export async function getUserXP(userId: string): Promise<UserXP> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new EnhancedBadgeError("Database client not initialized")

  const { data, error } = await supabase
    .from("user_xp")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error) throw new EnhancedBadgeError("Failed to fetch user XP")
  if (!data) throw new EnhancedBadgeError("User XP not found")

  return {
    userId: data.user_id as string,
    totalXp: Number(data.total_xp),
    currentLevel: Number(data.current_level),
    lastDailyChallenge: data.last_daily_challenge as string | undefined,
    streakCount: Number(data.streak_count),
  }
}

// Badge Challenges
export async function getActiveChallenges(): Promise<BadgeChallenge[]> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new EnhancedBadgeError("Database client not initialized")

  const { data, error } = await supabase
    .from("badge_challenges")
    .select("*")
    .eq("is_active", true)
    .gte("end_date", new Date().toISOString())

  if (error) throw new EnhancedBadgeError("Failed to fetch active challenges")
  if (!data) return []

  return data.map((challenge: any) => ({
    id: challenge.id as string,
    name: challenge.name as string,
    description: challenge.description as string | undefined,
    badgeId: challenge.badge_id as string,
    startDate: challenge.start_date as string | undefined,
    endDate: challenge.end_date as string | undefined,
    xpReward: Number(challenge.xp_reward),
    requirements: challenge.requirements as Record<string, any>,
    isActive: Boolean(challenge.is_active),
  }))
}

export async function createBadgeChallenge(challenge: Omit<BadgeChallenge, 'id'>): Promise<BadgeChallenge> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new EnhancedBadgeError("Database client not initialized")

    const { data, error } = await supabase
      .from("badge_challenges")
      .insert([challenge])
      .select()
      .single()

    if (error) throw new EnhancedBadgeError("Failed to create challenge", error.code)
    if (!data) throw new EnhancedBadgeError("No data returned from challenge creation")
    
    const typedData = data as {
      id: string
      name: string
      description?: string
      badge_id: string
      start_date?: string
      end_date?: string
      xp_reward: number
      requirements: Record<string, any>
      is_active: boolean
    }

    return {
      id: typedData.id,
      name: typedData.name,
      description: typedData.description,
      badgeId: typedData.badge_id,
      startDate: typedData.start_date,
      endDate: typedData.end_date,
      xpReward: typedData.xp_reward,
      requirements: typedData.requirements,
      isActive: typedData.is_active
    }
  } catch (error) {
    if (error instanceof EnhancedBadgeError) throw error
    throw new EnhancedBadgeError("Failed to create badge challenge")
  }
}

// User Challenge Progress
export async function getUserChallengeProgress(
  userId: string,
  challengeId: string
): Promise<UserChallengeProgress> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new EnhancedBadgeError("Database client not initialized")

  const { data, error } = await supabase
    .from("user_challenge_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("challenge_id", challengeId)
    .single()

  if (error) throw new EnhancedBadgeError("Failed to fetch challenge progress")
  if (!data) throw new EnhancedBadgeError("Challenge progress not found")

  return {
    userId: data.user_id as string,
    challengeId: data.challenge_id as string,
    progress: data.progress as Record<string, any>,
    completedAt: data.completed_at as string | undefined,
  }
}

export async function updateChallengeProgress(
  userId: string,
  challengeId: string,
  progress: Record<string, any>
): Promise<void> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new EnhancedBadgeError("Database client not initialized")

    const { error } = await supabase
      .from("user_challenge_progress")
      .upsert({
        user_id: userId,
        challenge_id: challengeId,
        progress,
        completed_at: isProgressComplete(progress) ? new Date().toISOString() : null
      })

    if (error) throw new EnhancedBadgeError("Failed to update challenge progress", error.code)
  } catch (error) {
    if (error instanceof EnhancedBadgeError) throw error
    throw new EnhancedBadgeError("Failed to update challenge progress")
  }
}

// Badge Showcase
export async function getBadgeShowcaseSettings(userId: string): Promise<BadgeShowcaseSettings> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new EnhancedBadgeError("Database client not initialized")

  const { data, error } = await supabase
    .from("badge_showcase_settings")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error) throw new EnhancedBadgeError("Failed to fetch showcase settings")
  if (!data) throw new EnhancedBadgeError("Showcase settings not found")

  return {
    userId: data.user_id as string,
    layoutType: data.layout_type as BadgeLayoutType,
    featuredBadges: (data.featured_badges as string[]) || [],
    showcaseTheme: data.showcase_theme as string,
    isPublic: Boolean(data.is_public),
  }
}

export async function updateBadgeShowcase(
  userId: string,
  settings: Omit<BadgeShowcaseSettings, 'userId'>
): Promise<BadgeShowcaseSettings> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new EnhancedBadgeError("Database client not initialized")

    const { data, error } = await supabase
      .from("badge_showcase_settings")
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw new EnhancedBadgeError("Failed to update showcase settings", error.code)
    if (!data) throw new EnhancedBadgeError("No data returned from showcase update")
    
    const typedData = data as {
      user_id: string
      layout_type: BadgeLayoutType
      featured_badges: string[]
      showcase_theme: string
      is_public: boolean
    }

    return {
      userId: typedData.user_id,
      layoutType: typedData.layout_type,
      featuredBadges: typedData.featured_badges,
      showcaseTheme: typedData.showcase_theme,
      isPublic: typedData.is_public
    }
  } catch (error) {
    if (error instanceof EnhancedBadgeError) throw error
    throw new EnhancedBadgeError("Failed to update badge showcase")
  }
}

// Badge Analytics
export async function getBadgeAnalytics(badgeId: string): Promise<BadgeAnalytics> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new EnhancedBadgeError("Database client not initialized")

  const { data, error } = await supabase
    .from("badge_analytics")
    .select("*")
    .eq("badge_id", badgeId)
    .single()

  if (error) throw new EnhancedBadgeError("Failed to fetch badge analytics")
  if (!data) throw new EnhancedBadgeError("Badge analytics not found")

  return {
    badgeId: data.badge_id as string,
    totalEarned: Number(data.total_earned),
    completionRate: Number(data.completion_rate),
    averageTimeToEarn: data.average_time_to_earn as string,
    popularityScore: Number(data.popularity_score),
  }
}

// Badge Rewards
export async function getBadgeRewards(badgeId: string): Promise<BadgeReward[]> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new EnhancedBadgeError("Database client not initialized")

  const { data, error } = await supabase
    .from("badge_rewards")
    .select("*")
    .eq("badge_id", badgeId)
    .eq("is_active", true)

  if (error) throw new EnhancedBadgeError("Failed to fetch badge rewards")

  return data.map((reward: any) => ({
    id: reward.id,
    badgeId: reward.badge_id,
    rewardType: reward.reward_type,
    rewardData: reward.reward_data,
    requiredTier: reward.required_tier,
    isActive: reward.is_active,
  }))
}

export async function createBadgeReward(reward: Omit<BadgeReward, 'id'>): Promise<BadgeReward> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new EnhancedBadgeError("Database client not initialized")

    const { data, error } = await supabase
      .from("badge_rewards")
      .insert([reward])
      .select()
      .single()

    if (error) throw new EnhancedBadgeError("Failed to create reward", error.code)
    if (!data) throw new EnhancedBadgeError("No data returned from reward creation")
    
    const typedData = data as {
      id: string
      badge_id: string
      reward_type: string
      reward_data: Record<string, any>
      required_tier: number
      is_active: boolean
    }

    return {
      id: typedData.id,
      badgeId: typedData.badge_id,
      rewardType: typedData.reward_type as BadgeRewardType,
      rewardData: typedData.reward_data,
      requiredTier: typedData.required_tier,
      isActive: typedData.is_active
    }
  } catch (error) {
    if (error instanceof EnhancedBadgeError) throw error
    throw new EnhancedBadgeError("Failed to create badge reward")
  }
}

// User Preferences
export async function getUserBadgePreferences(userId: string): Promise<UserBadgePreferences> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new EnhancedBadgeError("Database client not initialized")

  const { data, error } = await supabase
    .from("user_badge_preferences")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error) throw new EnhancedBadgeError("Failed to fetch user preferences")
  if (!data) throw new EnhancedBadgeError("User preferences not found")

  return {
    userId: data.user_id as string,
    displayStyle: data.display_style as BadgeDisplayStyle,
    notificationSettings: {
      email: Boolean((data.notification_settings as any)?.email),
      push: Boolean((data.notification_settings as any)?.push),
    },
    pinnedBadges: (data.pinned_badges as string[]) || [],
    customGoals: data.custom_goals as Record<string, any> | undefined,
  }
}

export async function updateBadgePreferences(
  userId: string,
  preferences: Partial<Omit<UserBadgePreferences, 'userId'>>
): Promise<UserBadgePreferences> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new EnhancedBadgeError("Database client not initialized")

    const { data, error } = await supabase
      .from("user_badge_preferences")
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw new EnhancedBadgeError("Failed to update preferences", error.code)
    if (!data) throw new EnhancedBadgeError("No data returned from preferences update")
    
    const typedData = data as {
      user_id: string
      display_style: string
      notification_settings: { email: boolean; push: boolean }
      pinned_badges: string[]
      custom_goals?: Record<string, any>
    }

    return {
      userId: typedData.user_id,
      displayStyle: typedData.display_style as BadgeDisplayStyle,
      notificationSettings: typedData.notification_settings,
      pinnedBadges: typedData.pinned_badges,
      customGoals: typedData.custom_goals
    }
  } catch (error) {
    if (error instanceof EnhancedBadgeError) throw error
    throw new EnhancedBadgeError("Failed to update badge preferences")
  }
}

// Helper Functions
function isProgressComplete(progress: Record<string, any>): boolean {
  // This is a placeholder implementation
  // Actual implementation would depend on your challenge requirements structure
  return Object.values(progress).every(value => value === true || value === 100)
}

// Extended Badge Operations
export async function getBadgeWithTiers(badgeId: string): Promise<BadgeWithProgress & { tiers: BadgeTier[] }> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) throw new EnhancedBadgeError("Database client not initialized")

    // Get badge with progress
    const badge = await getBadge(badgeId)

    // Get tiers
    const { data: tiers, error: tiersError } = await supabase
      .from("badge_tiers")
      .select("*")
      .eq("badge_id", badgeId)
      .order("tier_level", { ascending: true })

    if (tiersError) throw new EnhancedBadgeError("Failed to fetch badge tiers", tiersError.code)

    const typedTiers = (tiers || []).map((tier: any) => ({
      id: tier.id,
      badgeId: tier.badge_id,
      tierLevel: tier.tier_level,
      name: tier.name,
      requirements: tier.requirements,
      xpRequired: tier.xp_required,
      createdAt: tier.created_at
    })) as BadgeTier[]

    return {
      ...badge,
      tiers: typedTiers
    }
  } catch (error) {
    if (error instanceof EnhancedBadgeError) throw error
    throw new EnhancedBadgeError("Failed to fetch badge with tiers")
  }
} 
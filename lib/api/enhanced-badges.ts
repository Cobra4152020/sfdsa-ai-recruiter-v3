// const { getClientSideSupabase } = require("@/lib/supabase")

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
  BadgeWithProgress,
  BadgeType,
  Goal,
} from "@/types/badge";
import { getBadge } from "./badges";
import { getClientSideSupabase } from "@/lib/supabase";

type BadgeChallengeWithDbFields = BadgeChallenge & {
  badgeId?: string;
  startDate?: string;
  endDate?: string;
  xpReward?: number;
  requirements?: Record<string, unknown>;
  isActive?: boolean;
};

export class EnhancedBadgeError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "EnhancedBadgeError";
  }
}

// Badge Collections
export async function getBadgeCollections(): Promise<BadgeCollection[]> {
  const supabase = getClientSideSupabase();
  if (!supabase)
    throw new EnhancedBadgeError("Database client not initialized");

  const { data, error } = await supabase
    .from("badge_collections")
    .select(
      `
      *,
      badges:badge_collection_memberships(
        badge:badges(*)
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new EnhancedBadgeError("Failed to fetch badge collections");
  if (!data) return [];

  return data.map(
    (
      collection: Omit<BadgeCollection, "badges"> & {
        badges: { badge?: Badge }[];
      },
    ) => ({
      id: collection.id,
      name: collection.name,
      description: collection.description,
      theme: collection.theme,
      specialReward: collection.specialReward,
      badges: Array.isArray(collection.badges)
        ? collection.badges
            .filter((b): b is { badge: Badge } => !!b.badge)
            .map((b) => ({
              ...b.badge,
              earned: false,
              progress: 0,
              status: "locked",
              lastUpdated: new Date().toISOString(),
            }))
        : [],
      progress: 0, // Calculate based on user progress
      isComplete: false, // Calculate based on user progress
    }),
  );
}

export async function createBadgeCollection(
  collection: Omit<BadgeCollection, "id" | "badges">,
): Promise<BadgeCollection> {
  const supabase = getClientSideSupabase();
  try {
    if (!supabase)
      throw new EnhancedBadgeError("Database client not initialized");

    const { data, error } = await supabase
      .from("badge_collections")
      .insert([collection])
      .select()
      .single();

    if (error)
      throw new EnhancedBadgeError("Failed to create collection", error.code);
    if (!data)
      throw new EnhancedBadgeError("No data returned from collection creation");

    return {
      ...data,
      id: data.id,
      name: data.name,
      badges: [],
    } as BadgeCollection;
  } catch (error) {
    if (error instanceof EnhancedBadgeError) throw error;
    throw new EnhancedBadgeError("Failed to create badge collection");
  }
}

export async function addBadgeToCollection(
  collectionId: string,
  badgeId: string,
  position?: number,
): Promise<void> {
  const supabase = getClientSideSupabase();
  try {
    if (!supabase)
      throw new EnhancedBadgeError("Database client not initialized");

    const { error } = await supabase
      .from("badge_collection_memberships")
      .insert([
        {
          collection_id: collectionId,
          badge_id: badgeId,
          position,
        },
      ]);

    if (error)
      throw new EnhancedBadgeError(
        "Failed to add badge to collection",
        error.code,
      );
  } catch (error) {
    if (error instanceof EnhancedBadgeError) throw error;
    throw new EnhancedBadgeError("Failed to add badge to collection");
  }
}

// Badge Tiers
export async function getBadgeTiers(badgeId: string): Promise<BadgeTier[]> {
  const supabase = getClientSideSupabase();
  if (!supabase)
    throw new EnhancedBadgeError("Database client not initialized");

  const { data, error } = await supabase
    .from("badge_tiers")
    .select("*")
    .eq("badge_id", badgeId)
    .order("tier_level", { ascending: true });

  if (error) throw new EnhancedBadgeError("Failed to fetch badge tiers");

  return data.map((tier: BadgeTier) => ({
    id: tier.id,
    badgeId: tier.badgeId,
    level: tier.level,
    name: typeof tier.name === "string" ? tier.name : "",
    requirements: Array.isArray(tier.requirements) ? tier.requirements : [],
    rewards: tier.rewards,
    xpRequired: tier.xpRequired,
    imageUrl: typeof tier.imageUrl === "string" ? tier.imageUrl : "",
    createdAt: tier.createdAt,
  }));
}

// User XP
export async function getUserXP(userId: string): Promise<UserXP> {
  const supabase = getClientSideSupabase();
  if (!supabase)
    throw new EnhancedBadgeError("Database client not initialized");

  const { data, error } = await supabase
    .from("user_xp")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw new EnhancedBadgeError("Failed to fetch user XP");
  if (!data) throw new EnhancedBadgeError("User XP not found");

  return {
    userId: data.user_id as string,
    totalXp: Number(data.total_xp),
    currentLevel: Number(data.current_level),
    lastDailyChallenge:
      typeof data.last_daily_challenge === "string"
        ? data.last_daily_challenge
        : "",
    streakCount: Number(data.streak_count),
  };
}

export async function updateUserXP(
  userId: string,
  xpChange: number,
): Promise<UserXP> {
  const supabase = getClientSideSupabase();
  if (!supabase)
    throw new EnhancedBadgeError("Database client not initialized");

  const { data: currentXP, error: fetchError } = await supabase
    .from("user_xp")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (fetchError) throw new EnhancedBadgeError("Failed to fetch current XP");

  const newTotalXP = (currentXP?.total_xp || 0) + xpChange;
  const newLevel = Math.floor(newTotalXP / 1000) + 1; // Simple level calculation

  const { data, error } = await supabase
    .from("user_xp")
    .upsert({
      user_id: userId,
      total_xp: newTotalXP,
      current_level: newLevel,
      last_daily_challenge: currentXP?.last_daily_challenge,
      streak_count: currentXP?.streak_count || 0,
    })
    .select()
    .single();

  if (error) throw new EnhancedBadgeError("Failed to update user XP");
  if (!data) throw new EnhancedBadgeError("No data returned from XP update");

  return {
    userId: data.user_id,
    totalXp: Number(data.total_xp),
    currentLevel: Number(data.current_level),
    lastDailyChallenge:
      typeof data.last_daily_challenge === "string"
        ? data.last_daily_challenge
        : "",
    streakCount: Number(data.streak_count),
  };
}

// Badge Challenges
export async function getActiveChallenges(): Promise<
  BadgeChallengeWithDbFields[]
> {
  const supabase = getClientSideSupabase();
  if (!supabase)
    throw new EnhancedBadgeError("Database client not initialized");

  const { data, error } = await supabase
    .from("badge_challenges")
    .select("*")
    .eq("is_active", true)
    .gte("end_date", new Date().toISOString());

  if (error) throw new EnhancedBadgeError("Failed to fetch active challenges");
  if (!data) return [];

  return data.map((challenge: BadgeChallengeWithDbFields) => ({
    id: challenge.id,
    name: challenge.name,
    description: challenge.description,
    type: challenge.type as BadgeType,
    progress: challenge.progress as Record<string, number>,
    value: challenge.value,
    rewardType: challenge.rewardType as "badge" | "points" | "nft",
    rewardData: challenge.rewardData as Record<string, unknown>,
    customGoals: challenge.customGoals as Record<string, Goal> | null,
    badgeId: challenge.badgeId,
    startDate:
      typeof challenge.startDate === "string" ? challenge.startDate : "",
    endDate: typeof challenge.endDate === "string" ? challenge.endDate : "",
    xpReward: challenge.xpReward ?? 0,
    requirements: (challenge.requirements as Record<string, unknown>) ?? {},
    isActive: challenge.isActive ?? false,
  }));
}

export async function createBadgeChallenge(
  challenge: Omit<BadgeChallenge, "id">,
): Promise<BadgeChallengeWithDbFields> {
  const supabase = getClientSideSupabase();
  try {
    if (!supabase)
      throw new EnhancedBadgeError("Database client not initialized");

    const { data, error } = await supabase
      .from("badge_challenges")
      .insert([challenge])
      .select()
      .single();

    if (error)
      throw new EnhancedBadgeError("Failed to create challenge", error.code);
    if (!data)
      throw new EnhancedBadgeError("No data returned from challenge creation");

    const typedData = data as {
      id: string;
      name: string;
      description?: string;
      badgeId: string;
      start_date?: string;
      end_date?: string;
      xp_reward: number;
      requirements: Record<string, unknown>;
      is_active: boolean;
      type?: BadgeType;
      progress?: Record<string, number>;
      value?: number;
      rewardType?: "badge" | "points" | "nft";
      rewardData?: Record<string, unknown>;
      customGoals?: Record<string, Goal> | null;
    };

    return {
      id: typedData.id,
      name: typeof typedData.name === "string" ? typedData.name : "",
      description:
        typeof typedData.description === "string" ? typedData.description : "",
      type: typedData.type ?? "written",
      progress: typedData.progress ?? {},
      value: typedData.value ?? 0,
      rewardType: typedData.rewardType ?? "badge",
      rewardData: typedData.rewardData ?? {},
      customGoals: typedData.customGoals ?? null,
      badgeId: typedData.badgeId,
      startDate:
        typeof typedData.start_date === "string" ? typedData.start_date : "",
      endDate: typeof typedData.end_date === "string" ? typedData.end_date : "",
      xpReward: typedData.xp_reward,
      requirements: typedData.requirements,
      isActive: typedData.is_active,
    };
  } catch (error) {
    if (error instanceof EnhancedBadgeError) throw error;
    throw new EnhancedBadgeError("Failed to create badge challenge");
  }
}

// User Challenge Progress
export async function getUserChallengeProgress(
  userId: string,
  challengeId: string,
): Promise<UserChallengeProgress> {
  const supabase = getClientSideSupabase();
  if (!supabase)
    throw new EnhancedBadgeError("Database client not initialized");

  const { data, error } = await supabase
    .from("user_challenge_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("challenge_id", challengeId)
    .single();

  if (error) throw new EnhancedBadgeError("Failed to fetch challenge progress");
  if (!data) throw new EnhancedBadgeError("Challenge progress not found");

  return {
    userId: data.user_id as string,
    challengeId: data.challenge_id as string,
    progress: data.progress as Record<string, unknown>,
    isComplete: Boolean(data.is_complete),
    completedAt: typeof data.completed_at === "string" ? data.completed_at : "",
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function updateChallengeProgress(
  userId: string,
  challengeId: string,
  progress: Record<string, unknown>,
): Promise<void> {
  const supabase = getClientSideSupabase();
  try {
    if (!supabase)
      throw new EnhancedBadgeError("Database client not initialized");

    const { error } = await supabase.from("user_challenge_progress").upsert({
      user_id: userId,
      challenge_id: challengeId,
      progress,
      completed_at: isProgressComplete(progress)
        ? new Date().toISOString()
        : null,
    });

    if (error)
      throw new EnhancedBadgeError(
        "Failed to update challenge progress",
        error.code,
      );
  } catch (error) {
    if (error instanceof EnhancedBadgeError) throw error;
    throw new EnhancedBadgeError("Failed to update challenge progress");
  }
}

// Badge Showcase
export async function getBadgeShowcaseSettings(
  userId: string,
): Promise<BadgeShowcaseSettings> {
  const supabase = getClientSideSupabase();
  if (!supabase)
    throw new EnhancedBadgeError("Database client not initialized");

  const { data, error } = await supabase
    .from("badge_showcase_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw new EnhancedBadgeError("Failed to fetch showcase settings");
  if (!data) throw new EnhancedBadgeError("Showcase settings not found");

  return {
    userId: data.user_id as string,
    layoutType: data.layout_type as BadgeLayoutType,
    featuredBadges: (data.featured_badges as string[]) || [],
    showcaseTheme: data.showcase_theme as string,
    isPublic: Boolean(data.is_public),
    createdAt: typeof data.created_at === "string" ? data.created_at : "",
    updatedAt: typeof data.updated_at === "string" ? data.updated_at : "",
  };
}

export async function updateShowcaseSettings(
  userId: string,
  settings: Partial<Omit<BadgeShowcaseSettings, "userId">>,
): Promise<BadgeShowcaseSettings> {
  const supabase = getClientSideSupabase();
  if (!supabase)
    throw new EnhancedBadgeError("Database client not initialized");

  const { data, error } = await supabase
    .from("badge_showcase_settings")
    .upsert({
      user_id: userId,
      layout_type: settings.layoutType,
      featured_badges: settings.featuredBadges,
      showcase_theme: settings.showcaseTheme,
      is_public: settings.isPublic,
    })
    .select()
    .single();

  if (error) throw new EnhancedBadgeError("Failed to update showcase settings");
  if (!data)
    throw new EnhancedBadgeError("No data returned from settings update");

  return {
    userId: data.user_id,
    layoutType: data.layout_type,
    featuredBadges: data.featured_badges,
    showcaseTheme: data.showcase_theme,
    isPublic: data.is_public,
    createdAt: typeof data.created_at === "string" ? data.created_at : "",
    updatedAt: typeof data.updated_at === "string" ? data.updated_at : "",
  };
}

// Badge Analytics
export async function getBadgeAnalytics(
  badgeId: string,
): Promise<BadgeAnalytics> {
  const supabase = getClientSideSupabase();
  if (!supabase)
    throw new EnhancedBadgeError("Database client not initialized");

  const { data, error } = await supabase
    .from("badge_analytics")
    .select("*")
    .eq("badge_id", badgeId)
    .single();

  if (error) throw new EnhancedBadgeError("Failed to fetch badge analytics");
  if (!data) throw new EnhancedBadgeError("Badge analytics not found");

  return {
    badgeId: data.badge_id as string,
    totalEarned: Number(data.total_earned),
    completionRate: Number(data.completion_rate),
    averageTimeToEarn:
      typeof data.average_time_to_earn === "number"
        ? data.average_time_to_earn
        : Number(data.average_time_to_earn ?? 0),
    popularityScore: Number(data.popularity_score),
    updatedAt: data.updated_at ?? "",
  };
}

// Badge Rewards
export async function getBadgeRewards(badgeId: string): Promise<BadgeReward[]> {
  const supabase = getClientSideSupabase();
  if (!supabase)
    throw new EnhancedBadgeError("Database client not initialized");

  const { data, error } = await supabase
    .from("badge_rewards")
    .select("*")
    .eq("badge_id", badgeId)
    .eq("is_active", true);

  if (error) throw new EnhancedBadgeError("Failed to fetch badge rewards");

  return data.map((reward: BadgeReward) => ({
    id: reward.id,
    badgeId: reward.badgeId,
    type: reward.type,
    value:
      typeof reward.value === "number"
        ? reward.value
        : Number(reward.value ?? 0),
    description: reward.description,
    rewardType: reward.rewardType,
    rewardData: reward.rewardData,
    requiredTier: reward.requiredTier,
    isActive: reward.isActive,
  }));
}

export async function createBadgeReward(
  reward: Omit<BadgeReward, "id">,
): Promise<BadgeReward> {
  const supabase = getClientSideSupabase();
  try {
    if (!supabase)
      throw new EnhancedBadgeError("Database client not initialized");

    const { data, error } = await supabase
      .from("badge_rewards")
      .insert([reward])
      .select()
      .single();

    if (error)
      throw new EnhancedBadgeError("Failed to create reward", error.code);
    if (!data)
      throw new EnhancedBadgeError("No data returned from reward creation");

    const typedData = data as {
      id: string;
      badgeId: string;
      type: string;
      value: number;
      description: string;
      reward_type: string;
      reward_data: Record<string, unknown>;
      required_tier: number;
      is_active: boolean;
    };

    return {
      id: typedData.id,
      badgeId: typedData.badgeId,
      type: typedData.type,
      value:
        typeof typedData.value === "number"
          ? typedData.value
          : Number(typedData.value ?? 0),
      description: typedData.description,
      rewardType: typedData.reward_type as BadgeRewardType,
      rewardData: typedData.reward_data,
      requiredTier: typedData.required_tier,
      isActive: typedData.is_active,
    };
  } catch (error) {
    if (error instanceof EnhancedBadgeError) throw error;
    throw new EnhancedBadgeError("Failed to create badge reward");
  }
}

// User Preferences
export async function getUserBadgePreferences(
  userId: string,
): Promise<UserBadgePreferences> {
  const supabase = getClientSideSupabase();
  if (!supabase)
    throw new EnhancedBadgeError("Database client not initialized");

  const { data, error } = await supabase
    .from("user_badge_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw new EnhancedBadgeError("Failed to fetch user preferences");
  if (!data) throw new EnhancedBadgeError("User preferences not found");

  return {
    userId: data.user_id as string,
    displayStyle: data.display_style as BadgeDisplayStyle,
    notificationSettings: {
      email: Boolean(
        (data.notification_settings as { email: boolean; push: boolean })
          ?.email,
      ),
      push: Boolean(
        (data.notification_settings as { email: boolean; push: boolean })?.push,
      ),
    },
    pinnedBadges: (data.pinned_badges as string[]) || [],
    customGoals: data.custom_goals ?? null,
    createdAt: data.created_at ?? "",
    updatedAt: data.updated_at ?? "",
  };
}

export async function updateBadgePreferences(
  userId: string,
  preferences: Partial<Omit<UserBadgePreferences, "userId">>,
): Promise<UserBadgePreferences> {
  const supabase = getClientSideSupabase();
  try {
    if (!supabase)
      throw new EnhancedBadgeError("Database client not initialized");

    const { data, error } = await supabase
      .from("user_badge_preferences")
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error)
      throw new EnhancedBadgeError("Failed to update preferences", error.code);
    if (!data)
      throw new EnhancedBadgeError("No data returned from preferences update");

    const typedData = data as {
      user_id: string;
      display_style: string;
      notification_settings: { email: boolean; push: boolean };
      pinned_badges: string[];
      custom_goals?: Record<string, unknown>;
      created_at?: string;
      updated_at?: string;
    };

    return {
      userId: typedData.user_id,
      displayStyle: typedData.display_style as BadgeDisplayStyle,
      notificationSettings: typedData.notification_settings,
      pinnedBadges: typedData.pinned_badges,
      customGoals: typedData.custom_goals ?? null,
      createdAt: typedData.created_at ?? "",
      updatedAt: typedData.updated_at ?? "",
    };
  } catch (error) {
    if (error instanceof EnhancedBadgeError) throw error;
    throw new EnhancedBadgeError("Failed to update badge preferences");
  }
}

// Helper Functions
function isProgressComplete(progress: Record<string, unknown>): boolean {
  // This is a placeholder implementation
  // Actual implementation would depend on your challenge requirements structure
  return Object.values(progress).every(
    (value) => value === true || value === 100,
  );
}

// Interface for database tier object
interface DatabaseTier {
  id: string;
  badge_id: string;
  tier_level: number;
  name: string;
  requirements: string[];
  rewards?: string[];
  xp_required: number;
  image_url?: string;
  created_at: string;
}

// Extended Badge Operations
export async function getBadgeWithTiers(
  badgeId: string,
): Promise<BadgeWithProgress & { tiers: BadgeTier[] }> {
  const supabase = getClientSideSupabase();
  try {
    if (!supabase)
      throw new EnhancedBadgeError("Database client not initialized");

    // Get badge with progress
    const badge = await getBadge(badgeId);

    // Get tiers
    const { data: tiers, error: tiersError } = await supabase
      .from("badge_tiers")
      .select("*")
      .eq("badge_id", badgeId)
      .order("tier_level", { ascending: true });

    if (tiersError)
      throw new EnhancedBadgeError(
        "Failed to fetch badge tiers",
        tiersError.code,
      );

    const typedTiers = (tiers || []).map((tier: DatabaseTier) => {
      return {
        id: tier.id,
        badgeId: tier.badge_id,
        level: tier.tier_level,
        name: tier.name,
        requirements: tier.requirements,
        rewards: tier.rewards || [],
        xpRequired: tier.xp_required,
        imageUrl: tier.image_url,
        createdAt: tier.created_at,
      };
    }) as BadgeTier[];

    return {
      ...badge,
      tiers: typedTiers,
    };
  } catch (error) {
    if (error instanceof EnhancedBadgeError) throw error;
    throw new EnhancedBadgeError("Failed to fetch badge with tiers");
  }
}

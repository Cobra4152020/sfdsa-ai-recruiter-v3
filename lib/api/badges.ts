import type {
  BadgeProgress,
  TimelineEvent,
  BadgeWithProgress,
  BadgeType,
  BadgeRarity,
} from "@/types/badge";
import { getClientSideSupabase } from "@/lib/supabase";

export class BadgeError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "BadgeError";
  }
}

// Type for database badge row
interface BadgeRow {
  id: string;
  name: string;
  description: string;
  type: BadgeType;
  rarity: BadgeRarity;
  points: number;
  requirements: string[];
  rewards: string[];
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// Type for database progress row
interface BadgeProgressRow {
  badge_id: string;
  user_id: string;
  progress: number;
  is_unlocked: boolean;
  unlocked_at?: string;
  last_updated: string;
}

// Type for database event row
interface BadgeEventRow {
  id: number;
  badge_id: string;
  user_id: string;
  date: string;
  event: string;
  type: "start" | "progress" | "milestone" | "completion";
}

export async function getBadge(badgeId: string): Promise<BadgeWithProgress> {
  try {
    const supabase = getClientSideSupabase();
    if (!supabase) throw new BadgeError("Database client not initialized");

    // Get badge details
    const { data: badge, error: badgeError } = await supabase
      .from("badges")
      .select("*")
      .eq("id", badgeId)
      .single();

    if (badgeError)
      throw new BadgeError("Failed to fetch badge", badgeError.code);
    if (!badge) throw new BadgeError("Badge not found");

    // Get progress for the current user
    const { data: progress, error: progressError } = await supabase
      .from("badge_progress")
      .select("*")
      .eq("badge_id", badgeId)
      .single();

    if (progressError && progressError.code !== "PGRST116") {
      // Ignore not found error
      throw new BadgeError(
        "Failed to fetch badge progress",
        progressError.code,
      );
    }

    const badgeRow = badge as unknown as BadgeRow;
    const progressRow = progress as unknown as BadgeProgressRow | null;

    // Compose a default progressDetails if missing
    const progressDetails: BadgeProgress = progressRow
      ? {
          id: progressRow.badge_id + "_" + progressRow.user_id,
          badgeId: progressRow.badge_id,
          userId: progressRow.user_id,
          progress: progressRow.progress,
          status: progressRow.is_unlocked ? "completed" : "in_progress",
          actionsCompleted: [],
          createdAt: badgeRow.created_at,
          updatedAt: badgeRow.updated_at,
        }
      : {
          id: badgeRow.id + "_default",
          badgeId: badgeRow.id,
          userId: "",
          progress: 0,
          status: "in_progress" as const,
          actionsCompleted: [],
          createdAt: badgeRow.created_at,
          updatedAt: badgeRow.updated_at,
        };

    return {
      id: badgeRow.id,
      name: badgeRow.name,
      description: badgeRow.description,
      type: badgeRow.type,
      rarity: badgeRow.rarity,
      points: badgeRow.points,
      requirements: badgeRow.requirements,
      rewards: badgeRow.rewards,
      imageUrl: badgeRow.image_url,
      createdAt: badgeRow.created_at,
      updatedAt: badgeRow.updated_at,
      progress: progressRow?.progress ?? 0,
      isUnlocked: progressRow?.is_unlocked ?? false,
      progressDetails,
    };
  } catch (error) {
    if (error instanceof BadgeError) throw error;
    throw new BadgeError("Failed to fetch badge details");
  }
}

export async function getBadgeTimeline(
  badgeId: string,
): Promise<TimelineEvent[]> {
  try {
    const supabase = getClientSideSupabase();
    if (!supabase) throw new BadgeError("Database client not initialized");

    const { data, error } = await supabase
      .from("badge_events")
      .select("*")
      .eq("badge_id", badgeId)
      .order("date", { ascending: false })
      .limit(10);

    if (error)
      throw new BadgeError("Failed to fetch badge timeline", error.code);

    return (data as unknown as BadgeEventRow[]).map((event) => ({
      id: String(event.id),
      date: event.date,
      event: event.event,
      type: event.type,
      badgeId: event.badge_id,
      userId: event.user_id,
    }));
  } catch (error) {
    if (error instanceof BadgeError) throw error;
    throw new BadgeError("Failed to fetch badge timeline");
  }
}

export async function shareBadge(badgeId: string): Promise<void> {
  try {
    const supabase = getClientSideSupabase();
    if (!supabase) throw new BadgeError("Database client not initialized");

    const { error } = await supabase
      .from("badge_shares")
      .insert([{ badge_id: badgeId, shared_at: new Date().toISOString() }]);

    if (error) throw new BadgeError("Failed to share badge", error.code);
  } catch (error) {
    if (error instanceof BadgeError) throw error;
    throw new BadgeError("Failed to share badge");
  }
}

export async function getAllBadges(): Promise<BadgeWithProgress[]> {
  try {
    const supabase = getClientSideSupabase();
    if (!supabase) throw new BadgeError("Database client not initialized");

    // Get all badges
    const { data: badges, error: badgesError } = await supabase
      .from("badges")
      .select("*")
      .order("created_at", { ascending: false });

    if (badgesError)
      throw new BadgeError("Failed to fetch badges", badgesError.code);
    if (!badges) return [];

    // Get progress for all badges
    const { data: progress, error: progressError } = await supabase
      .from("badge_progress")
      .select("*");

    if (progressError)
      throw new BadgeError(
        "Failed to fetch badge progress",
        progressError.code,
      );

    // Combine badges with their progress
    return (badges as unknown as BadgeRow[]).map((badge) => {
      const badgeProgress = progress?.find(
        (p: { badge_id: string }) => p.badge_id === badge.id,
      ) as unknown as BadgeProgressRow | undefined;
      const progressDetails: BadgeProgress = badgeProgress
        ? {
            id: badgeProgress.badge_id + "_" + badgeProgress.user_id,
            badgeId: badgeProgress.badge_id,
            userId: badgeProgress.user_id,
            progress: badgeProgress.progress,
            status: badgeProgress.is_unlocked ? "completed" : "in_progress",
            actionsCompleted: [],
            createdAt: badge.created_at,
            updatedAt: badge.updated_at,
          }
        : {
            id: badge.id + "_default",
            badgeId: badge.id,
            userId: "",
            progress: 0,
            status: "in_progress" as const,
            actionsCompleted: [],
            createdAt: badge.created_at,
            updatedAt: badge.updated_at,
          };
      return {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        type: badge.type,
        rarity: badge.rarity,
        points: badge.points,
        requirements: badge.requirements,
        rewards: badge.rewards,
        imageUrl: badge.image_url,
        createdAt: badge.created_at,
        updatedAt: badge.updated_at,
        progress: badgeProgress?.progress ?? 0,
        isUnlocked: badgeProgress?.is_unlocked ?? false,
        progressDetails,
      };
    });
  } catch (error) {
    if (error instanceof BadgeError) throw error;
    throw new BadgeError("Failed to fetch badges");
  }
}

import { getServiceSupabase } from "@/app/lib/supabase/server";
import { awardBadgeToUser } from "@/lib/badge-utils";
import { createNotification } from "@/lib/notification-service";
import { v4 as uuidv4 } from "uuid";

interface ChallengeMetadata {
  tags?: string[];
  difficulty?: "easy" | "medium" | "hard";
  duration?: number;
  requirements?: string[];
  rewards?: {
    points?: number;
    badges?: string[];
    nfts?: string[];
  };
}

interface SubmissionMetadata {
  videoUrl?: string;
  hashtags?: string[];
  views?: number;
  likes?: number;
  shares?: number;
  comments?: number;
  duration?: number;
}

interface LeaderboardEntry {
  userId: string;
  username: string;
  points: number;
  submissions: number;
  rank: number;
  avatarUrl?: string;
  metadata?: {
    totalViews?: number;
    totalLikes?: number;
    totalShares?: number;
  };
}

interface LeaderboardEntryData {
  user_id: string;
  users: {
    username: string;
    avatar_url: string | null;
  } | null;
  submissions: number;
  points: number;
}

export interface TikTokChallenge {
  id: string;
  title: string;
  description: string;
  instructions: string;
  hashtags: string[];
  startDate: string;
  endDate: string;
  pointsReward: number;
  badgeReward?: string;
  exampleVideoUrl?: string;
  thumbnailUrl?: string;
  requirements?: {
    minDuration?: number;
    maxDuration?: number;
    requiredElements?: string[];
    minViews?: number;
  };
  status: "active" | "completed" | "upcoming";
  createdAt: Date;
  updatedAt: Date;
  metadata?: ChallengeMetadata;
}

export interface TikTokChallengeSubmission {
  id: string;
  challengeId: string;
  userId: string;
  videoUrl: string;
  tiktokUrl?: string;
  viewsCount?: number;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  status: "pending" | "approved" | "rejected";
  adminFeedback?: string;
  verificationCode?: string;
  submittedAt: Date;
  verifiedAt?: Date;
  metadata?: SubmissionMetadata;
}

export interface ChallengeWithCompletionStatus extends TikTokChallenge {
  completed: boolean;
  submissionId?: string;
  submissionStatus?: string;
}

// Define a type for the raw challenge object if not already present
interface TikTokChallengeRaw {
  id: string;
  title: string;
  description: string;
  // Add other fields as needed
  [key: string]: unknown;
}

/**
 * Service for managing TikTok challenges
 */
export const TikTokChallengeService = {
  /**
   * Get all active challenges
   */
  async getActiveChallenges(): Promise<TikTokChallenge[]> {
    try {
      const supabase = getServiceSupabase();
      const { data, error } = await supabase
        .from("active_tiktok_challenges")
        .select("*")
        .order("end_date", { ascending: true });

      if (error) {
        console.error("Error fetching active challenges:", error);
        return [];
      }

      return data.map(this.mapChallenge);
    } catch (error) {
      console.error("Error in getActiveChallenges:", error);
      return [];
    }
  },

  /**
   * Get all challenges with completion status for a user
   */
  async getChallengesForUser(
    userId: string,
  ): Promise<ChallengeWithCompletionStatus[]> {
    try {
      const supabase = getServiceSupabase();
      const { data, error } = await supabase.rpc(
        "get_challenges_with_completion",
        { p_user_id: userId },
      );

      if (error) {
        console.error("Error fetching challenges for user:", error);
        return [];
      }

      return data.map((challenge: TikTokChallengeRaw) => ({
        id: String(challenge.id),
        title: String(challenge.title),
        description: String(challenge.description),
        instructions: challenge.instructions || "",
        hashtags: Array.isArray(challenge.hashtags)
          ? (challenge.hashtags as unknown[]).map(String)
          : [],
        startDate: new Date(String(challenge.start_date)).toISOString(),
        endDate: new Date(String(challenge.end_date)).toISOString(),
        pointsReward: challenge.points_reward,
        badgeReward: challenge.badge_reward,
        status: challenge.status,
        completed: challenge.completed,
        submissionId: challenge.submission_id,
        submissionStatus: challenge.submission_status,
        createdAt: challenge.createdAt
          ? new Date(String(challenge.createdAt))
          : undefined,
        updatedAt: challenge.updatedAt
          ? new Date(String(challenge.updatedAt))
          : undefined,
        metadata: challenge.metadata as ChallengeMetadata,
      }));
    } catch (error) {
      console.error("Error in getChallengesForUser:", error);
      return [];
    }
  },

  /**
   * Get challenge by ID
   */
  async getChallengeById(id: string): Promise<TikTokChallenge | null> {
    try {
      const supabase = getServiceSupabase();
      const { data, error } = await supabase
        .from("tiktok_challenges")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(`Error fetching challenge ID ${id}:`, error);
        return null;
      }

      return this.mapChallenge(data);
    } catch (error) {
      console.error("Error in getChallengeById:", error);
      return null;
    }
  },

  /**
   * Create a new challenge (admin only)
   */
  async createChallenge(
    challenge: Omit<TikTokChallenge, "id" | "createdAt" | "updatedAt">,
  ): Promise<TikTokChallenge | null> {
    try {
      const supabase = getServiceSupabase();

      const { data, error } = await supabase
        .from("tiktok_challenges")
        .insert({
          title: challenge.title,
          description: challenge.description,
          instructions: challenge.instructions,
          hashtags: challenge.hashtags,
          start_date: challenge.startDate,
          end_date: challenge.endDate,
          points_reward: challenge.pointsReward,
          badge_reward: challenge.badgeReward,
          example_video_url: challenge.exampleVideoUrl,
          thumbnail_url: challenge.thumbnailUrl,
          requirements: challenge.requirements,
          status: challenge.status,
          metadata: challenge.metadata,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating challenge:", error);
        return null;
      }

      // Notify users about new challenge if it's active
      if (challenge.status === "active") {
        this.notifyUsersAboutNewChallenge(this.mapChallenge(data));
      }

      return this.mapChallenge(data);
    } catch (error) {
      console.error("Error in createChallenge:", error);
      return null;
    }
  },

  /**
   * Update an existing challenge (admin only)
   */
  async updateChallenge(
    id: string,
    challenge: Partial<TikTokChallenge>,
  ): Promise<TikTokChallenge | null> {
    try {
      const supabase = getServiceSupabase();

      const updateData: Record<
        string,
        string | number | boolean | string[] | object | undefined
      > = {};

      if (typeof challenge.title === "string")
        updateData.title = challenge.title;
      if (typeof challenge.description === "string")
        updateData.description = challenge.description;
      if (typeof challenge.instructions === "string")
        updateData.instructions = challenge.instructions;
      if (
        typeof challenge.hashtags === "object" &&
        Array.isArray(challenge.hashtags)
      )
        updateData.hashtags = challenge.hashtags;
      if (typeof challenge.startDate === "string")
        updateData.start_date = challenge.startDate;
      if (typeof challenge.endDate === "string")
        updateData.end_date = challenge.endDate;
      if (typeof challenge.pointsReward === "number")
        updateData.points_reward = challenge.pointsReward;
      if (typeof challenge.badgeReward === "string")
        updateData.badge_reward = challenge.badgeReward;
      if (typeof challenge.exampleVideoUrl === "string")
        updateData.example_video_url = challenge.exampleVideoUrl;
      if (typeof challenge.thumbnailUrl === "string")
        updateData.thumbnail_url = challenge.thumbnailUrl;
      if (typeof challenge.requirements === "object")
        updateData.requirements = challenge.requirements;
      if (typeof challenge.status === "string")
        updateData.status = challenge.status;
      if (typeof challenge.metadata === "object")
        updateData.metadata = challenge.metadata;

      const { data, error } = await supabase
        .from("tiktok_challenges")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating challenge ID ${id}:`, error);
        return null;
      }

      // Notify users about challenge updates if relevant
      if (challenge.status === "active" && data.status !== "active") {
        this.notifyUsersAboutChallengeUpdate(this.mapChallenge(data));
      }

      return this.mapChallenge(data);
    } catch (error) {
      console.error("Error in updateChallenge:", error);
      return null;
    }
  },

  /**
   * Submit challenge entry
   */
  async submitChallenge(
    challengeId: string,
    userId: string,
    videoUrl: string,
    tiktokUrl?: string,
    metadata?: SubmissionMetadata,
  ): Promise<TikTokChallengeSubmission | null> {
    try {
      const supabase = getServiceSupabase();

      // Check if challenge exists and is active
      const { data: challenge, error: challengeError } = await supabase
        .from("tiktok_challenges")
        .select("*")
        .eq("id", challengeId)
        .eq("status", "active")
        .single();

      if (challengeError || !challenge) {
        console.error(
          `Challenge ID ${challengeId} not found or not active:`,
          challengeError,
        );
        return null;
      }

      // Check if user already submitted this challenge
      const { data: existingSubmission, error: submissionError } =
        await supabase
          .from("tiktok_challenge_submissions")
          .select("id, status")
          .eq("challenge_id", challengeId)
          .eq("user_id", userId)
          .maybeSingle();

      if (submissionError) {
        console.error("Error checking existing submission:", submissionError);
        return null;
      }

      if (existingSubmission && existingSubmission.status === "approved") {
        console.error("User already completed this challenge");
        return null;
      }

      // Generate unique verification code
      const verificationCode = uuidv4().substring(0, 8).toUpperCase();

      // If submission exists but was rejected or pending, update it
      if (existingSubmission) {
        const { data: updatedSubmission, error: updateError } = await supabase
          .from("tiktok_challenge_submissions")
          .update({
            video_url: videoUrl,
            tiktok_url: tiktokUrl,
            status: "pending",
            verification_code: verificationCode,
            submitted_at: new Date().toISOString(),
            verified_at: null,
            metadata,
          })
          .eq("id", existingSubmission.id)
          .select()
          .single();

        if (updateError) {
          console.error("Error updating submission:", updateError);
          return null;
        }

        // Notify admins about resubmission
        this.notifyAdminsAboutSubmission(
          updatedSubmission,
          challenge,
          "resubmitted",
        );

        return this.mapSubmission(updatedSubmission);
      }

      // Create new submission
      const { data: newSubmission, error: createError } = await supabase
        .from("tiktok_challenge_submissions")
        .insert({
          challenge_id: challengeId,
          user_id: userId,
          video_url: videoUrl,
          tiktok_url: tiktokUrl,
          status: "pending",
          verification_code: verificationCode,
          metadata,
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating submission:", createError);
        return null;
      }

      // Notify user about submission
      this.notifyUserAboutSubmission(userId, challenge);

      // Notify admins about new submission
      this.notifyAdminsAboutSubmission(newSubmission, challenge, "submitted");

      return this.mapSubmission(newSubmission);
    } catch (error) {
      console.error("Error in submitChallenge:", error);
      return null;
    }
  },

  /**
   * Get submission by ID
   */
  async getSubmissionById(
    id: string,
  ): Promise<TikTokChallengeSubmission | null> {
    try {
      const supabase = getServiceSupabase();
      const { data, error } = await supabase
        .from("tiktok_challenge_submissions")
        .select("*, tiktok_challenges(*)")
        .eq("id", id)
        .single();

      if (error) {
        console.error(`Error fetching submission ID ${id}:`, error);
        return null;
      }

      return this.mapSubmission(data);
    } catch (error) {
      console.error("Error in getSubmissionById:", error);
      return null;
    }
  },

  /**
   * Get submissions for a challenge
   */
  async getSubmissionsForChallenge(
    challengeId: string,
  ): Promise<TikTokChallengeSubmission[]> {
    try {
      const supabase = getServiceSupabase();
      const { data, error } = await supabase
        .from("tiktok_challenge_submissions")
        .select("*")
        .eq("challenge_id", challengeId)
        .order("submitted_at", { ascending: false });

      if (error) {
        console.error(
          `Error fetching submissions for challenge ${challengeId}:`,
          error,
        );
        return [];
      }

      return data.map(this.mapSubmission);
    } catch (error) {
      console.error("Error in getSubmissionsForChallenge:", error);
      return [];
    }
  },

  /**
   * Get submissions by user
   */
  async getUserSubmissions(
    userId: string,
  ): Promise<TikTokChallengeSubmission[]> {
    try {
      const supabase = getServiceSupabase();
      const { data, error } = await supabase
        .from("tiktok_challenge_submissions")
        .select("*, tiktok_challenges(*)")
        .eq("user_id", userId)
        .order("submitted_at", { ascending: false });

      if (error) {
        console.error(`Error fetching submissions for user ${userId}:`, error);
        return [];
      }

      return data.map(this.mapSubmission);
    } catch (error) {
      console.error("Error in getUserSubmissions:", error);
      return [];
    }
  },

  /**
   * Review challenge submission (admin only)
   */
  async reviewSubmission(
    submissionId: string,
    status: "approved" | "rejected",
    adminFeedback?: string,
  ): Promise<TikTokChallengeSubmission | null> {
    try {
      const supabase = getServiceSupabase();

      // First fetch the submission to get challenge details
      const { data: submission, error: fetchError } = await supabase
        .from("tiktok_challenge_submissions")
        .select("*, tiktok_challenges(*)")
        .eq("id", submissionId)
        .single();

      if (fetchError || !submission) {
        console.error(
          `Error fetching submission ID ${submissionId}:`,
          fetchError,
        );
        return null;
      }

      // Update the submission status
      const { data: updatedSubmission, error: updateError } = await supabase
        .from("tiktok_challenge_submissions")
        .update({
          status,
          admin_feedback: adminFeedback,
          verified_at: status === "approved" ? new Date().toISOString() : null,
        })
        .eq("id", submissionId)
        .select()
        .single();

      if (updateError) {
        console.error(
          `Error updating submission ID ${submissionId}:`,
          updateError,
        );
        return null;
      }

      // If approved, award points and badge
      if (status === "approved") {
        await this.awardChallengeCompletion(
          submission.user_id,
          submission.tiktok_challenges.id,
          submission.tiktok_challenges.points_reward,
          submission.tiktok_challenges.badge_reward,
        );
      }

      // Notify user about submission review
      this.notifyUserAboutReview(
        submission.user_id,
        submission.tiktok_challenges,
        status,
        adminFeedback,
      );

      return this.mapSubmission(updatedSubmission);
    } catch (error) {
      console.error("Error in reviewSubmission:", error);
      return null;
    }
  },

  /**
   * Get TikTok challenge leaderboard
   */
  async getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    try {
      const supabase = getServiceSupabase();
      const { data, error } = await supabase
        .from("tiktok_challenge_submissions")
        .select(
          `
          user_id,
          users:user_id (
            username,
            avatar_url
          ),
          count(*) as submissions,
          sum(points_reward) as points
        `,
        )
        .group("user_id, users.username, users.avatar_url")
        .order("points", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
      }

      return (data as LeaderboardEntryData[]).map((entry, index) => ({
        userId: String(entry.user_id),
        username: String(entry.users?.username || ""),
        points: Number(entry.points || 0),
        submissions: Number(entry.submissions || 0),
        rank: index + 1,
        avatarUrl: entry.users?.avatar_url || undefined,
        metadata: {
          totalViews: 0, // These would need to be calculated from submissions
          totalLikes: 0,
          totalShares: 0,
        },
      }));
    } catch (error) {
      console.error("Error in getLeaderboard:", error);
      return [];
    }
  },

  /**
   * Award points and badges for completing a challenge
   */
  async awardChallengeCompletion(
    userId: string,
    challengeId: string,
    pointsReward: number,
    badgeReward?: string,
  ): Promise<void> {
    try {
      const supabase = getServiceSupabase();

      // Award points
      await supabase.from("user_points").insert({
        user_id: userId,
        points: pointsReward,
        activity: "tiktok_challenge_completion",
        description: `Completed TikTok challenge #${challengeId}`,
      });

      // Award badge if specified
      if (badgeReward) {
        await awardBadgeToUser(userId, badgeReward);
      }

      // Check if user should earn special badges
      const { data: completedCount, error: countError } = await supabase
        .from("tiktok_challenge_submissions")
        .select("id", { count: "exact" })
        .eq("user_id", userId)
        .eq("status", "approved");

      if (!countError && completedCount >= 3) {
        await awardBadgeToUser(userId, "tiktok_creator");
      }

      if (!countError && completedCount >= 10) {
        await awardBadgeToUser(userId, "tiktok_influencer");
      }
    } catch (error) {
      console.error("Error in awardChallengeCompletion:", error);
    }
  },

  /**
   * Notify user about their submission
   */
  async notifyUserAboutSubmission(
    userId: string,
    challenge: TikTokChallenge,
  ): Promise<void> {
    try {
      await createNotification({
        user_id: userId,
        type: "system",
        title: "TikTok Challenge Submitted",
        message: `Your submission for "${challenge.title}" is being reviewed. We'll notify you when it's approved.`,
        image_url: challenge.thumbnailUrl || "/notification-icon.png",
        action_url: "/tiktok-challenges",
        metadata: {
          challengeId: challenge.id,
          challengeTitle: challenge.title,
        },
      });
    } catch (error) {
      console.error("Error in notifyUserAboutSubmission:", error);
    }
  },

  /**
   * Notify user about their submission review
   */
  async notifyUserAboutReview(
    userId: string,
    challenge: TikTokChallenge,
    status: "approved" | "rejected",
    feedback?: string,
  ): Promise<void> {
    try {
      if (status === "approved") {
        await createNotification({
          user_id: userId,
          type: "achievement",
          title: "TikTok Challenge Approved!",
          message: `Your submission for "${challenge.title}" has been approved! You earned ${challenge.pointsReward} points.`,
          image_url: challenge.thumbnailUrl || "/achievement-icon.png",
          action_url: "/tiktok-challenges",
          metadata: {
            challengeId: challenge.id,
            challengeTitle: challenge.title,
            pointsEarned: challenge.pointsReward,
          },
        });
      } else {
        await createNotification({
          user_id: userId,
          type: "system",
          title: "TikTok Challenge Needs Revision",
          message: `Your submission for "${challenge.title}" was not approved. ${feedback || "Please review and try again."}`,
          image_url: "/notification-icon.png",
          action_url: "/tiktok-challenges",
          metadata: {
            challengeId: challenge.id,
            challengeTitle: challenge.title,
            feedback,
          },
        });
      }
    } catch (error) {
      console.error("Error in notifyUserAboutReview:", error);
    }
  },

  /**
   * Notify admins about new submission
   */
  async notifyAdminsAboutSubmission(
    submission: TikTokChallengeSubmission,
    challenge: TikTokChallenge,
    action: "submitted" | "resubmitted",
  ): Promise<void> {
    try {
      // In a real implementation, this would notify actual admins
      // For demo purposes, we'll just log it
      console.log(
        `New TikTok challenge ${action} - Challenge: "${challenge.title}", User: ${submission.userId}`,
      );
    } catch (error) {
      console.error("Error in notifyAdminsAboutSubmission:", error);
    }
  },

  /**
   * Notify users about new challenge
   */
  async notifyUsersAboutNewChallenge(
    challenge: TikTokChallenge,
  ): Promise<void> {
    try {
      // In a real implementation, this would query users and send them notifications
      // For demo purposes, we'll just log it
      console.log(`New TikTok challenge created: "${challenge.title}"`);
    } catch (error) {
      console.error("Error in notifyUsersAboutNewChallenge:", error);
    }
  },

  /**
   * Notify users about challenge update
   */
  async notifyUsersAboutChallengeUpdate(
    challenge: TikTokChallenge,
  ): Promise<void> {
    try {
      // In a real implementation, this would query users and send them notifications
      // For demo purposes, we'll just log it
      console.log(`TikTok challenge updated: "${challenge.title}"`);
    } catch (error) {
      console.error("Error in notifyUsersAboutChallengeUpdate:", error);
    }
  },

  /**
   * Map database challenge to service challenge
   */
  mapChallenge(data: Record<string, unknown>): TikTokChallenge {
    return {
      id: String(data.id),
      title: String(data.title),
      description: String(data.description),
      instructions: String(data.instructions),
      hashtags: Array.isArray(data.hashtags) ? data.hashtags.map(String) : [],
      startDate: String(data.start_date),
      endDate: String(data.end_date),
      pointsReward: Number(data.points_reward),
      badgeReward: data.badge_reward ? String(data.badge_reward) : undefined,
      exampleVideoUrl: data.example_video_url
        ? String(data.example_video_url)
        : undefined,
      thumbnailUrl: data.thumbnail_url ? String(data.thumbnail_url) : undefined,
      requirements: data.requirements as TikTokChallenge["requirements"],
      status: data.status as TikTokChallenge["status"],
      createdAt: new Date(String(data.created_at)),
      updatedAt: new Date(String(data.updated_at)),
      metadata: data.metadata as ChallengeMetadata | undefined,
    };
  },

  /**
   * Map database submission to service submission
   */
  mapSubmission(data: Record<string, unknown>): TikTokChallengeSubmission {
    return {
      id: String(data.id),
      challengeId: String(data.challenge_id),
      userId: String(data.user_id),
      videoUrl: String(data.video_url),
      tiktokUrl: data.tiktok_url ? String(data.tiktok_url) : undefined,
      viewsCount: data.views_count ? Number(data.views_count) : undefined,
      likesCount: data.likes_count ? Number(data.likes_count) : undefined,
      commentsCount: data.comments_count
        ? Number(data.comments_count)
        : undefined,
      sharesCount: data.shares_count ? Number(data.shares_count) : undefined,
      status: data.status as TikTokChallengeSubmission["status"],
      adminFeedback: data.admin_feedback
        ? String(data.admin_feedback)
        : undefined,
      verificationCode: data.verification_code
        ? String(data.verification_code)
        : undefined,
      submittedAt: new Date(String(data.submitted_at)),
      verifiedAt: data.verified_at
        ? new Date(String(data.verified_at))
        : undefined,
      metadata: data.metadata as SubmissionMetadata | undefined,
    };
  },
};

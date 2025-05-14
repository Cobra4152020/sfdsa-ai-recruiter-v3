import { createClient } from "@/lib/supabase-client"
import { getServiceSupabase } from "@/lib/supabase-service"
import { awardBadgeToUser } from "@/lib/badge-utils"
import { createNotification } from "@/lib/notification-service"
import { v4 as uuidv4 } from "uuid"

export interface TikTokChallenge {
  id: number
  title: string
  description: string
  instructions: string
  hashtags: string[]
  startDate: Date
  endDate: Date
  pointsReward: number
  badgeReward?: string
  exampleVideoUrl?: string
  thumbnailUrl?: string
  requirements?: {
    minDuration?: number
    maxDuration?: number
    requiredElements?: string[]
    minViews?: number
  }
  status: "draft" | "active" | "completed" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

export interface TikTokChallengeSubmission {
  id: number
  challengeId: number
  userId: string
  videoUrl: string
  tiktokUrl?: string
  viewsCount?: number
  likesCount?: number
  commentsCount?: number
  sharesCount?: number
  status: "pending" | "approved" | "rejected"
  adminFeedback?: string
  verificationCode?: string
  submittedAt: Date
  verifiedAt?: Date
  metadata?: Record<string, any>
}

export interface ChallengeWithCompletionStatus extends TikTokChallenge {
  completed: boolean
  submissionId?: number
  submissionStatus?: string
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
      const supabase = createClient()
      const { data, error } = await supabase
        .from("active_tiktok_challenges")
        .select("*")
        .order("end_date", { ascending: true })

      if (error) {
        console.error("Error fetching active challenges:", error)
        return []
      }

      return data.map(this.mapChallenge)
    } catch (error) {
      console.error("Error in getActiveChallenges:", error)
      return []
    }
  },

  /**
   * Get all challenges with completion status for a user
   */
  async getChallengesForUser(userId: string): Promise<ChallengeWithCompletionStatus[]> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.rpc("get_challenges_with_completion", { p_user_id: userId })

      if (error) {
        console.error("Error fetching challenges for user:", error)
        return []
      }

      return data.map((challenge) => ({
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        instructions: challenge.instructions || "",
        hashtags: challenge.hashtags || [],
        startDate: new Date(challenge.start_date),
        endDate: new Date(challenge.end_date),
        pointsReward: challenge.points_reward,
        badgeReward: challenge.badge_reward,
        status: challenge.status,
        completed: challenge.completed,
        submissionId: challenge.submission_id,
        submissionStatus: challenge.submission_status,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    } catch (error) {
      console.error("Error in getChallengesForUser:", error)
      return []
    }
  },

  /**
   * Get challenge by ID
   */
  async getChallengeById(id: number): Promise<TikTokChallenge | null> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("tiktok_challenges").select("*").eq("id", id).single()

      if (error) {
        console.error(`Error fetching challenge ID ${id}:`, error)
        return null
      }

      return this.mapChallenge(data)
    } catch (error) {
      console.error("Error in getChallengeById:", error)
      return null
    }
  },

  /**
   * Create a new challenge (admin only)
   */
  async createChallenge(
    challenge: Omit<TikTokChallenge, "id" | "createdAt" | "updatedAt">,
  ): Promise<TikTokChallenge | null> {
    try {
      const supabase = getServiceSupabase()

      const { data, error } = await supabase
        .from("tiktok_challenges")
        .insert({
          title: challenge.title,
          description: challenge.description,
          instructions: challenge.instructions,
          hashtags: challenge.hashtags,
          start_date: challenge.startDate.toISOString(),
          end_date: challenge.endDate.toISOString(),
          points_reward: challenge.pointsReward,
          badge_reward: challenge.badgeReward,
          example_video_url: challenge.exampleVideoUrl,
          thumbnail_url: challenge.thumbnailUrl,
          requirements: challenge.requirements,
          status: challenge.status,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating challenge:", error)
        return null
      }

      // Notify users about new challenge if it's active
      if (challenge.status === "active") {
        this.notifyUsersAboutNewChallenge(this.mapChallenge(data))
      }

      return this.mapChallenge(data)
    } catch (error) {
      console.error("Error in createChallenge:", error)
      return null
    }
  },

  /**
   * Update an existing challenge (admin only)
   */
  async updateChallenge(id: number, challenge: Partial<TikTokChallenge>): Promise<TikTokChallenge | null> {
    try {
      const supabase = getServiceSupabase()

      const updateData: Record<string, any> = {}

      if (challenge.title) updateData.title = challenge.title
      if (challenge.description) updateData.description = challenge.description
      if (challenge.instructions) updateData.instructions = challenge.instructions
      if (challenge.hashtags) updateData.hashtags = challenge.hashtags
      if (challenge.startDate) updateData.start_date = challenge.startDate.toISOString()
      if (challenge.endDate) updateData.end_date = challenge.endDate.toISOString()
      if (challenge.pointsReward) updateData.points_reward = challenge.pointsReward
      if (challenge.badgeReward !== undefined) updateData.badge_reward = challenge.badgeReward
      if (challenge.exampleVideoUrl !== undefined) updateData.example_video_url = challenge.exampleVideoUrl
      if (challenge.thumbnailUrl !== undefined) updateData.thumbnail_url = challenge.thumbnailUrl
      if (challenge.requirements) updateData.requirements = challenge.requirements
      if (challenge.status) updateData.status = challenge.status

      const { data, error } = await supabase.from("tiktok_challenges").update(updateData).eq("id", id).select().single()

      if (error) {
        console.error(`Error updating challenge ID ${id}:`, error)
        return null
      }

      // Notify users about challenge updates if relevant
      if (challenge.status === "active" && data.status !== "active") {
        this.notifyUsersAboutChallengeUpdate(this.mapChallenge(data))
      }

      return this.mapChallenge(data)
    } catch (error) {
      console.error("Error in updateChallenge:", error)
      return null
    }
  },

  /**
   * Submit challenge entry
   */
  async submitChallenge(
    challengeId: number,
    userId: string,
    videoUrl: string,
    tiktokUrl?: string,
    metadata?: Record<string, any>,
  ): Promise<TikTokChallengeSubmission | null> {
    try {
      const supabase = createClient()

      // Check if challenge exists and is active
      const { data: challenge, error: challengeError } = await supabase
        .from("tiktok_challenges")
        .select("*")
        .eq("id", challengeId)
        .eq("status", "active")
        .single()

      if (challengeError || !challenge) {
        console.error(`Challenge ID ${challengeId} not found or not active:`, challengeError)
        return null
      }

      // Check if user already submitted this challenge
      const { data: existingSubmission, error: submissionError } = await supabase
        .from("tiktok_challenge_submissions")
        .select("id, status")
        .eq("challenge_id", challengeId)
        .eq("user_id", userId)
        .maybeSingle()

      if (submissionError) {
        console.error("Error checking existing submission:", submissionError)
        return null
      }

      if (existingSubmission && existingSubmission.status === "approved") {
        console.error("User already completed this challenge")
        return null
      }

      // Generate unique verification code
      const verificationCode = uuidv4().substring(0, 8).toUpperCase()

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
          .single()

        if (updateError) {
          console.error("Error updating submission:", updateError)
          return null
        }

        // Notify admins about resubmission
        this.notifyAdminsAboutSubmission(updatedSubmission, challenge, "resubmitted")

        return this.mapSubmission(updatedSubmission)
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
        .single()

      if (createError) {
        console.error("Error creating submission:", createError)
        return null
      }

      // Notify user about submission
      this.notifyUserAboutSubmission(userId, challenge)

      // Notify admins about new submission
      this.notifyAdminsAboutSubmission(newSubmission, challenge, "submitted")

      return this.mapSubmission(newSubmission)
    } catch (error) {
      console.error("Error in submitChallenge:", error)
      return null
    }
  },

  /**
   * Get submission by ID
   */
  async getSubmissionById(id: number): Promise<TikTokChallengeSubmission | null> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("tiktok_challenge_submissions")
        .select("*, tiktok_challenges(*)")
        .eq("id", id)
        .single()

      if (error) {
        console.error(`Error fetching submission ID ${id}:`, error)
        return null
      }

      return this.mapSubmission(data)
    } catch (error) {
      console.error("Error in getSubmissionById:", error)
      return null
    }
  },

  /**
   * Get submissions for a challenge
   */
  async getSubmissionsForChallenge(challengeId: number): Promise<TikTokChallengeSubmission[]> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("tiktok_challenge_submissions")
        .select("*")
        .eq("challenge_id", challengeId)
        .order("submitted_at", { ascending: false })

      if (error) {
        console.error(`Error fetching submissions for challenge ${challengeId}:`, error)
        return []
      }

      return data.map(this.mapSubmission)
    } catch (error) {
      console.error("Error in getSubmissionsForChallenge:", error)
      return []
    }
  },

  /**
   * Get submissions by user
   */
  async getUserSubmissions(userId: string): Promise<TikTokChallengeSubmission[]> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("tiktok_challenge_submissions")
        .select("*, tiktok_challenges(*)")
        .eq("user_id", userId)
        .order("submitted_at", { ascending: false })

      if (error) {
        console.error(`Error fetching submissions for user ${userId}:`, error)
        return []
      }

      return data.map(this.mapSubmission)
    } catch (error) {
      console.error("Error in getUserSubmissions:", error)
      return []
    }
  },

  /**
   * Review challenge submission (admin only)
   */
  async reviewSubmission(
    submissionId: number,
    status: "approved" | "rejected",
    adminFeedback?: string,
  ): Promise<TikTokChallengeSubmission | null> {
    try {
      const supabase = getServiceSupabase()

      // First fetch the submission to get challenge details
      const { data: submission, error: fetchError } = await supabase
        .from("tiktok_challenge_submissions")
        .select("*, tiktok_challenges(*)")
        .eq("id", submissionId)
        .single()

      if (fetchError || !submission) {
        console.error(`Error fetching submission ID ${submissionId}:`, fetchError)
        return null
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
        .single()

      if (updateError) {
        console.error(`Error updating submission ID ${submissionId}:`, updateError)
        return null
      }

      // If approved, award points and badge
      if (status === "approved") {
        await this.awardChallengeCompletion(
          submission.user_id,
          submission.tiktok_challenges.id,
          submission.tiktok_challenges.points_reward,
          submission.tiktok_challenges.badge_reward,
        )
      }

      // Notify user about submission review
      this.notifyUserAboutReview(submission.user_id, submission.tiktok_challenges, status, adminFeedback)

      return this.mapSubmission(updatedSubmission)
    } catch (error) {
      console.error("Error in reviewSubmission:", error)
      return null
    }
  },

  /**
   * Get TikTok challenge leaderboard
   */
  async getLeaderboard(limit = 10): Promise<any[]> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("tiktok_challenge_leaderboard").select("*").limit(limit)

      if (error) {
        console.error("Error fetching TikTok challenge leaderboard:", error)
        return []
      }

      return data
    } catch (error) {
      console.error("Error in getLeaderboard:", error)
      return []
    }
  },

  /**
   * Award points and badges for completing a challenge
   */
  async awardChallengeCompletion(
    userId: string,
    challengeId: number,
    pointsReward: number,
    badgeReward?: string,
  ): Promise<void> {
    try {
      const supabase = getServiceSupabase()

      // Award points
      await supabase.from("user_points").insert({
        user_id: userId,
        points: pointsReward,
        activity: "tiktok_challenge_completion",
        description: `Completed TikTok challenge #${challengeId}`,
      })

      // Award badge if specified
      if (badgeReward) {
        await awardBadgeToUser(userId, badgeReward)
      }

      // Check if user should earn special badges
      const { data: completedCount, error: countError } = await supabase
        .from("tiktok_challenge_submissions")
        .select("id", { count: "exact" })
        .eq("user_id", userId)
        .eq("status", "approved")

      if (!countError && completedCount >= 3) {
        await awardBadgeToUser(userId, "tiktok_creator")
      }

      if (!countError && completedCount >= 10) {
        await awardBadgeToUser(userId, "tiktok_influencer")
      }
    } catch (error) {
      console.error("Error in awardChallengeCompletion:", error)
    }
  },

  /**
   * Notify user about their submission
   */
  async notifyUserAboutSubmission(userId: string, challenge: any): Promise<void> {
    try {
      await createNotification({
        user_id: userId,
        type: "challenge",
        title: "TikTok Challenge Submitted",
        message: `Your submission for "${challenge.title}" is being reviewed. We'll notify you when it's approved.`,
        image_url: challenge.thumbnail_url || "/notification-icon.png",
        action_url: "/tiktok-challenges",
        metadata: {
          challengeId: challenge.id,
          challengeTitle: challenge.title,
        },
      })
    } catch (error) {
      console.error("Error in notifyUserAboutSubmission:", error)
    }
  },

  /**
   * Notify user about their submission review
   */
  async notifyUserAboutReview(
    userId: string,
    challenge: any,
    status: "approved" | "rejected",
    feedback?: string,
  ): Promise<void> {
    try {
      if (status === "approved") {
        await createNotification({
          user_id: userId,
          type: "achievement",
          title: "TikTok Challenge Approved!",
          message: `Your submission for "${challenge.title}" has been approved! You earned ${challenge.points_reward} points.`,
          image_url: challenge.thumbnail_url || "/achievement-icon.png",
          action_url: "/tiktok-challenges",
          metadata: {
            challengeId: challenge.id,
            challengeTitle: challenge.title,
            pointsEarned: challenge.points_reward,
          },
        })
      } else {
        await createNotification({
          user_id: userId,
          type: "alert",
          title: "TikTok Challenge Needs Revision",
          message: `Your submission for "${challenge.title}" was not approved. ${feedback || "Please review and try again."}`,
          image_url: "/notification-icon.png",
          action_url: "/tiktok-challenges",
          metadata: {
            challengeId: challenge.id,
            challengeTitle: challenge.title,
            feedback,
          },
        })
      }
    } catch (error) {
      console.error("Error in notifyUserAboutReview:", error)
    }
  },

  /**
   * Notify admins about new submission
   */
  async notifyAdminsAboutSubmission(
    submission: any,
    challenge: any,
    action: "submitted" | "resubmitted",
  ): Promise<void> {
    try {
      // In a real implementation, this would notify actual admins
      // For demo purposes, we'll just log it
      console.log(`New TikTok challenge ${action} - Challenge: "${challenge.title}", User: ${submission.user_id}`)
    } catch (error) {
      console.error("Error in notifyAdminsAboutSubmission:", error)
    }
  },

  /**
   * Notify users about new challenge
   */
  async notifyUsersAboutNewChallenge(challenge: TikTokChallenge): Promise<void> {
    try {
      // In a real implementation, this would query users and send them notifications
      // For demo purposes, we'll just log it
      console.log(`New TikTok challenge created: "${challenge.title}"`)
    } catch (error) {
      console.error("Error in notifyUsersAboutNewChallenge:", error)
    }
  },

  /**
   * Notify users about challenge update
   */
  async notifyUsersAboutChallengeUpdate(challenge: TikTokChallenge): Promise<void> {
    try {
      // In a real implementation, this would query users and send them notifications
      // For demo purposes, we'll just log it
      console.log(`TikTok challenge updated: "${challenge.title}"`)
    } catch (error) {
      console.error("Error in notifyUsersAboutChallengeUpdate:", error)
    }
  },

  /**
   * Map database challenge to service challenge
   */
  mapChallenge(data: any): TikTokChallenge {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      instructions: data.instructions,
      hashtags: data.hashtags || [],
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      pointsReward: data.points_reward,
      badgeReward: data.badge_reward,
      exampleVideoUrl: data.example_video_url,
      thumbnailUrl: data.thumbnail_url,
      requirements: data.requirements,
      status: data.status,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  },

  /**
   * Map database submission to service submission
   */
  mapSubmission(data: any): TikTokChallengeSubmission {
    return {
      id: data.id,
      challengeId: data.challenge_id,
      userId: data.user_id,
      videoUrl: data.video_url,
      tiktokUrl: data.tiktok_url,
      viewsCount: data.views_count,
      likesCount: data.likes_count,
      commentsCount: data.comments_count,
      sharesCount: data.shares_count,
      status: data.status,
      adminFeedback: data.admin_feedback,
      verificationCode: data.verification_code,
      submittedAt: new Date(data.submitted_at),
      verifiedAt: data.verified_at ? new Date(data.verified_at) : undefined,
      metadata: data.metadata,
    }
  },
}

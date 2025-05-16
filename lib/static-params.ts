import { createClient } from "./supabase-server"

interface User {
  id: string
}

interface TikTokChallenge {
  id: number
}

interface TikTokSubmission {
  id: number
}

interface Donation {
  id: string
}

/**
 * Generates static parameters for user-related routes
 */
export async function generateUserStaticParams() {
  const supabase = createClient()
  const { data: users } = await supabase.from("users").select("id")
  
  return (users as User[] | null)?.map((user) => ({
    id: user.id,
  })) || []
}

/**
 * Generates static parameters for TikTok challenge routes
 */
export async function generateTikTokChallengeStaticParams() {
  const supabase = createClient()
  const { data: challenges } = await supabase.from("tiktok_challenges").select("id")
  
  return (challenges as TikTokChallenge[] | null)?.map((challenge) => ({
    id: challenge.id.toString(),
  })) || []
}

/**
 * Generates static parameters for TikTok challenge submission routes
 */
export async function generateTikTokSubmissionStaticParams() {
  const supabase = createClient()
  const { data: submissions } = await supabase.from("tiktok_challenge_submissions").select("id")
  
  return (submissions as TikTokSubmission[] | null)?.map((submission) => ({
    id: submission.id.toString(),
  })) || []
}

/**
 * Generates static parameters for donation routes
 */
export async function generateDonationStaticParams() {
  const supabase = createClient()
  const { data: donations } = await supabase.from("donations").select("id")
  
  return (donations as Donation[] | null)?.map((donation) => ({
    id: donation.id,
  })) || []
} 
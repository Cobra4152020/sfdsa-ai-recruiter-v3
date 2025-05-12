import { createClient } from "@/lib/supabase-server"
import type { Database } from "@/types/database"

export type DailyBriefing = Database["public"]["Tables"]["daily_briefings"]["Row"]
export type BriefingAttendance = Database["public"]["Tables"]["briefing_attendance"]["Row"]
export type BriefingShare = Database["public"]["Tables"]["briefing_shares"]["Row"]
export type BriefingStreak = Database["public"]["Tables"]["briefing_streaks"]["Row"]

export async function getTodaysBriefing() {
  try {
    const supabase = createClient()
    const today = new Date().toISOString().split("T")[0]

    console.log(`Fetching briefing for date: ${today}`)

    // First try to get an exact match for today
    const { data, error } = await supabase
      .from("daily_briefings")
      .select("*")
      .eq("date", today)
      .eq("active", true)
      .order("created_at", { ascending: false })
      .maybeSingle() // Use maybeSingle instead of single to avoid errors

    if (error) {
      console.error("Error in getTodaysBriefing:", error)
      return null
    }

    // If we found a briefing for today, return it
    if (data) {
      return data
    }

    // If no briefing for today, get the most recent one
    console.log("No briefing found for today, fetching most recent")
    const { data: recentData, error: recentError } = await supabase
      .from("daily_briefings")
      .select("*")
      .eq("active", true)
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (recentError) {
      console.error("Error fetching recent briefing:", recentError)
      return null
    }

    return recentData
  } catch (error) {
    console.error("Exception in getTodaysBriefing:", error)
    return null
  }
}

export async function getBriefingHistory(limit = 7) {
  const supabase = createClient()
  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("daily_briefings")
    .select("*")
    .lt("date", today)
    .eq("active", true)
    .order("date", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching briefing history:", error)
    return []
  }

  return data
}

export async function markBriefingAttended(userId: string, briefingId: string) {
  const supabase = createClient()
  const points = 25 // Base points for attending

  // First check if already attended
  const { data: existing } = await supabase
    .from("briefing_attendance")
    .select("*")
    .eq("user_id", userId)
    .eq("briefing_id", briefingId)
    .single()

  if (existing) {
    return { success: true, alreadyAttended: true, points: 0 }
  }

  // Get the briefing to check date
  const { data: briefing } = await supabase.from("daily_briefings").select("date").eq("id", briefingId).single()

  if (!briefing) {
    return { success: false, error: "Briefing not found" }
  }

  // Get user's current streak
  const { data: streak } = await supabase.from("briefing_streaks").select("*").eq("user_id", userId).single()

  let streakPoints = 0
  let newStreak = 1
  let longestStreak = streak?.longest_streak || 0

  if (streak) {
    const lastDate = new Date(streak.last_briefing_date)
    const briefingDate = new Date(briefing.date)
    const yesterday = new Date(briefingDate)
    yesterday.setDate(yesterday.getDate() - 1)

    // Check if this continues a streak
    if (lastDate.toISOString().split("T")[0] === yesterday.toISOString().split("T")[0]) {
      newStreak = streak.current_streak + 1

      // Award bonus points for streaks
      if (newStreak >= 7) {
        streakPoints = 50 // Week streak
      } else if (newStreak >= 30) {
        streakPoints = 200 // Month streak
      } else if (newStreak >= 3) {
        streakPoints = 15 // 3-day streak
      }

      if (newStreak > longestStreak) {
        longestStreak = newStreak
      }
    }
  }

  const totalPoints = points + streakPoints

  // Record attendance
  const { error: attendanceError } = await supabase.from("briefing_attendance").insert({
    user_id: userId,
    briefing_id: briefingId,
    points_awarded: totalPoints,
  })

  if (attendanceError) {
    console.error("Error recording attendance:", attendanceError)
    return { success: false, error: attendanceError.message }
  }

  // Update streak
  const { error: streakError } = await supabase.from("briefing_streaks").upsert({
    user_id: userId,
    current_streak: newStreak,
    longest_streak: longestStreak,
    last_briefing_date: briefing.date,
    updated_at: new Date().toISOString(),
  })

  if (streakError) {
    console.error("Error updating streak:", streakError)
  }

  // Award points to user
  if (totalPoints > 0) {
    const { error: pointsError } = await supabase.rpc("add_points", {
      p_user_id: userId,
      p_points: totalPoints,
      p_source: "daily_briefing",
      p_description: `Attended Sgt. Ken's Daily Briefing${streakPoints > 0 ? ` (includes ${streakPoints} streak bonus)` : ""}`,
    })

    if (pointsError) {
      console.error("Error awarding points:", pointsError)
    }
  }

  return {
    success: true,
    points: totalPoints,
    streak: newStreak,
    streakPoints,
  }
}

export async function recordBriefingShare(userId: string, briefingId: string, platform: string) {
  const supabase = createClient()
  const points = 50 // Points for sharing

  // Check if already shared on this platform today
  const { data: existing } = await supabase
    .from("briefing_shares")
    .select("*")
    .eq("user_id", userId)
    .eq("briefing_id", briefingId)
    .eq("platform", platform)
    .single()

  if (existing) {
    return { success: true, alreadyShared: true, points: 0 }
  }

  // Record share
  const { error: shareError } = await supabase.from("briefing_shares").insert({
    user_id: userId,
    briefing_id: briefingId,
    platform,
    points_awarded: points,
  })

  if (shareError) {
    console.error("Error recording share:", shareError)
    return { success: false, error: shareError.message }
  }

  // Award points
  const { error: pointsError } = await supabase.rpc("add_points", {
    p_user_id: userId,
    p_points: points,
    p_source: "briefing_share",
    p_description: `Shared Sgt. Ken's Daily Briefing on ${platform}`,
  })

  if (pointsError) {
    console.error("Error awarding points for share:", pointsError)
  }

  return { success: true, points }
}

export async function getUserBriefingStats(userId: string) {
  const supabase = createClient()

  // Get streak info
  const { data: streak, error: streakError } = await supabase
    .from("briefing_streaks")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (streakError && streakError.code !== "PGRST116") {
    // Not found error is ok
    console.error("Error fetching streak:", streakError)
  }

  // Get total briefings attended
  const { count: totalAttended, error: countError } = await supabase
    .from("briefing_attendance")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  if (countError) {
    console.error("Error counting attendance:", countError)
  }

  // Get total points earned from briefings
  const { data: pointsData, error: pointsError } = await supabase
    .from("briefing_attendance")
    .select("points_awarded")
    .eq("user_id", userId)

  if (pointsError) {
    console.error("Error fetching briefing points:", pointsError)
  }

  const attendancePoints = pointsData?.reduce((sum, record) => sum + (record.points_awarded || 0), 0) || 0

  // Get total points from shares
  const { data: sharePointsData, error: sharePointsError } = await supabase
    .from("briefing_shares")
    .select("points_awarded")
    .eq("user_id", userId)

  if (sharePointsError) {
    console.error("Error fetching share points:", sharePointsError)
  }

  const sharePoints = sharePointsData?.reduce((sum, record) => sum + (record.points_awarded || 0), 0) || 0

  return {
    currentStreak: streak?.current_streak || 0,
    longestStreak: streak?.longest_streak || 0,
    lastAttendance: streak?.last_briefing_date || null,
    totalAttended: totalAttended || 0,
    totalPoints: attendancePoints + sharePoints,
  }
}

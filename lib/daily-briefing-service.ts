import { getServiceSupabase } from "@/app/lib/supabase/server"
import { addParticipationPoints } from "@/lib/points-service"

export interface DailyBriefing {
  id: string
  content: string
  date: string
  theme: string
  title: string
  created_at: string
  userStreak?: number
  cycle_day?: number
}

export interface BriefingAttendance {
  id: string
  user_id: string
  briefing_id: string
  attended_at: string
}

export interface BriefingShare {
  id: string
  user_id: string
  briefing_id: string
  platform: string
  shared_at: string
}

export interface BriefingStats {
  total_attendees: number
  total_shares: number
  user_attended: boolean
  user_shared: boolean
  user_platforms_shared: string[]
}

/**
 * Get today's daily briefing
 */
export async function getTodaysBriefing(): Promise<DailyBriefing | null> {
  try {
    const supabase = getServiceSupabase()

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]

    // Query the daily_briefings table for today's briefing
    const { data, error } = await supabase.from("daily_briefings").select("*").eq("date", today).single()

    if (error) {
      console.error("Error fetching today's briefing:", error)

      // If no briefing for today, get the most recent one
      const { data: recentData, error: recentError } = await supabase
        .from("daily_briefings")
        .select("*")
        .order("date", { ascending: false })
        .limit(1)
        .single()

      if (recentError) {
        console.error("Error fetching recent briefing:", recentError)
        return null
      }

      return recentData
    }

    return data
  } catch (error) {
    console.error("Exception in getTodaysBriefing:", error)
    return null
  }
}

/**
 * Record user attendance for a daily briefing
 */
export async function recordAttendance(userId: string, briefingId: string): Promise<boolean> {
  try {
    const supabase = getServiceSupabase()

    // Check if user has already attended this briefing
    const { data: existingAttendance, error: checkError } = await supabase
      .from("briefing_attendance")
      .select("id")
      .eq("user_id", userId)
      .eq("briefing_id", briefingId)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking attendance:", checkError)
      return false
    }

    // If user has already attended, return true without recording again
    if (existingAttendance) {
      return true
    }

    // Record attendance
    const { error } = await supabase.from("briefing_attendance").insert({
      user_id: userId,
      briefing_id: briefingId,
      attended_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error recording attendance:", error)
      return false
    }

    // Award points for attendance
    await addParticipationPoints(
      userId,
      5, // 5 points for attending the daily briefing
      "daily_briefing_attendance",
      `Attended Sgt. Ken's Daily Briefing`,
    )

    return true
  } catch (error) {
    console.error("Exception in recordAttendance:", error)
    return false
  }
}

/**
 * Record user sharing a daily briefing on social media
 */
export async function recordShare(userId: string, briefingId: string, platform: string): Promise<boolean> {
  try {
    const supabase = getServiceSupabase()

    // Check if user has already shared this briefing on this platform
    const { data: existingShare, error: checkError } = await supabase
      .from("briefing_shares")
      .select("id")
      .eq("user_id", userId)
      .eq("briefing_id", briefingId)
      .eq("platform", platform)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking share:", checkError)
      return false
    }

    // If user has already shared on this platform, return false
    if (existingShare) {
      return false
    }

    // Record share
    const { error } = await supabase.from("briefing_shares").insert({
      user_id: userId,
      briefing_id: briefingId,
      platform,
      shared_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error recording share:", error)
      return false
    }

    // Award points for sharing
    const pointsMap: Record<string, number> = {
      twitter: 10,
      facebook: 10,
      linkedin: 15,
      instagram: 10,
      email: 5,
    }

    const points = pointsMap[platform] || 10

    await addParticipationPoints(
      userId,
      points,
      "daily_briefing_share",
      `Shared Sgt. Ken's Daily Briefing on ${platform}`,
    )

    return true
  } catch (error) {
    console.error("Exception in recordShare:", error)
    return false
  }
}

/**
 * Get stats for a daily briefing
 */
export async function getBriefingStats(briefingId: string, userId?: string): Promise<BriefingStats> {
  try {
    const supabase = getServiceSupabase()

    // Get total attendees
    const { count: totalAttendees, error: attendeesError } = await supabase
      .from("briefing_attendance")
      .select("id", { count: "exact", head: true })
      .eq("briefing_id", briefingId)

    if (attendeesError) {
      console.error("Error getting attendees count:", attendeesError)
    }

    // Get total shares
    const { count: totalShares, error: sharesError } = await supabase
      .from("briefing_shares")
      .select("id", { count: "exact", head: true })
      .eq("briefing_id", briefingId)

    if (sharesError) {
      console.error("Error getting shares count:", sharesError)
    }

    // Default stats
    const stats: BriefingStats = {
      total_attendees: totalAttendees || 0,
      total_shares: totalShares || 0,
      user_attended: false,
      user_shared: false,
      user_platforms_shared: [],
    }

    // If userId is provided, get user-specific stats
    if (userId) {
      // Check if user attended
      const { data: attendance, error: userAttendanceError } = await supabase
        .from("briefing_attendance")
        .select("id")
        .eq("briefing_id", briefingId)
        .eq("user_id", userId)
        .maybeSingle()

      if (userAttendanceError) {
        console.error("Error checking user attendance:", userAttendanceError)
      } else {
        stats.user_attended = !!attendance
      }

      // Get platforms user shared on
      const { data: shares, error: userSharesError } = await supabase
        .from("briefing_shares")
        .select("platform")
        .eq("briefing_id", briefingId)
        .eq("user_id", userId)

      if (userSharesError) {
        console.error("Error getting user shares:", userSharesError)
      } else if (shares && shares.length > 0) {
        stats.user_shared = true
        stats.user_platforms_shared = shares.map((share) => share.platform)
      }
    }

    return stats
  } catch (error) {
    console.error("Exception in getBriefingStats:", error)
    return {
      total_attendees: 0,
      total_shares: 0,
      user_attended: false,
      user_shared: false,
      user_platforms_shared: [],
    }
  }
}

/**
 * Calculate the day number (1-365) for a given date within the current cycle
 */
export function calculateCycleDay(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1
  return ((dayOfYear - 1) % 365) + 1
}

/**
 * Update briefing dates for the next cycle
 */
export async function updateBriefingCycle(): Promise<boolean> {
  try {
    const supabase = getServiceSupabase()
    const today = new Date()
    const cycleDay = calculateCycleDay(today)

    // If we're not at day 365, no need to update
    if (cycleDay !== 365) {
      return true
    }

    // Get all briefings ordered by their original dates
    const { data: briefings, error: fetchError } = await supabase
      .from("daily_briefings")
      .select("*")
      .order("date", { ascending: true })

    if (fetchError) {
      console.error("Error fetching briefings:", fetchError)
      return false
    }

    // Calculate the start date for the new cycle (tomorrow)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Update each briefing with a new date
    for (let i = 0; i < briefings.length; i++) {
      const newDate = new Date(tomorrow)
      newDate.setDate(newDate.getDate() + i)
      
      const { error: updateError } = await supabase
        .from("daily_briefings")
        .update({ 
          date: newDate.toISOString().split("T")[0],
          updated_at: new Date().toISOString()
        })
        .eq("id", briefings[i].id)

      if (updateError) {
        console.error(`Error updating briefing ${briefings[i].id}:`, updateError)
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Exception in updateBriefingCycle:", error)
    return false
  }
}

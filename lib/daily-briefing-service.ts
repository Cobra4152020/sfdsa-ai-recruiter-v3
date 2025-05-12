import { createClient } from "@/lib/supabase-server"
import type { Database } from "@/types/database"

export type DailyBriefing = Database["public"]["Tables"]["daily_briefings"]["Row"]
export type BriefingAttendance = Database["public"]["Tables"]["briefing_attendance"]["Row"]
export type BriefingShare = Database["public"]["Tables"]["briefing_shares"]["Row"]
export type BriefingStreak = Database["public"]["Tables"]["briefing_streaks"]["Row"]

// Default briefing data to use when no briefings exist
const DEFAULT_BRIEFING = {
  date: new Date().toISOString().split("T")[0],
  theme: "duty",
  quote:
    "The ultimate measure of a person is not where they stand in moments of comfort and convenience, but where they stand in times of challenge and controversy.",
  quote_author: "Martin Luther King Jr.",
  sgt_ken_take:
    "As deputy sheriffs, we face challenges daily that test our character and resolve. It's easy to do the right thing when everything is going well, but our true measure as law enforcement professionals is how we respond under pressure. Remember that each difficult situation is an opportunity to demonstrate our commitment to duty and service.",
  call_to_action:
    "Today, reflect on a challenging situation you've faced recently. How did you respond? What would you do differently next time? Share your insights with a colleague.",
  active: true,
}

// Function to create a default briefing
async function createDefaultBriefing() {
  try {
    const supabase = createClient()
    console.log("Creating default briefing")

    const { data, error } = await supabase
      .from("daily_briefings")
      .insert({
        ...DEFAULT_BRIEFING,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating default briefing:", error)
      return null
    }

    console.log("Default briefing created successfully:", data)
    return data
  } catch (error) {
    console.error("Exception in createDefaultBriefing:", error)
    return null
  }
}

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

    // If we found a recent briefing, return it
    if (recentData) {
      return recentData
    }

    // If no briefings exist at all, create a default one
    console.log("No briefings found in database, creating default")
    return await createDefaultBriefing()
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
  try {
    const supabase = createClient()
    const points = 25 // Base points for attending

    console.log(`Marking briefing ${briefingId} as attended by user ${userId}`)

    // First check if already attended
    const { data: existing, error: existingError } = await supabase
      .from("briefing_attendance")
      .select("*")
      .eq("user_id", userId)
      .eq("briefing_id", briefingId)
      .maybeSingle()

    if (existingError) {
      console.error("Error checking existing attendance:", existingError)
      return { success: false, error: "Failed to check existing attendance" }
    }

    if (existing) {
      console.log("User already attended this briefing")
      return { success: true, alreadyAttended: true, points: 0 }
    }

    // Get the briefing to check date
    const { data: briefing, error: briefingError } = await supabase
      .from("daily_briefings")
      .select("date")
      .eq("id", briefingId)
      .maybeSingle()

    if (briefingError || !briefing) {
      console.error("Error fetching briefing:", briefingError)
      return { success: false, error: "Briefing not found" }
    }

    // Get user's current streak
    const { data: streak, error: streakError } = await supabase
      .from("briefing_streaks")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()

    if (streakError && streakError.code !== "PGRST116") {
      // Not found error is ok
      console.error("Error fetching streak:", streakError)
    }

    let streakPoints = 0
    let newStreak = 1
    let longestStreak = streak?.longest_streak || 0

    if (streak) {
      const lastDate = streak.last_briefing_date ? new Date(streak.last_briefing_date) : null
      const briefingDate = new Date(briefing.date)

      if (lastDate) {
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
    }

    const totalPoints = points + streakPoints

    // Record attendance
    const { error: attendanceError } = await supabase.from("briefing_attendance").insert({
      user_id: userId,
      briefing_id: briefingId,
      points_awarded: totalPoints,
      attended_at: new Date().toISOString(),
    })

    if (attendanceError) {
      console.error("Error recording attendance:", attendanceError)
      return { success: false, error: attendanceError.message }
    }

    // Update streak
    const { error: streakError2 } = await supabase.from("briefing_streaks").upsert({
      user_id: userId,
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_briefing_date: briefing.date,
      updated_at: new Date().toISOString(),
    })

    if (streakError2) {
      console.error("Error updating streak:", streakError2)
      // Continue anyway, this is not critical
    }

    // Award points to user - try to use the add_points RPC function if it exists
    let pointsAwarded = false
    if (totalPoints > 0) {
      try {
        const { error: pointsError } = await supabase.rpc("add_points", {
          p_user_id: userId,
          p_points: totalPoints,
          p_source: "daily_briefing",
          p_description: `Attended Sgt. Ken's Daily Briefing${streakPoints > 0 ? ` (includes ${streakPoints} streak bonus)` : ""}`,
        })

        if (pointsError) {
          console.error("Error awarding points via RPC:", pointsError)
          // If the RPC function doesn't exist, we'll handle points differently
          if (pointsError.message.includes("function") && pointsError.message.includes("does not exist")) {
            console.log("add_points RPC function does not exist, updating user_points table directly")

            // Try to update user_points table directly if it exists
            try {
              const { error: directPointsError } = await supabase.from("user_points").upsert({
                user_id: userId,
                points: totalPoints,
                source: "daily_briefing",
                description: `Attended Sgt. Ken's Daily Briefing${streakPoints > 0 ? ` (includes ${streakPoints} streak bonus)` : ""}`,
                created_at: new Date().toISOString(),
              })

              if (!directPointsError) {
                pointsAwarded = true
              } else {
                console.error("Error updating user_points directly:", directPointsError)
              }
            } catch (err) {
              console.error("Exception updating user_points:", err)
            }
          }
        } else {
          pointsAwarded = true
        }
      } catch (err) {
        console.error("Exception in add_points RPC call:", err)
      }
    }

    return {
      success: true,
      points: totalPoints,
      pointsAwarded,
      streak: newStreak,
      streakPoints,
    }
  } catch (error) {
    console.error("Exception in markBriefingAttended:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function recordBriefingShare(userId: string, briefingId: string, platform: string) {
  try {
    const supabase = createClient()
    const points = 50 // Points for sharing

    // Check if already shared on this platform today
    const { data: existing, error: existingError } = await supabase
      .from("briefing_shares")
      .select("*")
      .eq("user_id", userId)
      .eq("briefing_id", briefingId)
      .eq("platform", platform)
      .maybeSingle()

    if (existingError) {
      console.error("Error checking existing share:", existingError)
      return { success: false, error: "Failed to check existing share" }
    }

    if (existing) {
      return { success: true, alreadyShared: true, points: 0 }
    }

    // Record share
    const { error: shareError } = await supabase.from("briefing_shares").insert({
      user_id: userId,
      briefing_id: briefingId,
      platform,
      points_awarded: points,
      shared_at: new Date().toISOString(),
    })

    if (shareError) {
      console.error("Error recording share:", shareError)
      return { success: false, error: shareError.message }
    }

    // Award points to user - try to use the add_points RPC function if it exists
    let pointsAwarded = false
    try {
      const { error: pointsError } = await supabase.rpc("add_points", {
        p_user_id: userId,
        p_points: points,
        p_source: "briefing_share",
        p_description: `Shared Sgt. Ken's Daily Briefing on ${platform}`,
      })

      if (pointsError) {
        console.error("Error awarding points for share:", pointsError)
        // If the RPC function doesn't exist, we'll handle points differently
        if (pointsError.message.includes("function") && pointsError.message.includes("does not exist")) {
          console.log("add_points RPC function does not exist, updating user_points table directly")

          // Try to update user_points table directly if it exists
          try {
            const { error: directPointsError } = await supabase.from("user_points").upsert({
              user_id: userId,
              points: points,
              source: "briefing_share",
              description: `Shared Sgt. Ken's Daily Briefing on ${platform}`,
              created_at: new Date().toISOString(),
            })

            if (!directPointsError) {
              pointsAwarded = true
            } else {
              console.error("Error updating user_points directly:", directPointsError)
            }
          } catch (err) {
            console.error("Exception updating user_points:", err)
          }
        }
      } else {
        pointsAwarded = true
      }
    } catch (err) {
      console.error("Exception in add_points RPC call:", err)
    }

    return {
      success: true,
      points,
      pointsAwarded,
    }
  } catch (error) {
    console.error("Exception in recordBriefingShare:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
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

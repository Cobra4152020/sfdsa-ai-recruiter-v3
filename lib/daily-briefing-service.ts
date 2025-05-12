import { createClient } from "@/lib/supabase-clients"
import { addParticipationPoints } from "@/lib/points-service"

export interface DailyBriefing {
  id: string
  date: string
  theme: "duty" | "courage" | "respect" | "service" | "leadership" | "resilience"
  quote: string
  quote_author: string | null
  sgt_ken_take: string
  call_to_action: string
  created_at: string
  active: boolean
}

export interface BriefingAttendance {
  id: string
  user_id: string
  briefing_id: string
  attended_at: string
  points_awarded: number
}

export interface BriefingStreak {
  user_id: string
  current_streak: number
  longest_streak: number
  last_briefing_date: string
}

const POINTS_FOR_ATTENDANCE = 25
const POINTS_FOR_SHARING = 50
const STREAK_BONUS_POINTS = 10 // Additional points per day in streak

/**
 * Get today's briefing
 */
export async function getTodaysBriefing(): Promise<DailyBriefing | null> {
  try {
    const supabase = createClient()

    // Get today's date in the same format as stored in the database
    const today = new Date().toISOString().split("T")[0]

    // Query for today's briefing
    const { data, error } = await supabase
      .from("daily_briefings")
      .select("*")
      .eq("date", today)
      .eq("active", true)
      .single()

    if (error) {
      console.error("Error fetching today's briefing:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Exception in getTodaysBriefing:", error)
    return null
  }
}

/**
 * Get briefing by ID
 */
export async function getBriefingById(id: string): Promise<DailyBriefing | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("daily_briefings").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching briefing with ID ${id}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error("Exception in getBriefingById:", error)
    return null
  }
}

/**
 * Get recent briefings (for history)
 */
export async function getRecentBriefings(limit = 7): Promise<DailyBriefing[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("daily_briefings")
      .select("*")
      .order("date", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching recent briefings:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Exception in getRecentBriefings:", error)
    return []
  }
}

/**
 * Record user attendance at the daily briefing
 */
export async function recordBriefingAttendance(
  userId: string,
  briefingId: string,
): Promise<{
  success: boolean
  pointsAwarded: number
  newStreak: number
  alreadyAttended: boolean
}> {
  try {
    const supabase = createClient()

    // Check if user has already attended this briefing
    const { data: existingAttendance, error: checkError } = await supabase
      .from("briefing_attendance")
      .select("*")
      .eq("user_id", userId)
      .eq("briefing_id", briefingId)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing attendance:", checkError)
      return { success: false, pointsAwarded: 0, newStreak: 0, alreadyAttended: false }
    }

    // If already attended, return early but count as success
    if (existingAttendance) {
      return {
        success: true,
        pointsAwarded: existingAttendance.points_awarded,
        newStreak: await getCurrentStreak(userId),
        alreadyAttended: true,
      }
    }

    // Get the briefing to check its date
    const briefing = await getBriefingById(briefingId)
    if (!briefing) {
      console.error(`Briefing with ID ${briefingId} not found`)
      return { success: false, pointsAwarded: 0, newStreak: 0, alreadyAttended: false }
    }

    // Update streak information
    const { updatedStreak, isConsecutive } = await updateStreak(userId, briefing.date)

    // Calculate points (base + streak bonus)
    let pointsToAward = POINTS_FOR_ATTENDANCE
    if (updatedStreak > 1) {
      pointsToAward += (updatedStreak - 1) * STREAK_BONUS_POINTS
    }

    // Record attendance
    const { error: insertError } = await supabase.from("briefing_attendance").insert({
      user_id: userId,
      briefing_id: briefingId,
      points_awarded: pointsToAward,
    })

    if (insertError) {
      console.error("Error recording attendance:", insertError)
      return { success: false, pointsAwarded: 0, newStreak: updatedStreak, alreadyAttended: false }
    }

    // Award points
    await addParticipationPoints(
      userId,
      pointsToAward,
      "daily_briefing_attendance",
      `Attended Sgt. Ken's Daily Briefing for ${briefing.date} (${updatedStreak}-day streak)`,
    )

    return {
      success: true,
      pointsAwarded: pointsToAward,
      newStreak: updatedStreak,
      alreadyAttended: false,
    }
  } catch (error) {
    console.error("Exception in recordBriefingAttendance:", error)
    return { success: false, pointsAwarded: 0, newStreak: 0, alreadyAttended: false }
  }
}

/**
 * Record social media share of a briefing
 */
export async function recordBriefingShare(
  userId: string,
  briefingId: string,
  platform: string,
): Promise<{ success: boolean; pointsAwarded: number }> {
  try {
    const supabase = createClient()

    // Check if user has already shared this briefing on this platform
    const { data: existingShare, error: checkError } = await supabase
      .from("briefing_shares")
      .select("*")
      .eq("user_id", userId)
      .eq("briefing_id", briefingId)
      .eq("platform", platform)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing share:", checkError)
      return { success: false, pointsAwarded: 0 }
    }

    // If already shared on this platform, return early but count as success
    if (existingShare) {
      return { success: true, pointsAwarded: existingShare.points_awarded }
    }

    // Record the share
    const { error: insertError } = await supabase.from("briefing_shares").insert({
      user_id: userId,
      briefing_id: briefingId,
      platform,
      points_awarded: POINTS_FOR_SHARING,
    })

    if (insertError) {
      console.error("Error recording share:", insertError)
      return { success: false, pointsAwarded: 0 }
    }

    // Award points
    await addParticipationPoints(
      userId,
      POINTS_FOR_SHARING,
      "daily_briefing_share",
      `Shared Sgt. Ken's Daily Briefing on ${platform}`,
    )

    return { success: true, pointsAwarded: POINTS_FOR_SHARING }
  } catch (error) {
    console.error("Exception in recordBriefingShare:", error)
    return { success: false, pointsAwarded: 0 }
  }
}

/**
 * Get a user's current briefing streak
 */
export async function getCurrentStreak(userId: string): Promise<number> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("briefing_streaks")
      .select("current_streak")
      .eq("user_id", userId)
      .single()

    if (error) {
      // If no record exists, the user hasn't started a streak yet
      if (error.code === "PGRST116") {
        return 0
      }
      console.error("Error getting streak:", error)
      return 0
    }

    return data.current_streak
  } catch (error) {
    console.error("Exception in getCurrentStreak:", error)
    return 0
  }
}

/**
 * Update a user's streak based on the date of the latest briefing they attended
 */
async function updateStreak(
  userId: string,
  briefingDate: string,
): Promise<{ updatedStreak: number; isConsecutive: boolean }> {
  try {
    const supabase = createClient()

    // Get user's current streak information
    const { data: streakData, error: streakError } = await supabase
      .from("briefing_streaks")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()

    if (streakError && streakError.code !== "PGRST116") {
      console.error("Error fetching streak data:", streakError)
      return { updatedStreak: 1, isConsecutive: false }
    }

    const today = new Date(briefingDate)
    let updatedStreak = 1
    let isConsecutive = false

    if (streakData) {
      const lastDate = streakData.last_briefing_date ? new Date(streakData.last_briefing_date) : null

      if (lastDate) {
        // Check if this briefing is for a different date than the last one attended
        if (briefingDate !== streakData.last_briefing_date) {
          const dayDifference = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

          // If it's the next day, increment streak
          if (dayDifference === 1) {
            updatedStreak = streakData.current_streak + 1
            isConsecutive = true
          }
          // If more than one day has passed, reset streak
          else if (dayDifference > 1) {
            updatedStreak = 1
            isConsecutive = false
          }
          // If it's the same day, maintain streak
          else if (dayDifference === 0) {
            updatedStreak = streakData.current_streak
            isConsecutive = true
          }
          // If it's a date in the past, don't change streak (this shouldn't happen in normal operation)
          else {
            updatedStreak = streakData.current_streak
            isConsecutive = false
          }
        } else {
          // Same briefing date, maintain streak
          updatedStreak = streakData.current_streak
          isConsecutive = true
        }
      }
    }

    // Calculate longest streak
    const longestStreak =
      streakData && streakData.longest_streak ? Math.max(streakData.longest_streak, updatedStreak) : updatedStreak

    // Update streak in database using upsert
    const { error: upsertError } = await supabase.from("briefing_streaks").upsert({
      user_id: userId,
      current_streak: updatedStreak,
      longest_streak: longestStreak,
      last_briefing_date: briefingDate,
      updated_at: new Date().toISOString(),
    })

    if (upsertError) {
      console.error("Error updating streak:", upsertError)
      return { updatedStreak: 1, isConsecutive: false }
    }

    return { updatedStreak, isConsecutive }
  } catch (error) {
    console.error("Exception in updateStreak:", error)
    return { updatedStreak: 1, isConsecutive: false }
  }
}

/**
 * Get user's briefing statistics
 */
export async function getUserBriefingStats(userId: string): Promise<{
  totalAttendance: number
  totalShares: number
  currentStreak: number
  longestStreak: number
  pointsEarned: number
}> {
  try {
    const supabase = createClient()

    // Get attendance count
    const { count: attendanceCount, error: attendanceError } = await supabase
      .from("briefing_attendance")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    if (attendanceError) {
      console.error("Error getting attendance count:", attendanceError)
    }

    // Get share count
    const { count: shareCount, error: shareError } = await supabase
      .from("briefing_shares")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    if (shareError) {
      console.error("Error getting share count:", shareError)
    }

    // Get streak info
    const { data: streakData, error: streakError } = await supabase
      .from("briefing_streaks")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()

    if (streakError && streakError.code !== "PGRST116") {
      console.error("Error getting streak info:", streakError)
    }

    // Get total points from attendance
    const { data: attendancePoints, error: pointsError1 } = await supabase
      .from("briefing_attendance")
      .select("points_awarded")
      .eq("user_id", userId)

    if (pointsError1) {
      console.error("Error getting attendance points:", pointsError1)
    }

    // Get total points from shares
    const { data: sharePoints, error: pointsError2 } = await supabase
      .from("briefing_shares")
      .select("points_awarded")
      .eq("user_id", userId)

    if (pointsError2) {
      console.error("Error getting share points:", pointsError2)
    }

    // Calculate total points
    const totalAttendancePoints = attendancePoints?.reduce((sum, item) => sum + (item.points_awarded || 0), 0) || 0
    const totalSharePoints = sharePoints?.reduce((sum, item) => sum + (item.points_awarded || 0), 0) || 0

    return {
      totalAttendance: attendanceCount || 0,
      totalShares: shareCount || 0,
      currentStreak: streakData?.current_streak || 0,
      longestStreak: streakData?.longest_streak || 0,
      pointsEarned: totalAttendancePoints + totalSharePoints,
    }
  } catch (error) {
    console.error("Exception in getUserBriefingStats:", error)
    return {
      totalAttendance: 0,
      totalShares: 0,
      currentStreak: 0,
      longestStreak: 0,
      pointsEarned: 0,
    }
  }
}

/**
 * Generate a new briefing for today if none exists
 */
export async function generateTodaysBriefingIfNeeded(): Promise<DailyBriefing | null> {
  try {
    // Check if today's briefing already exists
    const existingBriefing = await getTodaysBriefing()
    if (existingBriefing) {
      return existingBriefing
    }

    // Get the current date and determine theme based on day of week
    const today = new Date()
    const themes = ["duty", "courage", "respect", "service", "leadership", "resilience"]
    const themeIndex = today.getDay() % themes.length
    const theme = themes[themeIndex] as DailyBriefing["theme"]

    // Get quotes for this theme
    const quotes = getBriefingContentByTheme(theme)

    // Select a random quote from the theme
    const randomIndex = Math.floor(Math.random() * quotes.length)
    const content = quotes[randomIndex]

    const formattedDate = today.toISOString().split("T")[0]

    // Insert new briefing
    const supabase = createClient()
    const { data, error } = await supabase
      .from("daily_briefings")
      .insert({
        date: formattedDate,
        theme,
        quote: content.quote,
        quote_author: content.quote_author,
        sgt_ken_take: content.sgt_ken_take,
        call_to_action: content.call_to_action,
        active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error generating today's briefing:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Exception in generateTodaysBriefingIfNeeded:", error)
    return null
  }
}

/**
 * Get predefined content by theme
 */
function getBriefingContentByTheme(theme: DailyBriefing["theme"]): Array<{
  quote: string
  quote_author: string
  sgt_ken_take: string
  call_to_action: string
}> {
  // Content organized by theme
  const contentByTheme = {
    duty: [
      {
        quote: "Duty is the sublimest word in our language.",
        quote_author: "Robert E. Lee",
        sgt_ken_take:
          "Duty isn't what you do when the captain's watching. It's what you do at 3 AM when no one sees you going the extra mile to help a lost kid find their parents.",
        call_to_action: "The badge means something. If duty calls to you, we need you in this department.",
      },
      {
        quote: "The first duty of every public officer is to the public.",
        quote_author: "Theodore Roosevelt",
        sgt_ken_take:
          "This badge isn't about you. It's about them—every person in this county deserving protection, respect, and justice. Remember that when you're tired or frustrated.",
        call_to_action: "If you're ready to put the public first every day, apply to become a Deputy Sheriff.",
      },
      {
        quote:
          "I long to accomplish a great and noble task, but it is my chief duty to accomplish small tasks as if they were great and noble.",
        quote_author: "Helen Keller",
        sgt_ken_take:
          "Most days won't have car chases or dramatic rescues. They'll have paperwork, routine patrols, and community check-ins. Do them with excellence. That's how you earn this badge.",
        call_to_action: "Join us in doing the small things with great care. The community notices.",
      },
    ],
    courage: [
      {
        quote: "Courage is not simply one of the virtues, but the form of every virtue at the testing point.",
        quote_author: "C.S. Lewis",
        sgt_ken_take:
          "In this job, courage isn't running into a burning building. It's having that tough conversation with your partner when they're cutting corners. It's standing up when it would be easier to look away.",
        call_to_action: "This department needs deputies with moral courage. Apply today if you've got what it takes.",
      },
      {
        quote: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.",
        quote_author: "Lao Tzu",
        sgt_ken_take:
          "The bravest deputies I know aren't doing this job for themselves. They're doing it for their families, their communities—the people they love. That's what gets you through the hard days.",
        call_to_action: "Want to protect what matters most? Join the Sheriff's Department and serve with purpose.",
      },
      {
        quote: "It takes courage to grow up and become who you really are.",
        quote_author: "E.E. Cummings",
        sgt_ken_take:
          "This badge doesn't make you brave. It just reveals the courage you already had. Every day on this job tests who you really are beneath the uniform.",
        call_to_action: "Discover your true potential. Join us and become the deputy you're meant to be.",
      },
    ],
    respect: [
      {
        quote: "I speak to everyone in the same way, whether he is the garbage man or the president of the university.",
        quote_author: "Albert Einstein",
        sgt_ken_take:
          "In this job, you'll deal with everyone from judges to people having their worst day. Treat them all the same—with dignity. The badge demands it.",
        call_to_action: "If you believe everyone deserves respect, we need you wearing this uniform.",
      },
      {
        quote: "Respect for ourselves guides our morals; respect for others guides our manners.",
        quote_author: "Laurence Sterne",
        sgt_ken_take:
          "You'll be tested when that suspect spits insults at you. Stay professional. Your response in those moments defines what this badge means in our community.",
        call_to_action: "Join a department where respect isn't just policy—it's who we are.",
      },
      {
        quote: "We must learn to live together as brothers or perish together as fools.",
        quote_author: "Martin Luther King Jr.",
        sgt_ken_take:
          "The foundation of community policing is building bridges, not walls. In this county, we need deputies who see the humanity in everyone they serve.",
        call_to_action: "Be part of building a safer community through mutual respect. Apply today.",
      },
    ],
    service: [
      {
        quote: "The highest form of statesmanship is that which serves, not dominates, the people.",
        quote_author: "Allen Welsh Dulles",
        sgt_ken_take:
          "This badge isn't a license to control—it's a commitment to serve. Even when you're giving orders at a scene, remember you're there because people need you.",
        call_to_action: "True service requires humility and strength. If you have both, we need you.",
      },
      {
        quote: "The best way to find yourself is to lose yourself in the service of others.",
        quote_author: "Mahatma Gandhi",
        sgt_ken_take:
          "Many come to this job searching for something—purpose, identity, respect. The best deputies find it by forgetting themselves and focusing on who they're serving.",
        call_to_action: "Discover purpose through service. Join the Sheriff's Department today.",
      },
      {
        quote: "Everybody can be great, because anybody can serve.",
        quote_author: "Martin Luther King Jr.",
        sgt_ken_take:
          "Greatness in this department isn't measured by arrests or citations. It's measured by the elderly woman who feels safer because you check on her regularly.",
        call_to_action: "Your service makes this community stronger. Apply now and make an impact.",
      },
    ],
    leadership: [
      {
        quote: "The supreme quality for leadership is unquestionably integrity.",
        quote_author: "Dwight D. Eisenhower",
        sgt_ken_take:
          "In this job, leadership starts with what you do when no one's watching. When you cut corners on reports, your team notices. When you hold the line on procedure, they notice that too.",
        call_to_action: "We're building future leaders in law enforcement. Start your journey with us.",
      },
      {
        quote: "A leader is best when people barely know he exists.",
        quote_author: "Lao Tzu",
        sgt_ken_take:
          "The best shifts are when nothing goes wrong because you prevented problems before they happened. That's leadership—not the dramatic rescue, but the crisis that never occurred.",
        call_to_action: "True leaders know prevention beats reaction. Join us and lead with foresight.",
      },
      {
        quote: "The price of greatness is responsibility.",
        quote_author: "Winston Churchill",
        sgt_ken_take:
          "That badge means you're responsible—for your actions, your team, and this community. The weight feels heavy some days, but that's the burden of leadership.",
        call_to_action: "Ready to shoulder responsibility? The Sheriff's Department needs deputies who step up.",
      },
    ],
    resilience: [
      {
        quote: "The oak fought the wind and was broken, the willow bent when it must and survived.",
        quote_author: "Robert Jordan",
        sgt_ken_take:
          "This job will break you if you're rigid. You'll see things that challenge everything you believe. The deputies who last know when to stand firm and when to adapt.",
        call_to_action: "Join a team that builds resilience through support and training.",
      },
      {
        quote: "Life doesn't get easier or more forgiving; we get stronger and more resilient.",
        quote_author: "Steve Maraboli",
        sgt_ken_take:
          "The calls don't get easier with time. You just get better at handling them, at processing what you've seen, at talking it out instead of bottling it up.",
        call_to_action: "Become stronger through service. Apply to be a Deputy Sheriff today.",
      },
      {
        quote:
          "Resilience is not what happens to you. It's how you react to, respond to, and recover from what happens to you.",
        quote_author: "Jeffrey Gitomer",
        sgt_ken_take:
          "In this job, you'll have bad days. Calls that stick with you. What matters isn't that they happen, but that you come back tomorrow ready to serve again.",
        call_to_action: "We need deputies who keep showing up, especially after tough days. Join us.",
      },
    ],
  }

  return contentByTheme[theme]
}

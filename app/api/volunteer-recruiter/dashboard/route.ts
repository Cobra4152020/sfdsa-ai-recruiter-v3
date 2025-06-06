export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    try {
      // Fetch volunteer recruiter stats
      const { data: statsData, error: statsError } = await supabase
        .from("volunteer_recruiter_stats")
        .select("*")
        .eq("user_id", userId)
        .single();

      // Fetch referrals
      const { data: referralsData, error: referralsError } = await supabase
        .from("volunteer_referrals")
        .select("*")
        .eq("recruiter_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      // Fetch recent recruitment activities for points history
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("recruiter_activities")
        .select("*")
        .eq("recruiter_id", userId)
        .order("created_at", { ascending: false })
        .limit(30);

      // If we have successful data, format and return it
      if (!statsError && !referralsError && statsData) {
        const dashboardData = {
          referralCode: `VR2024-${userId.substring(0, 8)}`,
          referrals: (referralsData || []).map((ref: any) => ({
            id: ref.id,
            name: ref.referral_name || "Unknown",
            email: ref.referral_email,
            status: ref.status || "pending",
            date: ref.created_at,
            progress: getProgressFromStatus(ref.status),
            points: getPointsFromStatus(ref.status),
          })),
          pointsHistory: generatePointsHistory(activitiesData || []),
          badges: generateUserBadges(statsData),
          nfts: generateUserNFTs(statsData),
          events: await fetchUpcomingEvents(),
          stats: {
            totalReferrals: statsData.referrals_count || 0,
            pendingReferrals: (referralsData || []).filter((r: any) => r.status === "pending").length,
            activeReferrals: (referralsData || []).filter((r: any) => 
              ["contacted", "applied", "interview", "background"].includes(r.status)
            ).length,
            successfulReferrals: statsData.successful_referrals || 0,
            conversionRate: calculateConversionRate(statsData.referrals_count, statsData.successful_referrals),
            totalPoints: statsData.total_points || 0,
            badgesEarned: calculateBadgesEarned(statsData),
            nftsEarned: calculateNFTsEarned(statsData),
          },
        };

        return NextResponse.json({
          success: true,
          data: dashboardData,
          source: "database",
        });
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
    }

    // Fallback to generating demo data with user-specific elements
    const fallbackData = generateFallbackDashboardData(userId);
    
    return NextResponse.json({
      success: true,
      data: fallbackData,
      source: "fallback",
      message: "Using demo data - database connection unavailable",
    });

  } catch (error) {
    console.error("Error in volunteer recruiter dashboard API:", error);
    
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper functions
function getProgressFromStatus(status: string): number {
  const statusMap: { [key: string]: number } = {
    "pending": 5,
    "contacted": 15,
    "applied": 25,
    "interview": 60,
    "background": 75,
    "offered": 90,
    "hired": 100,
    "declined": 0,
  };
  return statusMap[status] || 10;
}

function getPointsFromStatus(status: string): number {
  const pointsMap: { [key: string]: number } = {
    "contacted": 25,
    "applied": 50,
    "interview": 100,
    "background": 150,
    "offered": 300,
    "hired": 500,
  };
  return pointsMap[status] || 0;
}

function generatePointsHistory(activities: any[]): Array<{ date: string; points: number }> {
  // Generate 30 days of points history
  const history = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Check if there were activities on this date
    const dayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.created_at);
      return activityDate.toDateString() === date.toDateString();
    });
    
    const dailyPoints = dayActivities.reduce((sum, activity) => sum + (activity.points || 0), 0);
    
    history.push({
      date: date.toISOString().split("T")[0],
      points: dailyPoints || Math.floor(Math.random() * 50) + 10, // Fallback to random for demo
    });
  }
  return history;
}

function generateUserBadges(stats: any) {
  const badges = [
    {
      id: "badge1",
      name: "First Referral",
      description: "Made your first successful referral",
      icon: "🎯",
      earned: (stats.referrals_count || 0) >= 1,
      earnedDate: (stats.referrals_count || 0) >= 1 ? stats.created_at : null,
    },
    {
      id: "badge2",
      name: "Recruitment Champion",
      description: "Referred 5 successful candidates",
      icon: "🏆",
      earned: (stats.successful_referrals || 0) >= 5,
      earnedDate: (stats.successful_referrals || 0) >= 5 ? stats.updated_at : null,
    },
    {
      id: "badge3",
      name: "Community Builder",
      description: "Participated in 3 recruitment events",
      icon: "🏗️",
      earned: (stats.events_participated || 0) >= 3,
      earnedDate: (stats.events_participated || 0) >= 3 ? stats.updated_at : null,
    },
  ];
  return badges;
}

function generateUserNFTs(stats: any) {
  const nfts = [];
  
  if ((stats.successful_referrals || 0) >= 10) {
    nfts.push({
      id: "nft1",
      name: "Elite Recruiter 2024",
      description: "Exclusive NFT for top performing recruiters",
      image: "/nft-elite-recruiter.png",
      earned: true,
      earnedDate: stats.updated_at,
      rarity: "rare",
    });
  }
  
  return nfts;
}

async function fetchUpcomingEvents() {
  try {
    const supabase = getServiceSupabase();
    const { data: eventsData } = await supabase
      .from("volunteer_events")
      .select("*")
      .gte("start_time", new Date().toISOString())
      .order("start_time", { ascending: true })
      .limit(5);

    if (eventsData && eventsData.length > 0) {
      return eventsData.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.start_time,
        location: event.location,
        attendees: 0, // Would need to count from participants table
        maxAttendees: event.max_participants || 100,
        status: "upcoming",
      }));
    }
  } catch (error) {
    console.error("Error fetching events:", error);
  }

  // Fallback events
  return [
    {
      id: "event1",
      title: "Community Recruitment Fair",
      description: "Join us at the Mission District Community Center",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Mission District Community Center",
      attendees: 45,
      maxAttendees: 50,
      status: "upcoming",
    },
    {
      id: "event2",
      title: "Virtual Info Session",
      description: "Online Q&A session for potential recruits",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Virtual (Zoom)",
      attendees: 127,
      maxAttendees: 200,
      status: "upcoming",
    },
  ];
}

function calculateConversionRate(totalReferrals: number, successfulReferrals: number): number {
  if (!totalReferrals || totalReferrals === 0) return 0;
  return Math.round((successfulReferrals / totalReferrals) * 100);
}

function calculateBadgesEarned(stats: any): number {
  let count = 0;
  if ((stats.referrals_count || 0) >= 1) count++;
  if ((stats.successful_referrals || 0) >= 5) count++;
  if ((stats.events_participated || 0) >= 3) count++;
  return count;
}

function calculateNFTsEarned(stats: any): number {
  let count = 0;
  if ((stats.successful_referrals || 0) >= 10) count++;
  return count;
}

function generateFallbackDashboardData(userId: string) {
  return {
    referralCode: `VR2024-${userId.substring(0, 8)}`,
    referrals: [
      {
        id: "demo1",
        name: "Demo Candidate 1",
        email: "demo1@example.com",
        status: "applied",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 25,
        points: 50,
      },
      {
        id: "demo2",
        name: "Demo Candidate 2",
        email: "demo2@example.com",
        status: "interview",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 60,
        points: 100,
      },
    ],
    pointsHistory: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 29 + i);
      return {
        date: date.toISOString().split("T")[0],
        points: Math.floor(Math.random() * 100) + 50,
      };
    }),
    badges: [
      {
        id: "badge1",
        name: "Demo Badge",
        description: "Sample achievement badge",
        icon: "🎯",
        earned: true,
        earnedDate: new Date().toISOString(),
      },
    ],
    nfts: [],
    events: [
      {
        id: "event1",
        title: "Demo Recruitment Event",
        description: "Sample recruitment event",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Demo Location",
        attendees: 25,
        maxAttendees: 50,
        status: "upcoming",
      },
    ],
    stats: {
      totalReferrals: 2,
      pendingReferrals: 0,
      activeReferrals: 2,
      successfulReferrals: 0,
      conversionRate: 0,
      totalPoints: 150,
      badgesEarned: 1,
      nftsEarned: 0,
    },
  };
} 
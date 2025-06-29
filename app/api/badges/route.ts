export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

// Use the badge types from your AchievementBadge component
type BadgeType =
  | "written"
  | "oral"
  | "physical"
  | "polygraph"
  | "psychological"
  | "full"
  | "chat-participation"
  | "application-started"
  | "application-completed"
  | "first-response"
  | "frequent-user"
  | "resource-downloader"
  | "hard-charger";

interface Badge {
  id: string;
  badge_type: BadgeType;
  name: string;
  description: string;
  created_at: string;
  points?: number;
  difficulty?: string;
  category?: string;
}

// Enhanced static badges data with more details
const staticBadges: Badge[] = [
  {
    id: "written",
    badge_type: "written",
    name: "Written Test",
    description: "Completed written test preparation",
    created_at: "2024-01-01T00:00:00Z",
    points: 100,
    difficulty: "Medium",
    category: "achievement",
  },
  {
    id: "oral",
    badge_type: "oral",
    name: "Oral Board",
    description: "Prepared for oral board interviews",
    created_at: "2024-01-02T00:00:00Z",
    points: 150,
    difficulty: "Hard",
    category: "achievement",
  },
  {
    id: "physical",
    badge_type: "physical",
    name: "Physical Test",
    description: "Completed physical test preparation",
    created_at: "2024-01-03T00:00:00Z",
    points: 125,
    difficulty: "Medium",
    category: "achievement",
  },
  {
    id: "polygraph",
    badge_type: "polygraph",
    name: "Polygraph",
    description: "Learned about the polygraph process",
    created_at: "2024-01-04T00:00:00Z",
    points: 75,
    difficulty: "Easy",
    category: "achievement",
  },
  {
    id: "psychological",
    badge_type: "psychological",
    name: "Psychological",
    description: "Prepared for psychological evaluation",
    created_at: "2024-01-05T00:00:00Z",
    points: 100,
    difficulty: "Medium",
    category: "achievement",
  },
  {
    id: "full",
    badge_type: "full",
    name: "Full Process",
    description: "Completed all preparation areas",
    created_at: "2024-01-06T00:00:00Z",
    points: 500,
    difficulty: "Expert",
    category: "process",
  },
  {
    id: "chat-participation",
    badge_type: "chat-participation",
    name: "Chat Participation",
    description: "Engaged with Sgt. Ken",
    created_at: "2024-01-07T00:00:00Z",
    points: 25,
    difficulty: "Easy",
    category: "process",
  },
  {
    id: "first-response",
    badge_type: "first-response",
    name: "First Response",
    description: "Received first response from Sgt. Ken",
    created_at: "2024-01-08T00:00:00Z",
    points: 10,
    difficulty: "Easy",
    category: "process",
  },
  {
    id: "application-started",
    badge_type: "application-started",
    name: "Application Started",
    description: "Started the application process",
    created_at: "2024-01-09T00:00:00Z",
    points: 50,
    difficulty: "Easy",
    category: "process",
  },
  {
    id: "application-completed",
    badge_type: "application-completed",
    name: "Application Completed",
    description: "Completed the application process",
    created_at: "2024-01-10T00:00:00Z",
    points: 200,
    difficulty: "Hard",
    category: "process",
  },
  {
    id: "frequent-user",
    badge_type: "frequent-user",
    name: "Frequent User",
    description: "Regularly engages with the recruitment platform",
    created_at: "2024-01-11T00:00:00Z",
    points: 75,
    difficulty: "Medium",
    category: "participation",
  },
  {
    id: "resource-downloader",
    badge_type: "resource-downloader",
    name: "Resource Downloader",
    description: "Downloaded recruitment resources and materials",
    created_at: "2024-01-12T00:00:00Z",
    points: 30,
    difficulty: "Easy",
    category: "participation",
  },
  {
    id: "hard-charger",
    badge_type: "hard-charger",
    name: "Hard Charger",
    description: "Show exceptional dedication and enthusiasm throughout your recruitment journey",
    created_at: "2024-01-13T00:00:00Z",
    points: 300,
    difficulty: "Expert",
    category: "participation",
  },
];

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    
    // Try to fetch real badges from the database
    const { data: dbBadges, error } = await supabase
      .from('badges')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Database error fetching badges:', error);
      // Return static badges with warning
      return NextResponse.json({
        success: true,
        badges: staticBadges,
        source: "static_fallback",
        message: "Using fallback data - database unavailable",
        total: staticBadges.length,
      });
    }

    // Use static badges as the primary source to avoid duplicates
    let allBadges = [...staticBadges];
    
    if (dbBadges && dbBadges.length > 0) {
      // Transform database badges to match our interface
      const transformedDbBadges = dbBadges.map(badge => ({
        id: badge.id,
        badge_type: badge.badge_type || badge.type,
        name: badge.name,
        description: badge.description,
        created_at: badge.created_at,
        points: badge.points || 0,
        difficulty: badge.difficulty || 'Medium',
        category: badge.category || 'application',
      }));

      // Only add unique badges from database (avoid duplicates by badge_type)
      const staticTypes = new Set(staticBadges.map(b => b.badge_type));
      const uniqueDbBadges = transformedDbBadges.filter(b => !staticTypes.has(b.badge_type));
      
      allBadges = [...staticBadges, ...uniqueDbBadges];
    }

    return NextResponse.json({
      success: true,
      badges: allBadges,
      source: dbBadges && dbBadges.length > 0 ? "hybrid" : "static",
      database_count: dbBadges?.length || 0,
      static_count: staticBadges.length,
      total: allBadges.length,
    });

  } catch (error) {
    console.error('Error in badges API:', error);
    
    // Always return static badges as fallback
    return NextResponse.json({
      success: true,
      badges: staticBadges,
      source: "static_fallback",
      message: "Using fallback data due to system error",
      total: staticBadges.length,
    });
  }
}

// POST endpoint to award badges to users
export async function POST(request: Request) {
  try {
    const { userId, badgeType, source = 'manual' } = await request.json();

    if (!userId || !badgeType) {
      return NextResponse.json({
        success: false,
        message: "userId and badgeType are required",
      }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Check if badge exists
    const badge = staticBadges.find(b => b.badge_type === badgeType);
    if (!badge) {
      return NextResponse.json({
        success: false,
        message: "Badge type not found",
      }, { status: 404 });
    }

    // Check if user already has this badge
    const { data: existingBadge, error: checkError } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_type', badgeType)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing badge:', checkError);
      return NextResponse.json({
        success: false,
        message: "Error checking badge status",
      }, { status: 500 });
    }

    if (existingBadge) {
      return NextResponse.json({
        success: false,
        message: "User already has this badge",
        alreadyEarned: true,
      });
    }

    // Award the badge
    const { data: newBadge, error: insertError } = await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_type: badgeType,
        badge_name: badge.name,
        badge_description: badge.description,
        points_awarded: badge.points || 0,
        source: source,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error awarding badge:', insertError);
      return NextResponse.json({
        success: false,
        message: "Error awarding badge",
      }, { status: 500 });
    }

    // Update user's total points
    const { error: pointsError } = await supabase.rpc('increment_user_points', {
      user_id: userId,
      points_to_add: badge.points || 0
    });

    if (pointsError) {
      console.warn('Could not update user points:', pointsError);
    }

    return NextResponse.json({
      success: true,
      message: "Badge awarded successfully",
      badge: newBadge,
      points_awarded: badge.points || 0,
    });

  } catch (error) {
    console.error('Error in POST badges API:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}

// Note: POST endpoint removed as it cannot be static
// Badge creation should be handled through a different mechanism
// such as a serverless function or external service

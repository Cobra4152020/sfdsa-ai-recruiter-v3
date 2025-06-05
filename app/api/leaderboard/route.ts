import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatar_url: string | null;
  badges: number;
  last_active: string;
  is_mock?: boolean;
  participation_count: number;
  badge_count: number;
  nft_count: number;
  has_applied: boolean;
  email?: string;
}

// Mock users to use as examples when there aren't enough real users
const MOCK_USERS: Omit<LeaderboardEntry, 'rank'>[] = [
  {
    id: "mock-1",
    name: "John Smith",
    points: 1500,
    avatar_url: "/male-law-enforcement-headshot.png",
    badges: 8,
    participation_count: 1500,
    badge_count: 8,
    nft_count: 3,
    has_applied: true,
    last_active: "2024-01-01T00:00:00Z",
    is_mock: true,
  },
  {
    id: "mock-2", 
    name: "Maria Garcia",
    points: 1200,
    avatar_url: "/female-law-enforcement-headshot.png",
    badges: 6,
    participation_count: 1200,
    badge_count: 6,
    nft_count: 2,
    has_applied: true,
    last_active: "2024-01-02T00:00:00Z",
    is_mock: true,
  },
  {
    id: "mock-3",
    name: "James Johnson", 
    points: 1000,
    avatar_url: "/asian-male-officer-headshot.png",
    badges: 5,
    participation_count: 1000,
    badge_count: 5,
    nft_count: 2,
    has_applied: false,
    last_active: "2024-01-03T00:00:00Z",
    is_mock: true,
  },
  {
    id: "mock-4",
    name: "Sarah Brown",
    points: 800,
    avatar_url: "/female-law-enforcement-headshot.png",
    badges: 4,
    participation_count: 800,
    badge_count: 4,
    nft_count: 1,
    has_applied: true,
    last_active: "2024-01-04T00:00:00Z",
    is_mock: true,
  },
  {
    id: "mock-5",
    name: "Michael Jones",
    points: 600,
    avatar_url: "/male-law-enforcement-headshot.png",
    badges: 3,
    participation_count: 600,
    badge_count: 3,
    nft_count: 1,
    has_applied: false,
    last_active: "2024-01-05T00:00:00Z",
    is_mock: true,
  },
];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || "10");
    const offset = Number(url.searchParams.get("offset") || "0");
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "participation";
    const timeframe = url.searchParams.get("timeframe") || "all-time";
    const currentUserId = url.searchParams.get("currentUserId");

    const supabase = getServiceSupabase();
    
    // Fetch real users from the database
    let query = supabase
      .from("users")
      .select(`
        id,
        name,
        email,
        participation_count,
        has_applied,
        created_at,
        updated_at
      `)
      .not("participation_count", "is", null)
      .gte("participation_count", 1); // Only users with at least 1 point

    // Apply search filter
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    // Apply timeframe filter (for future implementation)
    if (timeframe !== "all-time") {
      const now = new Date();
      let dateFilter: Date;
      
      switch (timeframe) {
        case "daily":
          dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "weekly":
          dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "monthly":
          dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateFilter = new Date(0);
      }
      
      query = query.gte("updated_at", dateFilter.toISOString());
    }

    // Order by participation count
    query = query.order("participation_count", { ascending: false });

    const { data: realUsers, error } = await query;

    if (error) {
      console.error("Error fetching real users:", error);
      // Fallback to mock data only
      let entries = MOCK_USERS.map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

      if (search) {
        entries = entries.filter((entry) =>
          entry.name.toLowerCase().includes(search.toLowerCase()),
        );
      }

      const total = entries.length;
      entries = entries.slice(offset, offset + limit);

      return NextResponse.json({
        success: true,
        entries,
        total,
        source: "mock-fallback",
      });
    }

    // Transform real users to leaderboard format
    const transformedRealUsers: LeaderboardEntry[] = (realUsers || []).map((user, index) => ({
      id: user.id,
      name: user.name || user.email?.split('@')[0] || 'Anonymous User',
      points: user.participation_count || 0,
      participation_count: user.participation_count || 0,
      badge_count: Math.floor((user.participation_count || 0) / 100), // Estimated badges
      nft_count: Math.floor((user.participation_count || 0) / 500), // Estimated NFTs
      has_applied: user.has_applied || false,
      avatar_url: null, // Real users don't have avatars set yet
      badges: Math.floor((user.participation_count || 0) / 100),
      last_active: user.updated_at || user.created_at || new Date().toISOString(),
      rank: index + 1,
      email: user.email,
      is_mock: false,
    }));

    // Combine real users with mock users if we don't have enough real users
    let allUsers: LeaderboardEntry[] = [...transformedRealUsers];
    
    // Add mock users to fill out the leaderboard if needed
    const mockUsersToAdd = MOCK_USERS.filter(mockUser => {
      // Only add mock users if their score would fit naturally in the ranking
      const lowestRealUserScore = transformedRealUsers.length > 0 
        ? transformedRealUsers[transformedRealUsers.length - 1].participation_count 
        : 0;
      return mockUser.participation_count > lowestRealUserScore || transformedRealUsers.length < 3;
    });

    // Insert mock users at appropriate positions based on their scores
    mockUsersToAdd.forEach(mockUser => {
      const mockUserEntry: LeaderboardEntry = { ...mockUser, rank: 0 };
      const insertIndex = allUsers.findIndex(user => user.participation_count < mockUser.participation_count);
      
      if (insertIndex === -1) {
        allUsers.push(mockUserEntry);
      } else {
        allUsers.splice(insertIndex, 0, mockUserEntry);
      }
    });

    // Re-assign ranks after combining
    allUsers = allUsers.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    // Mark current user if provided
    if (currentUserId) {
      allUsers = allUsers.map(user => ({
        ...user,
        is_current_user: user.id === currentUserId,
      }));
    }

    // Apply search filter to combined data
    if (search) {
      allUsers = allUsers.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    const total = allUsers.length;

    // Apply pagination
    const paginatedUsers = allUsers.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      entries: paginatedUsers,
      total,
      source: "live",
      realUserCount: transformedRealUsers.length,
      mockUserCount: mockUsersToAdd.length,
    });

  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    
    // Fallback to mock data only
    let entries = MOCK_USERS.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const limit = Number(url.searchParams.get("limit") || "10");
    const offset = Number(url.searchParams.get("offset") || "0");

    if (search) {
      entries = entries.filter((entry) =>
        entry.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    const total = entries.length;
    entries = entries.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      entries,
      total,
      source: "error-fallback",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

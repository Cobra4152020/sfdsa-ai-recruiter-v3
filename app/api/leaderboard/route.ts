import { NextResponse } from "next/server";

export const dynamic = "force-static";

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatar_url: string | null;
  badges: number;
  last_active: string;
}

// Mock leaderboard data
const STATIC_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: "1",
    name: "John Smith",
    points: 1500,
    rank: 1,
    avatar_url: null,
    badges: 8,
    last_active: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Jane Doe",
    points: 1200,
    rank: 2,
    avatar_url: null,
    badges: 6,
    last_active: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    name: "Bob Wilson",
    points: 1000,
    rank: 3,
    avatar_url: null,
    badges: 5,
    last_active: "2024-01-03T00:00:00Z",
  },
  {
    id: "4",
    name: "Alice Brown",
    points: 800,
    rank: 4,
    avatar_url: null,
    badges: 4,
    last_active: "2024-01-04T00:00:00Z",
  },
  {
    id: "5",
    name: "Charlie Davis",
    points: 600,
    rank: 5,
    avatar_url: null,
    badges: 3,
    last_active: "2024-01-05T00:00:00Z",
  },
];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || "10");
    const offset = Number(url.searchParams.get("offset") || "0");
    const search = url.searchParams.get("search") || "";

    let entries = [...STATIC_LEADERBOARD];

    // Apply search filter if provided
    if (search) {
      entries = entries.filter((entry) =>
        entry.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Get total count before pagination
    const total = entries.length;

    // Apply pagination
    entries = entries.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      entries,
      total,
      source: "static",
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

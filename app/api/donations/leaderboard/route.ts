export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server";

interface LeaderboardEntry {
  user_id: string;
  name: string;
  avatar_url: string;
  total_points: number;
  total_donations: number;
  last_donation_at: string;
}

// Static mock leaderboard data
const mockLeaderboard: LeaderboardEntry[] = [
  {
    user_id: "user-1",
    name: "Emma Thompson",
    avatar_url: "/placeholder.svg?height=40&width=40&query=Emma%20Thompson",
    total_points: 1000,
    total_donations: 20,
    last_donation_at: "2024-01-01T00:00:00Z",
  },
  {
    user_id: "user-2",
    name: "Liam Chen",
    avatar_url: "/placeholder.svg?height=40&width=40&query=Liam%20Chen",
    total_points: 985,
    total_donations: 19,
    last_donation_at: "2024-01-01T00:00:00Z",
  },
  {
    user_id: "user-3",
    name: "Sophia Patel",
    avatar_url: "/placeholder.svg?height=40&width=40&query=Sophia%20Patel",
    total_points: 970,
    total_donations: 18,
    last_donation_at: "2024-01-01T00:00:00Z",
  },
  {
    user_id: "user-4",
    name: "Noah Williams",
    avatar_url: "/placeholder.svg?height=40&width=40&query=Noah%20Williams",
    total_points: 955,
    total_donations: 17,
    last_donation_at: "2024-01-01T00:00:00Z",
  },
  {
    user_id: "user-5",
    name: "Olivia Rodriguez",
    avatar_url: "/placeholder.svg?height=40&width=40&query=Olivia%20Rodriguez",
    total_points: 940,
    total_donations: 16,
    last_donation_at: "2024-01-01T00:00:00Z",
  },
  {
    user_id: "user-6",
    name: "Mason Kim",
    avatar_url: "/placeholder.svg?height=40&width=40&query=Mason%20Kim",
    total_points: 925,
    total_donations: 15,
    last_donation_at: "2024-01-01T00:00:00Z",
  },
  {
    user_id: "user-7",
    name: "Ava Johnson",
    avatar_url: "/placeholder.svg?height=40&width=40&query=Ava%20Johnson",
    total_points: 910,
    total_donations: 14,
    last_donation_at: "2024-01-01T00:00:00Z",
  },
  {
    user_id: "user-8",
    name: "Ethan Singh",
    avatar_url: "/placeholder.svg?height=40&width=40&query=Ethan%20Singh",
    total_points: 895,
    total_donations: 13,
    last_donation_at: "2024-01-01T00:00:00Z",
  },
  {
    user_id: "user-9",
    name: "Isabella Lee",
    avatar_url: "/placeholder.svg?height=40&width=40&query=Isabella%20Lee",
    total_points: 880,
    total_donations: 12,
    last_donation_at: "2024-01-01T00:00:00Z",
  },
  {
    user_id: "user-10",
    name: "Lucas Brown",
    avatar_url: "/placeholder.svg?height=40&width=40&query=Lucas%20Brown",
    total_points: 865,
    total_donations: 11,
    last_donation_at: "2024-01-01T00:00:00Z",
  },
];

// Static route handler that returns the top 10 leaderboard entries
export async function GET() {
  return NextResponse.json({
    success: true,
    leaderboard: mockLeaderboard,
    source: "static",
  });
}

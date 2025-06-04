"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Star, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type LeaderboardEntry = {
  id: string;
  name: string;
  points: number;
  rank: number;
  previousRank: number;
  badgeCount: number;
  avatarUrl: string;
  isCurrentUser?: boolean;
};

// Sample data with avatar URLs and previous ranks
const sampleLeaderboardData: LeaderboardEntry[] = [
  {
    id: "1",
    name: "Michael Chen",
    points: 1250,
    rank: 1,
    previousRank: 2,
    badgeCount: 8,
    avatarUrl: "/asian-male-officer-headshot.png",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    points: 1180,
    rank: 2,
    previousRank: 1,
    badgeCount: 7,
    avatarUrl: "/female-law-enforcement-headshot.png",
  },
  {
    id: "3",
    name: "David Rodriguez",
    points: 1050,
    rank: 3,
    previousRank: 3,
    badgeCount: 6,
    avatarUrl: "/male-law-enforcement-headshot.png",
  },
  {
    id: "4",
    name: "Jessica Williams",
    points: 980,
    rank: 4,
    previousRank: 5,
    badgeCount: 5,
    avatarUrl: "/female-law-enforcement-headshot.png",
  },
  {
    id: "5",
    name: "Robert Kim",
    points: 920,
    rank: 5,
    previousRank: 4,
    badgeCount: 5,
    avatarUrl: "/asian-male-officer-headshot.png",
  },
];

interface RealTimeLeaderboardProps {
  currentUserId?: string;
  useMockData?: boolean;
  className?: string;
  limit?: number;
}

export function RealTimeLeaderboard({
  currentUserId,
  useMockData = false,
  className,
  limit = 5,
}: RealTimeLeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        if (useMockData) {
          // Mark current user in mock data if ID is provided
          const mockData = sampleLeaderboardData
            .map((entry) => ({
              ...entry,
              isCurrentUser: entry.id === currentUserId,
            }))
            .slice(0, limit);
          setLeaderboardData(mockData);
        } else {
          // In a real app, you would fetch from your API
          const response = await fetch("/api/leaderboard");
          const data = await response.json();

          // Process the data to mark current user
          const processedData = data
            .map((entry: LeaderboardEntry) => ({
              ...entry,
              isCurrentUser: entry.id === currentUserId,
            }))
            .slice(0, limit);

          setLeaderboardData(processedData);
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        // Fallback to sample data on error
        setLeaderboardData(sampleLeaderboardData.slice(0, limit));
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();

    // Set up SSE for real-time updates in a real application
    // This is just a simulation for the mock data
    if (useMockData) {
      const interval = setInterval(() => {
        setLeaderboardData((prev) => {
          // Simulate small point changes
          return prev
            .map((entry) => ({
              ...entry,
              points: entry.points + Math.floor(Math.random() * 5),
            }))
            .sort((a, b) => b.points - a.points)
            .map((entry, index) => ({
              ...entry,
              previousRank: entry.rank,
              rank: index + 1,
            }));
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [currentUserId, useMockData, limit]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <Star className="h-5 w-5 text-gray-300" />;
    }
  };

  const getRankChangeIcon = (current: number, previous: number) => {
    if (current < previous) {
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    } else if (current > previous) {
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>Real-Time Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p>Loading leaderboard data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Real-Time Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboardData.map((entry) => (
            <div
              key={entry.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg",
                entry.isCurrentUser
                  ? "bg-[#F0F7F2] border border-[#0A3C1F]"
                  : "bg-white border border-gray-100",
                "hover:shadow-sm transition-shadow",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(entry.rank)}
                </div>
                <Avatar className="h-10 w-10 border border-gray-200">
                  <AvatarImage
                    src={entry.avatarUrl || "/placeholder.svg"}
                    alt={entry.name}
                  />
                  <AvatarFallback>{entry.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      entry.isCurrentUser && "text-[#0A3C1F]",
                    )}
                  >
                    {entry.name} {entry.isCurrentUser && "(You)"}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">
                      {entry.badgeCount} badges
                    </span>
                    <div className="flex items-center ml-2">
                      {getRankChangeIcon(entry.rank, entry.previousRank)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-[#F0F7F2] text-[#0A3C1F] border-[#0A3C1F]"
                >
                  {entry.points} pts
                </Badge>
                <span className="text-sm font-medium text-gray-500">
                  #{entry.rank}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

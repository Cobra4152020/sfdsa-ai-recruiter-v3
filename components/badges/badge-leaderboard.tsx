"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Medal, Trophy, Star, Flame } from "lucide-react";

interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarUrl?: string;
  points: number;
  rank: number;
  badges: number;
  streak: number;
}

// Mock data for the leaderboard
const mockEntries: LeaderboardEntry[] = [
  {
    userId: "1",
    username: "Michael Chen",
    avatarUrl: "/asian-male-officer-headshot.png",
    points: 1250,
    rank: 1,
    badges: 8,
    streak: 12,
  },
  {
    userId: "2",
    username: "Sarah Johnson",
    avatarUrl: "/female-law-enforcement-headshot.png",
    points: 1180,
    rank: 2,
    badges: 7,
    streak: 8,
  },
  {
    userId: "3",
    username: "David Rodriguez",
    avatarUrl: "/male-law-enforcement-headshot.png",
    points: 1050,
    rank: 3,
    badges: 6,
    streak: 5,
  },
  {
    userId: "4",
    username: "Jessica Williams",
    avatarUrl: "/female-law-enforcement-headshot.png",
    points: 980,
    rank: 4,
    badges: 5,
    streak: 3,
  },
  {
    userId: "5",
    username: "Robert Kim",
    avatarUrl: "/asian-male-officer-headshot.png",
    points: 920,
    rank: 5,
    badges: 5,
    streak: 4,
  },
];

type TimeRange = "daily" | "weekly" | "monthly" | "all-time";

interface BadgeLeaderboardProps {
  entries?: LeaderboardEntry[];
  timeRange?: TimeRange;
  currentUserId?: string;
}

export function BadgeLeaderboard({
  entries = mockEntries,
  timeRange = "weekly",
  currentUserId,
}: BadgeLeaderboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] =
    useState<TimeRange>(timeRange);
  const [displayedEntries, setDisplayedEntries] =
    useState<LeaderboardEntry[]>(entries);

  const handleTimeRangeChange = (value: string) => {
    if (
      value === "daily" ||
      value === "weekly" ||
      value === "monthly" ||
      value === "all-time"
    ) {
      setSelectedTimeRange(value);
    }
  };

  useEffect(() => {
    // Update displayed entries when props change
    setDisplayedEntries(entries);
  }, [entries]);

  useEffect(() => {
    // Handle time range changes
    // In a real app, this would fetch new data based on the time range
    setDisplayedEntries(entries);
  }, [selectedTimeRange, entries]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!displayedEntries?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No leaderboard data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue={selectedTimeRange}
        onValueChange={handleTimeRangeChange}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="all-time">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTimeRange}>
          <div className="space-y-4">
            {displayedEntries.map((entry, index) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  entry.userId === currentUserId
                    ? "bg-[#F0F7F2] border border-[#0A3C1F]"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(entry.rank) || (
                      <span className="text-lg font-semibold">
                        {entry.rank}
                      </span>
                    )}
                  </div>
                  <Avatar>
                    <AvatarImage src={entry.avatarUrl} />
                    <AvatarFallback>
                      {getInitials(entry.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {entry.username}
                      {entry.streak >= 7 && (
                        <span className="ml-2 inline-flex items-center">
                          <Flame className="h-4 w-4 text-orange-500" />
                          <span className="text-sm text-orange-500 ml-1">
                            {entry.streak}
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {entry.badges} badges earned
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">{entry.points}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

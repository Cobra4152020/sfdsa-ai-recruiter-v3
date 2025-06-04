"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TikTokIcon } from "@/components/tiktok-icon";
import { Trophy, Video, Award, Medal } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarUrl: string;
  challengesCompleted: number;
  totalPoints: number;
  challengeDetails: Array<{
    challengeId: number;
    challengeTitle: string;
    submissionId: number;
    videoUrl: string;
    submittedAt: string;
    points: number;
  }>;
}

export function ChallengeLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/tiktok-challenges/leaderboard");

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast({
        title: "Error",
        description:
          "Failed to load TikTok challenge leaderboard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <TikTokIcon className="h-12 w-12 mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">
            No challenge entries yet
          </h3>
          <p className="text-gray-500 mt-1">
            Be the first to complete a TikTok challenge and earn your place on
            the leaderboard!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaderboard.slice(0, 3).map((entry, index) => (
          <Card
            key={entry.userId}
            className={`overflow-hidden ${index === 0 ? "border-yellow-400" : ""}`}
          >
            <div className={`h-2 ${getTrophyColor(index)}`} />
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={entry.avatarUrl || "/placeholder.svg"}
                      alt={entry.displayName}
                    />
                    <AvatarFallback>
                      {getInitials(entry.displayName)}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={`absolute -top-3 -right-3 p-1.5 rounded-full ${getTrophyBgColor(index)}`}
                  >
                    {getTrophyIcon(index)}
                  </div>
                </div>

                <h3 className="text-lg font-medium">{entry.displayName}</h3>

                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    {entry.totalPoints} points
                  </Badge>

                  <Badge variant="outline" className="flex items-center">
                    <Video className="h-3 w-3 mr-1" />
                    {entry.challengesCompleted} challenges
                  </Badge>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    Latest challenge: &quot;
                    {entry.challengeDetails[0]?.challengeTitle || "N/A"}&quot;
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Other Top Creators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.slice(3).map((entry, index) => (
              <div
                key={entry.userId}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 text-center w-6">
                  <span className="font-medium text-gray-600">{index + 4}</span>
                </div>

                <Avatar>
                  <AvatarImage
                    src={entry.avatarUrl || "/placeholder.svg"}
                    alt={entry.displayName}
                  />
                  <AvatarFallback>
                    {getInitials(entry.displayName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {entry.displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {entry.challengesCompleted} challenges completed
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <Badge variant="secondary">{entry.totalPoints} points</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

function getTrophyColor(position: number): string {
  switch (position) {
    case 0:
      return "bg-yellow-400";
    case 1:
      return "bg-gray-300";
    case 2:
      return "bg-amber-600";
    default:
      return "bg-gray-200";
  }
}

function getTrophyBgColor(position: number): string {
  switch (position) {
    case 0:
      return "bg-yellow-100 text-yellow-600";
    case 1:
      return "bg-gray-100 text-gray-600";
    case 2:
      return "bg-amber-100 text-amber-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function getTrophyIcon(position: number) {
  switch (position) {
    case 0:
      return <Trophy className="h-4 w-4" />;
    case 1:
      return <Medal className="h-4 w-4" />;
    case 2:
      return <Award className="h-4 w-4" />;
    default:
      return <Medal className="h-4 w-4" />;
  }
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Star, Zap, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TriviaLeaderboardEntry = {
  id: string;
  name: string;
  score: number;
  rank: number;
  correctAnswers: number;
  totalQuestions: number;
  avatarUrl: string;
  isCurrentUser?: boolean;
  perfectChallengeRounds: number;
  fastCorrectAnswers: number;
  accuracy: number;
  badges: string[];
};

// Sample data with avatar URLs
const sampleTriviaLeaderboardData: TriviaLeaderboardEntry[] = [
  {
    id: "1",
    name: "Michael Chen",
    score: 950,
    rank: 1,
    correctAnswers: 19,
    totalQuestions: 20,
    avatarUrl: "/asian-male-officer-headshot.png",
    perfectChallengeRounds: 2,
    fastCorrectAnswers: 15,
    accuracy: 95,
    badges: ["challenge-champion", "speed-demon"],
  },
  {
    id: "2",
    name: "Sarah Johnson",
    score: 900,
    rank: 2,
    correctAnswers: 18,
    totalQuestions: 20,
    avatarUrl: "/female-law-enforcement-headshot.png",
    perfectChallengeRounds: 1,
    fastCorrectAnswers: 12,
    accuracy: 90,
    badges: ["trivia-master"],
  },
  {
    id: "3",
    name: "David Rodriguez",
    score: 850,
    rank: 3,
    correctAnswers: 17,
    totalQuestions: 20,
    avatarUrl: "/male-law-enforcement-headshot.png",
    perfectChallengeRounds: 0,
    fastCorrectAnswers: 8,
    accuracy: 85,
    badges: ["speed-demon"],
  },
  {
    id: "4",
    name: "Jessica Williams",
    score: 800,
    rank: 4,
    correctAnswers: 16,
    totalQuestions: 20,
    avatarUrl: "/female-law-enforcement-headshot.png",
    perfectChallengeRounds: 0,
    fastCorrectAnswers: 5,
    accuracy: 80,
    badges: [],
  },
  {
    id: "5",
    name: "Robert Kim",
    score: 750,
    rank: 5,
    correctAnswers: 15,
    totalQuestions: 20,
    avatarUrl: "/asian-male-officer-headshot.png",
    perfectChallengeRounds: 0,
    fastCorrectAnswers: 3,
    accuracy: 75,
    badges: [],
  },
];

interface TriviaLeaderboardProps {
  currentUserId?: string;
  useMockData?: boolean;
  className?: string;
  limit?: number;
}

export function TriviaLeaderboard({
  currentUserId,
  useMockData = false,
  className,
  limit = 5,
}: TriviaLeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<
    TriviaLeaderboardEntry[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        if (useMockData) {
          // Mark current user in mock data if ID is provided
          const mockData = sampleTriviaLeaderboardData
            .map((entry) => ({
              ...entry,
              isCurrentUser: entry.id === currentUserId,
            }))
            .slice(0, limit);
          setLeaderboardData(mockData);
        } else {
          // In a real app, you would fetch from your API
          const response = await fetch("/api/trivia/leaderboard");
          const data = await response.json();

          // Process the data to mark current user
          const processedData = data
            .map((entry: TriviaLeaderboardEntry) => ({
              ...entry,
              isCurrentUser: entry.id === currentUserId,
            }))
            .slice(0, limit);

          setLeaderboardData(processedData);
        }
      } catch (error) {
        console.error("Error fetching trivia leaderboard data:", error);
        // Fallback to sample data on error
        setLeaderboardData(sampleTriviaLeaderboardData.slice(0, limit));
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [currentUserId, useMockData, limit]);

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "challenge-champion":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Trophy className="h-4 w-4 text-red-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Challenge Champion</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "speed-demon":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Zap className="h-4 w-4 text-yellow-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Speed Demon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "trivia-master":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Award className="h-4 w-4 text-purple-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Trivia Master</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };

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

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>SF Trivia Champions</CardTitle>
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
        <CardTitle>SF Trivia Champions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboardData.map((entry) => (
            <div
              key={entry.name}
              className={`p-4 rounded-lg border transition-colors ${
                entry.isCurrentUser 
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "bg-card border-border hover:bg-muted/50"
              }`}
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
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "font-medium",
                        entry.isCurrentUser && "text-[#0A3C1F]",
                      )}
                    >
                      {entry.name} {entry.isCurrentUser && "(You)"}
                    </p>
                    <div className="flex gap-1">
                      {entry.badges?.map((badge) => (
                        <span key={badge}>{getBadgeIcon(badge)}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>
                      {entry.correctAnswers}/{entry.totalQuestions} correct (
                      {entry.accuracy}%)
                    </span>
                    {entry.perfectChallengeRounds > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-200 text-[10px]"
                            >
                              {entry.perfectChallengeRounds}🏆
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {entry.perfectChallengeRounds} perfect challenge
                              rounds
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {entry.fastCorrectAnswers > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px]"
                            >
                              {entry.fastCorrectAnswers}⚡
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {entry.fastCorrectAnswers} fast correct answers
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-[#F0F7F2] text-[#0A3C1F] border-[#0A3C1F]"
                >
                  {entry.score} pts
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

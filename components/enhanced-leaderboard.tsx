"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AuthForm } from "@/components/auth-form";
import { Progress } from "@/components/ui/progress";
import { Heart, Share2, TrendingUp } from "lucide-react";
import confetti from "canvas-confetti";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Trophy,
  Medal,
  Award,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar_url?: string;
  participation_count: number;
  badge_count: number;
  nft_count: number;
  has_applied: boolean;
  rank?: number;
  is_current_user?: boolean;
  progress?: {
    total: number;
    current: number;
    label: string;
  };
  trending?: boolean;
  likes?: number;
  shares?: number;
  liked_by_user?: boolean;
  shared_by_user?: boolean;
}

interface EnhancedLeaderboardProps {
  currentUserId?: string;
  useMockData?: boolean;
}

export function EnhancedLeaderboard({
  currentUserId,
  useMockData = false,
}: EnhancedLeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("participation");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [timeframe, setTimeframe] = useState<string>("all-time");
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "like" | "share";
    userId: string;
  } | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const { isLoggedIn } = useUser();
  const { toast } = useToast();

  // Generate mock data with lower scores for easy replacement by real users
  const generateMockData = () => {
    const names = [
      "John Smith",
      "Maria Garcia", 
      "James Johnson",
      "David Williams",
      "Sarah Brown",
      "Michael Jones",
    ];

    // Lower scores so real users can easily surpass mock data
    const baseScores = [85, 65, 45, 35, 25, 15];

    const mockData = Array.from(
      { length: Math.min(limit, names.length) },
      (_, i) => {
        const isCurrentUser = currentUserId && i === 2; // Make the 3rd user the current user if currentUserId is provided

        const randomLikes = Math.floor(Math.random() * 15) + 2;
        const randomShares = Math.floor(Math.random() * 8) + 1;
        const randomProgress = {
          total: 100,
          current: Math.floor(Math.random() * 40) + 10,
          label: ["Next Rank", "Next Badge", "Level Up"][
            Math.floor(Math.random() * 3)
          ],
        };
        const isTrending = Math.random() > 0.8;

        return {
          id: `user-${i + 1}`,
          name: names[i],
          participation_count: baseScores[i] || 10,
          badge_count: Math.floor((baseScores[i] || 10) / 30), // 1-2 badges max
          nft_count: Math.floor((baseScores[i] || 10) / 80), // 0-1 NFTs
          has_applied: i < 3, // First 3 have applied
          avatar_url: `/placeholder.svg?height=40&width=40&query=avatar ${i + 1}`,
          is_current_user: !!isCurrentUser,
          rank: i + 1 + offset,
          likes: randomLikes,
          shares: randomShares,
          liked_by_user: Math.random() > 0.7,
          shared_by_user: Math.random() > 0.8,
          progress: randomProgress,
          trending: isTrending,
        };
      },
    );

    return mockData;
  };

  // Fetch data or use mock data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (useMockData) {
        // Use mock data directly
        const mockData = generateMockData();
        setLeaderboardData(mockData);
        setTotalUsers(50); // Simulate 50 total users
        setIsLoading(false);
        return;
      }

      // Build query parameters for real API call
      const params = new URLSearchParams({
        timeframe,
        category: activeTab,
        limit: limit.toString(),
        offset: offset.toString(),
        search: searchQuery,
      });

      if (currentUserId) {
        params.append("currentUserId", currentUserId);
      }

      // Add cache busting parameter
      const cacheBuster = `_cb=${Date.now()}`;
      const url = `/api/leaderboard?${params.toString()}&${cacheBuster}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Invalid content type: ${contentType}`);
      }

      const result = await response.json();

      if (!result || typeof result !== "object") {
        throw new Error("Invalid response format");
      }

      const data =
        result.leaderboard?.users || result.leaderboard || result.users || [];
      const total =
        result.leaderboard?.total || result.total || data.length || 0;

      if (Array.isArray(data) && data.length > 0) {
        setLeaderboardData(data);
        setTotalUsers(total);
      } else {
        // Fall back to mock data if no results
        const mockData = generateMockData();
        setLeaderboardData(mockData);
        setTotalUsers(50);
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError(err instanceof Error ? err : new Error(String(err)));

      // Fall back to mock data on error
      const mockData = generateMockData();
      setLeaderboardData(mockData);
      setTotalUsers(50);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on initial load and when filters change
  useEffect(() => {
    fetchData();
  }, [activeTab, timeframe, offset, searchQuery, currentUserId, useMockData]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setOffset(0); // Reset pagination when changing tabs
  };

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
    setOffset(0); // Reset pagination when changing timeframe
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0); // Reset pagination when searching
    fetchData();
  };

  const handlePrevPage = () => {
    if (offset - limit >= 0) {
      setOffset(offset - limit);
    }
  };

  const handleNextPage = () => {
    if (offset + limit < totalUsers) {
      setOffset(offset + limit);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-700" />;
    return <span className="text-gray-500 font-medium">{rank}</span>;
  };

  const handleLike = (userId: string) => {
    if (!isLoggedIn) {
      setPendingAction({ type: "like", userId });
      setShowAuthDialog(true);
      return;
    }

    // Update the liked status
    setLeaderboardData((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          const isNowLiked = !user.liked_by_user;

          // Show confetti for first like
          if (isNowLiked) {
            confetti({
              particleCount: 30,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#FFD700", "#0A3C1F"],
            });
          }

          return {
            ...user,
            likes: isNowLiked
              ? (user.likes || 0) + 1
              : Math.max(0, (user.likes || 0) - 1),
            liked_by_user: isNowLiked,
          };
        }
        return user;
      }),
    );

    toast({
      title: "Thanks for your support!",
      description: "Your like has been recorded.",
      duration: 3000,
    });
  };

  const handleShare = (userId: string) => {
    if (!isLoggedIn) {
      setPendingAction({ type: "share", userId });
      setShowAuthDialog(true);
      return;
    }

    // Show share dialog
    setShowShareDialog(true);

    // Update the shared status after a delay (simulating a share)
    setTimeout(() => {
      setLeaderboardData((prev) =>
        prev.map((user) => {
          if (user.id === userId && !user.shared_by_user) {
            return {
              ...user,
              shares: (user.shares || 0) + 1,
              shared_by_user: true,
            };
          }
          return user;
        }),
      );

      toast({
        title: "Content shared!",
        description:
          "Thanks for spreading the word about our recruitment program.",
        duration: 3000,
      });
    }, 1000);
  };

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);

    // Process the pending action
    if (pendingAction) {
      if (pendingAction.type === "like") {
        handleLike(pendingAction.userId);
      } else if (pendingAction.type === "share") {
        handleShare(pendingAction.userId);
      }
      setPendingAction(null);
    }
  };

  return (
    <>
      <Card className="w-full shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>

              <div className="flex items-center gap-2">
                <Select value={timeframe} onValueChange={handleTimeframeChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="all-time">All Time</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchData}
                  title="Refresh leaderboard"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-sm items-center space-x-2"
            >
              <Input
                type="search"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>

            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="participation">Points</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="nfts">NFTs</TabsTrigger>
                <TabsTrigger value="application">Applied</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                {isLoading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 py-3 border-b"
                    >
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                    </div>
                  ))
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    <p>Error loading leaderboard data.</p>
                    <Button
                      variant="outline"
                      onClick={fetchData}
                      className="mt-2"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {leaderboardData.map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center p-3 rounded-lg transition-all ${
                          user.is_current_user
                            ? "bg-green-50 border border-green-200"
                            : "hover:bg-gray-50"
                        } ${user.rank && user.rank < 4 ? "shadow-sm" : ""}`}
                      >
                        <div className="flex items-center justify-center w-8 mr-3">
                          {getRankIcon(user.rank || user.rank + offset)}
                        </div>

                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage
                            src={user.avatar_url || "/placeholder.svg"}
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            {activeTab === "participation" && (
                              <span>{user.participation_count} points</span>
                            )}
                            {activeTab === "badges" && (
                              <span>{user.badge_count} badges earned</span>
                            )}
                            {activeTab === "nfts" && (
                              <span>{user.nft_count} NFTs collected</span>
                            )}
                            {activeTab === "application" && (
                              <span>
                                {user.has_applied
                                  ? "Application submitted"
                                  : "Not applied yet"}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center">
                          {user.is_current_user && (
                            <Badge
                              variant="outline"
                              className="mr-2 bg-green-50"
                            >
                              You
                            </Badge>
                          )}

                          {user.trending && (
                            <Badge
                              variant="outline"
                              className="mr-2 bg-[#FFD700]/10 text-[#0A3C1F]"
                            >
                              <TrendingUp className="h-3 w-3 mr-1" /> Trending
                            </Badge>
                          )}

                          <div className="flex gap-2 ml-auto">
                            <Button
                              size="sm"
                              variant={
                                user.liked_by_user ? "default" : "outline"
                              }
                              className={`${user.liked_by_user ? "bg-[#0A3C1F] text-white" : "border-[#0A3C1F] text-[#0A3C1F]"} transition-all`}
                              onClick={() => handleLike(user.id)}
                            >
                              <Heart
                                className={`h-4 w-4 mr-1 ${user.liked_by_user ? "fill-white" : ""}`}
                              />
                              <span>{user.likes || 0}</span>
                            </Button>
                            <Button
                              size="sm"
                              variant={
                                user.shared_by_user ? "default" : "outline"
                              }
                              className={`${user.shared_by_user ? "bg-[#0A3C1F] text-white" : "border-[#0A3C1F] text-[#0A3C1F]"} transition-all`}
                              onClick={() => handleShare(user.id)}
                            >
                              <Share2 className="h-4 w-4 mr-1" />
                              <span>{user.shares || 0}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    {!isLoading && !error && (
                      <>
                        Showing {offset + 1}-
                        {Math.min(offset + leaderboardData.length, totalUsers)}{" "}
                        of {totalUsers}
                      </>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevPage}
                      disabled={offset === 0 || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={offset + limit >= totalUsers || isLoading}
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          {leaderboardData.map((user) => (
            <div key={`progress-${user.id}`}>
              {/* Progress bar */}
              <div className="mt-2 px-2">
                <div className="flex justify-between mb-1 text-xs">
                  <span>
                    {user.progress?.label}: {user.progress?.current}/
                    {user.progress?.total}
                  </span>
                  <span>
                    {Math.floor(
                      ((user.progress?.current || 0) /
                        (user.progress?.total || 1)) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    ((user.progress?.current || 0) /
                      (user.progress?.total || 1)) *
                    100
                  }
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>
            {pendingAction?.type === "like"
              ? "Sign in to like this recruiter's profile."
              : pendingAction?.type === "share"
                ? "Sign in to share this recruiter's profile."
                : "Sign in to access this feature."}
          </DialogDescription>
          <AuthForm onSuccess={handleAuthSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Share this profile</DialogTitle>
          <DialogDescription>
            <p>Choose how you want to share this profile:</p>
          </DialogDescription>

          <div className="grid grid-cols-2 gap-4 my-4">
            <Button
              className="bg-[#1877F2] hover:bg-[#1877F2]/90"
              onClick={() => setShowShareDialog(false)}
            >
              Facebook
            </Button>
            <Button
              className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
              onClick={() => setShowShareDialog(false)}
            >
              Twitter
            </Button>
            <Button
              className="bg-[#0A66C2] hover:bg-[#0A66C2]/90"
              onClick={() => setShowShareDialog(false)}
            >
              LinkedIn
            </Button>
            <Button
              className="bg-[#25D366] hover:bg-[#25D366]/90"
              onClick={() => setShowShareDialog(false)}
            >
              WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

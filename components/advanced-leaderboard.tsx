"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Medal,
  Award,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Heart,
  Share2,
  Eye,
  Star,
  TrendingUp,
  Heart as HeartFilled,
  Share2 as Share2Filled,
} from "lucide-react";
import { useAuthModal } from "@/context/auth-modal-context";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUser } from "@/context/user-context";
import { useToast } from "@/components/ui/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";

// Define avatar mapping for consistent images outside component to prevent re-renders
const AVATAR_MAPPING: Record<number, string> = {
  0: "/male-law-enforcement-headshot.png",
  1: "/female-law-enforcement-headshot.png",
  2: "/asian-male-officer-headshot.png",
  3: "/female-law-enforcement-headshot.png",
  4: "/male-law-enforcement-headshot.png",
};

interface LeaderboardUser {
  id: string;
  name: string;
  avatar_url: string;
  participation_count: number;
  badge_count: number;
  nft_count: number;
  has_applied: boolean;
  rank: number;
  is_current_user?: boolean;
  likes?: number;
  shares?: number;
  liked_by_user: boolean;
  shared_by_user: boolean;
  progress?: {
    total: number;
    current: number;
    label: string;
  };
  trending: boolean;
  spotlight?: boolean;
  referrals: number;
  is_mock?: boolean;
}

interface AdvancedLeaderboardProps {
  currentUserId?: string;
  useMockData?: boolean;
  className?: string;
}

export function AdvancedLeaderboard({
  currentUserId,
  useMockData = false,
  className,
}: AdvancedLeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("participation");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [spotlightUser, setSpotlightUser] = useState<LeaderboardUser | null>(
    null,
  );
  const [totalUsers, setTotalUsers] = useState(0);
  const [timeframe, setTimeframe] = useState<string>("all-time");
  const [offset, setOffset] = useState(0);
  const [pendingAction, setPendingAction] = useState<{
    type: "like" | "share";
    userId: string;
  } | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareForUnlock, setShareForUnlock] = useState<{
    badge: string;
    description: string;
  } | null>(null);
  const limit = 10;

  const { isLoggedIn, currentUser } = useUser();
  const { toast } = useToast();
  const { openModal } = useAuthModal();
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Use the current user ID from context if not provided as prop
  const effectiveCurrentUserId = currentUserId || currentUser?.id;

  // Generate minimal mock data with low scores for easy replacement by real users
  const generateMockData = useCallback(() => {
    const names = [
      "John Smith", 
      "Maria Garcia", 
      "James Johnson", 
      "Sarah Brown",
      "Michael Jones"
    ];

    // Much lower scores (matching our leaderboard API) so real users can easily surpass them
    const baseScores = [85, 65, 45, 35, 25];

    // Generate only 5 mock users instead of 50
    const fullDataset = Array.from({ length: 5 }, (_, i) => {
      const isCurrentUser = !!(currentUserId && i === 2); // Always boolean
      const randomLikes = Math.floor(Math.random() * 15) + 2; // Lower likes
      const randomShares = Math.floor(Math.random() * 8) + 1; // Lower shares
      const randomReferrals = Math.floor(Math.random() * 3); // Lower referrals
      const randomProgress = {
        total: 100,
        current: Math.floor(Math.random() * 40) + 10, // Lower progress
        label: ["Next Rank", "Next Badge", "Level Up"][
          Math.floor(Math.random() * 3)
        ],
      };
      const isTrending = Math.random() > 0.8;
      const isSpotlight = i === 0; // First user is spotlight

      // Use consistent avatar images
      const avatarUrl = AVATAR_MAPPING[i % 5];

      return {
        id: `mock-user-${i + 1}`,
        name: names[i],
        participation_count: baseScores[i],
        badge_count: Math.floor(baseScores[i] / 30), // 1-2 badges max
        nft_count: Math.floor(baseScores[i] / 80), // 0-1 NFTs max
        has_applied: i < 3, // Only first 3 have applied
        avatar_url: avatarUrl,
        is_current_user: isCurrentUser, // Always boolean
        rank: i + 1,
        likes: randomLikes,
        shares: randomShares,
        liked_by_user: Math.random() > 0.7,
        shared_by_user: Math.random() > 0.8,
        progress: randomProgress,
        trending: isTrending,
        spotlight: isSpotlight,
        referrals: randomReferrals,
        is_mock: true, // All generated mock data should be marked as mock
      };
    });

    return fullDataset;
  }, []); // Empty dependency array to prevent re-renders

  // Set the spotlight user
  useEffect(() => {
    if (leaderboardData.length > 0) {
      const spotlight =
        leaderboardData.find((user) => user.spotlight) || leaderboardData[0];
      setSpotlightUser(spotlight);
    }
  }, [leaderboardData]);

  // Animate spotlight when it changes
  useEffect(() => {
    if (spotlightUser && spotlightRef.current) {
      // Add a subtle pulse animation
      spotlightRef.current.animate(
        [
          { transform: "scale(1)", boxShadow: "0 0 0 rgba(10, 60, 31, 0)" },
          {
            transform: "scale(1.02)",
            boxShadow: "0 0 10px rgba(10, 60, 31, 0.2)",
          },
          { transform: "scale(1)", boxShadow: "0 0 0 rgba(10, 60, 31, 0)" },
        ],
        {
          duration: 2000,
          iterations: 1,
        },
      );
    }
  }, [spotlightUser]);

  // Fetch data or use mock data - fix dependencies
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (useMockData) {
        // Use mock data directly
        let mockData = generateMockData();
        
        // Apply search filter if there's a search query
        if (searchQuery.trim()) {
          mockData = mockData.filter(user => 
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        // Apply pagination for search results
        const startIndex = offset;
        const endIndex = offset + limit;
        const paginatedData = mockData.slice(startIndex, endIndex);
        
        setLeaderboardData(paginatedData);
        setTotalUsers(mockData.length); // Use filtered total for search results
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

      if (effectiveCurrentUserId) {
        params.append("currentUserId", effectiveCurrentUserId);
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

      // Handle the new API response format
      const data = result.entries || [];
      const total = result.total || 0;

      if (Array.isArray(data) && data.length > 0) {
        // Transform API data to match our component format
        const enhancedData = data.map((user, index) => ({
          id: user.id,
          name: user.name,
          avatar_url: user.avatar_url || (user.is_mock ? user.avatar_url : AVATAR_MAPPING[index % 5]),
          participation_count: user.participation_count || user.points || 0,
          badge_count: user.badge_count || user.badges || 0,
          nft_count: user.nft_count || 0,
          has_applied: user.has_applied || false,
          rank: user.rank || (index + 1 + offset),
          is_current_user: user.is_current_user || false,
          // Add social interaction mock data for now (lower values)
          likes: Math.floor(Math.random() * 15) + 2, // Reduced from 50 to 15
          shares: Math.floor(Math.random() * 8) + 1,  // Reduced from 20 to 8
          liked_by_user: Math.random() > 0.7,
          shared_by_user: Math.random() > 0.8,
          progress: {
            total: 100,
            current: Math.floor(((user.participation_count || user.points || 0) % 100)) + 1,
            label: ["Next Rank", "Next Badge", "Level Up"][
              Math.floor(Math.random() * 3)
            ],
          },
          trending: (user.participation_count || user.points || 0) > 50, // Mark higher scoring users as trending
          spotlight: index === 0, // First user is spotlight
          referrals: Math.floor(Math.random() * 3), // Reduced from 10 to 3
          is_mock: user.is_mock || false,
        }));

        setLeaderboardData(enhancedData);
        setTotalUsers(total);

        console.log(`📊 Loaded leaderboard: ${result.realUserCount || 0} real users, ${result.mockUserCount || 0} example users`);
      } else {
        // Fall back to mock data if no results
        let mockData = generateMockData();
        
        // Apply search filter for fallback data too
        if (searchQuery.trim()) {
          mockData = mockData.filter(user => 
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        setLeaderboardData(mockData);
        setTotalUsers(mockData.length);
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError(err instanceof Error ? err : new Error(String(err)));

      // Fall back to mock data on error
      let mockData = generateMockData();
      
      // Apply search filter for error fallback data too
      if (searchQuery.trim()) {
        mockData = mockData.filter(user => 
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setLeaderboardData(mockData);
      setTotalUsers(mockData.length);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, timeframe, offset, searchQuery, effectiveCurrentUserId, useMockData, generateMockData]); // Fixed dependencies

  // Fetch data on initial load and when filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setOffset(0); // Reset pagination when changing tabs
  };

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
    setOffset(0); // Reset pagination when changing timeframe
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
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

  const awardLikePoints = async () => {
    if (!currentUser?.id) return;
    
    try {
      const response = await fetch("/api/points/award", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          points: 5,
          action: "like_support",
          description: "Liked a fellow recruit's achievement"
        })
      });

      if (response.ok) {
        toast({
          title: "🎉 Support Points Earned!",
          description: "+5 points for supporting a fellow recruit!",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error awarding like points:", error);
    }
  };

  const handleLike = (userId: string) => {
    if (!isLoggedIn) {
      openModal("signup", "recruit");
      return;
    }

    // Check if user is already liked
    const user = leaderboardData.find(u => u.id === userId);
    const isLiking = !user?.liked_by_user;

    // Award points for liking (not for unliking)
    if (isLiking) {
      awardLikePoints();
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
              origin: { x: 0.5, y: 0.6 },
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
      title: isLiking ? "Thanks for your support!" : "Like removed",
      description: isLiking ? "Your like has been recorded!" : "Your like has been removed.",
      duration: 3000,
    });
  };

  const handleShare = (userId: string) => {
    if (!isLoggedIn) {
      openModal("signup", "recruit");
      return;
    }

    // Show share dialog
    setShowShareDialog(true);
    
    // Store the userId for sharing
    setPendingAction({ type: "share", userId });
  };

  const awardSharingPoints = async (platform: string) => {
    if (!currentUser?.id) return;
    
    try {
      const response = await fetch("/api/points/award", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          points: 10,
          action: "social_sharing",
          description: `Shared recruit profile on ${platform}`
        })
      });

      if (response.ok) {
        toast({
          title: "🎉 Sharing Points Earned!",
          description: `+10 points for sharing on ${platform}!`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error awarding sharing points:", error);
    }
  };

  const shareToSocialMedia = (platform: string) => {
    const user = leaderboardData.find(u => u.id === (pendingAction?.userId || ''));
    const shareText = `Check out ${user?.name || 'this top recruit'}'s amazing achievements in the San Francisco Deputy Sheriff's Association recruitment program! Join us in serving and protecting our community. #SFDSA #LawEnforcement #SanFrancisco`;
    const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002';
    const shareUrl = `${currentDomain}/profile/${pendingAction?.userId || "share"}`;
    
    let shareLink = '';
    
    switch (platform) {
      case 'Facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'Twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'LinkedIn':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent('SFDSA Top Recruit')}&summary=${encodeURIComponent(shareText)}`;
        break;
      case 'WhatsApp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
        break;
      default:
        // For other platforms or if sharing fails, copy to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
          toast({
            title: "Link copied!",
            description: "Share link copied to clipboard",
            duration: 3000,
          });
        }
        setShowShareDialog(false);
        return;
    }
    
    // Open the share link if available
    if (shareLink) {
      try {
        window.open(shareLink, '_blank', 'width=600,height=400');
      } catch (error) {
        console.error('Error opening share link:', error);
        // Fallback: copy to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
          toast({
            title: "Share link copied",
            description: "Couldn't open sharing window, but link was copied to clipboard",
            variant: "default",
          });
        }
      }
    }

    // Award points for sharing
    awardSharingPoints(platform);

    // Update the shared status and award points
    setLeaderboardData((prev) =>
      prev.map((user) => {
        if (user.id === pendingAction?.userId && !user.shared_by_user) {
          return {
            ...user,
            shares: (user.shares || 0) + 1,
            shared_by_user: true,
          };
        }
        return user;
      }),
    );

    // 25% chance to trigger a "share to unlock" opportunity
    if (Math.random() > 0.75) {
      const badges = [
        {
          badge: "Social Advocate",
          description: "Share content to earn this exclusive badge!",
        },
        {
          badge: "Community Builder",
          description: "Help grow our community by sharing!",
        },
        {
          badge: "Recruitment Champion",
          description:
            "Share to earn recruitment points and this special badge!",
        },
      ];
      setShareForUnlock(badges[Math.floor(Math.random() * badges.length)]);
    }

    toast({
      title: `Shared on ${platform}!`,
      description: "Thanks for spreading the word about our recruitment program!",
      duration: 3000,
    });

    setShowShareDialog(false);
  };

  const copyShareLink = () => {
    const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002';
    const shareUrl = `${currentDomain}/profile/${pendingAction?.userId || "share"}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
        duration: 3000,
      });
    }
  };

  const handleReferRecruit = () => {
    if (!isLoggedIn) {
      openModal("signup", "recruit");
      return;
    }

    // Show share dialog
    setShowShareDialog(true);

    toast({
      title: "Refer a Recruiter",
      description:
        "Share this link with potential recruits to earn referral bonuses!",
      duration: 5000,
    });
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-accent" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-700" />;
    return <span className="text-gray-500 font-medium">{rank}</span>;
  };

  return (
    <>
      <Card className={`w-full shadow-md ${className}`}>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-primary">Leaderboard</h2>

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
                  className="text-primary"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Recruiter Spotlight */}
            {spotlightUser && (
              <div
                ref={spotlightRef}
                className="bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-lg p-4 mb-4"
              >
                <div className="flex items-center mb-3">
                  <Star className="h-5 w-5 text-accent mr-2" />
                  <h3 className="font-semibold text-lg text-primary">
                    Recruiter Spotlight
                  </h3>
                </div>
                <div className="flex items-center">
                  <Avatar className="h-16 w-16 mr-4 border-2 border-accent">
                    <AvatarImage
                      src={
                        spotlightUser.avatar_url ||
                        "/placeholder.svg?height=64&width=64&query=avatar"
                      }
                      alt={spotlightUser.name}
                    />
                    <AvatarFallback>
                      {spotlightUser.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-bold text-lg">
                        {spotlightUser.name}
                      </span>
                      {spotlightUser.trending && (
                        <Badge className="ml-2 bg-primary text-primary-foreground">
                          <TrendingUp className="h-3 w-3 mr-1" /> Trending
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-1 text-sm">
                      <span className="flex items-center mr-3">
                        <Trophy className="h-4 w-4 text-accent mr-1" />
                        {spotlightUser.participation_count} points
                      </span>
                      <span className="flex items-center mr-3">
                        <Medal className="h-4 w-4 text-gray-400 mr-1" />
                        {spotlightUser.badge_count} badges
                      </span>
                      <span className="flex items-center mr-3">
                        <Award className="h-4 w-4 text-amber-700 mr-1" />
                        {spotlightUser.nft_count} NFTs
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 text-blue-500 mr-1" />
                        {spotlightUser.referrals} referrals
                      </span>
                    </div>

                    <div className="mt-2">
                      <div className="flex justify-between mb-1 text-xs">
                        <span>
                          {spotlightUser.progress?.label}:{" "}
                          {spotlightUser.progress?.current}/
                          {spotlightUser.progress?.total}
                        </span>
                        <span>
                          {Math.floor(
                            ((spotlightUser.progress?.current || 0) /
                              (spotlightUser.progress?.total || 1)) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          ((spotlightUser.progress?.current || 0) /
                            (spotlightUser.progress?.total || 1)) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 ml-4">
                    <Button
                      size="sm"
                      variant={
                        spotlightUser.liked_by_user ? "default" : "outline"
                      }
                      className={`${spotlightUser.liked_by_user ? "bg-primary text-primary-foreground" : "border-primary text-primary"} transition-all`}
                      onClick={() => handleLike(spotlightUser.id)}
                    >
                      <HeartFilled
                        className={`h-4 w-4 mr-1 ${spotlightUser.liked_by_user ? "fill-white" : ""}`}
                      />
                      <span>{spotlightUser.likes}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        spotlightUser.shared_by_user ? "default" : "outline"
                      }
                      className={`${spotlightUser.shared_by_user ? "bg-primary text-primary-foreground" : "border-primary text-primary"} transition-all`}
                      onClick={() => handleShare(spotlightUser.id)}
                    >
                      <Share2Filled className="h-4 w-4 mr-1" />
                      <span>{spotlightUser.shares}</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar and Refer Recruiter Button */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
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
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>

              <Button
                onClick={handleReferRecruit}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Eye className="h-4 w-4 mr-2" />
                Refer a Recruit
              </Button>
            </div>

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
                ) : leaderboardData.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery.trim() ? (
                      <div>
                        <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No results found</p>
                        <p className="text-sm">
                          No users found matching "{searchQuery}". Try a different search term.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchQuery("");
                            setOffset(0);
                          }}
                          className="mt-4"
                        >
                          Clear Search
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No data available</p>
                        <p className="text-sm">Try refreshing or changing your filters.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboardData.map((user, index) => (
                      <AnimatePresence key={user.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`flex flex-col p-3 rounded-lg transition-all ${
                            user.is_current_user
                              ? "bg-primary/5 border border-primary/20"
                              : "border hover:border-primary/20 hover:bg-primary/5"
                          } ${index < 3 ? "border-accent/30" : "border-gray-200"}`}
                        >
                          <div className="flex items-center">
                            <div className="flex items-center justify-center w-8 mr-3">
                              {getRankIcon(user.rank || index + 1 + offset)}
                            </div>

                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage
                                src={
                                  user.avatar_url ||
                                  "/placeholder.svg?height=40&width=40&query=avatar"
                                }
                                alt={user.name}
                              />
                              <AvatarFallback>
                                {user.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className="font-medium">{user.name}</span>
                                {user.is_current_user && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 bg-primary/10 text-primary"
                                  >
                                    You
                                  </Badge>
                                )}
                                {user.trending && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 bg-accent/10 text-primary"
                                  >
                                    <TrendingUp className="h-3 w-3 mr-1" />{" "}
                                    Trending
                                  </Badge>
                                )}
                                {user.has_applied && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 bg-green-50 text-green-700"
                                  >
                                    Applied
                                  </Badge>
                                )}
                                {/* Add indicator for real vs example users */}
                                {user.is_mock === true && (
                                  <div className="ml-2 flex items-center">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full" title="Example User"></div>
                                  </div>
                                )}
                                {user.is_mock === false && (
                                  <div className="ml-2 flex items-center">
                                    <div className="w-2 h-2 bg-green-400 rounded-full" title="Real User"></div>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-1 mt-1 text-xs text-gray-500">
                                <span className="flex items-center mr-2">
                                  <Trophy className="h-3 w-3 text-accent mr-1" />
                                  {user.participation_count} pts
                                </span>
                                <span className="flex items-center mr-2">
                                  <Medal className="h-3 w-3 text-gray-400 mr-1" />
                                  {user.badge_count} badges
                                </span>
                                <span className="flex items-center mr-2">
                                  <Award className="h-3 w-3 text-amber-700 mr-1" />
                                  {user.nft_count} NFTs
                                </span>
                                <span className="flex items-center">
                                  <Eye className="h-3 w-3 text-blue-500 mr-1" />
                                  {user.referrals} referrals
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={
                                  user.liked_by_user ? "default" : "outline"
                                }
                                className={`${user.liked_by_user ? "bg-primary text-primary-foreground" : "border-primary text-primary"} transition-all`}
                                onClick={() => handleLike(user.id)}
                              >
                                {user.liked_by_user ? (
                                  <HeartFilled className="h-4 w-4 mr-1" />
                                ) : (
                                  <Heart className="h-4 w-4 mr-1" />
                                )}
                                {user.liked_by_user ? "Liked" : "Like"}
                              </Button>
                              <Button
                                size="sm"
                                variant={
                                  user.shared_by_user ? "default" : "outline"
                                }
                                className={`${user.shared_by_user ? "bg-primary text-primary-foreground" : "border-primary text-primary"} transition-all`}
                                onClick={() => handleShare(user.id)}
                              >
                                {user.shared_by_user ? (
                                  <Share2Filled className="h-4 w-4 mr-1" />
                                ) : (
                                  <Share2 className="h-4 w-4 mr-1" />
                                )}
                                {user.shared_by_user ? "Shared" : "Share"}
                              </Button>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-2 px-2">
                            <div className="flex justify-between mb-1 text-xs">
                              <span>
                                {user.progress?.label}: {user.progress?.current}
                                /{user.progress?.total}
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
                        </motion.div>
                      </AnimatePresence>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    {!isLoading && !error && (
                      <>
                        {searchQuery.trim() ? (
                          totalUsers > 0 ? (
                            <>
                              Found {totalUsers} result{totalUsers !== 1 ? 's' : ''} for "{searchQuery}"
                              {leaderboardData.length > 0 && (
                                <> • Showing {offset + 1}-{Math.min(offset + leaderboardData.length, totalUsers)}</>
                              )}
                            </>
                          ) : null
                        ) : (
                          <>
                            Showing {offset + 1}-
                            {Math.min(offset + leaderboardData.length, totalUsers)}{" "}
                            of {totalUsers}
                          </>
                        )}
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
        </CardContent>
      </Card>

      {/* Top Recruiters Section */}
      <Card className={`w-full shadow-md mt-6 ${className}`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary">Top Referrers</h2>
            <Button variant="link" className="text-primary">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center p-4 border rounded-lg"
                  >
                    <Skeleton className="h-10 w-10 rounded-full mr-3" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-[120px] mb-2" />
                      <Skeleton className="h-3 w-[80px]" />
                    </div>
                  </div>
                ))
              : leaderboardData.slice(0, 3).map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center p-4 border rounded-lg hover:border-primary/20 hover:bg-primary/5 transition-all"
                  >
                    <div className="mr-3 text-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          index === 0
                            ? "bg-accent/20 text-accent"
                            : index === 1
                              ? "bg-gray-200 text-gray-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </div>

                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage
                        src={
                          user.avatar_url ||
                          "/placeholder.svg?height=40&width=40&query=avatar"
                        }
                        alt={user.name}
                      />
                      <AvatarFallback>
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 text-blue-500 mr-1" />
                          {user.referrals} recruits
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => handleShare(user.id)}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                ))}
          </div>
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Share this profile</DialogTitle>
          <DialogDescription>
            {shareForUnlock ? (
              <div className="bg-accent/10 border border-accent rounded-lg p-4 my-4">
                <h4 className="font-bold text-primary flex items-center">
                  <Trophy className="h-4 w-4 text-accent mr-2" />
                  Share to Unlock: {shareForUnlock.badge}
                </h4>
                <p className="mt-2 text-sm">{shareForUnlock.description}</p>
              </div>
            ) : (
              <p>Choose how you want to share this profile:</p>
            )}
          </DialogDescription>

          <div className="grid grid-cols-2 gap-4 my-4">
            <Button
              className="bg-[#1877F2] hover:bg-[#1877F2]/90"
              onClick={() => shareToSocialMedia('Facebook')}
            >
              Facebook
            </Button>
            <Button
              className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
              onClick={() => shareToSocialMedia('Twitter')}
            >
              Twitter
            </Button>
            <Button
              className="bg-[#0A66C2] hover:bg-[#0A66C2]/90"
              onClick={() => shareToSocialMedia('LinkedIn')}
            >
              LinkedIn
            </Button>
            <Button
              className="bg-[#25D366] hover:bg-[#25D366]/90"
              onClick={() => shareToSocialMedia('WhatsApp')}
            >
              WhatsApp
            </Button>
          </div>

          <div className="relative mt-2">
            <Input
              value={`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002'}/profile/${pendingAction?.userId || "share"}`}
              readOnly
            />
            <Button
              className="absolute right-1 top-1 h-7"
              variant="outline"
              size="sm"
              onClick={copyShareLink}
            >
              Copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/context/user-context";
import { TikTokChallengeCard } from "@/components/tiktok-challenge-card";
import { TikTokChallengeSubmissionViewer } from "@/components/tiktok-challenge-submission-viewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageWrapper } from "@/components/page-wrapper";
import { TikTokIcon } from "@/components/tiktok-icon";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Search, Filter, Award, Video, Users, Trophy, Star } from "lucide-react";
import { ChallengeLeaderboard } from "@/components/tiktok-challenge-leaderboard";
import { Skeleton } from "@/components/ui/skeleton";

interface Challenge {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  pointsReward: number;
  badgeReward?: string;
  thumbnailUrl?: string;
  hashtags: string[];
  status: string;
  completed?: boolean;
  submissionId?: number;
  submissionStatus?: string;
}

export default function TikTokChallengesPage() {
  const { currentUser } = useUser();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewingSubmissionId, setViewingSubmissionId] = useState<number | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("challenges");

  const fetchChallenges = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/tiktok-challenges?userId=${currentUser?.id}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch challenges");
      }

      const data = await response.json();
      setChallenges(data.challenges || []);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

  const filterChallenges = useCallback(() => {
    let filtered = [...challenges];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (challenge) =>
          challenge.title.toLowerCase().includes(query) ||
          challenge.description.toLowerCase().includes(query) ||
          challenge.hashtags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      switch (filterStatus) {
        case "active":
          filtered = filtered.filter(
            (challenge) =>
              !challenge.completed && new Date(challenge.endDate) > new Date(),
          );
          break;
        case "completed":
          filtered = filtered.filter((challenge) => challenge.completed);
          break;
        case "pending":
          filtered = filtered.filter(
            (challenge) => challenge.submissionStatus === "pending",
          );
          break;
        case "expired":
          filtered = filtered.filter(
            (challenge) =>
              !challenge.completed && new Date(challenge.endDate) <= new Date(),
          );
          break;
      }
    }

    setFilteredChallenges(filtered);
  }, [challenges, searchQuery, filterStatus]);

  useEffect(() => {
    if (currentUser) {
      fetchChallenges();
    }
  }, [currentUser, fetchChallenges]);

  useEffect(() => {
    filterChallenges();
  }, [filterChallenges]);

  const handleShowSubmission = (submissionId: number) => {
    setViewingSubmissionId(submissionId);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex space-x-2 pt-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (filteredChallenges.length === 0) {
      return (
        <div className="text-center py-12">
          <TikTokIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">
            No challenges found
          </h3>
          <p className="text-gray-500 mt-1">
            {searchQuery || filterStatus !== "all"
              ? "Try adjusting your filters or search query"
              : "Check back soon for new TikTok challenges!"}
          </p>

          {(searchQuery || filterStatus !== "all") && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => (
          <TikTokChallengeCard
            key={challenge.id}
            challenge={challenge}
            userId={currentUser?.id}
            onShowSubmission={handleShowSubmission}
          />
        ))}
      </div>
    );
  };

  return (
    <PageWrapper>
      <div className="container py-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold flex items-center bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/80 bg-clip-text text-transparent">
                <TikTokIcon className="h-10 w-10 mr-3" />
                TikTok Recruitment Challenges
              </h1>
              <p className="text-lg text-gray-600 mt-2 max-w-2xl">
                Showcase your passion for law enforcement! Create engaging TikTok videos,
                earn points, and help recruit the next generation of SF Deputy Sheriffs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                <Trophy className="h-4 w-4 mr-2 text-yellow-600" />
                <span className="text-yellow-800 font-medium">Creator Rewards</span>
              </Badge>
              <Badge variant="outline" className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <Video className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-blue-800 font-medium">125-200 Points</span>
              </Badge>
              <Badge variant="outline" className="flex items-center px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <Star className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-green-800 font-medium">Special Badges</span>
              </Badge>
            </div>
          </div>
        </header>

        {/* Enhanced Quick Stats */}
        <div className="bg-gradient-to-r from-[#0A3C1F]/10 to-transparent border border-[#0A3C1F]/20 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-[#0A3C1F]">5</div>
              <div className="text-sm text-gray-600 font-medium">Active Challenges</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0A3C1F]">125-200</div>
              <div className="text-sm text-gray-600 font-medium">Points Per Challenge</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0A3C1F]">🎖️</div>
              <div className="text-sm text-gray-600 font-medium">Unique Badges</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0A3C1F]">∞</div>
              <div className="text-sm text-gray-600 font-medium">Resubmissions</div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges">
            <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search challenges or hashtags..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Challenges</SelectItem>
                    <SelectItem value="active">Active Challenges</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {renderContent()}
          </TabsContent>

          <TabsContent value="leaderboard">
            <ChallengeLeaderboard />
          </TabsContent>
        </Tabs>

        {/* Enhanced How It Works Section */}
        <div className="mt-12 bg-gradient-to-br from-gray-50 to-white border rounded-xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0A3C1F] mb-3">
              How TikTok Challenges Work
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our recruitment efforts by creating engaging content that showcases your passion for law enforcement and community service.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0A3C1F] to-[#0A3C1F]/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-3">1. Choose & Create</h3>
              <p className="text-gray-600">
                Pick a challenge that resonates with you. Create an authentic TikTok video 
                following the guidelines and using the specified hashtags.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0A3C1F] to-[#0A3C1F]/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-3">2. Submit & Earn</h3>
              <p className="text-gray-600">
                Submit your TikTok link through our platform. Instantly earn 125-200 points 
                plus special badges based on the challenge type.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0A3C1F] to-[#0A3C1F]/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-3">3. Climb & Lead</h3>
              <p className="text-gray-600">
                Climb the leaderboard, earn recognition, and help us recruit amazing 
                candidates while showcasing your own potential as a future deputy.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Star className="h-6 w-6 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Pro Tip</h4>
                <p className="text-yellow-700 text-sm">
                  Authentic, passionate videos perform best! Share your genuine story and motivation 
                  for wanting to serve the San Francisco community. Quality over quantity always wins.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewingSubmissionId && (
        <TikTokChallengeSubmissionViewer
          submissionId={viewingSubmissionId}
          isOpen={!!viewingSubmissionId}
          onClose={() => setViewingSubmissionId(null)}
        />
      )}
    </PageWrapper>
  );
}

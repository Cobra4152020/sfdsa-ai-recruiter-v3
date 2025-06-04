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
import { CalendarDays, Search, Filter, Award } from "lucide-react";
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
              <h1 className="text-3xl font-bold flex items-center">
                <TikTokIcon className="h-8 w-8 mr-2" />
                TikTok Recruitment Challenges
              </h1>
              <p className="text-gray-600 mt-1">
                Showcase your skills, earn points, and help recruit for the SF
                Sheriff&apos;s Department!
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center px-3 py-1">
                <Award className="h-4 w-4 mr-1" />
                <span>Top Creators Badge</span>
              </Badge>
              <Badge variant="outline" className="flex items-center px-3 py-1">
                <CalendarDays className="h-4 w-4 mr-1" />
                <span>New Challenges Weekly</span>
              </Badge>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="challenges">
            <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search challenges..."
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

        <div className="mt-12 bg-gray-50 border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            How TikTok Challenges Work
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">1. Choose a Challenge</h3>
              <p className="text-gray-600">
                Pick an active challenge that matches your skills and interests.
                Each challenge has specific requirements and rewards.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">2. Create & Share</h3>
              <p className="text-gray-600">
                Create your TikTok video following the challenge guidelines. Use
                the specified hashtag when posting.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">3. Earn Rewards</h3>
              <p className="text-gray-600">
                Submit your video link to earn points. Top performers receive
                special badges and recognition.
              </p>
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

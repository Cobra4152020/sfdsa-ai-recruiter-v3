"use client";

import { PageWrapper } from "@/components/page-wrapper";
import { EnhancedLeaderboard } from "@/components/enhanced-leaderboard";
import { RealTimeLeaderboard } from "@/components/real-time-leaderboard";
import { TriviaLeaderboard } from "@/components/trivia-leaderboard";
import { BadgeLeaderboard } from "@/components/badges/badge-leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Star, Target, Users, Zap } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#0A3C1F] mb-4">
              🏆 Recruitment Leaderboard
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how you rank against other recruits! Compete in points, badges, trivia, and more. 
              Rise through the ranks and become a top recruit.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Top Performers</h3>
                <p className="text-sm text-gray-600">Overall rankings</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Medal className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Badge Champions</h3>
                <p className="text-sm text-gray-600">Most badges earned</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Trivia Masters</h3>
                <p className="text-sm text-gray-600">Highest quiz scores</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Community Leaders</h3>
                <p className="text-sm text-gray-600">Most referrals</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overall" className="space-y-6">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="overall" className="flex items-center">
                <Trophy className="h-4 w-4 mr-2" />
                Overall Rankings
              </TabsTrigger>
              <TabsTrigger value="badges" className="flex items-center">
                <Medal className="h-4 w-4 mr-2" />
                Badge Leaders
              </TabsTrigger>
              <TabsTrigger value="trivia" className="flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Trivia Champions
              </TabsTrigger>
              <TabsTrigger value="realtime" className="flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Live Rankings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overall" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                    Overall Recruitment Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EnhancedLeaderboard useMockData={true} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Medal className="h-5 w-5 mr-2 text-gray-400" />
                    Badge Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BadgeLeaderboard />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trivia" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-blue-500" />
                    Trivia Champions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TriviaLeaderboard useMockData={true} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="realtime" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-green-500" />
                    Live Activity Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RealTimeLeaderboard useMockData={true} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Competition Info */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                How Rankings Work
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Earning Points</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Complete practice tests: <strong>20 points</strong></li>
                    <li>• Chat with Sgt. Ken: <strong>5 points</strong></li>
                    <li>• Download resources: <strong>10 points</strong></li>
                    <li>• Refer other recruits: <strong>50 points</strong></li>
                    <li>• Earn badges: <strong>25-100 points</strong></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Ranking Categories</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Overall:</strong> Total points across all activities</li>
                    <li>• <strong>Badges:</strong> Number and rarity of badges earned</li>
                    <li>• <strong>Trivia:</strong> Quiz scores and completion rate</li>
                    <li>• <strong>Community:</strong> Referrals and social engagement</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
} 
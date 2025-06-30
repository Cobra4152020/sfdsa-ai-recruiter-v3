"use client";

import { PageWrapper } from "@/components/page-wrapper";
import { EnhancedLeaderboard } from "@/components/enhanced-leaderboard";
import { RealTimeLeaderboard } from "@/components/real-time-leaderboard";
import { TriviaLeaderboard } from "@/components/trivia-leaderboard";
import { BadgeLeaderboard } from "@/components/badges/badge-leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Star, Target, Users, Zap, Award, TrendingUp } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-yellow-500 bg-clip-text text-transparent mb-6">
            🏆 Live Recruitment Leaderboard
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how you rank against other recruits! Compete in points, badges, trivia, and more. 
            Rise through the ranks and become a top recruit. <strong>This leaderboard is live</strong> and updates in real-time.
          </p>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center hover:shadow-lg transition-shadow border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">Top Performers</h3>
              <p className="text-sm text-gray-600">Overall rankings with badges</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50">
            <CardContent className="p-6">
              <div className="bg-muted0 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Medal className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">Badge Champions</h3>
              <p className="text-sm text-gray-600">Most badges earned</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">Trivia Masters</h3>
              <p className="text-sm text-gray-600">Highest quiz scores</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">Live Rankings</h3>
              <p className="text-sm text-gray-600">Real-time updates</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overall" className="space-y-6">
          <TabsList className="grid grid-cols-4 mb-8 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="overall" className="flex items-center data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Trophy className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Overall Rankings</span>
              <span className="sm:hidden">Overall</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Medal className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Badge Leaders</span>
              <span className="sm:hidden">Badges</span>
            </TabsTrigger>
            <TabsTrigger value="trivia" className="flex items-center data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Zap className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Trivia Champions</span>
              <span className="sm:hidden">Trivia</span>
            </TabsTrigger>
            <TabsTrigger value="realtime" className="flex items-center data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Live Activity</span>
              <span className="sm:hidden">Live</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-6">
            <Card className="border-yellow-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Overall Recruitment Rankings
                  <div className="ml-auto flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm text-green-600 font-medium">LIVE</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <EnhancedLeaderboard useMockData={false} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <Card className="border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
                <CardTitle className="flex items-center">
                  <Medal className="h-5 w-5 mr-2 text-gray-500" />
                  Badge Leaderboard
                  <div className="ml-auto flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm text-green-600 font-medium">LIVE</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <BadgeLeaderboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trivia" className="space-y-6">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-blue-500" />
                  Trivia Champions
                  <div className="ml-auto flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm text-green-600 font-medium">LIVE</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <TriviaLeaderboard useMockData={false} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Live Activity Rankings
                  <div className="ml-auto flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm text-green-600 font-medium">LIVE</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RealTimeLeaderboard useMockData={false} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Competition Info */}
        <Card className="mt-8 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              How Live Rankings Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-blue-800 flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Earning Points
                </h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Complete practice tests: <strong>20 points</strong></li>
                  <li>• Chat with Sgt. Ken: <strong>5 points</strong></li>
                  <li>• Download resources: <strong>10 points</strong></li>
                  <li>• Refer other recruits: <strong>50 points</strong></li>
                  <li>• Earn badges: <strong>10-500 points</strong> (live system!)</li>
                  <li>• Complete application steps: <strong>50-200 points</strong></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-blue-800 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Ranking Categories
                </h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• <strong>Overall:</strong> Total points including badge bonuses</li>
                  <li>• <strong>Badges:</strong> Live badge count from database</li>
                  <li>• <strong>Trivia:</strong> Quiz scores and completion rate</li>
                  <li>• <strong>Live Activity:</strong> Real-time engagement metrics</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 font-medium flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span><strong>Live System:</strong> Rankings update in real-time as you earn badges and complete activities. Mock users have lower scores (25-85 points) so real users can easily climb the leaderboard!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
} 
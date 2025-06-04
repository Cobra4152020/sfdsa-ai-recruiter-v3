"use client";

import { useState, useEffect } from "react";
import { PageWrapper } from "@/components/page-wrapper";
import { BriefingCard } from "@/components/daily-briefing/briefing-card";
import { BriefingStats as BriefingStatsComponent } from "@/components/daily-briefing/briefing-stats";
import { BriefingLeaderboard } from "@/components/daily-briefing/briefing-leaderboard";
import { BriefingStreakBadge } from "@/components/daily-briefing/briefing-streak-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/user-context";
import { 
  Calendar, 
  Clock, 
  Trophy, 
  Target, 
  Star, 
  RefreshCw, 
  AlertCircle,
  Zap,
  Shield,
  Users
} from "lucide-react";
import { motion } from "framer-motion";

interface DailyBriefing {
  id: string;
  title: string;
  content: string;
  theme: string;
  date: string;
  created_at: string;
  cycle_day?: number;
  keyPoints?: string[];
}

interface BriefingStats {
  total_attendees: number;
  total_shares: number;
  user_attended: boolean;
  user_shared: boolean;
  user_platforms_shared: string[];
}

export default function DailyBriefingPage() {
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [stats, setStats] = useState<BriefingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStreak, setUserStreak] = useState(0);
  const { currentUser } = useUser();
  const { toast } = useToast();

  const fetchTodaysBriefing = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/daily-briefing/today', {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch briefing: ${response.status}`);
      }

      const data = await response.json();
      
      setBriefing(data.briefing);
      setStats(data.stats);
      setUserStreak(data.briefing?.userStreak || 0);
      
      if (data.error) {
        console.warn('Briefing API warning:', data.error);
      }
    } catch (err) {
      console.error('Error fetching daily briefing:', err);
      setError(err instanceof Error ? err.message : 'Failed to load briefing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysBriefing();
  }, []);

  const handleRefresh = () => {
    fetchTodaysBriefing();
    toast({
      title: "Briefing Refreshed",
      description: "Loading the latest daily briefing information.",
      duration: 2000,
    });
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-[#0A3C1F] mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-[#0A3C1F]">
                Sgt. Ken's Daily Briefing
              </h1>
              <Shield className="h-8 w-8 text-[#0A3C1F] ml-3" />
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay informed, earn points, and advance your journey to becoming a San Francisco Deputy Sheriff.
            </p>
            <div className="flex items-center justify-center mt-4 space-x-4">
              <Badge variant="outline" className="bg-[#0A3C1F]/5 text-[#0A3C1F] border-[#0A3C1F]/20">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Badge>
              <Badge variant="outline" className="bg-[#0A3C1F]/5 text-[#0A3C1F] border-[#0A3C1F]/20">
                <Clock className="h-3 w-3 mr-1" />
                {new Date().toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F]/5"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}. Using fallback content.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Briefing Content */}
            <div className="lg:col-span-2 space-y-6">
              {loading ? (
                <Card className="shadow-lg">
                  <CardHeader className="bg-[#0A3C1F] text-white">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-48 bg-white/20" />
                      <div className="flex space-x-4">
                        <Skeleton className="h-4 w-24 bg-white/20" />
                        <Skeleton className="h-4 w-20 bg-white/20" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="mt-6 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <BriefingCard briefing={briefing ?? undefined} />
                </motion.div>
              )}

              {/* Quick Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <Card className="bg-gradient-to-br from-[#0A3C1F]/5 to-[#0A3C1F]/10 border-[#0A3C1F]/20">
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 text-[#0A3C1F] mx-auto mb-2" />
                    <h3 className="font-semibold text-[#0A3C1F]">Daily Points</h3>
                    <p className="text-2xl font-bold text-[#0A3C1F]">25</p>
                    <p className="text-xs text-gray-600">Available today</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                  <CardContent className="p-4 text-center">
                    <Zap className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-amber-800">Your Streak</h3>
                    <p className="text-2xl font-bold text-amber-800">{userStreak}</p>
                    <p className="text-xs text-amber-600">Days in a row</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-800">Community</h3>
                    <p className="text-2xl font-bold text-blue-800">{stats?.total_attendees || 0}</p>
                    <p className="text-xs text-blue-600">Today's attendance</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* How It Works Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center text-[#0A3C1F]">
                      <Star className="h-5 w-5 mr-2" />
                      How to Earn Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-[#0A3C1F]/5 rounded-lg">
                        <div className="text-lg font-bold text-[#0A3C1F] mb-1">5 Points</div>
                        <p className="text-sm">Mark as attended</p>
                      </div>
                      <div className="text-center p-4 bg-[#0A3C1F]/5 rounded-lg">
                        <div className="text-lg font-bold text-[#0A3C1F] mb-1">10 Points</div>
                        <p className="text-sm">Complete daily quiz</p>
                      </div>
                      <div className="text-center p-4 bg-[#0A3C1F]/5 rounded-lg">
                        <div className="text-lg font-bold text-[#0A3C1F] mb-1">15 Points</div>
                        <p className="text-sm">Share on social media</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800 font-medium">
                        <Zap className="h-4 w-4 inline mr-1" />
                        Streak Bonus: Maintain daily attendance for bonus multipliers!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Streak Badge */}
              {userStreak > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <BriefingStreakBadge />
                </motion.div>
              )}

              {/* Stats Component */}
              {stats && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <BriefingStatsComponent stats={stats} userStreak={userStreak} />
                </motion.div>
              )}

              {/* Leaderboard */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <BriefingLeaderboard />
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-[#0A3C1F]">Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-[#0A3C1F]/20 text-[#0A3C1F] hover:bg-[#0A3C1F]/5"
                      onClick={() => window.location.href = '/trivia'}
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Daily Trivia Challenge
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-[#0A3C1F]/20 text-[#0A3C1F] hover:bg-[#0A3C1F]/5"
                      onClick={() => window.location.href = '/badges'}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      View Your Badges
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-[#0A3C1F]/20 text-[#0A3C1F] hover:bg-[#0A3C1F]/5"
                      onClick={() => window.location.href = '/leaderboard'}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View Leaderboard
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

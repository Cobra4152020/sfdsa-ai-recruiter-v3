"use client";

import { useState, useEffect } from "react";
import { PageWrapper } from "@/components/page-wrapper";
import { AuthRequiredWrapper } from "@/components/auth-required-wrapper";
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
  Users,
  Play,
  CheckCircle,
  Share2,
  Rocket
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

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
      <AuthRequiredWrapper
        requiredFeature="sgt_ken_chat"
        title="Daily Briefing Access"
        description="Stay informed with daily updates from Sgt. Ken and the department"
      >
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section with Image */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-12 rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-primary/80 dark:from-black dark:to-gray-900"
          >
            <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
              <div className="flex flex-col justify-center space-y-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-10 w-10 text-white dark:text-[#FFD700] mr-4" />
                  <h1 className="text-4xl md:text-5xl font-bold text-white dark:text-[#FFD700]">
                    Sgt. Ken's Daily Briefing
                  </h1>
                </div>
                <p className="text-xl text-white/90 dark:text-gray-300 leading-relaxed">
                  Stay informed, earn points, and advance your journey to becoming a San Francisco Deputy Sheriff. Get the latest updates, safety protocols, and department news.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant="outline" className="bg-white/10 text-white border-white/30 dark:bg-[#FFD700]/20 dark:text-[#FFD700] dark:border-[#FFD700]/50">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Badge>
                  <Badge variant="outline" className="bg-white/10 text-white border-white/30 dark:bg-[#FFD700]/20 dark:text-[#FFD700] dark:border-[#FFD700]/50">
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
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 dark:bg-[#FFD700]/20 dark:border-[#FFD700]/50 dark:text-[#FFD700] dark:hover:bg-[#FFD700]/30"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden shadow-2xl">
                  <Image
                    src="/sheriff-briefing.png"
                    alt="Sheriff's Daily Briefing - Law Enforcement Briefing Room"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div className="text-white">
                        <p className="text-sm font-medium">Live Briefing Room</p>
                        <p className="text-xs opacity-80">San Francisco Sheriff's Department</p>
                      </div>
                      <Play className="h-8 w-8 text-white/80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-300">
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
                <Card className="shadow-lg border-gray-200 dark:border-[#FFD700]/30">
                  <CardHeader className="bg-primary dark:bg-black text-white dark:text-[#FFD700]">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-48 bg-white/20 dark:bg-[#FFD700]/20" />
                      <div className="flex space-x-4">
                        <Skeleton className="h-4 w-24 bg-white/20 dark:bg-[#FFD700]/20" />
                        <Skeleton className="h-4 w-20 bg-white/20 dark:bg-[#FFD700]/20" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 bg-white dark:bg-black">
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full dark:bg-gray-800" />
                      <Skeleton className="h-4 w-3/4 dark:bg-gray-800" />
                      <Skeleton className="h-4 w-1/2 dark:bg-gray-800" />
                      <div className="mt-6 space-y-2">
                        <Skeleton className="h-4 w-full dark:bg-gray-800" />
                        <Skeleton className="h-4 w-5/6 dark:bg-gray-800" />
                        <Skeleton className="h-4 w-4/5 dark:bg-gray-800" />
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

              {/* Enhanced Quick Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-black dark:to-gray-900 border-primary/20 dark:border-[#FFD700]/30 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="bg-primary/10 dark:bg-[#FFD700]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8 text-primary dark:text-[#FFD700]" />
                    </div>
                    <h3 className="font-semibold text-primary dark:text-[#FFD700] mb-2">Daily Points</h3>
                    <p className="text-3xl font-bold text-primary dark:text-[#FFD700] mb-1">25</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Available today</p>
                    <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary dark:bg-[#FFD700] h-2 rounded-full w-1/3 transition-all duration-500"></div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-black dark:to-gray-900 border-amber-200 dark:border-[#FFD700]/30 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="bg-amber-200 dark:bg-[#FFD700]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="h-8 w-8 text-amber-600 dark:text-[#FFD700]" />
                    </div>
                    <h3 className="font-semibold text-amber-800 dark:text-[#FFD700] mb-2">Your Streak</h3>
                    <p className="text-3xl font-bold text-amber-800 dark:text-[#FFD700] mb-1">{userStreak}</p>
                    <p className="text-sm text-amber-600 dark:text-gray-400">Days in a row</p>
                    {userStreak > 0 && (
                      <div className="mt-3 flex justify-center">
                        <CheckCircle className="h-5 w-5 text-green-500 dark:text-[#FFD700]" />
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-black dark:to-gray-900 border-blue-200 dark:border-[#FFD700]/30 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="bg-blue-200 dark:bg-[#FFD700]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-blue-600 dark:text-[#FFD700]" />
                    </div>
                    <h3 className="font-semibold text-blue-800 dark:text-[#FFD700] mb-2">Community</h3>
                    <p className="text-3xl font-bold text-blue-800 dark:text-[#FFD700] mb-1">{stats?.total_attendees || 0}</p>
                    <p className="text-sm text-blue-600 dark:text-gray-400">Today's attendance</p>
                    <div className="mt-3 flex justify-center space-x-1">
                      {[...Array(Math.min(5, Math.floor((stats?.total_attendees || 0) / 5)))].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-blue-500 dark:bg-[#FFD700] rounded-full"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced How It Works Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="shadow-md border-gray-200 dark:border-[#FFD700]/30">
                  <CardHeader className="bg-gradient-to-r from-primary to-primary/80 dark:from-black dark:to-gray-900 text-white dark:text-[#FFD700]">
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 mr-2" />
                      How to Earn Points & Advance Your Career
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 bg-white dark:bg-black">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center p-6 bg-primary/5 dark:bg-gray-900 rounded-xl border border-primary/10 dark:border-[#FFD700]/20 hover:shadow-lg transition-all duration-300">
                        <div className="bg-primary dark:bg-[#FFD700] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-6 w-6 text-white dark:text-black" />
                        </div>
                        <div className="text-2xl font-bold text-primary dark:text-[#FFD700] mb-2">5 Points</div>
                        <p className="text-sm font-medium dark:text-gray-300">Mark as attended</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Daily participation</p>
                      </div>
                      <div className="text-center p-6 bg-primary/5 dark:bg-gray-900 rounded-xl border border-primary/10 dark:border-[#FFD700]/20 hover:shadow-lg transition-all duration-300">
                        <div className="bg-primary dark:bg-[#FFD700] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Trophy className="h-6 w-6 text-white dark:text-black" />
                        </div>
                        <div className="text-2xl font-bold text-primary dark:text-[#FFD700] mb-2">10 Points</div>
                        <p className="text-sm font-medium dark:text-gray-300">Complete daily quiz</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Test your knowledge</p>
                      </div>
                      <div className="text-center p-6 bg-primary/5 dark:bg-gray-900 rounded-xl border border-primary/10 dark:border-[#FFD700]/20 hover:shadow-lg transition-all duration-300">
                        <div className="bg-primary dark:bg-[#FFD700] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Share2 className="h-6 w-6 text-white dark:text-black" />
                        </div>
                        <div className="text-2xl font-bold text-primary dark:text-[#FFD700] mb-2">15 Points</div>
                        <p className="text-sm font-medium dark:text-gray-300">Share on social media</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Spread awareness</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-gray-900 dark:to-black border border-amber-200 dark:border-[#FFD700]/30 rounded-xl p-4">
                      <p className="text-sm text-amber-800 dark:text-[#FFD700] font-medium flex items-center">
                        <Zap className="h-4 w-4 mr-2" />
                        Streak Bonus: Maintain daily attendance for bonus multipliers! 
                        <span className="ml-2 bg-amber-200 dark:bg-[#FFD700]/20 px-2 py-1 rounded text-xs">+50% after 7 days</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Enhanced Sidebar */}
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

              {/* Enhanced Quick Links */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="shadow-md border-gray-200 dark:border-[#FFD700]/30">
                  <CardHeader className="bg-gradient-to-r from-primary to-primary/80 dark:from-black dark:to-gray-900">
                    <CardTitle className="text-white dark:text-[#FFD700] flex items-center">
                      <Rocket className="h-5 w-5 mr-2" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-6 bg-white dark:bg-black">
                    <Link href="/trivia">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-primary/20 dark:border-[#FFD700]/30 text-primary dark:text-[#FFD700] hover:bg-primary/5 dark:hover:bg-[#FFD700]/10 transition-all duration-200"
                      >
                        <Trophy className="h-4 w-4 mr-3" />
                        Daily Trivia Challenge
                        <Badge variant="secondary" className="ml-auto">10 pts</Badge>
                      </Button>
                    </Link>
                    <Link href="/badges">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-primary/20 dark:border-[#FFD700]/30 text-primary dark:text-[#FFD700] hover:bg-primary/5 dark:hover:bg-[#FFD700]/10 transition-all duration-200"
                      >
                        <Star className="h-4 w-4 mr-3" />
                        View Your Badges
                        <Badge variant="secondary" className="ml-auto">Progress</Badge>
                      </Button>
                    </Link>
                    <Link href="/leaderboard">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-primary/20 dark:border-[#FFD700]/30 text-primary dark:text-[#FFD700] hover:bg-primary/5 dark:hover:bg-[#FFD700]/10 transition-all duration-200"
                      >
                        <Users className="h-4 w-4 mr-3" />
                        View Leaderboard
                        <Badge variant="secondary" className="ml-auto">Rank</Badge>
                      </Button>
                    </Link>
                    <Link href="/deputy-launchpad">
                      <Button 
                        variant="default" 
                        className="w-full justify-start bg-primary dark:bg-[#FFD700] hover:bg-primary/90 dark:hover:bg-[#FFD700]/90 text-white dark:text-black transition-all duration-200"
                      >
                        <Shield className="h-4 w-4 mr-3" />
                        Deputy Launchpad
                        <Badge variant="secondary" className="ml-auto bg-white/20 text-white dark:bg-black/20 dark:text-black">New</Badge>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Today's Achievement */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-black dark:to-gray-900 border-green-200 dark:border-[#FFD700]/30">
                  <CardContent className="p-6 text-center">
                    <div className="bg-green-100 dark:bg-[#FFD700]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="h-8 w-8 text-green-600 dark:text-[#FFD700]" />
                    </div>
                    <h3 className="font-semibold text-green-800 dark:text-[#FFD700] mb-2">Today's Goal</h3>
                    <p className="text-sm text-green-600 dark:text-gray-300 mb-4">Complete all daily activities to unlock bonus rewards!</p>
                    <div className="w-full bg-green-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-green-500 dark:bg-[#FFD700] h-3 rounded-full w-2/3 transition-all duration-500"></div>
                    </div>
                    <p className="text-xs text-green-500 dark:text-[#FFD700] mt-2 font-medium">67% Complete</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </AuthRequiredWrapper>
    </PageWrapper>
  );
}

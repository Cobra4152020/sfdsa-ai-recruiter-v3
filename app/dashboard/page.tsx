"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, Star, Clock, Settings, PartyPopper, Gift, TrendingUp, Award, Calendar, MessageCircle, Gamepad2 } from "lucide-react";
import { RecruitDashboard } from "@/components/recruit-dashboard";
import { ApplicationProgressGamification } from "@/components/application-progress-gamification";
import { EarnedBadges } from "@/components/earned-badges";
import { PointsLog } from "@/components/points-log";
import { useUser } from "@/context/user-context";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    achievements: 0,
    nextSteps: 0,
    rank: null as number | null,
    pointsThisMonth: 0,
    badgesEarned: 0,
    totalAvailableBadges: 10,
    daysActive: 0
  });
  const { currentUser, isLoading: isUserLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Fetch user stats
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!currentUser?.id) return;

      try {
        // Fetch user points
        const pointsResponse = await fetch(`/api/user/points?userId=${currentUser.id}`);
        if (pointsResponse.ok) {
          const pointsData = await pointsResponse.json();
          setUserStats(prev => ({
            ...prev,
            totalPoints: pointsData.totalPoints || 0
          }));
        }

        // TODO: Add more API calls for achievements, next steps, rank when available
        // For now, using placeholder values that could be calculated
        setUserStats(prev => ({
          ...prev,
          achievements: Math.floor(prev.totalPoints / 50), // 1 achievement per 50 points
          nextSteps: prev.totalPoints < 100 ? 3 : prev.totalPoints < 500 ? 2 : 1,
        }));

      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    if (currentUser?.id) {
      fetchUserStats();
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser && !isUserLoading) {
      router.push("/login");
      return;
    }

    // Check for welcome parameters (new user flow)
    const welcome = searchParams?.get("welcome");
    const newUser = searchParams?.get("newUser");
    
    if (welcome === "true" && newUser === "true" && currentUser) {
      setShowWelcome(true);
      
      // Show welcome toast
      setTimeout(() => {
        toast({
          title: "🎉 Welcome to Your Dashboard!",
          description: "You've successfully verified your email and earned 50 points! Explore your dashboard and start your deputy sheriff journey.",
          duration: 8000,
        });
      }, 500);

      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete("welcome");
      url.searchParams.delete("newUser");
      window.history.replaceState({}, "", url.toString());
    }

    // Only stop loading when we have user data
    if (!isUserLoading) {
      setIsLoading(false);
    }
  }, [currentUser, isUserLoading, router, searchParams, toast]);

  // Show loading state while checking user or loading data
  if (isLoading || isUserLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-24 mt-4 md:mt-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>

        <Skeleton className="h-96" />
      </main>
    );
  }

  // If no user is found after loading, redirect to login
  if (!currentUser) {
    router.push("/login");
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Your Dashboard!
          </h1>
          <p className="text-muted-foreground mb-6">
            Track your progress and continue your journey to becoming a San
            Francisco Deputy Sheriff.
          </p>
        </div>
        <Button
          onClick={() => router.push("/profile/settings")}
          variant="outline"
          className="mt-4 md:mt-0"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Points
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {userStats.totalPoints.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{userStats.pointsThisMonth} from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center text-foreground">
              <Award className="mr-2 h-4 w-4 text-primary" />
              Badges Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {userStats.badgesEarned}
            </div>
            <p className="text-xs text-muted-foreground">
              {userStats.totalAvailableBadges - userStats.badgesEarned} more
              to unlock
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center text-foreground">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              Days Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {userStats.daysActive}
            </div>
            <p className="text-xs text-muted-foreground">
              Keep up the great work!
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-foreground">
        Quick Actions
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Link href="/roadmap">
            <Trophy className="mr-2 h-4 w-4" />
            View Roadmap
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-primary text-primary">
          <Link href="/badges">
            <Award className="mr-2 h-4 w-4" />
            My Badges
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-primary text-primary">
          <Link href="/chat-with-sgt-ken">
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat with Sgt. Ken
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-primary text-primary">
          <Link href="/games">
            <Gamepad2 className="mr-2 h-4 w-4" />
            Play Games
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="points">Points History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <RecruitDashboard />
        </TabsContent>

        <TabsContent value="progress">
          <ApplicationProgressGamification />
        </TabsContent>

        <TabsContent value="badges">
          <EarnedBadges />
        </TabsContent>

        <TabsContent value="points">
          {currentUser?.id && <PointsLog userId={currentUser.id} />}
        </TabsContent>
      </Tabs>
    </main>
  );
}

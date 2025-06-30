"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/user-context";
import {
  CalendarIcon,
  FileText,
  CheckCircle,
  Clock,
  MessageSquare,
  Bell,
  GamepadIcon,
  Award,
  Trophy,
  Shield,
  Lock,
  AlertCircle,
  CheckSquare,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

interface RecruitDashboardProps {
  className?: string;
}

interface PointsHistoryEntry {
  date: string;
  points: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending";
  dueDate: string;
  priority: "high" | "medium" | "low";
}

interface Appointment {
  id: string;
  title: string;
  date: string;
  location: string;
  status: "scheduled" | "pending" | "completed";
}

interface Document {
  id: string;
  title: string;
  uploadDate: string;
  status: "approved" | "pending" | "rejected";
  type: string;
}

interface Message {
  id: string;
  from: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

interface Notification {
  id: string;
  type: string;
  content: string;
  date: string;
  read: boolean;
}

interface DashboardData {
  applicationProgress: number;
  pointsTotal: number;
  badgeCount: number;
  badgesThisMonth: number;
  nftCount: number;
  pointsHistory: PointsHistoryEntry[];
  tasks: Task[];
  appointments: Appointment[];
  documents: Document[];
  messages: Message[];
  notifications: Notification[];
}

export function RecruitDashboard({ className }: RecruitDashboardProps) {
  const { currentUser, isLoading: isUserLoading } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [messageText, setMessageText] = useState("");
  const [triviaStats, setTriviaStats] = useState<{
    gamesPlayed: number;
    averageScore: number;
    bestScore: string;
    totalPointsEarned: number;
    badgesEarned: { name: string; date: string; description: string }[];
  }>({
    gamesPlayed: 0,
    averageScore: 0,
    bestScore: "0/0",
    totalPointsEarned: 0,
    badgesEarned: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Don't fetch if user is not loaded yet
      if (isUserLoading) return;

      // Don't fetch if no user is logged in
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch real user data instead of mock data
        let actualUserPoints = 0;
        let actualBadges = 0;
        let badgesThisMonth = 0;
        
        try {
          // Get actual points
          const pointsResponse = await fetch(`/api/user/points?userId=${currentUser.id}`);
          if (pointsResponse.ok) {
            const pointsData = await pointsResponse.json();
            actualUserPoints = pointsData.totalPoints || 0;
          }

          // Get actual badges with detailed information for filtering
          const badgesResponse = await fetch(`/api/users/${currentUser.id}/badges`);
          if (badgesResponse.ok) {
            const badgesData = await badgesResponse.json();
            actualBadges = badgesData.badges?.length || 0;
            
            // Count badges earned this month
            if (badgesData.badges && Array.isArray(badgesData.badges)) {
              const currentDate = new Date();
              const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
              
              badgesThisMonth = badgesData.badges.filter((badge: any) => {
                const earnedDate = new Date(badge.earned_at);
                return earnedDate >= startOfMonth;
              }).length;
            }
          }
        } catch (error) {
          console.log("Could not fetch real data, using fallback");
        }

        // Fetch real points history from the database
        let realPointsHistory: PointsHistoryEntry[] = [];
        try {
          const historyResponse = await fetch(`/api/user/points-history?userId=${currentUser.id}`);
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            realPointsHistory = historyData.pointsHistory || [];
            console.log('✅ Real points history loaded:', realPointsHistory.length, 'days');
          } else {
            console.warn('⚠️ Could not fetch real points history, using fallback');
          }
        } catch (historyError) {
          console.warn('⚠️ Error fetching points history:', historyError);
        }

        // If no real history available, create minimal fallback (not fake data)
        if (realPointsHistory.length === 0) {
          // Only show today with actual current points, rest at 0
          const today = new Date().toISOString().split("T")[0];
          realPointsHistory = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - 29 + i);
            const dateStr = date.toISOString().split("T")[0];
            return {
              date: dateStr,
              points: dateStr === today ? actualUserPoints : 0,
            };
          });
        }



        // Get real trivia stats
        let realTriviaStats = {
          gamesPlayed: 0,
          averageScore: 0,
          bestScore: "0/0",
          totalPointsEarned: 0,
          badgesEarned: [],
        };

        try {
          const triviaStatsResponse = await fetch(`/api/user/trivia-stats?userId=${currentUser.id}`);
          if (triviaStatsResponse.ok) {
            const triviaStatsData = await triviaStatsResponse.json();
            if (triviaStatsData.success) {
              realTriviaStats = triviaStatsData.stats;
              console.log('✅ Real trivia stats loaded:', realTriviaStats);
            }
          }
        } catch (error) {
          console.warn('⚠️ Could not fetch real trivia stats:', error);
        }

        // Get real recent activity/notifications
        let realNotifications = [];
        try {
          const activityResponse = await fetch(`/api/user/activity?userId=${currentUser.id}`);
          if (activityResponse.ok) {
            const activityData = await activityResponse.json();
            if (activityData.success) {
              realNotifications = activityData.activities;
              console.log('✅ Real activity loaded:', realNotifications.length, 'activities');
            }
          }
        } catch (error) {
          console.warn('⚠️ Could not fetch real activity:', error);
        }

        // Create real tasks based on user progress
        const realTasks = [
          {
            id: "trivia1",
            title: "Play SF Trivia with Sgt. Ken",
            description: "Test your knowledge about San Francisco and earn points",
            status: realTriviaStats.gamesPlayed > 0 ? "completed" as const : "pending" as const,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            priority: "medium" as const,
          },
          {
            id: "points1",
            title: "Earn Your First 100 Points",
            description: "Accumulate 100 points through various activities",
            status: actualUserPoints >= 100 ? "completed" as const : actualUserPoints > 0 ? "in-progress" as const : "pending" as const,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            priority: "high" as const,
          },
          {
            id: "profile1",
            title: "Complete Your Profile",
            description: "Fill out your profile information to get started",
            status: "completed" as const,
            dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            priority: "high" as const,
          },
        ];

        setDashboardData({
          applicationProgress: actualUserPoints >= 500 ? 100 : Math.floor((actualUserPoints / 500) * 100),
          pointsTotal: actualUserPoints,
          badgeCount: actualBadges,
          badgesThisMonth: badgesThisMonth,
          nftCount: 0,
          pointsHistory: realPointsHistory,
          tasks: realTasks,
          appointments: [], // Will add real appointments API later
          documents: [], // Will add real documents API later  
          messages: [], // Will add real messages API later
          notifications: realNotifications,
        });

        setTriviaStats(realTriviaStats);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(
          "An error occurred while fetching dashboard data. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, isUserLoading]);

  const handleScheduleAppointment = () => {
    if (!selectedDate) {
      toast({
        title: "Please select a date",
        description: "You must select a date to schedule an appointment",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Appointment Requested",
      description: `Your appointment request for ${selectedDate.toLocaleDateString()} has been submitted.`,
    });

    setSelectedDate(undefined);
  };



  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message before sending",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the recruitment team.",
    });

    setMessageText("");
  };

  // Show error state if there's an error
  if (error) {
    return (
      <div className={className}>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Show loading state while user is loading or data is loading
  if (isUserLoading || isLoading) {
    return (
      <div className={className}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Show message if no user is logged in
  if (!currentUser) {
    return (
      <div className={className}>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 mb-4">
            Please log in to view your dashboard
          </p>
          <Button asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary dark:text-[#FFD700]">
            Recruit Dashboard
          </h2>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="background-prep">Background Prep</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="trivia">Trivia Stats</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Application Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.applicationProgress}%
                </div>
                <Progress
                  value={dashboardData?.applicationProgress}
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.pointsTotal.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  +125 this week
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Badges Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.badgeCount}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {dashboardData?.badgesThisMonth} new this month
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  NFT Awards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.nftCount}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Bronze Recruit achieved
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Points History Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Points History</CardTitle>
              <CardDescription>
                Your participation points over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dashboardData?.pointsHistory}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="points"
                      stroke="#0A3C1F"
                      fill="#0A3C1F"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity and Upcoming Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.notifications.map(
                    (notification: Notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start space-x-4"
                      >
                        <div className="bg-primary/10 rounded-full p-2">
                          <Bell className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {notification.type.charAt(0).toUpperCase() +
                              notification.type.slice(1)}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {notification.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.tasks
                    .filter((task: Task) => task.status !== "completed")
                    .slice(0, 3)
                    .map((task: Task) => (
                      <div key={task.id} className="flex items-start space-x-4">
                        <div
                          className={`rounded-full p-2 ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-600"
                              : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                          <div className="flex items-center mt-1">
                            <p className="text-xs text-muted-foreground">
                              Due: {task.dueDate}
                            </p>
                            <Badge
                              variant="outline"
                              className={`ml-2 ${
                                task.status === "in-progress"
                                  ? "bg-blue-50 text-blue-600 border-blue-200"
                                  : "bg-yellow-50 text-yellow-600 border-yellow-200"
                              }`}
                            >
                              {task.status === "in-progress"
                                ? "In Progress"
                                : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Tasks</CardTitle>
              <CardDescription>
                Track your application process tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dashboardData?.tasks.map((task: Task) => (
                  <div
                    key={task.id}
                    className={`p-4 border rounded-lg ${
                      task.status === "completed"
                        ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                        : task.status === "in-progress"
                          ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                          : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`mt-0.5 rounded-full p-1.5 ${
                            task.status === "completed"
                              ? "bg-green-500"
                              : task.status === "in-progress"
                                ? "bg-blue-500"
                                : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        >
                          {task.status === "completed" ? (
                            <CheckCircle className="h-4 w-4 text-white" />
                          ) : (
                            <Clock className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${
                          task.priority === "high"
                            ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                            : task.priority === "medium"
                              ? "bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                              : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        }`}
                      >
                        {task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)}{" "}
                        Priority
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Due: {task.dueDate}
                      </div>
                      <div className="flex space-x-2">
                        {task.status !== "completed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className={
                              task.status === "pending"
                                ? "bg-blue-50 text-blue-600"
                                : ""
                            }
                            onClick={() => {
                              toast({
                                title:
                                  task.status === "pending"
                                    ? "Task Started"
                                    : "Task Completed",
                                description:
                                  task.status === "pending"
                                    ? `You&apos;ve started working on "${task.title}"`
                                    : `You&apos;ve completed "${task.title}"`,
                              });
                            }}
                          >
                            {task.status === "pending"
                              ? "Start Task"
                              : "Mark Complete"}
                          </Button>
                        )}
                        {task.title === "Play SF Trivia with Sgt. Ken" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              window.location.href = "/trivia";
                            }}
                          >
                            <GamepadIcon className="h-4 w-4 mr-2" />
                            Play Now
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Task Details",
                                description: `Viewing details for "${task.title}"`,
                              });
                            }}
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trivia" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trivia Stats Card */}
            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center">
                  <GamepadIcon className="h-5 w-5 mr-2 text-primary" />
                  Your Trivia Statistics
                </CardTitle>
                <CardDescription>
                  Track your progress in the SF Trivia Challenge
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Games Played</p>
                      <p className="text-3xl font-bold text-primary">
                        {triviaStats.gamesPlayed}
                      </p>
                    </div>
                    <div className="bg-[#FFD700]/10 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Best Score</p>
                      <p className="text-3xl font-bold text-primary">
                        {triviaStats.bestScore}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Average Score</p>
                      <p className="text-3xl font-bold text-blue-700">
                        {triviaStats.averageScore}/5
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Points Earned</p>
                      <p className="text-3xl font-bold text-green-700">
                        {triviaStats.totalPointsEarned}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-[#FFD700]" />
                      Trivia Badges Earned
                    </h3>
                    {triviaStats.badgesEarned.length > 0 ? (
                      <div className="space-y-3">
                        {triviaStats.badgesEarned.map((badge, index) => (
                          <div
                            key={index}
                            className="flex items-center p-3 bg-[#FFD700]/10 rounded-lg border border-[#FFD700]/20"
                          >
                            <div className="bg-[#FFD700]/20 p-2 rounded-full mr-3">
                              <Award className="h-5 w-5 text-[#FFD700]" />
                            </div>
                            <div>
                              <p className="font-medium text-primary">
                                {badge.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {badge.description}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Earned on{" "}
                                {new Date(badge.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        You haven&apos;t earned any trivia badges yet. Keep
                        playing to earn badges!
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Play Now Card */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-primary/10 to-[#FFD700]/10">
                <CardTitle>Play SF Trivia with Sgt. Ken</CardTitle>
                <CardDescription>
                  Test your knowledge and earn rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-32 w-32 bg-primary/10 rounded-full flex items-center justify-center">
                    <GamepadIcon className="h-16 w-16 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">
                      Ready to Test Your Knowledge?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Challenge yourself with questions about San Francisco
                      history, landmarks, and Sheriff&apos;s Department facts.
                      Earn points and unlock special badges!
                    </p>

                    <div className="bg-primary/5 p-4 rounded-lg text-left mb-6">
                      <div className="flex items-center mb-2">
                        <Trophy className="h-5 w-5 text-[#FFD700] mr-2" />
                        <h4 className="font-semibold">Rewards for Playing:</h4>
                      </div>
                      <ul className="space-y-1 text-sm pl-7 list-disc">
                        <li>Earn 25-100 points per game based on your score</li>
                        <li>Unlock exclusive badges for consistent playing</li>
                        <li>Improve your position on the leaderboard</li>
                        <li>
                          Learn important facts about SF and the Sheriff&apos;s
                          Department
                        </li>
                      </ul>
                    </div>

                    <Link href="/trivia">
                      <Button className="bg-primary hover:bg-primary/90 w-full">
                        <GamepadIcon className="h-4 w-4 mr-2" />
                        Play Trivia Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-[#FFD700]" />
                Trivia Leaderboard
              </CardTitle>
              <CardDescription>
                See how you rank against other recruits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Rank</th>
                      <th className="text-left pb-2">Name</th>
                      <th className="text-left pb-2">Games</th>
                      <th className="text-left pb-2">Avg. Score</th>
                      <th className="text-left pb-2">Total Points</th>
                      <th className="text-left pb-2">Badges</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-yellow-50">
                      <td className="py-3 font-medium">1</td>
                      <td className="py-3 font-medium">Michael Johnson</td>
                      <td className="py-3">27</td>
                      <td className="py-3">4.7/5</td>
                      <td className="py-3">1,350</td>
                      <td className="py-3">5</td>
                    </tr>
                    <tr className="border-b bg-muted">
                      <td className="py-3 font-medium">2</td>
                      <td className="py-3 font-medium">Sarah Williams</td>
                      <td className="py-3">23</td>
                      <td className="py-3">4.5/5</td>
                      <td className="py-3">1,120</td>
                      <td className="py-3">4</td>
                    </tr>
                    <tr className="border-b bg-orange-50">
                      <td className="py-3 font-medium">3</td>
                      <td className="py-3 font-medium">David Chen</td>
                      <td className="py-3">19</td>
                      <td className="py-3">4.2/5</td>
                      <td className="py-3">950</td>
                      <td className="py-3">3</td>
                    </tr>
                    <tr className="border-b bg-primary/10">
                      <td className="py-3 font-medium">8</td>
                      <td className="py-3 font-medium">You</td>
                      <td className="py-3">{triviaStats.gamesPlayed}</td>
                      <td className="py-3">{triviaStats.averageScore}/5</td>
                      <td className="py-3">{triviaStats.totalPointsEarned}</td>
                      <td className="py-3">
                        {triviaStats.badgesEarned.length}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-medium">9</td>
                      <td className="py-3 font-medium">Emily Rodriguez</td>
                      <td className="py-3">10</td>
                      <td className="py-3">3.7/5</td>
                      <td className="py-3">410</td>
                      <td className="py-3">1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.appointments.map(
                    (appointment: Appointment) => (
                      <div
                        key={appointment.id}
                        className="p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <CalendarIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{appointment.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {appointment.location}
                            </p>
                            <p className="text-sm font-medium mt-1">
                              {new Date(appointment.date).toLocaleString(
                                undefined,
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                },
                              )}
                            </p>
                            <Badge
                              variant="outline"
                              className={`mt-2 ${
                                appointment.status === "scheduled"
                                  ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                                  : "bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                              }`}
                            >
                              {appointment.status === "scheduled"
                                ? "Confirmed"
                                : "Pending"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4 space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Calendar Added",
                                description: `"${appointment.title}" has been added to your calendar.`,
                              });
                            }}
                          >
                            Add to Calendar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Appointment Details",
                                description: `Viewing details for "${appointment.title}"`,
                              });
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule New Appointment</CardTitle>
                <CardDescription>
                  Request a new appointment with the recruitment team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="appointment-type">Appointment Type</Label>
                    <select
                      id="appointment-type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select appointment type</option>
                      <option value="document-review">Document Review</option>
                      <option value="application-assistance">
                        Application Assistance
                      </option>
                      <option value="interview-prep">
                        Interview Preparation
                      </option>
                      <option value="general-inquiry">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <Label>Select Date</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="border rounded-md p-3"
                      disabled={(date) => {
                        // Disable weekends and past dates
                        const day = date.getDay();
                        const isPastDate =
                          date < new Date(new Date().setHours(0, 0, 0, 0));
                        return day === 0 || day === 6 || isPastDate;
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="appointment-time">Preferred Time</Label>
                    <select
                      id="appointment-time"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select time</option>
                      <option value="9:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="appointment-notes">Notes (Optional)</Label>
                    <Textarea
                      id="appointment-notes"
                      placeholder="Add any additional information or questions"
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    onClick={handleScheduleAppointment}
                  >
                    Request Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="background-prep" className="space-y-6">
          {/* Point Gate Check */}
          {(dashboardData?.pointsTotal || 0) < 75 ? (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <Lock className="h-5 w-5" />
                  Background Preparation Guide - Locked
                </CardTitle>
                <CardDescription className="text-amber-700 dark:text-amber-300">
                  Earn {75 - (dashboardData?.pointsTotal || 0)} more points to unlock this valuable preparation guide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2">
                      <div 
                        className="bg-amber-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min(((dashboardData?.pointsTotal || 0) / 75) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      {dashboardData?.pointsTotal || 0}/75
                    </span>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    🎯 <strong>Why unlock this?</strong> Get ahead of the competition by preparing your background investigation documents early. The more prepared you are, the faster you can get hired!
                  </p>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-sm mb-3 flex items-center">
                      <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                      How to Earn Points Quickly
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li className="flex items-center">
                        <GamepadIcon className="h-3 w-3 mr-2 text-blue-500" />
                        Play SF Trivia games (up to 100 points per perfect game)
                      </li>
                      <li className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-2 text-green-500" />
                        Attend Sgt. Ken's daily briefings (10 points each)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-2 text-purple-500" />
                        Complete recruitment tasks and activities
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Link href="/trivia" className="flex-1">
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                      >
                        <GamepadIcon className="h-4 w-4 mr-2" />
                        Play Trivia to Earn Points
                      </Button>
                    </Link>
                    <Link href="/daily-briefing">
                      <Button 
                        variant="outline" 
                        className="border-primary text-primary hover:bg-primary/10"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Daily Briefing
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Unlocked Header */}
              <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <CheckSquare className="h-5 w-5" />
                    Background Preparation Guide - Unlocked!
                  </CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-300">
                    🎉 Congratulations! You've earned access to the complete background investigation preparation guide.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/background-preparation" className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Access Complete Background Prep Guide
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="border-green-600 text-green-700 hover:bg-green-50"
                      onClick={() => {
                        toast({
                          title: "Feature Coming Soon",
                          description: "Document tracking will be available in the full guide.",
                        });
                      }}
                    >
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Track Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Preview of What's Available */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Complete Document Checklist
                    </CardTitle>
                    <CardDescription>
                      Your guide includes all required documents with detailed instructions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
                        <Shield className="h-5 w-5 text-red-600" />
                        <div>
                          <h4 className="font-medium text-sm text-red-800 dark:text-red-300">Identity Documents</h4>
                          <p className="text-xs text-red-600 dark:text-red-400">Birth certificate, driver's license, SSN card, passport</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-sm text-blue-800 dark:text-blue-300">Education Records</h4>
                          <p className="text-xs text-blue-600 dark:text-blue-400">High school & college transcripts (sealed)</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                        <Trophy className="h-5 w-5 text-green-600" />
                        <div>
                          <h4 className="font-medium text-sm text-green-800 dark:text-green-300">Employment History</h4>
                          <p className="text-xs text-green-600 dark:text-green-400">10-year verification forms & references</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
                        <AlertCircle className="h-5 w-5 text-purple-600" />
                        <div>
                          <h4 className="font-medium text-sm text-purple-800 dark:text-purple-300">Plus Much More</h4>
                          <p className="text-xs text-purple-600 dark:text-purple-400">Military records, financial forms, references</p>
                        </div>
                      </div>
                    </div>
                    
                    <Link href="/background-preparation">
                      <Button variant="outline" className="w-full mt-4 border-primary text-primary hover:bg-primary/10">
                        View Complete Checklist
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      What Makes This Guide Special
                    </CardTitle>
                    <CardDescription>
                      Advanced features to help you succeed in the background investigation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-2">
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Progress Tracking</h4>
                          <p className="text-xs text-muted-foreground">Check off completed documents and track your progress toward readiness</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-2">
                          <ExternalLink className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Direct Links & Contacts</h4>
                          <p className="text-xs text-muted-foreground">Official websites and phone numbers for each document source</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full p-2">
                          <Clock className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Time & Cost Estimates</h4>
                          <p className="text-xs text-muted-foreground">Know exactly how long each document takes and what it costs</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-amber-100 dark:bg-amber-900/20 rounded-full p-2">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Pro Tips & Warnings</h4>
                          <p className="text-xs text-muted-foreground">Insider advice to avoid common pitfalls and delays</p>
                        </div>
                      </div>
                    </div>
                    
                    <Link href="/background-preparation">
                      <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Start Background Preparation
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>


            </div>
          )}
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Messages</CardTitle>
                <CardDescription>
                  Communication with the recruitment team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.messages.map((message: Message) => (
                    <div
                      key={message.id}
                      className={`p-4 border rounded-lg ${
                        message.read
                          ? "bg-white dark:bg-gray-800"
                          : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-primary/10 rounded-full p-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{message.subject}</h4>
                            {!message.read && (
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-600 border-blue-200"
                              >
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            From: {message.from}
                          </p>
                          <p className="text-sm mt-2">{message.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(message.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Message Marked as Read",
                              description: `"${message.subject}" has been marked as read.`,
                            });
                          }}
                        >
                          {message.read ? "Mark as Unread" : "Mark as Read"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Reply Sent",
                              description: `Your reply to "${message.subject}" has been sent.`,
                            });
                          }}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Send Message</CardTitle>
                <CardDescription>Contact the recruitment team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="message-recipient">Recipient</Label>
                    <select
                      id="message-recipient"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select recipient</option>
                      <option value="recruitment-team">Recruitment Team</option>
                      <option value="background-unit">
                        Background Investigation Unit
                      </option>
                      <option value="training-division">
                        Training Division
                      </option>
                      <option value="hr-department">HR Department</option>
                      <option value="sgt-ken">
                        Sgt. Ken (Trivia Game Admin)
                      </option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message-subject">Subject</Label>
                    <Input
                      id="message-subject"
                      placeholder="Enter message subject"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message-content">Message</Label>
                    <Textarea
                      id="message-content"
                      placeholder="Type your message here"
                      className="min-h-[150px]"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message-attachment">
                      Attachment (Optional)
                    </Label>
                    <Input id="message-attachment" type="file" />
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    onClick={handleSendMessage}
                  >
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

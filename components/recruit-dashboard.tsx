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
  Upload,
  MessageSquare,
  Bell,
  GamepadIcon,
  Award,
  Trophy,
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
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
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
        
        try {
          // Get actual points
          const pointsResponse = await fetch(`/api/user/points?userId=${currentUser.id}`);
          if (pointsResponse.ok) {
            const pointsData = await pointsResponse.json();
            actualUserPoints = pointsData.totalPoints || 0;
          }

          // Get actual badges
          const badgesResponse = await fetch(`/api/users/${currentUser.id}/badges`);
          if (badgesResponse.ok) {
            const badgesData = await badgesResponse.json();
            actualBadges = badgesData.badges?.length || 0;
          }
        } catch (error) {
          console.log("Could not fetch real data, using fallback");
        }

        // Create realistic points history based on actual total
        const mockPointsHistory = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - 29 + i);
          // Distribute points more realistically
          const basePoints = actualUserPoints > 0 ? Math.floor(actualUserPoints / 30) : 10;
          const variation = Math.floor(Math.random() * 20) - 10;
          return {
            date: date.toISOString().split("T")[0],
            points: Math.max(0, basePoints + variation),
          };
        });

        const mockTasks: Task[] = [
          {
            id: "task1",
            title: "Complete application form",
            description: "Fill out the online application form",
            status: "completed" as const,
            dueDate: "2023-05-15",
            priority: "high" as const,
          },
          {
            id: "task2",
            title: "Submit required documents",
            description:
              "Upload your ID, education certificates, and references",
            status: "in-progress" as const,
            dueDate: "2023-05-20",
            priority: "high" as const,
          },
          {
            id: "task3",
            title: "Schedule written exam",
            description: "Book your slot for the written examination",
            status: "pending" as const,
            dueDate: "2023-05-25",
            priority: "medium" as const,
          },
          {
            id: "task4",
            title: "Prepare for physical fitness test",
            description:
              "Review requirements and practice for the physical fitness assessment",
            status: "pending" as const,
            dueDate: "2023-06-10",
            priority: "medium" as const,
          },
          {
            id: "task5",
            title: "Background check forms",
            description:
              "Complete and submit background check authorization forms",
            status: "pending" as const,
            dueDate: "2023-06-15",
            priority: "high" as const,
          },
          {
            id: "task6",
            title: "Play SF Trivia with Sgt. Ken",
            description:
              "Play the trivia game to learn more about San Francisco and earn points",
            status: "in-progress" as const,
            dueDate: "2023-05-30",
            priority: "medium" as const,
          },
        ];

        const mockAppointments: Appointment[] = [
          {
            id: "apt1",
            title: "Written Exam",
            date: "2023-05-28T10:00:00",
            location: "SF Sheriff&apos;s Office - 1 Dr Carlton B Goodlett Pl",
            status: "scheduled" as const,
          },
          {
            id: "apt2",
            title: "Physical Fitness Test",
            date: "2023-06-15T09:00:00",
            location: "SF Sheriff&apos;s Training Facility",
            status: "pending" as const,
          },
          {
            id: "apt3",
            title: "Oral Interview",
            date: "2023-06-30T13:00:00",
            location: "SF Sheriff&apos;s Office - 1 Dr Carlton B Goodlett Pl",
            status: "pending" as const,
          },
        ];

        const mockDocuments: Document[] = [
          {
            id: "doc1",
            title: "Application Form",
            uploadDate: "2023-05-10T14:30:00",
            status: "approved" as const,
            type: "application",
          },
          {
            id: "doc2",
            title: "Driver&apos;s License",
            uploadDate: "2023-05-10T14:35:00",
            status: "approved" as const,
            type: "identification",
          },
          {
            id: "doc3",
            title: "College Transcript",
            uploadDate: "2023-05-10T14:40:00",
            status: "pending" as const,
            type: "education",
          },
        ];

        const mockMessages = [
          {
            id: "msg1",
            from: "Recruitment Team",
            subject: "Application Received",
            content:
              "Thank you for submitting your application. We have received it and will begin processing shortly.",
            date: "2023-05-11T09:15:00",
            read: true,
          },
          {
            id: "msg2",
            from: "Sgt. Williams",
            subject: "Document Verification",
            content:
              "Your identification documents have been verified. Please ensure you upload your education certificates as soon as possible.",
            date: "2023-05-12T14:20:00",
            read: true,
          },
          {
            id: "msg3",
            from: "Training Division",
            subject: "Preparation Resources",
            content:
              "To help you prepare for the upcoming written exam, we&apos;ve attached some study materials and practice tests.",
            date: "2023-05-15T11:30:00",
            read: false,
          },
          {
            id: "msg4",
            from: "Sgt. Ken",
            subject: "SF Trivia Game Updates",
            content:
              "New trivia questions have been added to the SF Trivia Game! Play now to earn more points and badges.",
            date: "2023-05-16T10:45:00",
            read: false,
          },
        ];

        const mockNotifications = [
          {
            id: "notif1",
            type: "document",
            content:
              "Your Driver&apos;s License has been verified and approved.",
            date: "2023-05-12T14:25:00",
            read: false,
          },
          {
            id: "notif2",
            type: "appointment",
            content: "Your Written Exam is scheduled for May 28th at 10:00 AM.",
            date: "2023-05-20T09:00:00",
            read: false,
          },
          {
            id: "notif3",
            type: "message",
            content: "You have a new message from the Training Division.",
            date: "2023-05-15T11:35:00",
            read: false,
          },
          {
            id: "notif4",
            type: "badge",
            content:
              "Congratulations! You&apos;ve earned the 'Trivia Enthusiast' badge.",
            date: "2023-05-14T15:20:00",
            read: false,
          },
          {
            id: "notif5",
            type: "points",
            content:
              "You&apos;ve reached 1,000 points! Keep up the great work.",
            date: "2023-05-13T16:45:00",
            read: false,
          },
        ];

        // Mock trivia data
        const mockTriviaStats = {
          gamesPlayed: 12,
          averageScore: 3.8,
          bestScore: "5/5",
          totalPointsEarned: 475,
          badgesEarned: [
            {
              name: "Trivia Participant",
              date: "2023-05-01",
              description: "Completed your first trivia game",
            },
            {
              name: "Trivia Enthusiast",
              date: "2023-05-10",
              description: "Played 10 trivia games",
            },
          ],
        };

        setDashboardData({
          applicationProgress: actualUserPoints >= 500 ? 100 : Math.floor((actualUserPoints / 500) * 100),
          pointsTotal: actualUserPoints,
          badgeCount: actualBadges,
          nftCount: 0,
          pointsHistory: mockPointsHistory,
          tasks: mockTasks,
          appointments: mockAppointments,
          documents: mockDocuments,
          messages: mockMessages,
          notifications: mockNotifications,
        });

        setTriviaStats(mockTriviaStats);
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

  const handleUploadDocument = () => {
    if (!documentTitle || !documentFile) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and a file",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Document Uploaded",
      description: `Your document "${documentTitle}" has been uploaded successfully.`,
    });

    setDocumentTitle("");
    setDocumentFile(null);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3C1F]"></div>
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
          <h2 className="text-2xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">
            Recruit Dashboard
          </h2>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
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
                  2 new this month
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
                        <div className="bg-[#0A3C1F]/10 rounded-full p-2">
                          <Bell className="h-4 w-4 text-[#0A3C1F]" />
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
              <CardHeader className="bg-[#0A3C1F]/5">
                <CardTitle className="flex items-center">
                  <GamepadIcon className="h-5 w-5 mr-2 text-[#0A3C1F]" />
                  Your Trivia Statistics
                </CardTitle>
                <CardDescription>
                  Track your progress in the SF Trivia Challenge
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0A3C1F]/10 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Games Played</p>
                      <p className="text-3xl font-bold text-[#0A3C1F]">
                        {triviaStats.gamesPlayed}
                      </p>
                    </div>
                    <div className="bg-[#FFD700]/10 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Best Score</p>
                      <p className="text-3xl font-bold text-[#0A3C1F]">
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
                              <p className="font-medium text-[#0A3C1F]">
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
              <CardHeader className="bg-gradient-to-r from-[#0A3C1F]/10 to-[#FFD700]/10">
                <CardTitle>Play SF Trivia with Sgt. Ken</CardTitle>
                <CardDescription>
                  Test your knowledge and earn rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-32 w-32 bg-[#0A3C1F]/10 rounded-full flex items-center justify-center">
                    <GamepadIcon className="h-16 w-16 text-[#0A3C1F]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0A3C1F] mb-2">
                      Ready to Test Your Knowledge?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Challenge yourself with questions about San Francisco
                      history, landmarks, and Sheriff&apos;s Department facts.
                      Earn points and unlock special badges!
                    </p>

                    <div className="bg-[#0A3C1F]/5 p-4 rounded-lg text-left mb-6">
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
                      <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 w-full">
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
                    <tr className="border-b bg-gray-50">
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
                    <tr className="border-b bg-[#0A3C1F]/10">
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
                          <div className="bg-[#0A3C1F]/10 rounded-full p-2">
                            <CalendarIcon className="h-4 w-4 text-[#0A3C1F]" />
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
                    className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
                    onClick={handleScheduleAppointment}
                  >
                    Request Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Documents</CardTitle>
                <CardDescription>
                  Uploaded documents and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.documents.map((document: Document) => (
                    <div
                      key={document.id}
                      className="p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-[#0A3C1F]/10 rounded-full p-2">
                          <FileText className="h-4 w-4 text-[#0A3C1F]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{document.title}</h4>
                            <Badge
                              variant="outline"
                              className={`${
                                document.status === "approved"
                                  ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                                  : document.status === "rejected"
                                    ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                                    : "bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                              }`}
                            >
                              {document.status.charAt(0).toUpperCase() +
                                document.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Type:{" "}
                            {document.type.charAt(0).toUpperCase() +
                              document.type.slice(1)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded:{" "}
                            {new Date(document.uploadDate).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Document Downloaded",
                              description: `"${document.title}" has been downloaded.`,
                            });
                          }}
                        >
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Document Details",
                              description: `Viewing details for "${document.title}"`,
                            });
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload New Document</CardTitle>
                <CardDescription>
                  Submit required documents for your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="document-title">Document Title</Label>
                    <Input
                      id="document-title"
                      placeholder="Enter document title"
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="document-type">Document Type</Label>
                    <select
                      id="document-type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select document type</option>
                      <option value="identification">Identification</option>
                      <option value="education">Education</option>
                      <option value="employment">Employment History</option>
                      <option value="reference">Reference</option>
                      <option value="certification">Certification</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="document-file">Upload File</Label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-gray-300 dark:border-gray-600">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-[#0A3C1F] hover:text-[#0A3C1F]/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#0A3C1F]"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={(e) =>
                                setDocumentFile(e.target.files?.[0] || null)
                              }
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, PNG, JPG, GIF up to 10MB
                        </p>
                        {documentFile && (
                          <p className="text-sm text-[#0A3C1F] font-medium mt-2">
                            {documentFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="document-notes">Notes (Optional)</Label>
                    <Textarea
                      id="document-notes"
                      placeholder="Add any additional information about this document"
                      className="min-h-[80px]"
                    />
                  </div>

                  <Button
                    className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
                    onClick={handleUploadDocument}
                  >
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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
                        <div className="bg-[#0A3C1F]/10 rounded-full p-2">
                          <MessageSquare className="h-4 w-4 text-[#0A3C1F]" />
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
                    className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
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

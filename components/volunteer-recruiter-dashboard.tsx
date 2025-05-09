"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/context/user-context"
import {
  Users,
  UserPlus,
  Award,
  Trophy,
  Share2,
  Mail,
  Calendar,
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
  Copy,
  FileText,
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface VolunteerRecruiterDashboardProps {
  className?: string
}

export function VolunteerRecruiterDashboard({ className }: VolunteerRecruiterDashboardProps) {
  const { currentUser } = useUser()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [referralCode, setReferralCode] = useState(
    "SFSHERIFF-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
  )
  const [referralMessage, setReferralMessage] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // In a real implementation, this would be an API call
        // For now, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockReferrals = [
          {
            id: "ref1",
            name: "John Smith",
            email: "john.smith@example.com",
            status: "applied",
            date: "2023-05-10T14:30:00",
            progress: 25,
            points: 50,
          },
          {
            id: "ref2",
            name: "Maria Rodriguez",
            email: "maria.rodriguez@example.com",
            status: "interview",
            date: "2023-05-08T10:15:00",
            progress: 60,
            points: 100,
          },
          {
            id: "ref3",
            name: "David Chen",
            email: "david.chen@example.com",
            status: "background",
            date: "2023-05-05T09:45:00",
            progress: 75,
            points: 150,
          },
          {
            id: "ref4",
            name: "Sarah Johnson",
            email: "sarah.johnson@example.com",
            status: "pending",
            date: "2023-05-03T16:20:00",
            progress: 10,
            points: 25,
          },
          {
            id: "ref5",
            name: "Michael Brown",
            email: "michael.brown@example.com",
            status: "hired",
            date: "2023-04-28T11:10:00",
            progress: 100,
            points: 500,
          },
        ]

        const mockPointsHistory = Array.from({ length: 30 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - 29 + i)
          return {
            date: date.toISOString().split("T")[0],
            points: Math.floor(Math.random() * 100) + 50,
          }
        })

        const mockBadges = [
          {
            id: "badge1",
            name: "Recruitment Starter",
            description: "Made your first successful referral",
            progress: 100,
            earned: true,
            image: "/document-icon.png",
          },
          {
            id: "badge2",
            name: "Recruitment Pro",
            description: "Successfully referred 5 candidates",
            progress: 60,
            earned: false,
            image: "/fitness-icon.png",
          },
          {
            id: "badge3",
            name: "Diversity Champion",
            description: "Referred candidates from diverse backgrounds",
            progress: 75,
            earned: false,
            image: "/psychology-icon.png",
          },
          {
            id: "badge4",
            name: "Social Media Maven",
            description: "Shared recruitment content 10 times on social media",
            progress: 40,
            earned: false,
            image: "/chat-icon.png",
          },
        ]

        const mockNFTs = [
          {
            id: "nft1",
            name: "Bronze Recruiter",
            description: "Awarded for 3 successful referrals",
            progress: 66,
            threshold: 3,
            current: 2,
            image: "/generic-badge.png",
          },
          {
            id: "nft2",
            name: "Silver Recruiter",
            description: "Awarded for 10 successful referrals",
            progress: 20,
            threshold: 10,
            current: 2,
            image: "/generic-badge.png",
          },
          {
            id: "nft3",
            name: "Gold Recruiter",
            description: "Awarded for 25 successful referrals",
            progress: 8,
            threshold: 25,
            current: 2,
            image: "/generic-badge.png",
          },
        ]

        const mockEvents = [
          {
            id: "event1",
            title: "Virtual Recruitment Info Session",
            date: "2023-06-15T18:00:00",
            location: "Zoom",
            description: "Present information about the Sheriff's Department to potential recruits",
            status: "upcoming",
          },
          {
            id: "event2",
            title: "Community Job Fair",
            date: "2023-06-22T10:00:00",
            location: "Mission District Community Center",
            description: "Staff a booth at the community job fair to attract potential recruits",
            status: "upcoming",
          },
          {
            id: "event3",
            title: "College Campus Visit",
            date: "2023-07-05T13:00:00",
            location: "City College of San Francisco",
            description: "Speak to criminal justice students about career opportunities",
            status: "upcoming",
          },
        ]

        const mockReferralStats = {
          totalReferrals: 12,
          pendingReferrals: 4,
          activeReferrals: 5,
          successfulReferrals: 3,
          conversionRate: 25,
          totalPoints: 825,
          badgesEarned: 1,
          nftsEarned: 0,
        }

        setDashboardData({
          referrals: mockReferrals,
          pointsHistory: mockPointsHistory,
          badges: mockBadges,
          nfts: mockNFTs,
          events: mockEvents,
          stats: mockReferralStats,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
    toast({
      title: "Referral code copied!",
      description: "The referral code has been copied to your clipboard.",
      duration: 3000,
    })
  }

  const handleSendReferral = () => {
    if (!referralMessage.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message to send with your referral.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Referral sent!",
      description: "Your referral invitation has been sent successfully.",
      duration: 3000,
    })

    setReferralMessage("")
  }

  if (isLoading) {
    return (
      <div className={className}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3C1F]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">Volunteer Recruiter Dashboard</h2>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.stats.totalReferrals}</div>
                <div className="text-xs text-muted-foreground mt-1">+2 this month</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Successful Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.stats.successfulReferrals}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Conversion: {dashboardData.stats.conversionRate}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.stats.totalPoints}</div>
                <div className="text-xs text-muted-foreground mt-1">+125 this week</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rewards Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.stats.badgesEarned} Badges</div>
                <div className="text-xs text-muted-foreground mt-1">{dashboardData.stats.nftsEarned} NFTs</div>
              </CardContent>
            </Card>
          </div>

          {/* Points History Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Points History</CardTitle>
              <CardDescription>Your recruitment points over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dashboardData.pointsHistory}
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
                    <Area type="monotone" dataKey="points" stroke="#0A3C1F" fill="#0A3C1F" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Referral Code and Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Code</CardTitle>
                <CardDescription>Share this code with potential recruits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-[#0A3C1F]/5 p-4 rounded-lg flex items-center justify-between mb-4">
                  <code className="text-lg font-mono font-bold text-[#0A3C1F]">{referralCode}</code>
                  <Button variant="outline" size="sm" onClick={handleCopyReferralCode}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="referral-message">Referral Message</Label>
                    <Textarea
                      id="referral-message"
                      placeholder="Enter a personal message to send with your referral"
                      className="min-h-[100px] mt-1"
                      value={referralMessage}
                      onChange={(e) => setReferralMessage(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Input placeholder="Enter email address" type="email" />
                    <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white" onClick={handleSendReferral}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share on Facebook
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share on Twitter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 rounded-full p-2">
                      <UserPlus className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">New Referral</h4>
                      <p className="text-sm text-muted-foreground">Sarah Johnson has been referred</p>
                      <p className="text-xs text-muted-foreground mt-1">Today at 4:20 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 rounded-full p-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Referral Progress</h4>
                      <p className="text-sm text-muted-foreground">Maria Rodriguez completed her interview</p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday at 2:15 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 rounded-full p-2">
                      <Award className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Badge Earned</h4>
                      <p className="text-sm text-muted-foreground">You earned the "Recruitment Starter" badge</p>
                      <p className="text-xs text-muted-foreground mt-1">May 15, 2023 at 10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-yellow-100 rounded-full p-2">
                      <Calendar className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Upcoming Event</h4>
                      <p className="text-sm text-muted-foreground">Virtual Recruitment Info Session on June 15</p>
                      <p className="text-xs text-muted-foreground mt-1">2 weeks from now</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Referrals</CardTitle>
              <CardDescription>Track the progress of your referred candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dashboardData.referrals.map((referral: any) => (
                  <div
                    key={referral.id}
                    className="p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{referral.name}</h4>
                        <div className="text-sm text-muted-foreground">{referral.email}</div>
                        <div className="text-xs text-muted-foreground">
                          Referred on {new Date(referral.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <Badge
                          variant="outline"
                          className={`${
                            referral.status === "hired"
                              ? "bg-green-50 text-green-600 border-green-200"
                              : referral.status === "background"
                                ? "bg-blue-50 text-blue-600 border-blue-200"
                                : referral.status === "interview"
                                  ? "bg-purple-50 text-purple-600 border-purple-200"
                                  : referral.status === "applied"
                                    ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                                    : "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                        >
                          {referral.status === "hired"
                            ? "Hired"
                            : referral.status === "background"
                              ? "Background Check"
                              : referral.status === "interview"
                                ? "Interview Stage"
                                : referral.status === "applied"
                                  ? "Applied"
                                  : "Pending"}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Application Progress</span>
                        <span>{referral.progress}%</span>
                      </div>
                      <Progress value={referral.progress} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm">
                        <span className="font-medium">Points earned:</span>{" "}
                        <span className="text-[#0A3C1F] font-bold">{referral.points}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button variant="outline" size="sm">
                          <ChevronRight className="h-4 w-4" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Referral Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Pending", value: dashboardData.stats.pendingReferrals, fill: "#9CA3AF" },
                        { name: "Active", value: dashboardData.stats.activeReferrals, fill: "#3B82F6" },
                        { name: "Successful", value: dashboardData.stats.successfulReferrals, fill: "#10B981" },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" name="Referrals" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{dashboardData.stats.conversionRate}%</div>
                    <div className="text-sm text-muted-foreground">Conversion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{dashboardData.stats.totalPoints}</div>
                    <div className="text-sm text-muted-foreground">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {Math.round(dashboardData.stats.totalPoints / dashboardData.stats.totalReferrals)}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg. Points/Referral</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Make a New Referral</CardTitle>
                <CardDescription>Refer someone to join the San Francisco Sheriff's Department</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="referral-name">Candidate Name</Label>
                    <Input id="referral-name" placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referral-email">Candidate Email</Label>
                    <Input id="referral-email" type="email" placeholder="Enter email address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referral-phone">Candidate Phone (Optional)</Label>
                    <Input id="referral-phone" type="tel" placeholder="Enter phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referral-notes">Notes (Optional)</Label>
                    <Textarea
                      id="referral-notes"
                      placeholder="Add any additional information about the candidate"
                      className="min-h-[80px]"
                    />
                  </div>
                  <Button
                    className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
                    onClick={(e) => {
                      e.preventDefault()
                      toast({
                        title: "Referral submitted!",
                        description: "Your referral has been submitted successfully.",
                      })
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Submit Referral
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Badges Progress</CardTitle>
                <CardDescription>Track your progress towards earning badges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dashboardData.badges.map((badge: any) => (
                    <div key={badge.id} className="flex items-start space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center">
                          <img src={badge.image || "/placeholder.svg"} alt={badge.name} className="w-8 h-8" />
                        </div>
                        {badge.earned && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-medium">{badge.name}</h4>
                          {badge.earned && (
                            <Badge className="ml-2 bg-green-50 text-green-600 border-green-200">Earned</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{badge.progress}%</span>
                          </div>
                          <Progress value={badge.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>NFT Awards Progress</CardTitle>
                <CardDescription>Track your progress towards earning exclusive NFTs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dashboardData.nfts.map((nft: any) => (
                    <div key={nft.id} className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center">
                        <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{nft.name}</h4>
                        <p className="text-sm text-muted-foreground">{nft.description}</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>
                              Progress: {nft.current} of {nft.threshold} referrals
                            </span>
                            <span>{nft.progress}%</span>
                          </div>
                          <Progress value={nft.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-[#0A3C1F]/5 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-[#0A3C1F]" />
                    About NFT Awards
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    NFT Awards are unique digital collectibles that recognize your contributions to the recruitment
                    program. These blockchain-based tokens are yours to keep forever and can be displayed on your
                    profile.
                  </p>
                  <Button
                    variant="link"
                    className="text-[#0A3C1F] p-0 h-auto mt-2"
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "The NFT showcase feature will be available soon!",
                      })
                    }}
                  >
                    Learn more about NFTs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Points Breakdown</CardTitle>
              <CardDescription>How you've earned your recruitment points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#0A3C1F]/5 rounded-lg">
                  <div className="flex items-center">
                    <UserPlus className="h-5 w-5 mr-3 text-[#0A3C1F]" />
                    <div>
                      <h4 className="font-medium">Successful Referrals</h4>
                      <p className="text-sm text-muted-foreground">Points earned when your referrals are hired</p>
                    </div>
                  </div>
                  <div className="text-xl font-bold">500</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0A3C1F]/5 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3 text-[#0A3C1F]" />
                    <div>
                      <h4 className="font-medium">Active Referrals</h4>
                      <p className="text-sm text-muted-foreground">Points earned for referrals in the hiring process</p>
                    </div>
                  </div>
                  <div className="text-xl font-bold">250</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0A3C1F]/5 rounded-lg">
                  <div className="flex items-center">
                    <Share2 className="h-5 w-5 mr-3 text-[#0A3C1F]" />
                    <div>
                      <h4 className="font-medium">Social Sharing</h4>
                      <p className="text-sm text-muted-foreground">Points earned for sharing recruitment content</p>
                    </div>
                  </div>
                  <div className="text-xl font-bold">75</div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-4">How to Earn More Points</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 mr-2 text-[#0A3C1F]" />
                      <h4 className="font-medium">Refer Quality Candidates</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Earn 25 points when they apply, 50 points when they interview, and 150 points when hired.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 mr-2 text-[#0A3C1F]" />
                      <h4 className="font-medium">Share on Social Media</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Earn 5 points each time you share recruitment content on your social media platforms.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 mr-2 text-[#0A3C1F]" />
                      <h4 className="font-medium">Attend Recruitment Events</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Earn 25 points for each recruitment event you attend or help organize.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 mr-2 text-[#0A3C1F]" />
                      <h4 className="font-medium">Provide Testimonials</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Earn 20 points by providing a testimonial about your experience with the Sheriff's Department.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Recruitment Events</CardTitle>
              <CardDescription>Events where you can help recruit new deputies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dashboardData.events.map((event: any) => (
                  <div
                    key={event.id}
                    className="p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-[#0A3C1F]/10 rounded-full p-3 mt-1">
                        <Calendar className="h-5 w-5 text-[#0A3C1F]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <h4 className="font-medium text-lg">{event.title}</h4>
                          <Badge
                            variant="outline"
                            className="mt-1 sm:mt-0 bg-blue-50 text-blue-600 border-blue-200 self-start"
                          >
                            {event.status === "upcoming" ? "Upcoming" : event.status}
                          </Badge>
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              {new Date(event.date).toLocaleDateString()} at{" "}
                              {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">{event.description}</p>
                        <div className="mt-4 flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#0A3C1F] text-[#0A3C1F]"
                            onClick={() => {
                              toast({
                                title: "RSVP Confirmed",
                                description: `You've confirmed your attendance for ${event.title}.`,
                              })
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            RSVP
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Added to Calendar",
                                description: `${event.title} has been added to your calendar.`,
                              })
                            }}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Add to Calendar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Event Shared",
                                description: "Event details have been copied to your clipboard.",
                              })
                            }}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Suggest an Event</CardTitle>
                <CardDescription>Propose a recruitment event in your community</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input id="event-title" placeholder="Enter event title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-location">Location</Label>
                    <Input id="event-location" placeholder="Enter event location" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Date</Label>
                      <Input id="event-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-time">Time</Label>
                      <Input id="event-time" type="time" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-description">Description</Label>
                    <Textarea
                      id="event-description"
                      placeholder="Describe the event and its recruitment potential"
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button
                    className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
                    onClick={(e) => {
                      e.preventDefault()
                      toast({
                        title: "Event Suggested",
                        description: "Your event suggestion has been submitted for review.",
                      })
                    }}
                  >
                    Submit Event Suggestion
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Resources</CardTitle>
                <CardDescription>Materials to help you succeed at recruitment events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-[#0A3C1F]" />
                      <div>
                        <h4 className="font-medium">Recruitment Talking Points</h4>
                        <p className="text-sm text-muted-foreground">
                          Key information to share with potential recruits
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                  <div className="p-3 border rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-[#0A3C1F]" />
                      <div>
                        <h4 className="font-medium">Recruitment Flyer Templates</h4>
                        <p className="text-sm text-muted-foreground">Printable materials for events</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                  <div className="p-3 border rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-[#0A3C1F]" />
                      <div>
                        <h4 className="font-medium">Frequently Asked Questions</h4>
                        <p className="text-sm text-muted-foreground">
                          Answers to common questions from potential recruits
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                  <div className="p-3 border rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-[#0A3C1F]" />
                      <div>
                        <h4 className="font-medium">Event Best Practices Guide</h4>
                        <p className="text-sm text-muted-foreground">Tips for successful recruitment events</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-3">Need Additional Resources?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Contact the recruitment team if you need specific materials for an upcoming event.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Contact Form",
                        description: "The contact form will be available soon.",
                      })
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Recruitment Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

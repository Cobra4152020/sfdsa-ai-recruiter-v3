"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Award,
  Lock,
  Star,
  Zap,
  MessageSquare,
  FileText,
  Download,
  Clock,
  CheckCircle,
  Users,
  Gift,
  Share2,
} from "lucide-react";
import { AchievementBadge } from "@/components/achievement-badge";
import { Progress } from "@/components/ui/progress";
import { NFT_AWARD_TIERS } from "@/lib/nft-utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import type { BadgeType } from "@/types/badge";

export default function GamificationExplainer() {
  const [activeTab, setActiveTab] = useState("points");
  const [showShareDialog, setShowShareDialog] = useState(false);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0A3C1F] mb-2">
            Recruitment Gamification System
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our recruitment platform uses gamification to make your journey to
            becoming a San Francisco Deputy Sheriff more engaging and rewarding.
            Learn how it all works below.
          </p>
        </div>

        <Tabs
          defaultValue="points"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-6 mb-8">
            <TabsTrigger value="points" className="text-sm sm:text-base">
              <Trophy className="h-4 w-4 mr-2 hidden sm:inline" /> Points System
            </TabsTrigger>
            <TabsTrigger value="badges" className="text-sm sm:text-base">
              <Award className="h-4 w-4 mr-2 hidden sm:inline" /> Badges
            </TabsTrigger>
            <TabsTrigger value="referrals" className="text-sm sm:text-base">
              <Users className="h-4 w-4 mr-2 hidden sm:inline" /> Referrals
            </TabsTrigger>
            <TabsTrigger value="unlockables" className="text-sm sm:text-base">
              <Lock className="h-4 w-4 mr-2 hidden sm:inline" /> Unlockable
              Content
            </TabsTrigger>
            <TabsTrigger value="nfts" className="text-sm sm:text-base">
              <Star className="h-4 w-4 mr-2 hidden sm:inline" /> NFT Rewards
            </TabsTrigger>
            <TabsTrigger value="trivia" className="text-sm sm:text-base">
              <MessageSquare className="h-4 w-4 mr-2 hidden sm:inline" /> SF
              Trivia
            </TabsTrigger>
          </TabsList>

          <TabsContent value="points" className="space-y-6">
            <PointsSystemExplainer />
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <BadgesExplainer />
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <ReferralRewardsExplainer setShowShareDialog={setShowShareDialog} />
          </TabsContent>

          <TabsContent value="unlockables" className="space-y-6">
            <UnlockableContentExplainer />
          </TabsContent>

          <TabsContent value="nfts" className="space-y-6">
            <NFTRewardsExplainer />
          </TabsContent>

          <TabsContent value="trivia" className="space-y-6">
            <TriviaGameExplainer />
          </TabsContent>
        </Tabs>

        <Card className="mt-12 border-[#0A3C1F]/20">
          <CardHeader className="bg-[#0A3C1F] text-white">
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" /> Get Started Now
            </CardTitle>
            <CardDescription className="text-gray-200">
              Begin your journey to becoming a San Francisco Deputy Sheriff
              today!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Start Earning Points
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Create an account, complete your profile, and start engaging
                  with our platform to earn your first points and badges.
                </p>
                <Link href="/awards">
                  <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
                    View Leaderboard
                  </Button>
                </Link>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Track Your Progress
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Monitor your points, badges, and unlocked content in your
                  profile dashboard.
                </p>
                <Link href="/profile">
                  <Button
                    variant="outline"
                    className="border-[#0A3C1F] text-[#0A3C1F]"
                  >
                    Go to Profile
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Referral Link</DialogTitle>
            <DialogDescription>
              Share this link with potential recruits and earn rewards when they
              sign up!
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 my-4">
            <Button className="bg-[#1877F2] hover:bg-[#1877F2]/90">
              Facebook
            </Button>
            <Button className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90">
              Twitter
            </Button>
            <Button className="bg-[#0A66C2] hover:bg-[#0A66C2]/90">
              LinkedIn
            </Button>
            <Button className="bg-[#25D366] hover:bg-[#25D366]/90">
              WhatsApp
            </Button>
          </div>

          <div className="relative mt-2">
            <Input
              value="https://sfdsa-recruiter.com/join?ref=demo-user123"
              readOnly
            />
            <Button
              className="absolute right-1 top-1 h-7"
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(
                  "https://sfdsa-recruiter.com/join?ref=demo-user123",
                );
              }}
            >
              Copy
            </Button>
          </div>

          <div className="bg-[#0A3C1F]/10 border border-[#0A3C1F]/20 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-[#0A3C1F] flex items-center">
              <Award className="mr-2 h-4 w-4 text-[#0A3C1F]" />
              Referral Tip
            </h4>
            <p className="text-sm mt-1">
              Personalize your message when sharing your link to increase the
              chances of your friends signing up!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PointsSystemExplainer() {
  const pointTiers = [
    {
      name: "Bronze Recruit",
      points: 1000,
      rewards: ["Bronze Badge", "Leaderboard Recognition"],
      icon: <Award className="h-8 w-8 text-amber-600" />,
      color: "from-amber-200/20 to-amber-200/5",
    },
    {
      name: "Silver Recruit",
      points: 2500,
      rewards: ["Silver Badge", "Priority Application Review"],
      icon: <Award className="h-8 w-8 text-gray-400" />,
      color: "from-gray-200/20 to-gray-200/5",
    },
    {
      name: "Gold Recruit",
      points: 5000,
      rewards: ["Gold Badge", "Exclusive Resources"],
      icon: <Award className="h-8 w-8 text-yellow-400" />,
      color: "from-yellow-200/20 to-yellow-200/5",
    },
    {
      name: "Platinum Recruit",
      points: 10000,
      rewards: ["Platinum Badge", "Direct Contact with Recruiters"],
      icon: <Award className="h-8 w-8 text-gray-300" />,
      color: "from-gray-100/20 to-gray-100/5",
    },
  ];

  const pointActivities = [
    {
      name: "Chat with Sgt. Ken",
      points: 5,
      description:
        "Earn points for each meaningful interaction with our AI assistant",
      icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
    },
    {
      name: "Complete Practice Tests",
      points: 20,
      description: "Earn points for each practice test you complete",
      icon: <FileText className="h-8 w-8 text-green-500" />,
    },
    {
      name: "Review Application Materials",
      points: 10,
      description:
        "Earn points for reviewing application documents and resources",
      icon: <FileText className="h-8 w-8 text-purple-500" />,
    },
    {
      name: "Submit Application",
      points: 100,
      description:
        "Earn a significant point bonus when you submit your application",
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    },
  ];

  const pointCategories = [
    {
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
      title: "Chat Interactions",
      description:
        "Earn points by chatting with our AI assistant and asking questions about the recruitment process.",
      points: "5-20 points per meaningful interaction",
    },
    {
      icon: <Download className="h-5 w-5 text-green-500" />,
      title: "Resource Downloads",
      description:
        "Download study materials, application guides, and other resources to prepare for the process.",
      points: "10 points per resource",
    },
    {
      icon: <Clock className="h-5 w-5 text-purple-500" />,
      title: "Time Spent",
      description:
        "Points awarded based on time spent engaging with our recruitment platform.",
      points: "1 point per minute (up to 30 points per day)",
    },
    {
      icon: <Award className="h-5 w-5 text-yellow-500" />,
      title: "Badge Achievements",
      description:
        "Earn badges by completing specific actions and milestones in the recruitment process.",
      points: "25-100 points per badge",
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-red-500" />,
      title: "Application Progress",
      description:
        "Advance through the application process to earn substantial points.",
      points: "50-200 points per stage completed",
    },
    {
      icon: <Users className="h-5 w-5 text-indigo-500" />,
      title: "Referrals",
      description:
        "Refer potential recruits to earn points when they sign up using your referral link.",
      points: "100 points per successful referral",
    },
    {
      icon: <Gift className="h-5 w-5 text-pink-500" />,
      title: "Donations",
      description:
        "Support the SFDSA through donations to earn points and special recognition.",
      points: "10 points per dollar donated",
    },
    {
      icon: <Share2 className="h-5 w-5 text-orange-500" />,
      title: "Social Sharing",
      description:
        "Share content, badges, or your achievements on social media to earn points.",
      points: "25 points per share",
    },
  ];

  const gamePoints = [
    {
      name: "Trivia Games",
      description:
        "Test your knowledge about San Francisco and law enforcement",
      points:
        "10 points per correct answer, 25 bonus points for perfect scores",
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
    },
    {
      name: "Word Constructor",
      description: "Build words related to law enforcement and public safety",
      points: "5 points per word, bonus points for longer words",
      icon: <FileText className="h-5 w-5 text-green-500" />,
    },
    {
      name: "Memory Match",
      description: "Match pairs of cards featuring law enforcement concepts",
      points: "2 points per match, time bonuses available",
      icon: <Star className="h-5 w-5 text-yellow-500" />,
    },
    {
      name: "Spin to Win",
      description: "Daily opportunity to spin for random point rewards",
      points: "10-100 random points per day",
      icon: <Zap className="h-5 w-5 text-purple-500" />,
    },
  ];

  return (
    <>
      <Card>
        <CardHeader className="bg-[#0A3C1F] text-white">
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 text-[#FFD700] mr-2" />
            Points System Overview
          </CardTitle>
          <CardDescription className="text-gray-200">
            Our points system rewards your engagement and progress through the
            recruitment process
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">How to Earn Points</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pointActivities.map((activity) => (
                  <div
                    key={activity.name}
                    className="flex items-start p-4 rounded-lg border bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="rounded-full p-2 mr-3 bg-white dark:bg-gray-800 shadow-sm">
                      {activity.icon}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">{activity.name}</h4>
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-[#0A3C1F] text-white text-xs">
                          +{activity.points} pts
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Point Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pointCategories.map((category, index) => (
                  <div key={index} className="flex p-4 border rounded-lg">
                    <div className="mr-3">{category.icon}</div>
                    <div>
                      <h4 className="font-medium">{category.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                      <div className="mt-2 text-sm font-medium text-[#0A3C1F]">
                        {category.points}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Games & Points</h3>
              <p className="mb-4">
                Engage with our interactive games to earn points while learning
                about law enforcement and the San Francisco Sheriff&apos;s
                Department.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gamePoints.map((game, index) => (
                  <div key={index} className="flex p-4 border rounded-lg">
                    <div className="mr-3">{game.icon}</div>
                    <div>
                      <h4 className="font-medium">{game.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {game.description}
                      </p>
                      <div className="mt-2 text-sm font-medium text-[#0A3C1F]">
                        {game.points}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/games">
                  <Button
                    variant="outline"
                    className="border-[#0A3C1F] text-[#0A3C1F]"
                  >
                    Play Games
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">
                Point Tiers and Rewards
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {pointTiers.map((tier) => (
                  <div key={tier.name} className="border rounded-lg p-4">
                    <div
                      className={`rounded-full p-2 mb-3 inline-block bg-gradient-to-b ${tier.color}`}
                    >
                      {tier.icon}
                    </div>
                    <h4 className="font-bold">{tier.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {tier.points.toLocaleString()} points
                    </p>
                    <div className="mt-2 space-y-1">
                      {tier.rewards.map((reward, i) => (
                        <div key={i} className="flex items-center text-sm">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          <span>{reward}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0A3C1F]/5 p-4 rounded-lg border border-[#0A3C1F]/20 mt-8">
              <h3 className="font-semibold text-lg mb-2 text-[#0A3C1F]">
                Points and Leaderboard
              </h3>
              <p>
                Your points determine your position on our leaderboard. The
                leaderboard is updated in real-time, allowing you to see how you
                stack up against other recruits. Top performers are recognized
                and may receive special opportunities in the recruitment
                process.
              </p>
              <div className="mt-4">
                <Link href="/awards">
                  <Button
                    variant="outline"
                    className="border-[#0A3C1F] text-[#0A3C1F]"
                  >
                    View Leaderboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function ReferralRewardsExplainer({
  setShowShareDialog,
}: {
  setShowShareDialog: (show: boolean) => void;
}) {
  const referralCount = 2; // Demo value

  const referralTiers = [
    {
      count: 1,
      reward: "+100 Points",
      description: "Refer your first recruit",
      icon: <Trophy className="h-5 w-5 text-[#FFD700]" />,
      achieved: referralCount >= 1,
    },
    {
      count: 3,
      reward: "Connector Badge",
      description: "Refer 3 potential recruits",
      icon: <Award className="h-5 w-5 text-[#0A3C1F]" />,
      achieved: referralCount >= 3,
    },
    {
      count: 5,
      reward: "+500 Points",
      description: "Refer 5 potential recruits",
      icon: <Trophy className="h-5 w-5 text-[#FFD700]" />,
      achieved: referralCount >= 5,
    },
    {
      count: 10,
      reward: "Recruitment Champion NFT",
      description: "Refer 10 potential recruits",
      icon: <Star className="h-5 w-5 text-[#FFD700]" />,
      achieved: referralCount >= 10,
    },
    {
      count: 25,
      reward: "VIP Recruitment Event Access",
      description: "Refer 25 potential recruits",
      icon: <Gift className="h-5 w-5 text-[#0A3C1F]" />,
      achieved: referralCount >= 25,
    },
  ];

  // Find the next tier
  const nextTier = referralTiers.find((tier) => !tier.achieved);

  // Calculate progress to next tier
  const progressToNextTier = nextTier
    ? Math.min(100, Math.round((referralCount / nextTier.count) * 100))
    : 100;

  return (
    <>
      <Card className="w-full shadow-md">
        <CardHeader className="bg-[#0A3C1F] text-white">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Referral Rewards Program
          </CardTitle>
          <CardDescription className="text-gray-200">
            Refer potential recruits and earn exclusive rewards
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium">Your Referrals</h3>
                <p className="text-sm text-gray-500">
                  You&apos;ve referred {referralCount} potential recruits
                </p>
              </div>
              <Button
                className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
                onClick={() => setShowShareDialog(true)}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Your Link
              </Button>
            </div>

            {nextTier && (
              <div className="mt-4">
                <div className="flex justify-between mb-1 text-sm">
                  <span>Progress to next reward: {nextTier.reward}</span>
                  <span>
                    {referralCount}/{nextTier.count} referrals
                  </span>
                </div>
                <Progress value={progressToNextTier} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  Refer {nextTier.count - referralCount} more recruits to unlock{" "}
                  {nextTier.reward}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Referral Reward Tiers</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {referralTiers.map((tier) => (
                <div
                  key={tier.count}
                  className={`p-4 border rounded-lg transition-all ${
                    tier.achieved
                      ? "bg-[#0A3C1F]/5 border-[#0A3C1F]/20"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div
                      className={`p-2 rounded-full ${tier.achieved ? "bg-[#0A3C1F]/10" : "bg-gray-100"}`}
                    >
                      {tier.icon}
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">{tier.reward}</h4>
                      <p className="text-xs text-gray-500">
                        {tier.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium">
                      {tier.count} Referrals
                    </span>
                    {tier.achieved ? (
                      <Badge className="bg-[#0A3C1F] text-white">
                        Unlocked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        Locked
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <h3 className="font-medium mb-2">How It Works</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Share your unique referral link with potential recruits</li>
                <li>
                  When they sign up using your link, you get credit for the
                  referral
                </li>
                <li>
                  As your referral count grows, you unlock exclusive rewards
                </li>
                <li>Track your progress and rewards on this page</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function BadgesExplainer() {
  const badgeCategories = [
    {
      category: "Achievement Badges",
      description:
        "Earned by completing specific preparation milestones in the recruitment process",
      badges: [
        {
          type: "written",
          name: "Written Test",
          description:
            "Complete written test preparation materials and practice exams",
          requirements: [
            "Review written test materials",
            "Score 80% or higher on practice test",
            "Complete at least 3 practice sessions",
          ],
        },
        {
          type: "oral",
          name: "Oral Board",
          description:
            "Prepare for oral board interviews through practice and study",
          requirements: [
            "Review interview question guides",
            "Complete mock interview",
            "Watch interview preparation videos",
          ],
        },
        {
          type: "physical",
          name: "Physical Test",
          description:
            "Prepare for the physical fitness requirements of the role",
          requirements: [
            "Review physical test requirements",
            "Track workout progress",
            "Complete fitness self-assessment",
          ],
        },
        {
          type: "polygraph",
          name: "Polygraph",
          description:
            "Learn about the polygraph process and prepare accordingly",
          requirements: [
            "Review polygraph information",
            "Complete pre-polygraph questionnaire",
            "Watch polygraph preparation video",
          ],
        },
        {
          type: "psychological",
          name: "Psychological",
          description:
            "Understand and prepare for the psychological evaluation",
          requirements: [
            "Review psychological evaluation information",
            "Complete self-assessment",
            "Review common psychological test questions",
          ],
        },
      ],
    },
    {
      category: "Process Badges",
      description:
        "Earned by progressing through the application and recruitment process",
      badges: [
        {
          type: "chat-participation",
          name: "Chat Participation",
          description: "Engage with Sgt. Ken, our AI assistant",
          requirements: [
            "Ask at least 5 questions to Sgt. Ken",
            "Engage in a conversation spanning multiple topics",
            "Use the chat feature on 3 separate days",
          ],
        },
        {
          type: "first-response",
          name: "First Response",
          description: "Receive your first response from Sgt. Ken",
          requirements: [
            "Ask your first question to Sgt. Ken",
            "Read the complete response",
            "Follow up with a related question",
          ],
        },
        {
          type: "application-started",
          name: "Application Started",
          description:
            "Begin the application process for the SF Sheriff&apos;s Department",
          requirements: [
            "Create an account",
            "Fill out basic profile information",
            "Start the application form",
          ],
        },
        {
          type: "application-completed",
          name: "Application Completed",
          description: "Complete the full application process",
          requirements: [
            "Fill out all required application fields",
            "Upload necessary documents",
            "Submit the completed application",
          ],
        },
        {
          type: "full",
          name: "Full Process",
          description:
            "Complete all preparation areas in the recruitment process",
          requirements: [
            "Earn all achievement badges",
            "Complete application",
            "Attend orientation (if applicable)",
          ],
        },
      ],
    },
    {
      category: "Participation Badges",
      description:
        "Earned through consistent engagement with the recruitment platform",
      badges: [
        {
          type: "frequent-user",
          name: "Frequent User",
          description: "Regularly engage with the recruitment platform",
          requirements: [
            "Log in for 7 consecutive days",
            "Spend at least 10 minutes on the platform daily",
            "Interact with multiple platform features",
          ],
        },
        {
          type: "resource-downloader",
          name: "Resource Downloader",
          description: "Download recruitment resources and materials",
          requirements: [
            "Download at least 5 different resources",
            "Review downloaded materials",
            "Apply knowledge from resources in interactions",
          ],
        },
      ],
    },
  ];

  return (
    <>
      <Card>
        <CardHeader className="bg-[#0A3C1F] text-white">
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 text-[#FFD700] mr-2" />
            Badge System
          </CardTitle>
          <CardDescription className="text-gray-200">
            Earn badges by completing specific actions and milestones in your
            recruitment journey
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            <div>
              <p className="mb-6">
                Our badge system recognizes your achievements and progress
                throughout the recruitment process. Each badge represents a
                specific accomplishment or milestone, showcasing your dedication
                and preparation for a career with the San Francisco
                Sheriff&apos;s Department.
              </p>
            </div>

            {badgeCategories.map((category) => (
              <div key={category.category} className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">
                  {category.category}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {category.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.badges.map((badge) => (
                    <Card key={badge.type} className="border-[#0A3C1F]/20">
                      <CardHeader className="pb-2">
                        <div className="flex justify-center mb-2">
                          <AchievementBadge
                            type={badge.type as BadgeType}
                            size="lg"
                            earned={false}
                          />
                        </div>
                        <CardTitle className="text-center text-lg">
                          {badge.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-center mb-4">
                          {badge.description}
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <h4 className="text-sm font-medium mb-2">
                            Requirements:
                          </h4>
                          <ul className="text-sm space-y-1">
                            {badge.requirements.map((req, i) => (
                              <li key={i} className="flex items-start">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-[#0A3C1F]/5 p-4 rounded-lg border border-[#0A3C1F]/20">
              <h3 className="font-semibold text-lg mb-2 text-[#0A3C1F]">
                Badge Benefits
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span>
                    <strong>Recognition:</strong> Badges appear on your profile
                    and leaderboard, showcasing your achievements to recruiters
                    and other applicants.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span>
                    <strong>Points:</strong> Each badge awards points that
                    contribute to your overall score and leaderboard position.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span>
                    <strong>Unlockable Content:</strong> Some badges unlock
                    exclusive content, resources, or features on the platform.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span>
                    <strong>Application Advantage:</strong> Badges demonstrate
                    your commitment and preparation to recruiters reviewing your
                    application.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function UnlockableContentExplainer() {
  const unlockablePages = [
    {
      name: "G.I. Bill Benefits",
      description:
        "Detailed information on using G.I. Bill benefits for law enforcement training",
      pointsRequired: 300,
      imageUrl: "/veterans-law-enforcement-training.png",
      path: "/gi-bill",
    },
    {
      name: "Discounted Housing Programs",
      description:
        "Information about special housing programs for law enforcement in San Francisco",
      pointsRequired: 500,
      imageUrl: "/san-francisco-apartments.png",
      path: "/discounted-housing",
    },
    {
      name: "Advanced Training Resources",
      description:
        "Specialized training materials and resources for serious applicants",
      pointsRequired: 1000,
      imageUrl: "/law-enforcement-training.png",
      path: "/advanced-training",
    },
    {
      name: "Interview Preparation Guide",
      description:
        "Comprehensive guide to acing the Sheriff&apos;s Department interview",
      pointsRequired: 1500,
      imageUrl: "/job-interview-preparation.png",
      path: "/interview-guide",
    },
  ];

  const unlockMethods = [
    {
      title: "Point Accumulation",
      description:
        "The primary method of unlocking content is by earning points through platform engagement and completing activities.",
      icon: <Trophy className="h-6 w-6 text-[#0A3C1F]" />,
    },
    {
      title: "Badge Collection",
      description:
        "Some content is unlocked by earning specific badges that demonstrate your knowledge in relevant areas.",
      icon: <Award className="h-6 w-6 text-[#0A3C1F]" />,
    },
    {
      title: "Application Progress",
      description:
        "Advancing through the application process automatically unlocks content relevant to your current stage.",
      icon: <CheckCircle className="h-6 w-6 text-[#0A3C1F]" />,
    },
    {
      title: "Special Events",
      description:
        "Participating in special events, webinars, or virtual information sessions can unlock exclusive content.",
      icon: <Star className="h-6 w-6 text-[#0A3C1F]" />,
    },
  ];

  return (
    <>
      <Card>
        <CardHeader className="bg-[#0A3C1F] text-white">
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 text-[#FFD700] mr-2" />
            Unlockable Content
          </CardTitle>
          <CardDescription className="text-gray-200">
            Earn points and badges to unlock exclusive content and resources
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            <div>
              <p className="mb-6">
                Our platform features exclusive content that becomes available
                as you progress through your recruitment journey. Unlocking this
                content not only provides valuable information but also
                demonstrates your commitment to joining the San Francisco
                Sheriff&apos;s Department.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                How to Unlock Content
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unlockMethods.map((method) => (
                  <div key={method.title} className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      {method.icon}
                      <h4 className="font-semibold ml-2">{method.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Unlockable Pages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {unlockablePages.map((page) => (
                  <Card
                    key={page.name}
                    className="overflow-hidden border-[#0A3C1F]/20"
                  >
                    <div className="relative h-40">
                      <Image
                        src={page.imageUrl || "/placeholder.svg"}
                        alt={page.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <div className="p-4 text-white">
                          <h4 className="font-bold text-lg">{page.name}</h4>
                          <div className="flex items-center">
                            <Lock className="h-4 w-4 mr-1" />
                            <span className="text-sm">
                              {page.pointsRequired} points required
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        {page.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-muted-foreground">
                            Unlock progress
                          </span>
                          <Progress value={0} className="h-2 w-24" />
                        </div>
                        <Link href={page.path}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            View Page
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-[#0A3C1F]/5 p-4 rounded-lg border border-[#0A3C1F]/20">
              <h3 className="font-semibold text-lg mb-2 text-[#0A3C1F]">
                Benefits of Unlockable Content
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span>
                    <strong>Exclusive Information:</strong> Access detailed
                    information not available to casual visitors.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span>
                    <strong>Preparation Advantage:</strong> Gain insights that
                    will help you better prepare for the recruitment process.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span>
                    <strong>Personalized Resources:</strong> Access content
                    relevant to your specific interests and background.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span>
                    <strong>Demonstration of Commitment:</strong> Unlocking
                    content shows recruiters your dedication to the process.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function NFTRewardsExplainer() {
  return (
    <>
      <Card>
        <CardHeader className="bg-[#0A3C1F] text-white">
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 text-[#FFD700] mr-2" />
            NFT Rewards
          </CardTitle>
          <CardDescription className="text-gray-200">
            Earn exclusive digital collectibles that recognize your achievements
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            <div>
              <p className="mb-6">
                Our platform offers exclusive NFT (Non-Fungible Token) rewards
                to recognize outstanding achievements in the recruitment
                process. These digital collectibles serve as permanent proof of
                your accomplishments and may provide special benefits in the
                future.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                Available NFT Awards
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {NFT_AWARD_TIERS.map((tier) => (
                  <Card key={tier.id} className="border-[#0A3C1F]/20">
                    <CardHeader className="pb-2">
                      <div className="aspect-square relative mb-2 bg-gray-100 rounded-md overflow-hidden">
                        <Image
                          src={
                            tier.imageUrl ||
                            "/placeholder.svg?height=200&width=200&query=nft award badge"
                          }
                          alt={tier.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <CardTitle className="text-center text-lg">
                        {tier.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-center mb-4">
                        {tier.description}
                      </p>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Required Points:</span>
                          <span className="font-medium">
                            {tier.pointThreshold.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                How NFT Rewards Work
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">1. Earn Points</h4>
                  <p className="text-sm text-muted-foreground">
                    Accumulate points through platform engagement, completing
                    application steps, and earning badges.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">
                    2. Reach Point Thresholds
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Each NFT award has a specific point threshold. Once you
                    reach that threshold, you become eligible for the award.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">3. Receive Your NFT</h4>
                  <p className="text-sm text-muted-foreground">
                    NFTs are automatically awarded when you reach the required
                    point threshold. You&apos;ll receive a notification and the
                    NFT will appear in your profile.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">4. Display and Share</h4>
                  <p className="text-sm text-muted-foreground">
                    Your NFTs are displayed on your profile and can be shared on
                    social media to showcase your achievements.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0A3C1F]/5 p-4 rounded-lg border border-[#0A3C1F]/20">
              <h3 className="font-semibold text-lg mb-2 text-[#0A3C1F]">
                Benefits of NFT Rewards
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span>
                    <strong>Permanent Recognition:</strong> Unlike traditional
                    digital badges, NFTs are permanent, verifiable records of
                    your achievements.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span>
                    <strong>Exclusive Status:</strong> NFTs are awarded only to
                    top performers, making them a symbol of excellence.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span>
                    <strong>Future Benefits:</strong> NFT holders may receive
                    special benefits, access to exclusive events, or recognition
                    in future department initiatives.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span>
                    <strong>Digital Portfolio:</strong> Build a collection of
                    NFTs that showcase your journey and achievements in the
                    recruitment process.
                  </span>
                </li>
              </ul>
            </div>

            <div className="text-center p-6 border rounded-lg bg-gradient-to-b from-[#0A3C1F]/10 to-transparent">
              <h3 className="text-xl font-bold text-[#0A3C1F] mb-2">
                Start Earning Your NFT Rewards Today!
              </h3>
              <p className="mb-4">
                Begin your journey by creating an account, engaging with our
                platform, and working toward your first NFT award.
              </p>
              <Link href="/awards">
                <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function TriviaGameExplainer() {
  return (
    <>
      <Card>
        <CardHeader className="bg-[#0A3C1F] text-white">
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 text-[#FFD700] mr-2" />
            SF Trivia Game
          </CardTitle>
          <CardDescription className="text-gray-200">
            Test your knowledge about San Francisco while earning points and
            badges
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold mb-4">About SF Trivia</h3>
                <p className="mb-4">
                  The SF Trivia game is an exciting way to test your knowledge
                  about San Francisco while earning points and competing with
                  other recruits. Answer questions about the city&apos;s
                  history, landmarks, culture, and more to climb the leaderboard
                  and earn special badges.
                </p>
                <p className="mb-4">
                  Each game consists of 5 challenging questions with
                  multiple-choice answers. You&apos;ll have 30 seconds to answer
                  each question, with bonus points awarded for speed and
                  accuracy. It&apos;s a fun way to learn more about the city
                  you&apos;ll be serving while advancing your recruitment
                  journey.
                </p>
                <div className="mt-6">
                  <Link href="/trivia">
                    <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
                      Play SF Trivia Now
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/3 bg-[#0A3C1F]/5 p-4 rounded-lg border border-[#0A3C1F]/20">
                <h4 className="font-semibold text-[#0A3C1F] mb-3">
                  Game Features
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>5 challenging questions per game</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>30-second timer for each question</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Detailed explanations for each answer</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Real-time leaderboard updates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Special trivia badges to earn</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                How to Earn Points with Trivia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-[#0A3C1F]/20">
                  <CardHeader className="pb-2">
                    <div className="rounded-full p-2 w-12 h-12 bg-green-100 flex items-center justify-center mx-auto">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-center text-lg mt-2">
                      Correct Answers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm mb-2">
                      Earn 10 points for each correct answer
                    </p>
                    <div className="text-2xl font-bold text-[#0A3C1F]">
                      +10 pts
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#0A3C1F]/20">
                  <CardHeader className="pb-2">
                    <div className="rounded-full p-2 w-12 h-12 bg-blue-100 flex items-center justify-center mx-auto">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-center text-lg mt-2">
                      Speed Bonus
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm mb-2">
                      Answer quickly for bonus points
                    </p>
                    <div className="text-2xl font-bold text-[#0A3C1F]">
                      +5 pts
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#0A3C1F]/20">
                  <CardHeader className="pb-2">
                    <div className="rounded-full p-2 w-12 h-12 bg-purple-100 flex items-center justify-center mx-auto">
                      <Trophy className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-center text-lg mt-2">
                      Perfect Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm mb-2">
                      Get all questions right for a bonus
                    </p>
                    <div className="text-2xl font-bold text-[#0A3C1F]">
                      +25 pts
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Trivia Badges</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-[#0A3C1F]/20">
                  <CardHeader className="pb-2">
                    <div className="flex justify-center mb-2">
                      <div className="w-16 h-16 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center">
                        <Trophy className="h-8 w-8 text-[#0A3C1F]" />
                      </div>
                    </div>
                    <CardTitle className="text-center text-lg">
                      Trivia Participant
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-center mb-4">
                      Awarded for completing your first trivia game
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">
                        Requirements:
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-start">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span>Complete one full trivia game</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span>Answer all 5 questions</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#0A3C1F]/20">
                  <CardHeader className="pb-2">
                    <div className="flex justify-center mb-2">
                      <div className="w-16 h-16 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center">
                        <Trophy className="h-8 w-8 text-[#0A3C1F]" />
                      </div>
                    </div>
                    <CardTitle className="text-center text-lg">
                      Trivia Enthusiast
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-center mb-4">
                      Awarded for completing 5 trivia games
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">
                        Requirements:
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-start">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span>Complete 5 full trivia games</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span>
                            Earn at least 100 total points from trivia
                          </span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#0A3C1F]/20">
                  <CardHeader className="pb-2">
                    <div className="flex justify-center mb-2">
                      <div className="w-16 h-16 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center">
                        <Trophy className="h-8 w-8 text-[#0A3C1F]" />
                      </div>
                    </div>
                    <CardTitle className="text-center text-lg">
                      Trivia Master
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-center mb-4">
                      Awarded for achieving 3 perfect scores
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">
                        Requirements:
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-start">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span>
                            Get a perfect score (5/5) on 3 different games
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span>
                            Answer within the time limit for all questions
                          </span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Trivia Leaderboard</h3>
              <p className="mb-4">
                Compete with other recruits on the trivia leaderboard! The
                leaderboard tracks your performance across all trivia games,
                showing your total correct answers, accuracy percentage, and
                overall ranking. Top performers are recognized and may receive
                special rewards.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-[#0A3C1F]/20">
                <h4 className="font-medium mb-3">Leaderboard Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <div className="rounded-full p-2 bg-green-100 mr-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Correct Answers</div>
                      <div className="text-sm text-muted-foreground">
                        Total correct answers across all games
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="rounded-full p-2 bg-blue-100 mr-3">
                      <Trophy className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Accuracy</div>
                      <div className="text-sm text-muted-foreground">
                        Percentage of correct answers
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="rounded-full p-2 bg-purple-100 mr-3">
                      <Star className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Perfect Games</div>
                      <div className="text-sm text-muted-foreground">
                        Number of 5/5 scores
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#0A3C1F]/10 to-transparent p-6 rounded-lg border border-[#0A3C1F]/20">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold text-[#0A3C1F] mb-2">
                    Ready to Test Your San Francisco Knowledge?
                  </h3>
                  <p className="mb-4">
                    Challenge yourself with our SF Trivia game! Answer questions
                    about San Francisco&apos;s history, landmarks, culture, and
                    more. Earn points, climb the leaderboard, and unlock special
                    badges while preparing for your career with the San
                    Francisco Sheriff&apos;s Department.
                  </p>
                  <Link href="/trivia">
                    <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
                      Play SF Trivia Now
                    </Button>
                  </Link>
                </div>
                <div className="md:w-1/3 flex justify-center mt-6 md:mt-0">
                  <div className="w-32 h-32 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center">
                    <Trophy className="h-16 w-16 text-[#0A3C1F]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

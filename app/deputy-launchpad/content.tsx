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
  Rocket,
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
import { useToast } from "@/components/ui/use-toast";
import type { BadgeType } from "@/types/badge";

export default function LaunchpadContent() {
  const [activeTab, setActiveTab] = useState("points");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const { toast } = useToast();

  return (
    <div className="mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#0A3C1F] mb-2">
          Deputy Launchpad
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Your mission control center for becoming a San Francisco Deputy
          Sheriff. Earn points, unlock badges, and track your progress through
          our engaging recruitment platform.
        </p>
      </div>

      <Tabs
        defaultValue="points"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-8">
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
            <Rocket className="h-5 w-5 mr-2" /> Launch Your Career
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
                toast({
                  title: "Link copied!",
                  description: "Referral link copied to clipboard",
                  duration: 3000,
                });
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
      rewards: [
        "Gold Badge",
        "Exclusive Q&A with a Deputy",
        "SFDSA Store Discount",
      ],
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      color: "from-yellow-200/20 to-yellow-200/5",
    },
    {
      name: "Platinum Recruit",
      points: 10000,
      rewards: ["Platinum Badge", "Personalized recruitment guide"],
      icon: <Trophy className="h-8 w-8 text-blue-400" />,
      color: "from-blue-200/20 to-blue-200/5",
    },
  ];

  return (
    <Card className="border-[#0A3C1F]/20">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 text-[#0A3C1F]" /> How the Points System Works
        </CardTitle>
        <CardDescription>
          Earn points for engaging with our platform. The more you explore, the
          more you earn!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#0A3C1F]/10 rounded-full">
              <CheckCircle className="h-6 w-6 text-[#0A3C1F]" />
            </div>
            <div>
              <h4 className="font-semibold">Complete Your Profile</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Earn an instant <strong>250 points</strong> for filling out
                your profile information.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#0A3C1F]/10 rounded-full">
              <FileText className="h-6 w-6 text-[#0A3C1F]" />
            </div>
            <div>
              <h4 className="font-semibold">Read Informational Pages</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gain <strong>50 points</strong> for each informational page you
                read.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#0A3C1F]/10 rounded-full">
              <Zap className="h-6 w-6 text-[#0A3C1F]" />
            </div>
            <div>
              <h4 className="font-semibold">Play SF Trivia</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Test your knowledge and earn up to <strong>100 points</strong>{" "}
                per trivia game.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#0A3C1F]/10 rounded-full">
              <Users className="h-6 w-6 text-[#0A3C1F]" />
            </div>
            <div>
              <h4 className="font-semibold">Refer a Friend</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive <strong>500 points</strong> for every successful
                referral.
              </p>
            </div>
          </div>
        </div>

        <h4 className="text-lg font-semibold mt-8 mb-4">Point Tiers</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pointTiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-lg p-4 bg-gradient-to-br ${tier.color} border border-black/10 dark:border-white/10`}
            >
              <div className="flex items-start space-x-4">
                {tier.icon}
                <div>
                  <h5 className="font-semibold">{tier.name}</h5>
                  <p className="text-sm font-bold">{tier.points} Points</p>
                  <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
                    {tier.rewards.map((reward) => (
                      <li key={reward}>{reward}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ReferralRewardsExplainer({
  setShowShareDialog,
}: {
  setShowShareDialog: (show: boolean) => void;
}) {
  return (
    <Card className="border-[#0A3C1F]/20">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 text-[#0A3C1F]" /> Refer a Recruit, Earn
          Rewards
        </CardTitle>
        <CardDescription>
          Help us find the next generation of Deputy Sheriffs and get rewarded
          for it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
          <h3 className="text-2xl font-bold text-[#0A3C1F]">
            Earn 500 Points
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            For every friend who signs up using your unique referral link.
          </p>
          <Button
            className="mt-4 bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
            onClick={() => setShowShareDialog(true)}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Get Your Referral Link
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          <h4 className="font-semibold">How It Works:</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              <strong>Share Your Link:</strong> Get your unique link from your
              profile and share it via social media, email, or text.
            </li>
            <li>
              <strong>Friend Signs Up:</strong> Your friend clicks the link and
              creates an account on our platform.
            </li>
            <li>
              <strong>You Get Points:</strong> Once their account is verified,
              500 points are automatically added to your total.
            </li>
          </ol>
        </div>

        <div className="mt-6 bg-[#0A3C1F]/10 p-4 rounded-lg">
          <h4 className="font-semibold text-[#0A3C1F] flex items-center">
            <Gift className="mr-2 h-4 w-4" /> Unlimited Referrals
          </h4>
          <p className="text-sm text-[#0A3C1F]/80 mt-1">
            There's no limit to how many people you can refer or how many
            points you can earn!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function BadgesExplainer() {
  const badgeCategories = [
    {
      title: "Engagement Badges",
      description: "Awarded for interacting with the platform.",
      badges: [
        {
          name: "First Steps",
          description: "Create an account.",
          icon: "👣",
          color: "bg-blue-100 text-blue-800",
        },
        {
          name: "Profile Pro",
          description: "Complete your user profile.",
          icon: "👤",
          color: "bg-green-100 text-green-800",
        },
        {
          name: "Avid Reader",
          description: "Read 5 informational pages.",
          icon: "📚",
          color: "bg-indigo-100 text-indigo-800",
        },
        {
          name: " lorem-1",
          description: "Read 5 informational pages.",
          icon: "📚",
          color: "bg-indigo-100 text-indigo-800",
        },
      ],
    },
    {
      title: "Achievement Badges",
      description: "Awarded for reaching milestones.",
      badges: [
        {
          name: "Point Pioneer",
          description: "Earn your first 1,000 points.",
          icon: "🏆",
          color: "bg-yellow-100 text-yellow-800",
        },
        {
          name: "Recruit Referrer",
          description: "Successfully refer a new recruit.",
          icon: "🤝",
          color: "bg-pink-100 text-pink-800",
        },
        {
          name: "Trivia Titan",
          description: "Score 100% on a trivia game.",
          icon: "🧠",
          color: "bg-purple-100 text-purple-800",
        },
        {
          name: " lorem-2",
          description: "Score 100% on a trivia game.",
          icon: "🧠",
          color: "bg-purple-100 text-purple-800",
        },
      ],
    },
    {
      title: "Special Edition Badges",
      description: "Limited-time badges for special events.",
      badges: [
        {
          name: "Community Event",
          description: "Attend a recruitment event.",
          icon: "🎉",
          color: "bg-red-100 text-red-800",
        },
        {
          name: "Holiday Hero",
          description: "Log in during a holiday week.",
          icon: "🎄",
          color: "bg-teal-100 text-teal-800",
        },
        {
          name: "Survey Superstar",
          description: "Complete a user feedback survey.",
          icon: "📝",
          color: "bg-orange-100 text-orange-800",
        },
        {
          name: " lorem-3",
          description: "Complete a user feedback survey.",
          icon: "📝",
          color: "bg-orange-100 text-orange-800",
        },
      ],
    },
  ];

  return (
    <Card className="border-[#0A3C1F]/20">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="mr-2 text-[#0A3C1F]" /> Collectible Badges
        </CardTitle>
        <CardDescription>
          Show off your progress and dedication by collecting unique badges.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {badgeCategories.map((category) => (
          <div key={category.title} className="mb-8 last:mb-0">
            <h4 className="text-lg font-semibold mb-1">{category.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {category.description}
            </p>
            <div className="flex flex-wrap gap-4">
              {category.badges.map((badge) => (
                <AchievementBadge key={badge.name} badge={badge as BadgeType} />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            View all your collected badges on your profile page.
          </p>
          <Link href="/profile">
            <Button
              variant="outline"
              className="border-[#0A3C1F] text-[#0A3C1F]"
            >
              Go to My Badges
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function UnlockableContentExplainer() {
  const contentTiers = [
    {
      title: "Recruit Resources Pack",
      points: 2000,
      icon: <Download className="h-6 w-6 text-blue-500" />,
      items: [
        "Digital Study Guide for the P.O.S.T. Exam",
        "Interview Tips from Senior Deputies (PDF)",
        "Physical Fitness Training Plan",
      ],
      color: "border-blue-500/20 bg-blue-500/5",
    },
    {
      title: "Behind-the-Badge Video Series",
      points: 4000,
      icon: <Rocket className="h-6 w-6 text-purple-500" />,
      items: [
        "Day-in-the-Life of a Deputy (Ep. 1)",
        "Tour of the new jail facility",
        "K-9 Unit Training Session",
      ],
      color: "border-purple-500/20 bg-purple-500/5",
    },
    {
      title: "Application Fast-Track",
      points: 7500,
      icon: <Clock className="h-6 w-6 text-green-500" />,
      items: [
        "Priority review of your application",
        "Direct contact with a recruitment officer",
        "Invitation to an exclusive pre-academy webinar",
      ],
      color: "border-green-500/20 bg-green-500/5",
    },
  ];

  return (
    <Card className="border-[#0A3C1F]/20">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="mr-2 text-[#0A3C1F]" /> Unlockable Content
        </CardTitle>
        <CardDescription>
          Your points are keys to exclusive content and advantages.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {contentTiers.map((tier) => (
            <div
              key={tier.title}
              className={`p-6 rounded-lg border ${tier.color}`}
            >
              <div className="flex items-center space-x-4 mb-4">
                {tier.icon}
                <div>
                  <h4 className="font-semibold">{tier.title}</h4>
                  <p className="text-sm font-bold">
                    Unlocks at {tier.points} Points
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {tier.items.map((item) => (
                  <li key={item} className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-yellow-100/50 dark:bg-yellow-800/20 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg text-center">
          <p>
            All unlocked content will appear automatically on your profile page
            once you reach the required point threshold.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function NFTRewardsExplainer() {
  return (
    <Card className="border-[#0A3C1F]/20">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="mr-2 text-[#0A3C1F]" /> Digital Collectible (NFT)
          Rewards
        </CardTitle>
        <CardDescription>
          Top performers can earn a unique, blockchain-verified digital
          collectible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h4 className="text-lg font-semibold">
              The "Founder's Badge" NFT
            </h4>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              As a special reward for our most dedicated candidates, we're
              offering a limited edition "Founder's Badge" NFT. This isn't just
              a digital image; it's a permanent, verifiable token on the
              blockchain that proves you were one of the top early members of
              our recruitment community.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <strong>Strictly Limited:</strong> Only the top 100 point-earners
                are eligible.
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <strong>Verifiable Achievement:</strong> A permanent digital trophy.
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <strong>Future Perks:</strong> May unlock future rewards and
                access.
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {NFT_AWARD_TIERS.slice(0, 4).map((tier, index) => (
              <div
                key={tier.name}
                className="relative aspect-square rounded-lg overflow-hidden border-2 border-black/10 dark:border-white/10"
              >
                <Image
                  src={tier.image}
                  alt={`${tier.name} NFT Badge`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-end p-2">
                  <span className="text-white font-bold text-xs drop-shadow-lg">
                    {tier.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-blue-100/50 dark:bg-blue-800/20 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200">
            How to Qualify
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Maintain your position in the top 100 on the leaderboard by the end
            of the recruitment cycle. We'll contact eligible winners with
            instructions on how to claim their NFT.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function TriviaGameExplainer() {
  return (
    <Card className="border-[#0A3C1F]/20">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 text-[#0A3C1F]" /> San Francisco Trivia
          Challenge
        </CardTitle>
        <CardDescription>
          Test your knowledge about the city you want to serve.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative p-6 rounded-lg bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-lg font-semibold">
              Ready for the Challenge?
            </h4>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Answer questions about San Francisco's history, landmarks, and
              laws. Each correct answer earns you points. Score a perfect 100%
              to earn the "Trivia Titan" badge!
            </p>
            <Link href="/trivia">
              <Button className="mt-4 bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
                Play Trivia Now
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-6 text-center">
          <div>
            <h5 className="font-semibold">Earn Points</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gain up to 100 points for each game you play.
            </p>
          </div>
          <div>
            <h5 className="font-semibold">Unlock a Badge</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get a perfect score to add the exclusive "Trivia Titan" badge to
              your collection.
            </p>
          </div>
          <div>
            <h5 className="font-semibold">Learn About SF</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Deepen your knowledge of the community you will serve.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
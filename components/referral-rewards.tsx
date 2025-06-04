"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, Gift, Share2, Users, Trophy, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface ReferralTier {
  count: number;
  reward: string;
  description: string;
  icon: React.ReactNode;
  achieved: boolean;
}

export function ReferralRewards() {
  const { toast } = useToast();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [referralCount] = useState(0);

  const referralTiers: ReferralTier[] = [
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

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      "https://sfdsa-recruiter.com/join?ref=demo-user123",
    );
    toast({
      title: "Link Copied!",
      description: "Referral link copied to clipboard",
      duration: 3000,
    });
  };

  return (
    <>
      <Card className="w-full shadow-md">
        <CardHeader className="bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/80 text-white">
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
                onClick={handleShare}
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
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Referral Reward Tiers</h3>
              <Link href="/gamification">
                <Button variant="link" className="text-[#0A3C1F] p-0">
                  Learn more about referrals
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {referralTiers.slice(0, 3).map((tier) => (
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
              onClick={handleCopyLink}
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
    </>
  );
}

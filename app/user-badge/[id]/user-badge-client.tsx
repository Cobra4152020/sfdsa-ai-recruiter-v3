"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/user-context";
import { AchievementBadge } from "@/components/achievement-badge";
import { BadgeProgress } from "@/components/badge-progress";
import {
  BadgeRequirements,
  BadgeRewards,
  BadgeTimeline,
  BadgeShare,
  BadgeUnlockAnimation,
} from "@/components/badges";
import { Trophy, Share2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { BadgeType, BadgeRarity } from "@/types/badge";
import {
  SocialSharingService,
  SocialPlatform,
  ShareOptions,
  ShareResult,
} from "@/lib/social-sharing-service";

interface UserBadgeClientProps {
  badgeId: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  type: BadgeType;
  rarity: BadgeRarity;
  points: number;
  requirements: string[];
  rewards: string[];
}

export default function UserBadgeClient({ badgeId }: UserBadgeClientProps) {
  const router = useRouter();
  const { currentUser } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [badge, setBadge] = useState<Badge | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

  useEffect(() => {
    const fetchBadge = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setBadge({
          id: badgeId,
          name: "Community Champion",
          description:
            "Awarded for outstanding contributions to the SFDSA community",
          type: "chat-participation",
          rarity: "legendary",
          points: 1000,
          requirements: [
            "Complete 50 community interactions",
            "Receive 10 positive feedback ratings",
            "Participate in 5 community events",
          ],
          rewards: [
            "1000 points",
            "Special profile badge",
            "Early access to new features",
            "Recognition on leaderboard",
          ],
        });
        setProgress(75);
        setIsUnlocked(true);
        setIsLoading(false);
      } catch (_error) {
        console.error("Error fetching badge:", _error);
        toast({
          title: "Error",
          description: "Failed to load badge details. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchBadge();
  }, [badgeId, toast]);

  const handleShare = async (platform: SocialPlatform) => {
    if (!badge || !currentUser?.id) {
      toast({
        title: "Cannot Share",
        description: "Badge data or user information is missing.",
        variant: "destructive",
      });
      return;
    }

    const shareOptions: ShareOptions = {
      title: `I unlocked the ${badge.name} badge!`,
      text: badge.description,
      url: window.location.href, // Ideally, this would be a public URL to the user's badge page
      achievementType: "badge",
      achievementId: badge.id,
      userId: currentUser.id,
      // If your badge object has an image URL, you can add it here:
      // image: badge.imageUrl,
    };

    try {
      const result: ShareResult = await SocialSharingService.share(
        platform,
        shareOptions,
      );
      if (result.success) {
        toast({
          title: "Shared Successfully!",
          description: `Your achievement was shared to ${platform}.`,
        });
      } else {
        toast({
          title: "Sharing Failed",
          description:
            result.error || `Could not share to ${platform}. Please try again.`,
          variant: "destructive",
        });
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      console.error(`Error sharing to ${platform}:`, err);
      toast({
        title: "Sharing Error",
        description: `An unexpected error occurred while trying to share to ${platform}. ${err.message}`,
        variant: "destructive",
      });
    }
  };

  if (isLoading || !badge) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/badges")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Badges
          </Button>
          <h1 className="text-3xl font-bold text-[#0A3C1F]">{badge.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Badge Details</CardTitle>
                <CardDescription>{badge.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-8">
                  <AchievementBadge
                    type={badge.type}
                    earned={isUnlocked}
                    size="xl"
                  />
                  <BadgeProgress badgeType={badge.type} progress={progress} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <BadgeRequirements
                    requirements={badge.requirements}
                    progress={progress}
                  />
                  <BadgeRewards rewards={badge.rewards} unlocked={isUnlocked} />
                </div>

                <div className="mt-8 flex justify-center gap-4">
                  {isUnlocked ? (
                    <>
                      <Button
                        onClick={() => handleShare("facebook")}
                        className="gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        Share to Facebook
                      </Button>
                      <Button
                        onClick={() => handleShare("twitter")}
                        className="gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        Share to Twitter
                      </Button>
                      <Button
                        onClick={() => handleShare("linkedin")}
                        className="gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        Share to LinkedIn
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push("/badges")}
                        className="gap-2"
                      >
                        <Trophy className="h-4 w-4" />
                        View All Badges
                      </Button>
                    </>
                  ) : (
                    <Button disabled className="gap-2">
                      <Trophy className="h-4 w-4" />
                      {progress}% Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest progress towards this badge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BadgeTimeline userId={currentUser?.id} />
              </CardContent>
            </Card>

            <BadgeShare
              badgeId={badgeId}
              badgeName={badge.name}
              isUnlocked={isUnlocked}
              onShare={handleShare}
            />
          </div>
        </div>
      </div>

      {showUnlockAnimation && (
        <BadgeUnlockAnimation
          badge={badge}
          onComplete={() => setShowUnlockAnimation(false)}
        />
      )}
    </main>
  );
}

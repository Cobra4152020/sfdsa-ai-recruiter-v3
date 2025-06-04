"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Trophy,
  Share2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { logError } from "@/lib/error-monitoring";
import { getClientSideSupabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";

// interface TriviaAnswer { // Commented out unused interface
//   questionId: string;
//   isCorrect: boolean;
//   timestamp: string;
// }

// interface TriviaAttempt { // Commented out unused interface

interface TriviaBadge {
  id: string;
  name: string;
  description: string;
  requirements: {
    correctAnswers: number;
    attempts: number;
    categories?: string[];
  };
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

interface BadgeProgress {
  id: string;
  userId: string;
  badgeId: string;
  progress: number;
  isUnlocked: boolean;
  unlockedAt: string | null;
  actionsCompleted: string[];
  lastActionAt: string;
  badge: TriviaBadge;
}

interface DatabaseBadgeProgress {
  id: string;
  user_id: string;
  badge_id: string;
  progress: number;
  is_unlocked: boolean;
  unlocked_at: string | null;
  actions_completed: string[];
  last_action_at: string;
  badge: {
    id: string;
    name: string;
    description: string;
    requirements: {
      correctAnswers: number;
      attempts: number;
      categories?: string[];
    };
    icon: string;
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  };
}

export function TriviaBadges() {
  const [badges, setBadges] = useState<BadgeProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<TriviaBadge | null>(null);
  const { toast } = useToast();

  const fetchUserBadges = useCallback(async () => {
    try {
      const supabase = getClientSideSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data: badgeProgress, error: progressError } = await supabase
        .from("badge_progress")
        .select(
          `
          id,
          user_id,
          badge_id,
          progress,
          is_unlocked,
          unlocked_at,
          actions_completed,
          last_action_at,
          badge:badges (
            id,
            name,
            description,
            requirements,
            icon,
            rarity
          )
        `,
        )
        .eq("user_id", user.id)
        .order("unlocked_at", { ascending: false });

      if (progressError) {
        throw progressError;
      }

      // Transform database response to match our interface
      const transformedBadges: BadgeProgress[] = (
        badgeProgress as unknown as DatabaseBadgeProgress[]
      ).map((progress) => ({
        id: progress.id,
        userId: progress.user_id,
        badgeId: progress.badge_id,
        progress: progress.progress,
        isUnlocked: progress.is_unlocked,
        unlockedAt: progress.unlocked_at,
        actionsCompleted: progress.actions_completed,
        lastActionAt: progress.last_action_at,
        badge: progress.badge,
      }));

      setBadges(transformedBadges);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch badges";
      logError(
        "Error fetching user badges",
        error instanceof Error ? error : new Error(errorMessage),
        "TriviaBadges",
      );
      setError(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserBadges();
  }, [fetchUserBadges]);

  const handleShare = useCallback(
    async (platform: string) => {
      if (!selectedBadge) return;

      try {
        const shareText = `I earned the ${selectedBadge.name} badge in the SFDSA Trivia Challenge! 🏆`;
        const shareUrl = window.location.href;

        switch (platform) {
          case "facebook":
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
              "_blank",
            );
            break;
          case "twitter":
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
              "_blank",
            );
            break;
          case "linkedin":
            window.open(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
              "_blank",
            );
            break;
          case "email":
            window.location.href = `mailto:?subject=${encodeURIComponent("I earned a badge!")}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
            break;
          default:
            if (navigator.share) {
              await navigator.share({
                title: "SFDSA Trivia Badge",
                text: shareText,
                url: shareUrl,
              });
            }
        }

        // Record the share
        const supabase = getClientSideSupabase();
        const { error: shareError } = await supabase
          .from("badge_shares")
          .insert({
            user_id: badges[0]?.userId,
            badge_id: selectedBadge.id,
            platform,
            share_url: shareUrl,
          });

        if (shareError) {
          throw shareError;
        }

        toast({
          title: "Share recorded!",
          description: "Thanks for sharing your achievement!",
          variant: "default",
        });
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          logError("Error sharing badge", error, "TriviaBadges");
          toast({
            title: "Share failed",
            description: "Could not share badge. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        setShowShareDialog(false);
      }
    },
    [selectedBadge, badges, toast],
  );

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case "legendary":
        return "text-orange-500";
      case "epic":
        return "text-purple-500";
      case "rare":
        return "text-blue-500";
      case "uncommon":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trivia Badges</CardTitle>
          <CardDescription>Loading your achievements...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trivia Badges</CardTitle>
          <CardDescription>Error loading badges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-red-500 dark:text-red-400 mb-4">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error.message}
          </div>
          <Button
            onClick={() => fetchUserBadges()}
            className="mt-4"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Trivia Badges</CardTitle>
          <CardDescription>
            Your achievements in the SFDSA Trivia Challenge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {badges.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  No badges yet
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Start playing trivia to earn badges!
                </p>
              </div>
            ) : (
              badges.map((badgeProgress) => (
                <div
                  key={badgeProgress.id}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0">
                    <Trophy
                      className={`h-8 w-8 ${getRarityColor(badgeProgress.badge.rarity)}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">
                        {badgeProgress.badge.name}
                      </h3>
                      <Badge
                        variant={
                          badgeProgress.badge.rarity === "legendary"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {badgeProgress.badge.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {badgeProgress.badge.description}
                    </p>
                    <div className="mt-2">
                      <Progress
                        value={badgeProgress.progress}
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {badgeProgress.progress}% complete
                      </p>
                    </div>
                    {badgeProgress.isUnlocked && badgeProgress.unlockedAt && (
                      <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Earned on{" "}
                        {new Date(
                          badgeProgress.unlockedAt,
                        ).toLocaleDateString()}
                      </div>
                    )}
                    {badgeProgress.isUnlocked && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setSelectedBadge(badgeProgress.badge);
                          setShowShareDialog(true);
                        }}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Share Your Badge</DialogTitle>
          <DialogDescription>
            Share your achievement with friends and colleagues!
          </DialogDescription>

          <div className="grid grid-cols-2 gap-4 my-4">
            <Button
              className="bg-[#1877F2] hover:bg-[#1877F2]/90"
              onClick={() => handleShare("facebook")}
            >
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            <Button
              className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
              onClick={() => handleShare("twitter")}
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button
              className="bg-[#0A66C2] hover:bg-[#0A66C2]/90"
              onClick={() => handleShare("linkedin")}
            >
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              onClick={() => handleShare("email")}
              className="border-[#0A3C1F] text-[#0A3C1F]"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>

          <div className="bg-[#0A3C1F]/5 p-3 rounded-lg text-sm">
            <p className="font-medium">Customize your message:</p>
            <textarea
              className="w-full mt-2 p-2 border rounded-md text-sm"
              rows={3}
              defaultValue={`I earned the ${selectedBadge?.name} badge in the SFDSA Trivia Challenge! 🏆`}
            ></textarea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

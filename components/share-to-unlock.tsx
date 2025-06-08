"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Lock,
  Unlock,
  Share2,
  Trophy,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";
import { AchievementBadge } from "./achievement-badge";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/user-context";
import { useAuthModal } from "@/context/auth-modal-context";
import confetti from "canvas-confetti";
import type { BadgeType } from "@/types/badge";

interface ShareToUnlockProps {
  badgeType: string;
  badgeName: string;
  badgeDescription: string;
  requiredShares?: number;
  className?: string;
}

export function ShareToUnlock({
  badgeType,
  badgeName,
  badgeDescription,
  requiredShares = 1,
  className,
}: ShareToUnlockProps) {
  const [isLocked, setIsLocked] = useState(true);
  const [sharesCompleted, setSharesCompleted] = useState(0);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn, currentUser } = useUser();
  const { openModal } = useAuthModal();

  const handleShare = (platform: string) => {
    // Create share content
    const shareText = `Join the San Francisco Deputy Sheriff's Association recruitment program! Help serve and protect our community. #SFDSA #LawEnforcement #SanFrancisco`;
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002';
    
    // Open actual social media sharing URLs
    let shareLink = '';
    
    switch (platform) {
      case 'Facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'Twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'LinkedIn':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent('SFDSA Recruitment Program')}&summary=${encodeURIComponent(shareText)}`;
        break;
      case 'Email':
        const emailSubject = 'Join the SFDSA Recruitment Program';
        const emailBody = `${shareText}\n\nLearn more and apply: ${shareUrl}`;
        shareLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        break;
      default:
        // For other platforms or if sharing fails, copy to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
          toast({
            title: "Link copied!",
            description: "Share link copied to clipboard",
            duration: 3000,
          });
        }
        break;
    }
    
    // Open the share link if available
    if (shareLink) {
      try {
        window.open(shareLink, '_blank', 'width=600,height=400');
      } catch (error) {
        console.error('Error opening share link:', error);
        // Fallback: copy to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
          toast({
            title: "Share link copied",
            description: "Couldn't open sharing window, but link was copied to clipboard",
            variant: "default",
          });
        }
      }
    }
    
    // Award points for sharing
    awardSharingPoints(platform);
    
    // Update share progress
    setSharesCompleted((prev) => {
      const newCount = prev + 1;

      // Check if we've reached the required shares to unlock
      if (newCount >= requiredShares && isLocked) {
        setTimeout(() => {
          setIsLocked(false);

          // Trigger confetti when unlocked
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 0.5, y: 0.6 },
            colors: ["#FFD700", "#0A3C1F", "#FFFFFF"],
          });

          toast({
            title: "Badge Unlocked!",
            description: `You've earned the ${badgeName} badge!`,
            duration: 5000,
          });
        }, 500);
      }

      return newCount;
    });

    toast({
      title: `Shared on ${platform}!`,
      description: `${sharesCompleted + 1}/${requiredShares} shares completed`,
      duration: 3000,
    });

    setShowShareDialog(false);
  };

  const handleShareClick = () => {
    if (!isLoggedIn) {
      openModal("signup", "recruit");
      return;
    }

    setShowShareDialog(true);
  };

  const awardSharingPoints = async (platform: string) => {
    if (!currentUser?.id) return;
    
    try {
      const response = await fetch("/api/points/award", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          points: 25,
          action: "social_sharing",
          description: `Shared recruitment content on ${platform}`
        })
      });

      if (response.ok) {
        toast({
          title: "🎉 Points Earned!",
          description: `+25 points for sharing on ${platform}!`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error awarding sharing points:", error);
    }
  };

  return (
    <>
      <Card className={`overflow-hidden ${className}`}>
        <CardHeader
          className={`bg-gradient-to-r ${isLocked ? "from-gray-700 to-gray-900" : "from-[#0A3C1F] to-[#0A3C1F]/80"} text-white`}
        >
          <CardTitle className="flex items-center">
            {isLocked ? (
              <Lock className="mr-2 h-5 w-5" />
            ) : (
              <Unlock className="mr-2 h-5 w-5" />
            )}
            {isLocked ? "Locked Badge" : "Badge Unlocked!"}
          </CardTitle>
          <CardDescription className="text-gray-200">
            {isLocked
              ? `Share to unlock this exclusive badge (${sharesCompleted}/${requiredShares})`
              : "Congratulations! You've unlocked this badge."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center">
          <div
            className={`relative ${isLocked ? "opacity-50 filter grayscale" : ""}`}
          >
            <AchievementBadge
              type={badgeType as BadgeType}
              size="lg"
              earned={!isLocked}
            />
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 rounded-full p-2">
                  <Lock className="h-8 w-8 text-white" />
                </div>
              </div>
            )}
          </div>
          <h3 className="mt-4 font-bold text-lg text-center">{badgeName}</h3>
          <p className="mt-1 text-sm text-gray-500 text-center">
            {badgeDescription}
          </p>

          {isLocked && (
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-[#0A3C1F] h-2.5 rounded-full"
                style={{
                  width: `${(sharesCompleted / requiredShares) * 100}%`,
                }}
              ></div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {isLocked ? (
            <Button
              onClick={handleShareClick}
              className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share to Unlock
            </Button>
          ) : (
            <Button
              onClick={handleShareClick}
              variant="outline"
              className="w-full border-[#0A3C1F] text-[#0A3C1F]"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Share Your Achievement
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Share {isLocked ? "to Unlock Badge" : "Your Achievement"}
            </DialogTitle>
            <DialogDescription>
              {isLocked
                ? `Share ${requiredShares - sharesCompleted} more time${requiredShares - sharesCompleted !== 1 ? "s" : ""} to unlock the ${badgeName} badge.`
                : `Share your achievement with others and inspire them to join!`}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#1877F2]/90"
              onClick={() => handleShare("Facebook")}
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button
              className="flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
              onClick={() => handleShare("Twitter")}
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              className="flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#0A66C2]/90"
              onClick={() => handleShare("LinkedIn")}
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
            <Button
              className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700"
              onClick={() => handleShare("Email")}
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { useBadgeSystem } from "@/hooks/use-badge-system";
import { BadgeEarnedPopup } from "@/components/badge-earned-popup";

type BadgeType =
  | "written"
  | "oral"
  | "physical"
  | "polygraph"
  | "psychological"
  | "full"
  | "chat-participation"
  | "application-started"
  | "application-completed"
  | "first-response"
  | "frequent-user"
  | "resource-downloader";

interface BadgeAwardButtonProps {
  badgeType: BadgeType;
  badgeName?: string;
  badgeDescription?: string;
  participationPoints?: number;
  shareMessage?: string;
  buttonText?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onSuccess?: (badge: EarnedBadge, alreadyEarned: boolean) => void;
  onError?: (error: string) => void;
}

// Define a minimal Badge interface for earnedBadge
interface EarnedBadge {
  badge_type?: BadgeType;
  name?: string;
  description?: string;
}

export function BadgeAwardButton({
  badgeType,
  badgeName,
  badgeDescription,
  participationPoints,
  shareMessage,
  buttonText = "Award Badge",
  variant = "default",
  size = "default",
  className,
  onSuccess,
  onError,
}: BadgeAwardButtonProps) {
  const { awardBadge, isAwarding } = useBadgeSystem();
  const [showPopup, setShowPopup] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<EarnedBadge | null>(null);

  const handleClick = async () => {
    const result = await awardBadge({
      type: badgeType,
      name: badgeName,
      description: badgeDescription,
      participationPoints,
      shareMessage,
    });

    if (result.success) {
      if (onSuccess) {
        onSuccess(result.badge as EarnedBadge, !!result.alreadyEarned);
      }

      if (!result.alreadyEarned) {
        setEarnedBadge(result.badge as EarnedBadge);
        setShowPopup(true);
      }
    } else if (onError) {
      onError(result.message || "Failed to award badge");
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
        disabled={isAwarding}
      >
        <Award className="mr-2 h-4 w-4" />
        {isAwarding ? "Awarding..." : buttonText}
      </Button>

      {showPopup && earnedBadge && (
        <BadgeEarnedPopup
          badgeType={earnedBadge.badge_type || badgeType}
          badgeName={earnedBadge.name || badgeName || ""}
          badgeDescription={earnedBadge.description || badgeDescription || ""}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}

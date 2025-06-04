"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { AchievementShareDialog } from "./achievement-share-dialog";
import { useUser } from "@/context/user-context";

interface LeaderboardShareButtonProps {
  position: number;
  points: number;
  className?: string;
}

export function LeaderboardShareButton({
  position,
  points,
  className,
}: LeaderboardShareButtonProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { currentUser } = useUser();

  if (!currentUser) return null;

  const positionText = getPositionText(position);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={className}
        onClick={() => setIsShareDialogOpen(true)}
      >
        <Share2 className="h-4 w-4 mr-1" />
        Share
      </Button>

      <AchievementShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        achievement={{
          title: `${positionText} Place on the SF Sheriff Recruitment Leaderboard!`,
          description: `I'm currently in ${positionText.toLowerCase()} place with ${points.toLocaleString()} points in my journey to become a San Francisco Deputy Sheriff! Join me in this exciting career path.`,
          shareUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/leaderboard?highlight=${currentUser.id}`,
        }}
      />
    </>
  );
}

function getPositionText(position: number): string {
  if (position === 1) return "1st";
  if (position === 2) return "2nd";
  if (position === 3) return "3rd";
  return `${position}th`;
}

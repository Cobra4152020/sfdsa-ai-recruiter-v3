"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { AchievementShareDialog } from "./achievement-share-dialog";
import { useUser } from "@/context/user-context";

interface RecruitmentProgressShareProps {
  progress: number;
  stage: string;
  className?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

export function RecruitmentProgressShare({
  progress,
  stage,
  className,
  variant = "default",
  size = "default",
}: RecruitmentProgressShareProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { currentUser } = useUser();

  if (!currentUser) return null;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsShareDialogOpen(true)}
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share My Progress
      </Button>

      <AchievementShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        achievement={{
          title: `${progress}% Through the SF Sheriff Recruitment Process!`,
          description: `I&apos;m currently at the ${stage} stage (${progress}% complete) in my journey to become a San Francisco Deputy Sheriff! Join me in this exciting career path.`,
          shareUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/profile/${currentUser.id}?ref=share`,
        }}
      />
    </>
  );
}

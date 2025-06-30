"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { BadgeSharingDialog } from "./badge-sharing-dialog";

interface RecruitmentBadgeProps {
  userName: string;
  showShareOptions?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RecruitmentBadge({
  userName,
  showShareOptions = true,
  size = "md",
  className = "",
}: RecruitmentBadgeProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  // Size classes
  const sizeClasses = {
    sm: {
      badge: "w-32 h-32",
      icon: "w-8 h-8",
      title: "text-xs",
      subtitle: "text-[10px]",
    },
    md: {
      badge: "w-40 h-40",
      icon: "w-10 h-10",
      title: "text-sm",
      subtitle: "text-xs",
    },
    lg: {
      badge: "w-48 h-48",
      icon: "w-12 h-12",
      title: "text-base",
      subtitle: "text-sm",
    },
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`relative ${sizeClasses[size].badge}`}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFD700]/60 opacity-50 blur-md"></div>
        <div className="relative h-full w-full rounded-full bg-gradient-to-br from-primary to-primary/80 p-1">
          <div className="h-full w-full rounded-full bg-primary flex flex-col items-center justify-center text-white p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${sizeClasses[size].icon} text-[#FFD700] mb-2`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div className="text-center">
              <div
                className={`font-bold text-[#FFD700] ${sizeClasses[size].title}`}
              >
                SF DEPUTY SHERIFF
              </div>
              <div className={`mt-1 font-medium ${sizeClasses[size].subtitle}`}>
                RECRUIT CANDIDATE
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 text-center">
        <h3 className="font-bold text-sm">{userName}</h3>
        <p className="text-xs text-muted-foreground">Recruitment Candidate</p>
      </div>

      {showShareOptions && (
        <Button
          variant="outline"
          size="sm"
          className="mt-2 text-xs h-8"
          onClick={() => setIsShareDialogOpen(true)}
        >
          <Share2 className="h-3 w-3 mr-1" />
          Share Badge
        </Button>
      )}

      <BadgeSharingDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        badges={[]}
        userName={userName}
      />
    </div>
  );
}

"use client";

import { Trophy, Star, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BadgeType } from "@/types/badge";
import { useState } from "react";

interface AchievementBadgeProps {
  type: BadgeType;
  earned: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showTooltip?: boolean;
  imageUrl?: string;
}

export function AchievementBadge({
  type,
  earned,
  size = "md",
  showTooltip = true,
  imageUrl,
}: AchievementBadgeProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  const imageSizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10", 
    lg: "h-14 w-14",
    xl: "h-20 w-20",
  };

  const baseClasses = cn(
    "rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden",
    sizeClasses[size],
    earned
      ? "bg-gradient-to-br from-[#0A3C1F] to-[#0A3C1F]/80 text-white shadow-lg hover:shadow-xl"
      : "bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600",
  );

  const iconClasses = cn(
    "transition-transform duration-300",
    earned && "transform hover:scale-110",
    size === "sm"
      ? "h-4 w-4"
      : size === "md"
        ? "h-6 w-6"
        : size === "lg"
          ? "h-8 w-8"
          : "h-12 w-12",
  );

  // Get the default image URL based on badge type
  const getDefaultImageUrl = () => {
    const imageMap: Record<string, string> = {
      // Achievement Badges
      physical: "/badges/physical.png",
      psychological: "/badges/psychological.png", 
      oral: "/badges/oral.png",
      polygraph: "/badges/polygraph.png",
      written: "/badges/written.png",
      // Process Badges
      full: "/badges/full.png",
      "chat-participation": "/badges/chat-participation.png",
      "first-response": "/badges/first-response.png",
      "application-started": "/badges/application-started.png",
      "application-completed": "/badges/application-completed.png",
      // Participation Badges
      "frequent-user": "/badges/frequent-user.png",
      "resource-downloader": "/badges/resource-downloader.png",
      "hard-charger": "/badges/hard-charger.png",
    };
    return imageMap[type] || null;
  };

  const getBadgeIcon = () => {
    switch (type) {
      case "written":
      case "oral":
      case "physical":
      case "polygraph":
      case "psychological":
        return <Medal className={iconClasses} />;
      case "full":
        return <Trophy className={iconClasses} />;
      default:
        return <Star className={iconClasses} />;
    }
  };

  const finalImageUrl = imageUrl || getDefaultImageUrl();
  const shouldShowImage = finalImageUrl && !imageError;

  return (
    <div
      className={baseClasses}
      title={
        showTooltip
          ? `${type.charAt(0).toUpperCase() + type.slice(1)} Badge`
          : undefined
      }
    >
      {shouldShowImage ? (
        <img
          src={finalImageUrl}
          alt={`${type} badge`}
          className={cn(
            "transition-transform duration-300 object-contain",
            earned && "transform hover:scale-110",
            imageSizeClasses[size]
          )}
          onError={() => setImageError(true)}
        />
      ) : (
        getBadgeIcon()
      )}
      
      {/* Earned indicator overlay */}
      {earned && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10 rounded-full" />
      )}
    </div>
  );
}

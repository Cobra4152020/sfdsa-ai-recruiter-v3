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
      ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg hover:shadow-xl"
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
    if (!type) return null;
    
    const imageMap: Record<string, string | null> = {
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
      // Trivia & Game Badges - use default icons for now
      "trivia-titan": null,
      "sf-baseball-participant": null,
      "sf-baseball-enthusiast": null,
      "sf-baseball-master": null,
      "sf-basketball-participant": null,
      "sf-basketball-enthusiast": null,
      "sf-basketball-master": null,
      "sf-districts-participant": null,
      "sf-districts-enthusiast": null,
      "sf-districts-master": null,
      "sf-football-participant": null,
      "sf-football-enthusiast": null,
      "sf-football-master": null,
      "sf-day-trips-participant": null,
      "sf-day-trips-enthusiast": null,
      "sf-day-trips-master": null,
      "sf-tourist-spots-participant": null,
      "sf-tourist-spots-enthusiast": null,
      "sf-tourist-spots-master": null,
      // Special Achievement Badges - use default icons for now
      "point-pioneer": null,
      "recruit-referrer": null,
      "document-master": null,
      "community-event": null,
      "holiday-hero": null,
      "survey-superstar": null,
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
      case "document-master":
        return <Medal className={iconClasses} />;
      case "full":
      case "trivia-titan":
      case "point-pioneer":
        return <Trophy className={iconClasses} />;
      case "sf-baseball-participant":
      case "sf-baseball-enthusiast":
      case "sf-baseball-master":
      case "sf-basketball-participant":
      case "sf-basketball-enthusiast":
      case "sf-basketball-master":
      case "sf-districts-participant":
      case "sf-districts-enthusiast":
      case "sf-districts-master":
      case "sf-football-participant":
      case "sf-football-enthusiast":
      case "sf-football-master":
      case "sf-day-trips-participant":
      case "sf-day-trips-enthusiast":
      case "sf-day-trips-master":
      case "sf-tourist-spots-participant":
      case "sf-tourist-spots-enthusiast":  
      case "sf-tourist-spots-master":
        return <Medal className={iconClasses} />;
      case "recruit-referrer":
      case "community-event":
      case "holiday-hero":
      case "survey-superstar":
        return <Star className={iconClasses} />;
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
        showTooltip && type
          ? `${type.charAt(0).toUpperCase() + type.slice(1)} Badge`
          : undefined
      }
    >
      {shouldShowImage ? (
        <img
          src={finalImageUrl}
          alt={`${type || 'unknown'} badge`}
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

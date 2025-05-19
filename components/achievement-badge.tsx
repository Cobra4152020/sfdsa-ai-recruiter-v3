"use client"

import { Trophy, Star, Medal } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BadgeType } from "@/types/badge"

interface AchievementBadgeProps {
  type: BadgeType
  earned: boolean
  size?: "sm" | "md" | "lg" | "xl"
}

export function AchievementBadge({ type, earned, size = "md" }: AchievementBadgeProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  }

  const baseClasses = cn(
    "rounded-full flex items-center justify-center transition-all duration-300",
    sizeClasses[size],
    earned
      ? "bg-gradient-to-br from-[#0A3C1F] to-[#0A3C1F]/80 text-white shadow-lg hover:shadow-xl"
      : "bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
  )

  const iconClasses = cn(
    "transition-transform duration-300",
    earned && "transform hover:scale-110",
    size === "sm" ? "h-4 w-4" : size === "md" ? "h-6 w-6" : size === "lg" ? "h-8 w-8" : "h-12 w-12"
  )

  const getBadgeIcon = () => {
    switch (type) {
      case "written":
      case "oral":
      case "physical":
      case "polygraph":
      case "psychological":
        return <Medal className={iconClasses} />
      case "full":
        return <Trophy className={iconClasses} />
      default:
        return <Star className={iconClasses} />
    }
  }

  return (
    <div className={baseClasses} title={`${type.charAt(0).toUpperCase() + type.slice(1)} Badge`}>
      {getBadgeIcon()}
    </div>
  )
}

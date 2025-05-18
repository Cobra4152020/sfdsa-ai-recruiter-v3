"use client"

import { Trophy, Star, Medal } from "lucide-react"
import { cn } from "@/lib/utils"

interface AchievementBadgeProps {
  type: string
  rarity: string
  points: number
  earned: boolean
  size?: "sm" | "md" | "lg" | "xl"
}

export function AchievementBadge({
  type,
  rarity,
  points,
  earned,
  size = "md"
}: AchievementBadgeProps) {
  const getBadgeIcon = () => {
    switch (type) {
      case "achievement":
        return <Trophy className="h-full w-full" />
      case "milestone":
        return <Medal className="h-full w-full" />
      default:
        return <Star className="h-full w-full" />
    }
  }

  const getBadgeColor = () => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-600"
      case "rare":
        return "bg-blue-100 text-blue-600"
      case "epic":
        return "bg-purple-100 text-purple-600"
      case "legendary":
        return "bg-yellow-100 text-yellow-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-12 h-12"
      case "md":
        return "w-16 h-16"
      case "lg":
        return "w-20 h-20"
      case "xl":
        return "w-24 h-24"
      default:
        return "w-16 h-16"
    }
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "rounded-lg flex items-center justify-center p-3 transition-all",
          getSizeClasses(),
          getBadgeColor(),
          !earned && "opacity-50 grayscale"
        )}
      >
        {getBadgeIcon()}
      </div>
      <div className="absolute -bottom-2 -right-2 bg-[#0A3C1F] text-white text-xs font-medium px-2 py-0.5 rounded-full">
        {points} pts
      </div>
    </div>
  )
}

"use client"

import { Trophy, Star, Award, Medal } from "lucide-react"
import type { BadgeType, BadgeRarity } from "@/types/badge"
import { cn } from "@/lib/utils"

interface AchievementBadgeProps {
  type: BadgeType
  rarity: BadgeRarity
  points: number
  earned: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const RARITY_COLORS = {
  common: "bg-gray-100 text-gray-600",
  uncommon: "bg-green-100 text-green-600",
  rare: "bg-blue-100 text-blue-600",
  epic: "bg-purple-100 text-purple-600",
  legendary: "bg-yellow-100 text-yellow-600",
} as const

const TYPE_ICONS = {
  achievement: Trophy,
  skill: Star,
  participation: Medal,
  special: Award,
} as const

const SIZE_CLASSES = {
  sm: "h-12 w-12 p-2",
  md: "h-16 w-16 p-3",
  lg: "h-20 w-20 p-4",
} as const

export function AchievementBadge({
  type,
  rarity,
  points,
  earned,
  size = "md",
  className,
}: AchievementBadgeProps) {
  const Icon = TYPE_ICONS[type]
  const rarityColor = RARITY_COLORS[rarity]
  const sizeClass = SIZE_CLASSES[size]

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          "rounded-full flex items-center justify-center transition-all duration-200",
          rarityColor,
          sizeClass,
          !earned && "opacity-50 grayscale",
          className
        )}
      >
        <Icon className="w-full h-full" />
      </div>
      {points > 0 && (
        <div className={cn(
          "absolute -bottom-2 -right-2 bg-white rounded-full px-2 py-0.5 text-xs font-bold border shadow-sm",
          earned ? "text-green-600 border-green-200" : "text-gray-400 border-gray-200"
        )}>
          +{points}
        </div>
      )}
    </div>
  )
}

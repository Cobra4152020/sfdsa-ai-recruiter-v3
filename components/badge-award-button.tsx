"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Award } from "lucide-react"
import { useBadgeSystem } from "@/hooks/use-badge-system"
import { BadgeEarnedPopup } from "@/components/badge-earned-popup"
import type { BadgeType } from "@/lib/badge-utils"

interface BadgeAwardButtonProps {
  badgeType: BadgeType
  badgeName?: string
  badgeDescription?: string
  participationPoints?: number
  shareMessage?: string
  buttonText?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  onSuccess?: (badge: any, alreadyEarned: boolean) => void
  onError?: (error: string) => void
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
  const { awardBadge, isAwarding, error } = useBadgeSystem()
  const [showPopup, setShowPopup] = useState(false)
  const [earnedBadge, setEarnedBadge] = useState<any>(null)

  const handleClick = async () => {
    const result = await awardBadge({
      type: badgeType,
      name: badgeName,
      description: badgeDescription,
      participationPoints,
      shareMessage,
    })

    if (result.success) {
      if (onSuccess) {
        onSuccess(result.badge, !!result.alreadyEarned)
      }

      if (!result.alreadyEarned) {
        setEarnedBadge(result.badge)
        setShowPopup(true)
      }
    } else if (onError) {
      onError(result.message || "Failed to award badge")
    }
  }

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={handleClick} disabled={isAwarding}>
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
  )
}

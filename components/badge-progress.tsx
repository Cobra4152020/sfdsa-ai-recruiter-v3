"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AchievementBadge } from "@/components/achievement-badge"
import { useUser } from "@/context/user-context"
import type { BadgeType } from "@/lib/badge-utils"

interface BadgeProgressProps {
  title?: string
  badgeType: BadgeType
  badgeName?: string
  currentValue?: number
  maxValue?: number
  fetchUrl?: string
  className?: string
}

export function BadgeProgress({
  title,
  badgeType,
  badgeName,
  currentValue: initialValue,
  maxValue = 10,
  fetchUrl,
  className,
}: BadgeProgressProps) {
  const { currentUser } = useUser()
  const [currentValue, setCurrentValue] = useState(initialValue || 0)
  const [isLoading, setIsLoading] = useState(!!fetchUrl)
  const [error, setError] = useState<string | null>(null)
  const [earned, setEarned] = useState(false)

  useEffect(() => {
    if (initialValue !== undefined) {
      setCurrentValue(initialValue)
      setEarned(initialValue >= maxValue)
      return
    }

    if (fetchUrl && currentUser?.id) {
      const fetchProgress = async () => {
        setIsLoading(true)
        setError(null)

        try {
          const response = await fetch(fetchUrl.replace("[userId]", currentUser.id))
          const data = await response.json()

          if (!data.success) {
            throw new Error(data.message || "Failed to fetch progress")
          }

          setCurrentValue(data.progress || 0)
          setEarned(data.earned || false)
        } catch (err) {
          console.error("Error fetching badge progress:", err)
          setError(err instanceof Error ? err.message : "Unknown error")
        } finally {
          setIsLoading(false)
        }
      }

      fetchProgress()
    }
  }, [fetchUrl, currentUser?.id, initialValue, maxValue])

  const progressPercentage = Math.min(Math.round((currentValue / maxValue) * 100), 100)

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{title || badgeName || badgeType}</span>
          <AchievementBadge type={badgeType} size="sm" earned={earned} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : (
          <>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>
                {currentValue} / {maxValue}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {earned ? "Badge earned! 🎉" : `${progressPercentage}% complete - ${maxValue - currentValue} more to go`}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

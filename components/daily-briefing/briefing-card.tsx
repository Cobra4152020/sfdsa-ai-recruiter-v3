"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, Award, Check, AlertCircle } from "lucide-react"
import type { DailyBriefing, BriefingStats } from "@/lib/daily-briefing-service"
import { BriefingShareDialog } from "./briefing-share-dialog"
import { BriefingStreakBadge } from "./briefing-streak-badge"
import { useUser } from "@/context/user-context"

interface BriefingCardProps {
  briefing: DailyBriefing
  stats: BriefingStats
  onShare: (platform: string) => Promise<boolean>
}

export function BriefingCard({ briefing, stats, onShare }: BriefingCardProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [shareError, setShareError] = useState<string | null>(null)
  const { currentUser } = useUser()

  const handleShare = async (platform: string) => {
    if (!currentUser) {
      setShareError("You must be logged in to share")
      return false
    }

    setIsSharing(true)
    setShareError(null)

    try {
      const success = await onShare(platform)
      if (!success) {
        setShareError(`You've already shared on ${platform} today`)
      }
      return success
    } catch (error) {
      console.error("Error sharing:", error)
      setShareError("Failed to share. Please try again.")
      return false
    } finally {
      setIsSharing(false)
    }
  }

  // Format the date for display
  const formattedDate = new Date(briefing.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader className="bg-[#0A3C1F] dark:bg-[#121212] text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-[#FFD700]">Sgt. Ken's Daily Briefing</CardTitle>
          <BriefingStreakBadge />
        </div>
        <CardDescription className="text-white/80">
          {formattedDate} • Theme: {briefing.theme}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 pb-4">
        <h2 className="text-xl font-semibold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">{briefing.title}</h2>

        <div className="prose dark:prose-invert max-w-none">
          {briefing.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {shareError && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{shareError}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Award className="h-4 w-4 text-[#0A3C1F] dark:text-[#FFD700]" />
          <span>{stats.total_attendees} recruits attended today</span>

          {stats.user_attended && (
            <span className="flex items-center text-green-600 dark:text-green-400 ml-2">
              <Check className="h-4 w-4 mr-1" />
              You attended
            </span>
          )}
        </div>

        <Button
          onClick={() => setIsShareDialogOpen(true)}
          className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white dark:bg-[#FFD700] dark:text-[#121212] dark:hover:bg-[#FFD700]/90"
          disabled={isSharing}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share & Earn Points
        </Button>
      </CardFooter>

      <BriefingShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        onShare={handleShare}
        briefing={briefing}
        sharedPlatforms={stats.user_platforms_shared}
        isSharing={isSharing}
      />
    </Card>
  )
}

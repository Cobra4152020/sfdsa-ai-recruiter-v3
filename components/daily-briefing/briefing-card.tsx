"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

  // Ensure briefing has all required properties with fallbacks
  const safeBriefing = {
    id: briefing?.id || "",
    title: briefing?.title || "No Briefing Available",
    content: briefing?.content || "There is no briefing content available for today.",
    date: briefing?.date || new Date().toISOString(),
    theme: briefing?.theme || "None",
    created_at: briefing?.created_at || new Date().toISOString(),
    updated_at: briefing?.updated_at || new Date().toISOString(),
  }

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
  const formattedDate = new Date(safeBriefing.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Safely split content
  const contentParagraphs = safeBriefing.content
    ? safeBriefing.content.split("\n\n")
    : ["There is no briefing content available for today."]

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <CardHeader className="bg-[#0A3C1F] dark:bg-[#121212] text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CardTitle className="text-2xl font-bold text-[#FFD700]">Sgt. Ken's Daily Briefing</CardTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <BriefingStreakBadge />
            </motion.div>
          </div>
          <CardDescription className="text-white/80">
            {formattedDate} • Theme: {safeBriefing.theme}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-4">
          <motion.h2
            className="text-xl font-semibold mb-4 text-[#0A3C1F] dark:text-[#FFD700]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {safeBriefing.title}
          </motion.h2>

          <motion.div
            className="prose dark:prose-invert max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {contentParagraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>

          <AnimatePresence>
            {shareError && (
              <motion.div
                className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md flex items-center"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{shareError}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg p-4">
          <motion.div
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Award className="h-4 w-4 text-[#0A3C1F] dark:text-[#FFD700]" />
            <span>{stats.total_attendees} recruits attended today</span>

            <AnimatePresence>
              {stats.user_attended && (
                <motion.span
                  className="flex items-center text-green-600 dark:text-green-400 ml-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Check className="h-4 w-4 mr-1" />
                  You attended
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setIsShareDialogOpen(true)}
              className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white dark:bg-[#FFD700] dark:text-[#121212] dark:hover:bg-[#FFD700]/90"
              disabled={isSharing}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share & Earn Points
            </Button>
          </motion.div>
        </CardFooter>
      </motion.div>

      <BriefingShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        onShare={handleShare}
        briefing={safeBriefing}
        sharedPlatforms={stats.user_platforms_shared}
        isSharing={isSharing}
      />
    </Card>
  )
}

"use client"

import { useState } from "react"
import type { Badge } from "@/lib/badge-utils"
import { AchievementBadge } from "./achievement-badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Share2, Lock, CheckCircle, Trophy, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AchievementShareDialog } from "./achievement-share-dialog"

interface BadgeDetailCardProps {
  badge: Badge
  earned?: boolean
  progress?: number
  currentUser?: { id: string; name: string } | null
  onShare?: () => void
}

export function BadgeDetailCard({ badge, earned = false, progress = 0, currentUser, onShare }: BadgeDetailCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  const handleShareClick = () => {
    if (earned) {
      // If earned, open share dialog
      setIsShareDialogOpen(true)
    } else {
      // If not earned, call onShare to progress
      onShare?.()
    }
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md border border-[#0A3C1F]/20 dark:border-[#FFD700]/20">
      <CardHeader className="pb-2 bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/90 text-white dark:from-[#0A3C1F] dark:to-[#0A3C1F]/90 dark:text-[#FFD700]">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{badge.name}</CardTitle>
          {earned && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CheckCircle className="h-5 w-5 text-[#FFD700]" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>You've earned this badge!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <CardDescription className="text-white/80 dark:text-[#FFD700]/80">
          {badge.category === "application" ? "Application Achievement" : "Participation Recognition"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow py-4">
        <div className="flex flex-col items-center mb-4">
          <div className="relative">
            <AchievementBadge type={badge.id as any} size="lg" earned={earned} />
            {!earned && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                <Lock className="h-6 w-6 text-white/90" />
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{badge.description}</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Requirements:</span>
            {earned ? (
              <span className="text-green-600 dark:text-green-400 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" /> Completed
              </span>
            ) : (
              <span className="text-gray-500">{progress}% Complete</span>
            )}
          </div>

          <Progress value={earned ? 100 : progress} className="h-2 bg-gray-200" />

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 text-xs border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F]/10 dark:border-[#FFD700] dark:text-[#FFD700] dark:hover:bg-[#FFD700]/10"
              >
                <Info className="h-3.5 w-3.5 mr-1" /> View Requirements
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-[#0A3C1F] dark:text-[#FFD700]" />
                  {badge.name} Requirements
                </DialogTitle>
                <DialogDescription>Complete these requirements to earn this badge</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    <AchievementBadge type={badge.id as any} size="sm" earned={earned} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{badge.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{badge.description}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm mb-2">How to earn this badge:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {badge.id === "written" && (
                      <>
                        <li>Complete the written test preparation module</li>
                        <li>Score at least 80% on the practice test</li>
                        <li>Review all study materials</li>
                      </>
                    )}
                    {/* Other badge requirements as before */}
                  </ul>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                {!earned && currentUser && (
                  <Button
                    onClick={() => {
                      onShare?.()
                      setIsDialogOpen(false)
                    }}
                    className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white dark:bg-[#0A3C1F] dark:hover:bg-[#0A3C1F]/90 dark:text-[#FFD700]"
                  >
                    <Share2 className="h-4 w-4 mr-2" /> Share to Progress
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        {currentUser ? (
          <Button
            onClick={handleShareClick}
            className={`w-full ${
              earned
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white dark:bg-[#0A3C1F] dark:hover:bg-[#0A3C1F]/90 dark:text-[#FFD700]"
            }`}
          >
            <Share2 className="h-4 w-4 mr-2" />
            {earned ? "Share Achievement" : "Share to Progress"}
          </Button>
        ) : (
          <Button className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white dark:bg-[#0A3C1F] dark:hover:bg-[#0A3C1F]/90 dark:text-[#FFD700]">
            Sign In to Track Progress
          </Button>
        )}
      </CardFooter>

      {/* Share Dialog */}
      {earned && (
        <AchievementShareDialog
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          achievement={{
            title: `${badge.name} Badge Earned`,
            description: `I earned the ${badge.name} badge in my journey to become a San Francisco Deputy Sheriff! ${badge.description}`,
            imageUrl: badge.icon,
            shareUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/badge/${badge.id}?ref=${currentUser?.id}`,
          }}
        />
      )}
    </Card>
  )
}

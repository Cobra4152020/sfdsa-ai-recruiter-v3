"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { addParticipationPoints } from "@/lib/points-service"
import { useUser } from "@/context/user-context"
import { useAuthModal } from "@/context/auth-modal-context"
import { useClientOnly } from "@/hooks/use-client-only"
import { getWindowOrigin, isBrowser } from "@/lib/utils"

interface GameShareProps {
  score: number
  gameName: string
  gameDescription: string
  onPointsAdded?: (points: number) => void
}

export function GameShare({ score, gameName, gameDescription, onPointsAdded }: GameShareProps) {
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const { toast } = useToast()
  const { currentUser } = useUser()
  const { openModal } = useAuthModal()
  const memoizedGetWindowOrigin = useCallback(() => getWindowOrigin(), [])
  const origin = useClientOnly(memoizedGetWindowOrigin, '')

  const handleShare = async (platform: string) => {
    if (!currentUser) {
      openModal("signin", "recruit")
      return
    }

    if (!isBrowser()) return

    setIsSharing(true)

    try {
      // Add participation points - 10 points for sharing
      const success = await addParticipationPoints(
        currentUser.id,
        10,
        "game_share",
        `Shared ${gameName} score on ${platform}`
      )

      if (success) {
        onPointsAdded?.(10)
        toast({
          title: "Points added!",
          description: "You earned 10 points for sharing your score.",
        })
      }

      // Create share text
      const shareText = `I scored ${score} points in ${gameName} on the SF Deputy Sheriff recruitment site! ${gameDescription}`
      const shareUrl = `${origin}/games/${gameName.toLowerCase()}`

      // Handle platform-specific sharing
      switch (platform) {
        case "Facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(
              shareText,
            )}`,
            "_blank",
          )
          break
        case "Twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            "_blank",
          )
          break
        case "LinkedIn":
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            "_blank",
          )
          break
      }

      setShowShareDialog(false)
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to share your score. Please try again.",
      })
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <>
      <Button onClick={() => setShowShareDialog(true)} className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
        <Share2 className="mr-2 h-4 w-4" />
        Share Your Score
      </Button>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md dialog-gold-border">
          <DialogHeader>
            <DialogTitle>Share Your Score</DialogTitle>
            <DialogDescription>
              Share your score of {score} points in {gameName} and earn bonus participation points!
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4 py-4">
            <Button
              className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#1877F2]/90"
              onClick={() => handleShare("Facebook")}
              disabled={isSharing}
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button
              className="flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
              onClick={() => handleShare("Twitter")}
              disabled={isSharing}
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              className="flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#0A66C2]/90"
              onClick={() => handleShare("LinkedIn")}
              disabled={isSharing}
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowShareDialog(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-900">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

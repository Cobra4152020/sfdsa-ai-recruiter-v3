"use client"

import { useState } from "react"
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

interface GameShareProps {
  score: number
  gameName: string
  gameDescription: string
  onPointsAdded?: (points: number) => void
}

export function GameShare({ score, gameName, gameDescription, onPointsAdded }: GameShareProps) {
  const [showShareDialog, setShowShareDialog] = useState(false)
  const { toast } = useToast()
  const { user, isLoggedIn } = useUser()

  const handleShare = async (platform: string) => {
    const shareText = `I scored ${score} points in the ${gameName} game! Try to beat my score!`
    const shareUrl = window.location.href

    // Simulate sharing
    try {
      // In a real implementation, this would use the Web Share API or platform-specific sharing
      console.log(`Sharing to ${platform}: ${shareText} - ${shareUrl}`)

      toast({
        title: `Shared on ${platform}!`,
        description: "Thanks for sharing your achievement!",
        duration: 3000,
      })

      // Award extra points if logged in
      if (isLoggedIn && user?.id) {
        const sharingPoints = 50
        await addParticipationPoints(user.id, sharingPoints, "game_share", `Shared ${gameName} score on ${platform}`)

        toast({
          title: "Bonus Points!",
          description: `You earned ${sharingPoints} points for sharing!`,
          duration: 3000,
        })

        if (onPointsAdded) {
          onPointsAdded(sharingPoints)
        }
      }

      setShowShareDialog(false)
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Sharing Error",
        description: "There was a problem sharing your result. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <>
      <Button onClick={() => setShowShareDialog(true)} className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
        <Share2 className="mr-2 h-4 w-4" />
        Share Your Score
      </Button>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
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
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button
              className="flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
              onClick={() => handleShare("Twitter")}
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              className="flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#0A66C2]/90"
              onClick={() => handleShare("LinkedIn")}
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

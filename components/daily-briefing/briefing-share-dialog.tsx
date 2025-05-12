"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Check, Loader2 } from "lucide-react"
import type { DailyBriefing } from "@/lib/daily-briefing-service"

interface BriefingShareDialogProps {
  isOpen: boolean
  onClose: () => void
  onShare: (platform: string) => Promise<boolean>
  briefing: DailyBriefing
  sharedPlatforms: string[]
  isSharing: boolean
}

export function BriefingShareDialog({
  isOpen,
  onClose,
  onShare,
  briefing,
  sharedPlatforms,
  isSharing,
}: BriefingShareDialogProps) {
  const [sharingPlatform, setSharingPlatform] = useState<string | null>(null)

  const handleShare = async (platform: string) => {
    if (isSharing) return

    setSharingPlatform(platform)

    try {
      // Generate share text
      const shareText = `Check out Sgt. Ken's Daily Briefing: "${briefing.title}" #SFDeputySheriff #LawEnforcement`
      const shareUrl = `${window.location.origin}/daily-briefing`

      // Handle different platforms
      let shareUrl2 = ""

      switch (platform) {
        case "twitter":
          shareUrl2 = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
          break
        case "facebook":
          shareUrl2 = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
          break
        case "linkedin":
          shareUrl2 = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
          break
        case "instagram":
          // Instagram doesn't have a web sharing API, so we'll just copy to clipboard
          await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
          alert("Text copied to clipboard! Open Instagram and paste to share.")
          break
        case "email":
          shareUrl2 = `mailto:?subject=${encodeURIComponent(`Sgt. Ken's Daily Briefing: ${briefing.title}`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
          break
      }

      // Open share URL in new window if not email or instagram
      if (shareUrl2 && platform !== "instagram") {
        window.open(shareUrl2, "_blank")
      }

      // Record the share
      const success = await onShare(platform)

      if (success) {
        // Wait a moment before closing to show the success state
        setTimeout(() => {
          setSharingPlatform(null)
        }, 1000)
      } else {
        setSharingPlatform(null)
      }
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error)
      setSharingPlatform(null)
    }
  }

  const platforms = [
    { id: "twitter", name: "Twitter", icon: Twitter, color: "bg-blue-400 hover:bg-blue-500" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600 hover:bg-blue-700" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-700 hover:bg-blue-800" },
    { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-600 hover:bg-pink-700" },
    { id: "email", name: "Email", icon: Mail, color: "bg-gray-600 hover:bg-gray-700" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Daily Briefing</DialogTitle>
          <DialogDescription>
            Share Sgt. Ken's Daily Briefing on social media to earn points and help recruit others!
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {platforms.map((platform) => {
            const isShared = sharedPlatforms.includes(platform.id)
            const isCurrentlySharing = sharingPlatform === platform.id
            const Icon = platform.icon

            return (
              <Button
                key={platform.id}
                onClick={() => handleShare(platform.id)}
                className={`${platform.color} text-white flex items-center justify-center gap-2 ${
                  isShared ? "opacity-60" : ""
                }`}
                disabled={isShared || isSharing}
              >
                {isCurrentlySharing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isShared ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                {platform.name}
                {isShared && " ✓"}
              </Button>
            )
          })}
        </div>

        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <p>You'll earn points for each unique platform you share on.</p>
          <p className="mt-1">Twitter/X: 10pts • Facebook: 10pts • LinkedIn: 15pts • Instagram: 10pts • Email: 5pts</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

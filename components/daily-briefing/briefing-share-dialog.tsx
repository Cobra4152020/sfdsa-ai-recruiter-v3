"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Twitter, Facebook, Linkedin, Mail, Instagram } from "lucide-react"

interface PlatformOption {
  id: string
  name: string
  icon: React.ElementType
  color: string
}

interface BriefingShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  briefingId?: string
  briefingTitle?: string
  sharedPlatforms?: string[]
}

export function BriefingShareDialog({
  open,
  onOpenChange,
  briefingId = "default-briefing",
  briefingTitle = "Daily Briefing",
  sharedPlatforms = [],
}: BriefingShareDialogProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState<string | null>(null)
  const [shareError, setShareError] = useState<string | null>(null)

  const platforms: PlatformOption[] = [
    { id: "twitter", name: "Twitter", icon: Twitter, color: "bg-blue-400" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-700" },
    { id: "email", name: "Email", icon: Mail, color: "bg-gray-600" },
    { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-600" },
  ]

  const handleShare = async (platform: PlatformOption) => {
    try {
      setIsSharing(true)
      setShareError(null)

      // Simulate sharing delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create share message
      const shareMessage = `Check out today's San Francisco Deputy Sheriff's briefing: "${briefingTitle}"`

      // Handle different platforms
      if (platform.id === "email") {
        window.open(
          `mailto:?subject=${encodeURIComponent("SF Deputy Sheriff Daily Briefing")}&body=${encodeURIComponent(shareMessage)}`,
        )
      } else {
        // For actual integration, you'd use the Web Share API or platform-specific APIs
        console.log(`Shared to ${platform.name}: ${shareMessage}`)
      }

      setShareSuccess(platform.id)
      setTimeout(() => setShareSuccess(null), 2000)
    } catch (error) {
      console.error("Error sharing:", error)
      setShareError("Failed to share. Please try again.")
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Briefing</DialogTitle>
          <DialogDescription>Share today's briefing with your network to keep everyone informed.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {platforms.map((platform) => {
            const isShared = sharedPlatforms?.includes?.(platform.id) || false
            const isCurrentSuccess = shareSuccess === platform.id

            return (
              <Button
                key={platform.id}
                variant="outline"
                className={`flex items-center justify-center h-20 ${isShared || isCurrentSuccess ? "border-green-500" : ""}`}
                onClick={() => handleShare(platform)}
                disabled={isSharing || isShared}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`rounded-full p-2 ${platform.color} text-white`}>
                    {isShared || isCurrentSuccess ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <platform.icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-sm">{platform.name}</span>
                </div>
              </Button>
            )
          })}
        </div>

        {shareError && <div className="text-red-500 text-sm">{shareError}</div>}

        <DialogFooter className="sm:justify-between">
          <div className="text-sm text-gray-500">
            {sharedPlatforms?.length ? `Shared on ${sharedPlatforms.length} platform(s)` : ""}
          </div>

          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

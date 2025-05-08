"use client"

import { useState, useEffect } from "react"
import { Shield, Award, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import QRCode from "qrcode.react"

interface RecruitmentBadgeProps {
  userName: string
  size?: "sm" | "md" | "lg"
  showShareButton?: boolean
  className?: string
  showShareOptions?: boolean
}

export function RecruitmentBadge({
  userName,
  size = "md",
  showShareButton = true,
  className,
  showShareOptions = true,
}: RecruitmentBadgeProps) {
  const [isClient, setIsClient] = useState(false)
  const [badgeUrl, setBadgeUrl] = useState("")

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== "undefined") {
      // Use user-badge route instead of badge route
      const url = `${window.location.origin}/user-badge/${encodeURIComponent(userName)}`
      setBadgeUrl(url)
    }
  }, [userName])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userName}'s SF Sheriff Recruitment Badge`,
          text: "Check out my recruitment badge for the San Francisco Sheriff's Office!",
          url: badgeUrl,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(badgeUrl)
      toast({
        title: "Badge link copied!",
        description: "Share this link with others to show your interest in joining the SF Sheriff's Office.",
      })
    }
  }

  // Size configuration
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "relative rounded-full bg-gradient-to-br from-[#0A3C1F] to-[#0A3C1F]/80 p-1",
          sizeClasses[size],
          className,
        )}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFD700]/60 opacity-50 blur-md"></div>
        <div className="relative h-full w-full rounded-full bg-[#0A3C1F] flex flex-col items-center justify-center text-white p-4">
          <Shield className="w-1/3 h-1/3 text-[#FFD700] mb-2" />
          <div className="text-center">
            <div className="font-bold text-[#FFD700]">SF DEPUTY SHERIFF</div>
            <div className={cn("mt-1 font-medium", textSizeClasses[size])}>RECRUIT CANDIDATE</div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <h3 className="font-bold text-lg text-[#0A3C1F] dark:text-[#FFD700]">{userName}</h3>
        <p className="text-sm text-[#0A3C1F]/70 dark:text-white/70">Recruitment Candidate</p>
      </div>

      {showShareButton && isClient && (
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-[#0A3C1F] text-[#0A3C1F] dark:border-[#FFD700] dark:text-[#FFD700]"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Share Badge
          </Button>

          {showShareOptions && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-[#0A3C1F] text-[#0A3C1F] dark:border-[#FFD700] dark:text-[#FFD700]"
                >
                  <Award className="h-4 w-4" />
                  QR Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Your Recruitment Badge</DialogTitle>
                  <DialogDescription>
                    Scan this QR code to view {userName}'s SF Sheriff Recruitment Badge
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center p-4">
                  {badgeUrl && <QRCode value={badgeUrl} size={200} />}
                  <p className="mt-4 text-sm text-center text-gray-500">
                    Share this QR code with others to show your interest in joining the SF Sheriff's Office
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  )
}

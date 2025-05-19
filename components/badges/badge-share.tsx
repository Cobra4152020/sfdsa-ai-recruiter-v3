"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Linkedin, Link as LinkIcon } from "lucide-react"
import { useState, useEffect } from "react"

interface BadgeShareProps {
  badgeId: string
  badgeName: string
  isUnlocked: boolean
  onShare: () => void
}

export function BadgeShare({ badgeId, badgeName, isUnlocked, onShare }: BadgeShareProps) {
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    setShareUrl(`${window.location.origin}/badges/${badgeId}`)
  }, [badgeId])

  const shareText = `I just earned the ${badgeName} badge! Join me in becoming a San Francisco Deputy Sheriff. #LawEnforcement #JoinTheForce`

  const socialShareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      onShare()
    } catch (error) {
      console.error("Failed to copy URL:", error)
    }
  }

  if (!isUnlocked) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Achievement</CardTitle>
        <CardDescription>Share your success with others</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                window.open(socialShareUrls.twitter, "_blank")
                onShare()
              }}
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Share on Twitter</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                window.open(socialShareUrls.facebook, "_blank")
                onShare()
              }}
            >
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Share on Facebook</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                window.open(socialShareUrls.linkedin, "_blank")
                onShare()
              }}
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">Share on LinkedIn</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              className={copied ? "text-green-600" : ""}
            >
              <LinkIcon className="h-4 w-4" />
              <span className="sr-only">Copy link</span>
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            Share this achievement to inspire others to join the force!
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
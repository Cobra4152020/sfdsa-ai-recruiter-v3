"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/context/user-context"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeIcon, getThemeColor, getThemeTitle } from "./theme-icon"
import { Calendar, Share2, Medal, Facebook, Twitter, Linkedin, LinkIcon, ThumbsUp, Trophy, Flame } from "lucide-react"
import type { DailyBriefing } from "@/lib/daily-briefing-service"
import confetti from "canvas-confetti"

export function BriefingCard() {
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showRewardDialog, setShowRewardDialog] = useState(false)
  const [pointsAwarded, setPointsAwarded] = useState(0)
  const [streak, setStreak] = useState(0)
  const [attendanceRecorded, setAttendanceRecorded] = useState(false)

  const { currentUser, isLoggedIn } = useUser()
  const { toast } = useToast()

  // Fetch today's briefing on component mount
  useEffect(() => {
    fetchTodaysBriefing()
  }, [])

  // Record attendance when logged in and briefing loads
  useEffect(() => {
    if (isLoggedIn && currentUser && briefing && !attendanceRecorded) {
      recordAttendance()
    }
  }, [isLoggedIn, currentUser, briefing, attendanceRecorded])

  const fetchTodaysBriefing = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/daily-briefing")

      if (!response.ok) {
        throw new Error(`Failed to fetch briefing: ${response.statusText}`)
      }

      const data = await response.json()
      setBriefing(data.briefing)
    } catch (error) {
      console.error("Error fetching briefing:", error)
      setError("Could not load today's briefing. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const recordAttendance = async () => {
    try {
      if (!currentUser || !briefing) return

      const response = await fetch("/api/daily-briefing/attend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          briefingId: briefing.id,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to record attendance: ${response.statusText}`)
      }

      const data = await response.json()

      setAttendanceRecorded(true)

      // Only show reward dialog for first-time attendance of this briefing
      if (!data.alreadyAttended) {
        setPointsAwarded(data.pointsAwarded)
        setStreak(data.newStreak)

        // Show confetti for streaks of 3 or more
        if (data.newStreak >= 3) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })
        }

        setShowRewardDialog(true)
      }
    } catch (error) {
      console.error("Error recording attendance:", error)
      toast({
        title: "Attendance Error",
        description: "We couldn't record your attendance. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async (platform: string) => {
    if (!isLoggedIn || !currentUser || !briefing) {
      setShowShareDialog(false)
      return
    }

    try {
      // First record the share in our system
      const response = await fetch("/api/daily-briefing/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          briefingId: briefing.id,
          platform,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to record share: ${response.statusText}`)
      }

      const data = await response.json()

      // Show notification about points earned
      toast({
        title: "Points Awarded!",
        description: `You earned ${data.pointsAwarded} points for sharing Sgt. Ken's briefing!`,
        variant: "default",
      })

      // Generate share text
      const shareText = `Sgt. Ken's Daily Briefing: "${briefing.quote}" Join me in learning what it takes to be a San Francisco Deputy Sheriff.`
      const shareUrl = window.location.origin + "/daily-briefing"

      // Perform the actual share based on platform
      switch (platform) {
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            "_blank",
          )
          break
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
            "_blank",
          )
          break
        case "linkedin":
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank")
          break
        case "copy":
          navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
          toast({
            title: "Link Copied!",
            description: "The briefing link has been copied to your clipboard.",
            variant: "default",
          })
          break
      }

      setShowShareDialog(false)
    } catch (error) {
      console.error("Error sharing briefing:", error)
      toast({
        title: "Sharing Error",
        description: "We couldn't process your share. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-7 w-60" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-28 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full rounded-md" />
        </CardFooter>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full shadow-lg border-red-300">
        <CardHeader className="pb-2">
          <CardTitle>Daily Briefing Unavailable</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchTodaysBriefing} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!briefing) {
    return null
  }

  const themeColors = getThemeColor(briefing.theme)

  return (
    <>
      <Card className="w-full shadow-lg">
        <CardHeader className={`pb-4 border-b ${themeColors.border}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ThemeIcon theme={briefing.theme} className={themeColors.text} />
              <Badge variant="outline" className={`${themeColors.bg} ${themeColors.text} border-none`}>
                {getThemeTitle(briefing.theme)}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(briefing.date)}
            </div>
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">Sgt. Ken's Daily Briefing</CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Quote section */}
          <div className="border-l-4 border-gray-300 pl-4 italic">
            <p className="text-xl font-serif mb-2">{briefing.quote}</p>
            {briefing.quote_author && <p className="text-right text-gray-600">— {briefing.quote_author}</p>}
          </div>

          {/* Sgt. Ken's Take */}
          <div className={`p-4 rounded-md ${themeColors.bg} border ${themeColors.border}`}>
            <div className="font-bold mb-2 flex items-center gap-2">
              <ThemeIcon theme={briefing.theme} size={18} className={themeColors.text} />
              <span className={themeColors.text}>Sgt. Ken's Take:</span>
            </div>
            <p className="text-gray-800 dark:text-gray-200">{briefing.sgt_ken_take}</p>
          </div>

          {/* Call to Action */}
          <div className="bg-[#0A3C1F]/10 p-4 rounded-md">
            <p className="font-bold text-[#0A3C1F] mb-2">Your Call to Action:</p>
            <p className="text-gray-800 dark:text-gray-200">{briefing.call_to_action}</p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
          <Button
            className="w-full sm:w-auto bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
            onClick={() => setShowShareDialog(true)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Briefing
          </Button>

          {!isLoggedIn && (
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => (window.location.href = "/login")}>
              <Medal className="h-4 w-4 mr-2" />
              Sign In to Earn Points
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Today's Briefing</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#1877F2]/90"
              onClick={() => handleShare("facebook")}
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>

            <Button
              className="flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
              onClick={() => handleShare("twitter")}
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>

            <Button
              className="flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#0A66C2]/90"
              onClick={() => handleShare("linkedin")}
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => handleShare("copy")}
            >
              <LinkIcon className="h-4 w-4" />
              Copy Link
            </Button>
          </div>

          <div className={isLoggedIn ? "bg-green-50 p-3 rounded-md border border-green-200" : "hidden"}>
            <p className="text-sm text-green-800 flex items-center">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Share to earn 50 participation points!
            </p>
          </div>

          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={() => setShowShareDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reward Dialog */}
      <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#0A3C1F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-[#0A3C1F]" />
            </div>

            <h3 className="text-xl font-bold text-[#0A3C1F] mb-2">Briefing Attendance Recorded!</h3>

            <p className="mb-4">
              You've earned <span className="font-bold">{pointsAwarded} points</span> for attending Sgt. Ken's Daily
              Briefing.
            </p>

            {streak > 1 && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex items-center">
                <Flame className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-amber-800">{streak}-Day Streak!</p>
                  <p className="text-sm text-amber-700">
                    Keep checking in daily to increase your streak and earn bonus points!
                  </p>
                </div>
              </div>
            )}

            <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 mt-2" onClick={() => setShowShareDialog(true)}>
              <Share2 className="h-4 w-4 mr-2" />
              Share for More Points
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeIcon } from "./theme-icon"
import { Check, Award, AlertCircle, Info } from "lucide-react"
import type { DailyBriefing } from "@/lib/daily-briefing-service"
import { formatDate } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import confetti from "canvas-confetti"

type BriefingCardProps = {
  briefing: DailyBriefing
  onAttend: (briefingId: string) => Promise<{
    success: boolean
    points: number
    streak?: number
    streakPoints?: number
    alreadyAttended?: boolean
  }>
  onShare: (
    briefingId: string,
    platform: string,
  ) => Promise<{
    success: boolean
    points: number
    alreadyShared?: boolean
  }>
  isHistorical?: boolean
}

export function BriefingCard({ briefing, onAttend, onShare, isHistorical = false }: BriefingCardProps) {
  const [isAttending, setIsAttending] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [attended, setAttended] = useState(false)
  const [shared, setShared] = useState(false)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAttend = async () => {
    if (isAttending || attended || isHistorical) return

    setIsAttending(true)
    setError(null)

    try {
      console.log("Attempting to mark briefing as attended:", briefing.id)
      const result = await onAttend(briefing.id)
      console.log("Attendance result:", result)

      if (result.success) {
        setAttended(true)
        if (result.points > 0 && !result.alreadyAttended) {
          setPointsEarned((prev) => prev + result.points)
          setShowConfetti(true)

          // Trigger confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })

          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        setError("Failed to mark briefing as attended. Please try again.")
      }
    } catch (error) {
      console.error("Error attending briefing:", error)
      setError("An error occurred while marking the briefing as attended. Please try again.")
    } finally {
      setIsAttending(false)
    }
  }

  const handleShare = async (platform: string) => {
    if (isSharing || shared) return

    setIsSharing(true)
    setError(null)

    try {
      const result = await onShare(briefing.id, platform)

      if (result.success) {
        setShared(true)
        if (result.points > 0 && !result.alreadyShared) {
          setPointsEarned((prev) => prev + result.points)
          setShowConfetti(true)

          // Trigger confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })

          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        setError("Failed to share briefing. Please try again.")
      }
    } catch (error) {
      console.error("Error sharing briefing:", error)
      setError("An error occurred while sharing the briefing. Please try again.")
    } finally {
      setIsSharing(false)
    }
  }

  const shareOnTwitter = () => {
    const text = `"${briefing.quote}" - ${briefing.quote_author}\n\nSgt. Ken's take: ${briefing.sgt_ken_take.substring(0, 100)}...\n\n`
    const url = `${window.location.origin}/daily-briefing`
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`

    window.open(shareUrl, "_blank")
    handleShare("twitter")
  }

  const shareOnFacebook = () => {
    const url = `${window.location.origin}/daily-briefing`
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`

    window.open(shareUrl, "_blank")
    handleShare("facebook")
  }

  const shareOnLinkedIn = () => {
    const title = `Sgt. Ken's Daily Briefing: ${briefing.theme.charAt(0).toUpperCase() + briefing.theme.slice(1)}`
    const summary = `"${briefing.quote}" - ${briefing.quote_author}\n\nSgt. Ken's take: ${briefing.sgt_ken_take.substring(0, 100)}...`
    const url = `${window.location.origin}/daily-briefing`
    const shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`

    window.open(shareUrl, "_blank")
    handleShare("linkedin")
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ThemeIcon theme={briefing.theme} size={28} className="text-blue-600" />
            <CardTitle className="text-xl md:text-2xl capitalize">{briefing.theme} Briefing</CardTitle>
          </div>
          <div className="text-sm text-gray-500">{formatDate(new Date(briefing.date))}</div>
        </div>

        {showConfetti && (
          <div className="absolute top-0 right-0 bg-green-100 text-green-800 px-3 py-1 rounded-bl-lg font-medium animate-pulse">
            +{pointsEarned} points!
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isHistorical && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              You are viewing a historical briefing. Attendance and points cannot be earned for past briefings.
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <blockquote className="text-xl italic font-semibold text-gray-800">"{briefing.quote}"</blockquote>
          <div className="mt-2 text-right text-gray-600">— {briefing.quote_author}</div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-800">Sgt. Ken's Take:</h3>
          <p className="text-gray-700 whitespace-pre-line">{briefing.sgt_ken_take}</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-bold text-blue-800">Today's Call to Action:</h3>
          <p className="text-blue-700">{briefing.call_to_action}</p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
        {!isHistorical && (
          <Button
            onClick={handleAttend}
            disabled={isAttending || attended || isHistorical}
            className="w-full sm:w-auto"
            variant={attended ? "outline" : "default"}
          >
            {isAttending ? (
              <>Loading...</>
            ) : attended ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Attended
              </>
            ) : (
              <>
                <Award className="mr-2 h-4 w-4" />
                Mark as Attended
              </>
            )}
          </Button>
        )}

        <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
          <Button onClick={shareOnTwitter} disabled={isSharing} variant="outline" className="flex-1">
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            Share
          </Button>

          <Button onClick={shareOnFacebook} disabled={isSharing} variant="outline" className="flex-1">
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Share
          </Button>

          <Button onClick={shareOnLinkedIn} disabled={isSharing} variant="outline" className="flex-1">
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

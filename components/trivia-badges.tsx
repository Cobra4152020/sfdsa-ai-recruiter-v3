"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Share2, Zap, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@/context/user-context"
import { getServiceSupabase } from "@/lib/supabase-clients"
import { useToast } from "@/components/ui/use-toast"

interface TriviaAnswer {
  answer_time: number
  is_correct: boolean
}

interface TriviaAttempt {
  score: number
  total_questions: number
  game_mode?: string
  trivia_answers?: TriviaAnswer[]
}

interface TriviaBadge {
  id: string
  type: string
  name: string
  description: string
  requirement: number
  progress: number
  earned: boolean
  icon?: React.ReactElement
}

export function TriviaBadges() {
  const [badges, setBadges] = useState<TriviaBadge[]>([
    {
      id: "trivia-participant",
      type: "trivia-participant",
      name: "Trivia Participant",
      description: "Complete your first trivia round",
      requirement: 1,
      progress: 0,
      earned: false,
      icon: <Award className="h-5 w-5" />,
    },
    {
      id: "trivia-enthusiast",
      type: "trivia-enthusiast",
      name: "Trivia Enthusiast",
      description: "Complete 5 trivia rounds",
      requirement: 5,
      progress: 0,
      earned: false,
      icon: <Award className="h-5 w-5" />,
    },
    {
      id: "trivia-master",
      type: "trivia-master",
      name: "Trivia Master",
      description: "Achieve 3 perfect scores",
      requirement: 3,
      progress: 0,
      earned: false,
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      id: "speed-demon",
      type: "speed-demon",
      name: "Speed Demon",
      description: "Answer 10 questions in under 5 seconds each",
      requirement: 10,
      progress: 0,
      earned: false,
      icon: <Zap className="h-5 w-5" />,
    },
    {
      id: "challenge-champion",
      type: "challenge-champion",
      name: "Challenge Champion",
      description: "Complete a perfect round in Challenge Mode",
      requirement: 1,
      progress: 0,
      earned: false,
      icon: <Trophy className="h-5 w-5 text-red-500" />,
    },
  ])

  const { currentUser } = useUser()
  const { toast } = useToast()

  useEffect(() => {
    if (currentUser) {
      fetchUserBadges()
    }
  }, [currentUser])

  const fetchUserBadges = async () => {
    try {
      const supabase = getServiceSupabase()

      // Get user's earned badges
      const { data: userBadges, error: badgesError } = await supabase
        .from("badges")
        .select("badge_type")
        .eq("user_id", currentUser!.id)

      if (badgesError) throw badgesError

      // Get user's trivia attempts and fast answers
      const { data: attempts, error: attemptsError } = await supabase
        .from("trivia_attempts")
        .select("*, trivia_answers(answer_time, is_correct)")
        .eq("user_id", currentUser!.id)

      if (attemptsError) throw attemptsError

      // Calculate progress for each badge
      const updatedBadges = badges.map((badge) => {
        const isEarned = userBadges?.some((ub) => ub.badge_type === badge.type) || false

        let progress = 0
        switch (badge.type) {
          case "trivia-participant":
            progress = Math.min((attempts as TriviaAttempt[] || []).length, 1)
            break
          case "trivia-enthusiast":
            progress = Math.min((attempts as TriviaAttempt[] || []).length, 5)
            break
          case "trivia-master":
            const perfectScores = (attempts as TriviaAttempt[] || []).filter((a) => a.score === a.total_questions).length
            progress = Math.min(perfectScores, 3)
            break
          case "speed-demon":
            // Count answers under 5 seconds that were correct
            const fastAnswers = (attempts as TriviaAttempt[] || []).flatMap(
              (a) => a.trivia_answers?.filter((ans: TriviaAnswer) => ans.answer_time < 5 && ans.is_correct) || []
            )
            progress = Math.min(fastAnswers.length, 10)
            break
          case "challenge-champion":
            const perfectChallengeRounds = (attempts as TriviaAttempt[] || []).filter(
              (a) => a.score === a.total_questions && a.game_mode === "challenge"
            ).length
            progress = Math.min(perfectChallengeRounds, 1)
            break
        }

        return {
          ...badge,
          progress,
          earned: isEarned,
        }
      })

      setBadges(updatedBadges)
    } catch (error) {
      console.error("Error fetching user badges:", error)
    }
  }

  const handleShare = async (badge: TriviaBadge) => {
    const shareText = `I earned the "${badge.name}" badge playing the San Francisco Trivia Game! Test your knowledge too!`
    const shareUrl = `${window.location.origin}/trivia`

    try {
      if (navigator.share) {
        await navigator.share({
          title: "SFSO Trivia Badge Earned!",
          text: shareText,
          url: shareUrl,
        })
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        toast({
          title: "Link copied!",
          description: "Share link copied to clipboard",
        })
      }

      // Record the share if logged in
      if (currentUser) {
        const response = await fetch("/api/trivia/share", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
            platform: "native",
            badgeType: badge.type,
          }),
        })

        const result = await response.json()
        if (result.success) {
          toast({
            title: "Points awarded!",
            description: "You earned 20 points for sharing your badge!",
            duration: 3000,
          })
        }
      }
    } catch (error) {
      console.error("Error sharing badge:", error)
      // Fallback to Twitter
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        "_blank",
      )
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Trivia Badges</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 rounded-lg border ${
                badge.earned
                  ? "bg-[#0A3C1F]/10 border-[#0A3C1F]/30"
                  : "bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    badge.earned ? "bg-[#FFD700]/20" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  {React.cloneElement(badge.icon || <Award className="h-5 w-5" />, {
                    className: `${badge.earned ? "text-[#FFD700]" : "text-gray-500"} ${
                      badge.icon ? (badge.icon.props as { className?: string }).className || "" : ""
                    }`,
                  } as { className: string })}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{badge.name}</div>
                  <div className="text-xs text-gray-500">{badge.description}</div>
                </div>
                {badge.earned && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 border-[#0A3C1F] text-[#0A3C1F]"
                    onClick={() => handleShare(badge)}
                  >
                    <Share2 className="h-3.5 w-3.5 mr-1" />
                    Share
                  </Button>
                )}
              </div>

              {!badge.earned && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>
                      Progress: {badge.progress}/{badge.requirement}
                    </span>
                    <span>{Math.round((badge.progress / badge.requirement) * 100)}%</span>
                  </div>
                  <Progress value={(badge.progress / badge.requirement) * 100} className="h-2" />
                </div>
              )}
            </div>
          ))}

          {!currentUser && (
            <div className="bg-[#0A3C1F]/5 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Sign in to track your badge progress!</p>
              <Button
                size="sm"
                className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
                onClick={() => (window.location.href = "/trivia")}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/context/user-context"
import { AchievementBadge } from "@/components/achievement-badge"
import { BadgeProgress } from "@/components/badge-progress"
import { BadgeRequirements } from "@/components/badge-requirements"
import { BadgeRewards } from "@/components/badge-rewards"
import { BadgeTimeline } from "@/components/badge-timeline"
import { BadgeShare } from "@/components/badge-share"
import { BadgeUnlockAnimation } from "@/components/badge-unlock-animation"
import { Trophy, Share2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BadgeClientProps {
  badgeId: string
}

export default function BadgeClient({ badgeId }: BadgeClientProps) {
  const router = useRouter()
  const { currentUser } = useUser()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [badge, setBadge] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false)

  useEffect(() => {
    const fetchBadge = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setBadge({
          id: badgeId,
          name: "Community Champion",
          description: "Awarded for outstanding contributions to the SFDSA community",
          type: "achievement",
          rarity: "legendary",
          points: 1000,
          requirements: [
            "Complete 50 community interactions",
            "Receive 10 positive feedback ratings",
            "Participate in 5 community events",
          ],
          rewards: [
            "1000 points",
            "Special profile badge",
            "Early access to new features",
            "Recognition on leaderboard",
          ],
        })
        setProgress(75)
        setIsUnlocked(true)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching badge:", error)
        toast({
          title: "Error",
          description: "Failed to load badge details. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchBadge()
  }, [badgeId, toast])

  const handleShare = async () => {
    try {
      // Simulate sharing
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Badge shared!",
        description: "Your achievement has been shared with the community.",
      })
    } catch (error) {
      toast({
        title: "Error sharing badge",
        description: "Failed to share badge. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading || !badge) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.push("/badges")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Badges
          </Button>
          <h1 className="text-3xl font-bold text-[#0A3C1F]">{badge.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Badge Details</CardTitle>
                <CardDescription>{badge.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-8">
                  <AchievementBadge
                    type={badge.type}
                    rarity={badge.rarity}
                    points={badge.points}
                    earned={isUnlocked}
                    size="lg"
                  />
                  <BadgeProgress value={progress} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <BadgeRequirements requirements={badge.requirements} progress={progress} />
                  <BadgeRewards rewards={badge.rewards} unlocked={isUnlocked} />
                </div>

                <div className="mt-8 flex justify-center gap-4">
                  {isUnlocked ? (
                    <>
                      <Button onClick={handleShare} className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share Achievement
                      </Button>
                      <Button variant="outline" onClick={() => router.push("/badges")} className="gap-2">
                        <Trophy className="h-4 w-4" />
                        View All Badges
                      </Button>
                    </>
                  ) : (
                    <Button disabled className="gap-2">
                      <Trophy className="h-4 w-4" />
                      {progress}% Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest progress towards this badge</CardDescription>
              </CardHeader>
              <CardContent>
                <BadgeTimeline badgeId={badgeId} />
              </CardContent>
            </Card>

            <BadgeShare
              badgeId={badgeId}
              badgeName={badge.name}
              isUnlocked={isUnlocked}
              onShare={handleShare}
            />
          </div>
        </div>
      </div>

      {showUnlockAnimation && (
        <BadgeUnlockAnimation
          badge={badge}
          onComplete={() => setShowUnlockAnimation(false)}
        />
      )}
    </main>
  )
} 
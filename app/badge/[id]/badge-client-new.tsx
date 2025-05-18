"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/context/user-context"
import { AchievementBadge } from "@/components/achievement-badge"
import { BadgeProgress } from "@/components/badge-progress"
import { Trophy, Share2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  BadgeRequirements,
  BadgeRewards,
  BadgeTimeline,
  BadgeShare,
  BadgeUnlockAnimation,
  BadgeErrorBoundary,
} from "@/components/badges"
import type { Badge, BadgeWithProgress } from "@/types/badge"

interface BadgeClientProps {
  badge: BadgeWithProgress
}

export default function BadgeClient({ badge }: BadgeClientProps) {
  const router = useRouter()
  const { currentUser } = useUser()
  const { toast } = useToast()
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false)

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

        <BadgeErrorBoundary>
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
                      earned={badge.isUnlocked}
                      size="lg"
                    />
                    <BadgeProgress
                      badgeType={badge.type}
                      badgeName={badge.name}
                      progress={badge.progress}
                      currentValue={badge.progress}
                      maxValue={100}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BadgeRequirements requirements={badge.requirements} progress={badge.progress} />
                    <BadgeRewards rewards={badge.rewards} unlocked={badge.isUnlocked} />
                  </div>

                  <div className="mt-8 flex justify-center gap-4">
                    {badge.isUnlocked ? (
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
                        {badge.progress}% Complete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <BadgeErrorBoundary>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest progress towards this badge</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BadgeTimeline badgeId={badge.id} />
                  </CardContent>
                </Card>
              </BadgeErrorBoundary>

              <BadgeErrorBoundary>
                <BadgeShare
                  badgeId={badge.id}
                  badgeName={badge.name}
                  isUnlocked={badge.isUnlocked}
                  onShare={handleShare}
                />
              </BadgeErrorBoundary>
            </div>
          </div>
        </BadgeErrorBoundary>
      </div>

      {showUnlockAnimation && (
        <BadgeErrorBoundary>
          <BadgeUnlockAnimation
            badge={badge}
            onComplete={() => setShowUnlockAnimation(false)}
          />
        </BadgeErrorBoundary>
      )}
    </main>
  )
} 
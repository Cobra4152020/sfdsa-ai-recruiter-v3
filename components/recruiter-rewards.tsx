"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Gift, Award, CheckCircle, AlertCircle, Lock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useUser } from "@/context/user-context"

interface RecruiterReward {
  id: number
  name: string
  description: string
  pointsRequired: number
  rewardType: string
  imageUrl: string
  isActive: boolean
  maxRedemptions: number | null
  redemptionsCount: number
}

export function RecruiterRewards() {
  const { currentUser } = useUser()
  const [rewards, setRewards] = useState<RecruiterReward[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReward, setSelectedReward] = useState<RecruiterReward | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (!currentUser?.id) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch rewards
        const rewardsResponse = await fetch("/api/recruiter/rewards")
        const rewardsData = await rewardsResponse.json()

        if (rewardsData.success && rewardsData.rewards) {
          setRewards(rewardsData.rewards)
        }

        // Fetch recruiter points
        const pointsResponse = await fetch(`/api/recruiter/points?recruiterId=${currentUser.id}`)
        const pointsData = await pointsResponse.json()

        if (pointsData.success && pointsData.totalPoints !== undefined) {
          setTotalPoints(pointsData.totalPoints)
        }
      } catch (err) {
        console.error("Error fetching rewards data:", err)
        toast({
          title: "Error",
          description: "Failed to load rewards information",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [currentUser?.id])

  const handleRedeemClick = (reward: RecruiterReward) => {
    setSelectedReward(reward)
    setIsModalOpen(true)
    setNotes("")
  }

  const handleRedeemSubmit = async () => {
    if (!currentUser?.id || !selectedReward) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/recruiter/rewards/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recruiterId: currentUser.id,
          rewardId: selectedReward.id,
          notes: notes.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Reward Redeemed!",
          description: `You've successfully redeemed: ${selectedReward.name}`,
        })
        setIsModalOpen(false)

        // Update local state to reflect the redemption
        setTotalPoints((prev) => prev - selectedReward.pointsRequired)
        setRewards((prev) =>
          prev.map((reward) =>
            reward.id === selectedReward.id ? { ...reward, redemptionsCount: reward.redemptionsCount + 1 } : reward,
          ),
        )
      } else {
        toast({
          title: "Redemption Failed",
          description: data.message || "There was an error redeeming your reward",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error redeeming reward:", err)
      toast({
        title: "Error",
        description: "An unexpected error occurred while redeeming your reward",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRewardTypeIcon = (type: string) => {
    switch (type) {
      case "badge":
        return <Award className="h-4 w-4 mr-1" />
      case "certificate":
        return <CheckCircle className="h-4 w-4 mr-1" />
      case "gift_card":
        return <Gift className="h-4 w-4 mr-1" />
      default:
        return <Gift className="h-4 w-4 mr-1" />
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-7 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-24 w-24" />
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="h-5 w-5 mr-2" /> Recruiter Rewards
          </CardTitle>
          <CardDescription>
            Redeem your hard-earned points for rewards. You currently have <strong>{totalPoints}</strong> points.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rewards.length > 0 ? (
            <div className="grid gap-6">
              {rewards.map((reward) => {
                const canRedeem = totalPoints >= reward.pointsRequired
                const isLimitReached =
                  reward.maxRedemptions !== null && reward.redemptionsCount >= reward.maxRedemptions

                return (
                  <div
                    key={reward.id}
                    className={`flex gap-4 p-4 rounded-lg border ${
                      canRedeem && !isLimitReached ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="h-20 w-20 rounded overflow-hidden bg-white border flex items-center justify-center">
                      {reward.imageUrl ? (
                        <img
                          src={reward.imageUrl || "/placeholder.svg"}
                          alt={reward.name}
                          className="object-contain h-full w-full"
                        />
                      ) : (
                        <Gift className="h-10 w-10 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{reward.name}</h3>
                          <Badge variant="outline" className="mt-1">
                            {getRewardTypeIcon(reward.rewardType)}
                            {reward.rewardType.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">{reward.pointsRequired} points</span>
                          {reward.maxRedemptions !== null && (
                            <div className="text-xs text-gray-500 mt-1">
                              {reward.redemptionsCount}/{reward.maxRedemptions} claimed
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-2">{reward.description}</p>

                      <div className="mt-3 flex justify-between items-center">
                        <div className="w-2/3">
                          <Progress
                            value={Math.min(100, (totalPoints / reward.pointsRequired) * 100)}
                            className="h-2"
                          />
                          {!canRedeem && (
                            <div className="text-xs text-gray-500 mt-1">
                              {reward.pointsRequired - totalPoints} more points needed
                            </div>
                          )}
                        </div>

                        <Button
                          size="sm"
                          disabled={!canRedeem || isLimitReached}
                          onClick={() => handleRedeemClick(reward)}
                          className="bg-[#0A3C1F] hover:bg-[#072915]"
                        >
                          {isLimitReached ? (
                            <>
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Sold Out
                            </>
                          ) : canRedeem ? (
                            "Redeem"
                          ) : (
                            <>
                              <Lock className="h-4 w-4 mr-1" />
                              Locked
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No rewards are currently available. Check back later!</div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 text-sm text-gray-500">
          Rewards may take up to 5 business days to be processed and delivered.
        </CardFooter>
      </Card>

      {/* Redemption Confirmation Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
            <DialogDescription>
              You are about to redeem <strong>{selectedReward?.name}</strong> for{" "}
              <strong>{selectedReward?.pointsRequired} points</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">{selectedReward?.description}</p>

            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Additional Notes (Optional)</p>
              <Textarea
                placeholder="Add any specific details or requests regarding this redemption..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-24"
              />
            </div>

            <div className="bg-amber-50 p-3 rounded-md text-sm text-amber-800">
              <p className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  This action will deduct {selectedReward?.pointsRequired} points from your account. Reward redemptions
                  cannot be reversed.
                </span>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleRedeemSubmit} disabled={isSubmitting} className="bg-[#0A3C1F] hover:bg-[#072915]">
              {isSubmitting ? "Processing..." : "Confirm Redemption"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

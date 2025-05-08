"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { NFTAwardCard } from "@/components/nft-award-card"
import { useUser } from "@/context/user-context"
import { NFT_AWARD_TIERS } from "@/lib/nft-utils"

interface NFTAwardsShowcaseProps {
  className?: string
}

export function NFTAwardsShowcase({ className }: NFTAwardsShowcaseProps) {
  const { currentUser } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [awards, setAwards] = useState<any[]>([])
  const [currentPoints, setCurrentPoints] = useState(0)
  const [nextAward, setNextAward] = useState<any | null>(null)

  useEffect(() => {
    const fetchAwards = async () => {
      if (!currentUser?.id) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/users/${currentUser.id}/nft-awards`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch NFT awards")
        }

        setAwards(data.awards || [])
        setCurrentPoints(data.currentPoints || 0)
        setNextAward(data.nextAward || null)
      } catch (err) {
        console.error("Error fetching NFT awards:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAwards()
  }, [currentUser?.id])

  // Get awarded IDs to determine which awards have been earned
  const awardedIds = awards.map((award) => award.id)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="mr-2">🏆</span> NFT Awards
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A3C1F]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <>
            {nextAward && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Next NFT Award: {nextAward.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{nextAward.description}</p>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>
                    {currentPoints.toLocaleString()} / {nextAward.pointThreshold.toLocaleString()} points
                  </span>
                </div>
                <Progress value={(currentPoints / nextAward.pointThreshold) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {nextAward.pointsNeeded.toLocaleString()} more points needed
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {NFT_AWARD_TIERS.map((tier) => {
                // Find the awarded version if it exists
                const awardedVersion = awards.find((award) => award.id === tier.id)

                return (
                  <NFTAwardCard
                    key={tier.id}
                    id={tier.id}
                    name={tier.name}
                    description={tier.description}
                    imageUrl={tier.imageUrl}
                    tokenId={awardedVersion?.tokenId}
                    contractAddress={awardedVersion?.contractAddress}
                    awardedAt={awardedVersion?.awardedAt}
                    pointsAtAward={awardedVersion?.pointsAtAward}
                    blockchainExplorerUrl={awardedVersion?.blockchainExplorerUrl}
                  />
                )
              })}
            </div>

            {awards.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>You haven't earned any NFT awards yet.</p>
                <p className="mt-2">
                  Earn participation points by engaging with Sgt. Ken and exploring the application process!
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

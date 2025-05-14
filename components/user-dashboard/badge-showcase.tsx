"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Share2, Download, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserBadge {
  id: string
  badge_id: string
  user_id: string
  earned_at: string
  badge: {
    id: string
    name: string
    description: string
    image_url: string
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
    nft_enabled: boolean
    nft_contract_address?: string
    requirements: any
  }
}

export default function BadgeShowcase() {
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [lockedBadges, setLockedBadges] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchBadges() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) return

        // Fetch earned badges
        const { data: earnedBadges, error: earnedError } = await supabase
          .from("user_badges")
          .select(`
            id,
            badge_id,
            user_id,
            earned_at,
            badge:badges (
              id,
              name,
              description,
              image_url,
              rarity,
              nft_enabled,
              nft_contract_address,
              requirements
            )
          `)
          .eq("user_id", session.user.id)
          .order("earned_at", { ascending: false })

        if (earnedError) throw earnedError

        // Fetch locked badges (badges user hasn't earned yet)
        const { data: allBadges, error: allError } = await supabase
          .from("badges")
          .select("*")
          .order("created_at", { ascending: true })

        if (allError) throw allError

        const earnedBadgeIds = earnedBadges.map((b) => b.badge_id)
        const locked = allBadges.filter((b) => !earnedBadgeIds.includes(b.id))

        setBadges(earnedBadges)
        setLockedBadges(locked)
      } catch (error) {
        console.error("Error fetching badges:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBadges()
  }, [supabase])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "uncommon":
        return "bg-green-100 text-green-800 border-green-200"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const mintNFT = async (badge: UserBadge) => {
    try {
      toast({
        title: "Minting NFT",
        description: "Your NFT is being minted. This may take a moment.",
      })

      // Call your NFT minting API
      const response = await fetch("/api/mint-badge-nft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ badgeId: badge.badge_id, userBadgeId: badge.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to mint NFT")
      }

      toast({
        title: "NFT Minted!",
        description: "Your badge has been minted as an NFT. Check your wallet.",
      })
    } catch (error) {
      console.error("Error minting NFT:", error)
      toast({
        title: "Minting Failed",
        description: "There was an error minting your NFT. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const shareBadge = async (badge: UserBadge) => {
    try {
      // Generate share URL
      const shareUrl = `${window.location.origin}/badges/share/${badge.id}`

      // Use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: `I earned the ${badge.badge.name} badge!`,
          text: badge.badge.description,
          url: shareUrl,
        })
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Link Copied!",
          description: "Badge share link copied to clipboard.",
        })
      }
    } catch (error) {
      console.error("Error sharing badge:", error)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Badges</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Your Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {badges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center p-3 text-center border rounded-lg">
                  <div className="relative mb-2">
                    <img
                      src={badge.badge.image_url || "/placeholder.svg?height=80&width=80&query=badge"}
                      alt={badge.badge.name}
                      className="w-16 h-16 mx-auto"
                    />
                    {badge.badge.nft_enabled && (
                      <div className="absolute top-0 right-0 p-1 text-xs font-bold text-white bg-purple-600 rounded-full">
                        NFT
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-medium">{badge.badge.name}</h4>
                  <Badge variant="outline" className={`mt-1 text-xs ${getRarityColor(badge.badge.rarity)}`}>
                    {badge.badge.rarity}
                  </Badge>
                  <div className="mt-2 space-x-1">
                    <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => shareBadge(badge)}>
                      <Share2 className="w-3 h-3" />
                    </Button>
                    {badge.badge.nft_enabled && (
                      <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => mintNFT(badge)}>
                        <Download className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {lockedBadges.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-medium text-gray-500">Badges to Unlock</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {lockedBadges.slice(0, 4).map((badge) => (
                    <div
                      key={badge.id}
                      className="flex flex-col items-center p-3 text-center border rounded-lg bg-gray-50"
                    >
                      <div className="relative mb-2">
                        <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                          <Lock className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                      <h4 className="text-sm font-medium text-gray-500">{badge.name}</h4>
                      <Badge variant="outline" className={`mt-1 text-xs ${getRarityColor(badge.rarity)}`}>
                        {badge.rarity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-md">
            <Award className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <h3 className="mb-1 text-lg font-medium">No Badges Yet</h3>
            <p className="mb-4 text-sm">Complete challenges and activities to earn badges!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

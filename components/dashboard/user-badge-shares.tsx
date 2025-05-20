"use client"

import { useState, useEffect } from "react"
import { getClientSideSupabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface BadgeShare {
  id: string
  badge_id: string
  platform: string
  shared_at: string
  click_count: number
}

export function UserBadgeShares() {
  const [shares, setShares] = useState<BadgeShare[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = getClientSideSupabase()

  useEffect(() => {
    async function loadUserShares() {
      try {
        setLoading(true)
        setError(null)

        // Get the current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setError("You must be logged in to view your badge shares")
          return
        }

        // Get the user's badge shares - this will respect RLS policies
        const { data, error } = await supabase
          .from("badge_shares")
          .select("*")
          .eq("user_id", user.id)
          .order("shared_at", { ascending: false })

        if (error) throw error

        setShares(data || [])
      } catch (err) {
        console.error("Error loading badge shares:", err)
        setError("Failed to load your badge shares")
      } finally {
        setLoading(false)
      }
    }

    loadUserShares()
  }, [supabase])

  const handleShareBadge = async (badgeId: string, platform: string) => {
    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to share badges",
          variant: "destructive",
        })
        return
      }

      // Create a new share record - this will respect RLS policies
      const { error } = await supabase.from("badge_shares").insert({
        user_id: user.id,
        badge_id: badgeId,
        platform,
        share_url: `https://example.com/badge/${badgeId}`,
      })

      if (error) throw error

      toast({
        title: "Badge shared",
        description: `Your badge has been shared on ${platform}`,
      })

      // Reload shares
      const { data, error: loadError } = await supabase
        .from("badge_shares")
        .select("*")
        .eq("user_id", user.id)
        .order("shared_at", { ascending: false })

      if (loadError) throw loadError

      setShares(data || [])
    } catch (err) {
      console.error("Error sharing badge:", err)
      toast({
        title: "Error",
        description: "Failed to share your badge",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Badge Shares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading your badge shares...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Badge Shares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Badge Shares</CardTitle>
      </CardHeader>
      <CardContent>
        {shares.length === 0 ? (
          <div className="text-center py-4">
            <p className="mb-4">You haven't shared any badges yet</p>
            <div className="flex justify-center space-x-2">
              <Button onClick={() => handleShareBadge("sample-badge-1", "Twitter")}>Share on Twitter</Button>
              <Button onClick={() => handleShareBadge("sample-badge-1", "Facebook")}>Share on Facebook</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {shares.map((share) => (
              <div key={share.id} className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Badge ID: {share.badge_id}</p>
                    <p className="text-sm text-gray-500">
                      Shared on {share.platform} • {new Date(share.shared_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm">{share.click_count} clicks</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

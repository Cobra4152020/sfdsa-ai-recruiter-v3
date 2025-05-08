"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AchievementBadge } from "@/components/achievement-badge"
import { NFTAwardCard } from "@/components/nft-award-card"
import { Progress } from "@/components/ui/progress"
import { Edit, Save, Trophy, Medal, Award, Share2, Calendar, User } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useUser } from "@/context/user-context"

interface UserProfileCardProps {
  userId: string
  isExpanded?: boolean
  className?: string
}

export function UserProfileCard({ userId, isExpanded = false, className }: UserProfileCardProps) {
  const { currentUser } = useUser()
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const isCurrentUser = currentUser?.id === userId

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/users/${userId}/profile`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch user profile")
        }

        setProfile(data.profile)
        setBio(data.profile.bio || "")
      } catch (err) {
        console.error("Error fetching user profile:", err)
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  const handleSaveBio = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to update bio")
      }

      setProfile((prev: any) => ({ ...prev, bio }))
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your bio has been updated successfully.",
      })
    } catch (err) {
      console.error("Error updating bio:", err)
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "Failed to update bio",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    if (!profile) return

    const shareUrl = `${window.location.origin}/profile/${userId}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name}'s SF Sheriff Recruitment Profile`,
          text: `Check out ${profile.name}'s profile on the San Francisco Sheriff's Office recruitment platform!`,
          url: shareUrl,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Profile link copied!",
        description: "Share this link with others to show your recruitment profile.",
      })
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-pulse rounded-full bg-gray-200 h-16 w-16"></div>
            <div className="animate-pulse h-6 bg-gray-200 rounded w-32"></div>
            <div className="animate-pulse h-4 bg-gray-200 rounded w-24"></div>
            <div className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !profile) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500">{error || "Failed to load user profile"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Generate a placeholder avatar URL if avatar_url is missing
  const avatarUrl = profile.avatar_url || `/placeholder.svg?height=64&width=64&query=user-${profile.id}`

  const joinDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Compact view (for leaderboard)
  if (!isExpanded) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-[#0A3C1F]">
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate">{profile.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Trophy className="h-4 w-4 mr-1" />
                <span>Rank #{profile.rank || "N/A"}</span>
                {profile.has_applied && (
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                    Applied
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{profile.participation_count.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Points</div>
            </div>
          </div>
          {profile.badges && profile.badges.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1 justify-center">
              {profile.badges.slice(0, 5).map((badge: any) => (
                <AchievementBadge key={badge.id} type={badge.badge_type} size="sm" earned={true} showTooltip={false} />
              ))}
              {profile.badges.length > 5 && (
                <Badge variant="outline" className="ml-1">
                  +{profile.badges.length - 5} more
                </Badge>
              )}
            </div>
          )}
          <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => setIsDialogOpen(true)}>
            View Profile
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Expanded view (for profile page)
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4 border-2 border-[#0A3C1F]">
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <div className="flex items-center mt-1 text-muted-foreground">
                <Trophy className="h-4 w-4 mr-1" />
                <span>Rank #{profile.rank || "N/A"}</span>
                {profile.has_applied && (
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                    Applied
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {isCurrentUser && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <Save className="h-4 w-4 mr-1" /> : <Edit className="h-4 w-4 mr-1" />}
                {isEditing ? "Save" : "Edit"}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1 flex items-center">
                <Trophy className="h-4 w-4 mr-1" />
                Points
              </div>
              <div className="text-2xl font-bold">{profile.participation_count.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1 flex items-center">
                <Medal className="h-4 w-4 mr-1" />
                Badges
              </div>
              <div className="text-2xl font-bold">{profile.badge_count}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1 flex items-center">
                <Award className="h-4 w-4 mr-1" />
                NFT Awards
              </div>
              <div className="text-2xl font-bold">{profile.nft_count}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Joined
              </div>
              <div className="text-sm font-medium">{joinDate}</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">About</h3>
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                  maxLength={500}
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveBio}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                {profile.bio || (isCurrentUser ? "Add a bio to tell others about yourself." : "No bio available.")}
              </p>
            )}
          </div>

          {profile.next_award && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Next NFT Award: {profile.next_award.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{profile.next_award.description}</p>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>
                  {profile.participation_count.toLocaleString()} / {profile.next_award.pointThreshold.toLocaleString()}{" "}
                  points
                </span>
              </div>
              <Progress
                value={(profile.participation_count / profile.next_award.pointThreshold) * 100}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {profile.next_award.pointsNeeded.toLocaleString()} more points needed
              </p>
            </div>
          )}

          <Tabs defaultValue="badges">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="badges">Badges ({profile.badge_count})</TabsTrigger>
              <TabsTrigger value="nfts">NFT Awards ({profile.nft_count})</TabsTrigger>
            </TabsList>
            <TabsContent value="badges" className="mt-4">
              {profile.badges && profile.badges.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {profile.badges.map((badge: any) => (
                    <div key={badge.id} className="flex flex-col items-center text-center">
                      <AchievementBadge type={badge.badge_type} size="md" earned={true} />
                      <h4 className="text-sm font-medium mt-2">{badge.name}</h4>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No badges earned yet.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="nfts" className="mt-4">
              {profile.nft_awards && profile.nft_awards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.nft_awards.map((award: any) => (
                    <NFTAwardCard
                      key={award.nft_award_id}
                      id={award.nft_award_id}
                      name={award.name}
                      description={award.description}
                      imageUrl={award.imageUrl}
                      tokenId={award.token_id}
                      contractAddress={award.contract_address}
                      awardedAt={award.awarded_at}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No NFT awards earned yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

// Dialog version for compact view
export function UserProfileDialog({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <User className="h-4 w-4 mr-1" />
          View Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        <UserProfileCard userId={userId} isExpanded={true} />
      </DialogContent>
    </Dialog>
  )
}

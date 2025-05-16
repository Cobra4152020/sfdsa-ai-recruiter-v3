"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { User, Trophy, Medal, Award, Calendar } from "lucide-react"

interface UserProfileDialogProps {
  userId: string
  isOpen?: boolean
  onClose?: () => void
  currentUserId?: string
}

export function UserProfileDialog({ userId, isOpen: externalIsOpen, onClose, currentUserId }: UserProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Sync with external open state if provided
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen)
    }
  }, [externalIsOpen])

  // Handle dialog close
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open && onClose) {
      onClose()
    }
  }

  // Fetch user profile when dialog opens
  useEffect(() => {
    if (isOpen && userId) {
      setIsLoading(true)
      setError(null)

      // Simulate API call with mock data
      setTimeout(() => {
        try {
          const mockProfile = generateMockProfile(userId, currentUserId)
          setProfile(mockProfile)
          setIsLoading(false)
        } catch (err) {
          console.error("Error fetching profile:", err)
          setError("Failed to load user profile")
          setIsLoading(false)
        }
      }, 1000)
    }
  }, [isOpen, userId, currentUserId])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <User className="h-4 w-4" />
          View Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-200 h-16 w-16"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-[200px]"></div>
                <div className="h-4 bg-gray-200 rounded w-[150px]"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            <p>Failed to load user profile. Please try again.</p>
          </div>
        ) : (
          profile && (
            <div className="space-y-4">
              <div className="flex items-center">
                <Avatar className="h-16 w-16 mr-4 border-2 border-[#0A3C1F]">
                  <AvatarImage
                    src={profile.avatar_url || `/placeholder.svg?height=64&width=64&query=user-${profile.id}`}
                    alt={profile.name}
                  />
                  <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1 flex items-center">
                    <Trophy className="h-4 w-4 mr-1" />
                    Points
                  </div>
                  <div className="text-2xl font-bold">{profile.participation_count?.toLocaleString() || 0}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1 flex items-center">
                    <Medal className="h-4 w-4 mr-1" />
                    Badges
                  </div>
                  <div className="text-2xl font-bold">{profile.badge_count || 0}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1 flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    NFT Awards
                  </div>
                  <div className="text-2xl font-bold">{profile.nft_count || 0}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined
                  </div>
                  <div className="text-sm font-medium">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
                  </div>
                </div>
              </div>

              {profile.bio && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground">{profile.bio}</p>
                </div>
              )}

              <Tabs defaultValue="badges">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="badges">Badges ({profile.badge_count || 0})</TabsTrigger>
                  <TabsTrigger value="nfts">NFT Awards ({profile.nft_count || 0})</TabsTrigger>
                </TabsList>
                <TabsContent value="badges" className="mt-4">
                  {profile.badges && profile.badges.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {profile.badges.map((badge: any) => (
                        <div key={badge.id} className="flex flex-col items-center text-center">
                          <div
                            className={`rounded-full w-12 h-12 flex items-center justify-center mb-2 ${badge.color || "bg-blue-500"}`}
                          >
                            <img
                              src={badge.icon || "/placeholder.svg?height=32&width=32&query=badge"}
                              alt={badge.name}
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                          <h4 className="text-sm font-medium">{badge.name}</h4>
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {profile.nft_awards.map((award: any) => (
                        <div key={award.id} className="border rounded-lg overflow-hidden">
                          <div className="aspect-square relative">
                            <img
                              src={award.imageUrl || "/placeholder.svg?height=200&width=200&query=nft award"}
                              alt={award.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium">{award.name}</h4>
                            <p className="text-xs text-muted-foreground">{award.description}</p>
                          </div>
                        </div>
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
          )
        )}
      </DialogContent>
    </Dialog>
  )
}

// Helper function to generate mock profile data
function generateMockProfile(userId: string, currentUserId?: string) {
  const isCurrentUser = userId === currentUserId
  const id = userId
  const name = `User ${id.split("-")[1] || id}`
  const rank = Math.floor(Math.random() * 20) + 1
  const participation_count = Math.floor(Math.random() * 1000) + 100
  const badge_count = Math.floor(Math.random() * 8)
  const nft_count = Math.floor(Math.random() * 3)
  const has_applied = Math.random() > 0.7
  const created_at = new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
  const bio =
    Math.random() > 0.3 ? `I'm ${name} and I'm interested in joining the San Francisco Sheriff's Department.` : ""

  // Generate mock badges
  const badges = Array.from({ length: badge_count }, (_, i) => ({
    id: `badge-${i + 1}`,
    name: [
      "Participation",
      "Quick Learner",
      "Resource Explorer",
      "Quiz Master",
      "Application Started",
      "Frequent Visitor",
      "Deep Diver",
      "Community Connector",
    ][i % 8],
    badge_type: [
      "written",
      "oral",
      "physical",
      "polygraph",
      "psychological",
      "full",
      "chat-participation",
      "application-started",
    ][i % 8],
    color: [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-orange-500",
    ][i % 8],
    icon: `/placeholder.svg?height=32&width=32&query=badge ${i + 1}`,
  }))

  // Generate mock NFT awards
  const nft_awards = Array.from({ length: nft_count }, (_, i) => ({
    id: `nft-${i + 1}`,
    name: ["Gold Recruit", "Silver Explorer", "Bronze Participant"][i % 3],
    description: "Awarded for exceptional engagement with the recruitment platform.",
    imageUrl: `/placeholder.svg?height=200&width=200&query=nft award ${i + 1}`,
    token_id: `token-${i + 1}`,
    contract_address: "0x1234567890abcdef",
    awarded_at: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString(),
  }))

  return {
    id,
    name,
    rank,
    participation_count,
    badge_count,
    nft_count,
    has_applied,
    created_at,
    bio,
    badges,
    nft_awards,
    avatar_url: `/placeholder.svg?height=64&width=64&query=user ${id}`,
    is_current_user: isCurrentUser,
  }
}

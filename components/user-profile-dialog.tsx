"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { User, Trophy, Medal, Award, Calendar } from "lucide-react"
import { useUserProfile } from "@/hooks/use-user-profile"

interface UserProfileDialogProps {
  userId: string
}

export function UserProfileDialog({ userId }: UserProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { profile, isLoading, error } = useUserProfile(userId, isOpen)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                    src={profile.avatar_url || "/placeholder.svg?height=64&width=64&query=user"}
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

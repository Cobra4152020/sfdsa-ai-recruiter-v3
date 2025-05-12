"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Share2, ChevronRight, Bell } from "lucide-react"
import Link from "next/link"
import { BadgeSharingDialog } from "./badge-sharing-dialog"

interface UserProfileProps {
  userId: string
  showDetails?: boolean
}

interface UserData {
  id: string
  name: string
  email: string
  avatar_url?: string
  points: number
  rank: number
  badges: number
  level: string
  joined_at: string
}

export function UserProfile({ userId, showDetails = true }: UserProfileProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/users/${userId}/profile`)
        const data = await response.json()

        if (data.success && data.profile) {
          setUserData(data.profile)
        } else {
          setError(data.message || "Failed to load user profile")
        }
      } catch (err) {
        setError("An error occurred while fetching user data")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchUserData()
    }
  }, [userId])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !userData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-4">
            <p className="text-red-500">{error || "User not found"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date)
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={userData.avatar_url || "/placeholder.svg"} alt={userData.name} />
              <AvatarFallback>{getInitials(userData.name)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold">{userData.name}</h2>
              <p className="text-muted-foreground text-sm mb-2">Joined {formatDate(userData.joined_at)}</p>

              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  Rank #{userData.rank}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Medal className="h-3 w-3" />
                  {userData.badges} Badges
                </Badge>
                <Badge className="bg-[#0A3C1F] text-white">{userData.level}</Badge>
              </div>

              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => setIsShareDialogOpen(true)}>
                  <Share2 className="h-3 w-3 mr-1" />
                  Share Profile
                </Button>

                {showDetails && (
                  <Link href={`/profile/${userId}`}>
                    <Button variant="default" size="sm" className="text-xs h-8">
                      View Full Profile
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
              <div className="mt-4">
                <Link href="/profile/notifications" className="flex items-center text-primary hover:underline">
                  <Bell className="mr-2 h-4 w-4" />
                  Manage Notification Preferences
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <BadgeSharingDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        badges={[]}
        userName={userData.name}
      />
    </>
  )
}

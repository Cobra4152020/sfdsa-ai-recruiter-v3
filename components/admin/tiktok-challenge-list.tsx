"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, MoreVertical, Edit, Trash2, Eye, Award, AlertTriangle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { TikTokIcon } from "@/components/tiktok-icon"

interface Challenge {
  id: number
  title: string
  description: string
  startDate: string
  endDate: string
  pointsReward: number
  badgeReward?: string
  hashtags: string[]
  status: string
  submissionCount: number
}

export function TikTokChallengeList() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/tiktok-challenges/admin")

      if (!response.ok) {
        throw new Error("Failed to fetch challenges")
      }

      const data = await response.json()
      setChallenges(data.challenges || [])
    } catch (error) {
      console.error("Error fetching challenges:", error)
      toast({
        title: "Error",
        description: "Failed to load challenges. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/tiktok-challenges/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update challenge status")
      }

      // Update local state
      setChallenges(challenges.map((challenge) => (challenge.id === id ? { ...challenge, status } : challenge)))

      toast({
        title: "Status updated",
        description: `Challenge status changed to ${status}`,
      })
    } catch (error) {
      console.error("Error updating challenge status:", error)
      toast({
        title: "Error",
        description: "Failed to update challenge status",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this challenge? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/tiktok-challenges/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete challenge")
      }

      // Remove from local state
      setChallenges(challenges.filter((challenge) => challenge.id !== id))

      toast({
        title: "Challenge deleted",
        description: "The challenge has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting challenge:", error)
      toast({
        title: "Error",
        description: "Failed to delete challenge",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (challenges.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TikTokIcon className="h-12 w-12 mb-4 text-gray-400" />
          <h3 className="text-xl font-medium text-gray-900 mb-1">No challenges yet</h3>
          <p className="text-gray-500 text-center max-w-md mb-4">
            Create your first TikTok challenge to engage users and encourage them to create content
          </p>
          <Button onClick={() => (window.location.href = "?tab=create")}>Create Your First Challenge</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {challenges.map((challenge) => {
        const isActive = challenge.status === "active"
        const isExpired = new Date(challenge.endDate) < new Date()

        return (
          <Card key={challenge.id} className={`overflow-hidden ${isActive ? "" : "opacity-75"}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <CardDescription>
                    {challenge.submissionCount} submission{challenge.submissionCount !== 1 && "s"}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => (window.location.href = `/admin/tiktok-challenges/${challenge.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => (window.location.href = `/admin/tiktok-challenges/${challenge.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Challenge
                    </DropdownMenuItem>
                    {isActive ? (
                      <DropdownMenuItem onClick={() => handleStatusChange(challenge.id, "inactive")}>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Deactivate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleStatusChange(challenge.id, "active")}>
                        <Eye className="h-4 w-4 mr-2" />
                        Activate
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleDelete(challenge.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">{challenge.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {challenge.hashtags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
                {challenge.hashtags.length > 3 && (
                  <Badge variant="outline">+{challenge.hashtags.length - 3} more</Badge>
                )}
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{format(new Date(challenge.startDate), "MMM d")}</span>
                  <span className="mx-1">-</span>
                  <span>{format(new Date(challenge.endDate), "MMM d, yyyy")}</span>
                </div>

                <div className="flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  <span>{challenge.pointsReward} points</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <div className="w-full flex justify-between items-center">
                <Badge
                  variant={isExpired ? "outline" : isActive ? "default" : "secondary"}
                  className={isExpired ? "border-red-200 text-red-700" : ""}
                >
                  {isExpired ? "Expired" : challenge.status}
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = `/admin/tiktok-challenges/${challenge.id}/submissions`)}
                >
                  View Submissions
                </Button>
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

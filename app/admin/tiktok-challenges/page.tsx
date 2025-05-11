"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { TikTokIcon } from "@/components/tiktok-icon"
import { Edit, Eye, CheckCircle2, Clock, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"

interface Challenge {
  id: number
  title: string
  description: string
  startDate: Date
  endDate: Date
  pointsReward: number
  badgeReward?: string
  thumbnailUrl?: string
  status: string
  hashtags: string[]
}

interface Submission {
  id: number
  challengeId: number
  userId: string
  videoUrl: string
  status: string
  submittedAt: Date
  user?: {
    displayName: string
    avatarUrl?: string
  }
}

const getChallengeStatusBadgeStyle = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500 text-white"
    case "completed":
      return "bg-gray-500 text-white"
    default:
      return "bg-yellow-500 text-black"
  }
}

const getChallengeStatusLabel = (status: string) => {
  switch (status) {
    case "active":
      return "Active"
    case "completed":
      return "Completed"
    default:
      return "Unknown"
  }
}

export default function AdminTikTokChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [pendingSubmissions, setPendingSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([])

  useEffect(() => {
    fetchChallenges()
    fetchPendingSubmissions()
  }, [])

  useEffect(() => {
    filterChallenges()
  }, [challenges, searchQuery])

  const fetchChallenges = async () => {
    try {
      setIsLoading(true)

      // This would be a real API call in a production app
      // For this demo, we'll just simulate data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockChallenges = [
        {
          id: 1,
          title: "Day in the Life of a Deputy",
          description: "Create a TikTok showing what you think a day in the life of a SF Sheriff's Deputy looks like.",
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          pointsReward: 150,
          badgeReward: "content_creator",
          thumbnailUrl: "/placeholder.svg?key=00qeb",
          status: "active",
          hashtags: ["DayInTheLife", "SFSheriff", "LawEnforcement"],
        },
        {
          id: 2,
          title: "Sheriff's Fitness Challenge",
          description:
            "Show off your fitness routine that would help prepare for the physical requirements of being a deputy.",
          startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          pointsReward: 100,
          thumbnailUrl: "/placeholder.svg?key=tio10",
          status: "active",
          hashtags: ["FitnessChallenge", "SFSheriff", "DeputyFitness"],
        },
        {
          id: 3,
          title: "SF Landmark Patrol",
          description: "Create a creative TikTok about patrolling a famous San Francisco landmark as a deputy.",
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          pointsReward: 120,
          thumbnailUrl: "/placeholder.svg?key=255yu",
          status: "completed",
          hashtags: ["SFLandmarks", "DeputySheriff", "GoldenGate"],
        },
      ]

      setChallenges(mockChallenges)
    } catch (error) {
      console.error("Error fetching challenges:", error)
      toast({
        title: "Error",
        description: "Failed to load TikTok challenges. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPendingSubmissions = async () => {
    try {
      // This would be a real API call in a production app
      // For this demo, we'll just simulate data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockSubmissions = [
        {
          id: 101,
          challengeId: 1,
          userId: "user123",
          videoUrl: "/tiktok-submission.png",
          status: "pending",
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          user: {
            displayName: "Alex Johnson",
            avatarUrl: "/diverse-user-avatars.png",
          },
        },
        {
          id: 102,
          challengeId: 2,
          userId: "user456",
          videoUrl: "/tiktok-submission.png",
          status: "pending",
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          user: {
            displayName: "Sam Rodriguez",
            avatarUrl: "/diverse-user-avatars.png",
          },
        },
        {
          id: 103,
          challengeId: 1,
          userId: "user789",
          videoUrl: "/tiktok-submission.png",
          status: "pending",
          submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          user: {
            displayName: "Jamie Taylor",
            avatarUrl: "/diverse-user-avatars.png",
          },
        },
      ]

      setPendingSubmissions(mockSubmissions)
    } catch (error) {
      console.error("Error fetching pending submissions:", error)
    }
  }

  const filterChallenges = () => {
    if (!searchQuery) {
      setFilteredChallenges(challenges)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = challenges.filter(
      (challenge) =>
        challenge.title.toLowerCase().includes(query) ||
        challenge.description.toLowerCase().includes(query) ||
        challenge.hashtags.some((tag) => tag.toLowerCase().includes(query)),
    )

    setFilteredChallenges(filtered)
  }

  const handleReviewSubmission = async (submissionId: number, isApproved: boolean) => {
    try {
      // In a real app, this would call your API endpoint
      // For this demo, we'll just update the local state

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setPendingSubmissions((prevSubmissions) => prevSubmissions.filter((sub) => sub.id !== submissionId))

      // Show success message
      toast({
        title: isApproved ? "Submission Approved" : "Submission Rejected",
        description: isApproved
          ? "The submission has been approved and points awarded."
          : "The submission has been rejected. User will be notified.",
      })
    } catch (error) {
      console.error("Error reviewing submission:", error)
      toast({
        title: "Error",
        description: "Failed to process the review. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderChallengesContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <div className="p-0">
                <Skeleton className="h-40 w-full rounded-t-lg" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 w-full">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )
    }

    if (filteredChallenges.length === 0) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">No challenges found</h3>
          <p className="text-gray-500 mt-1">
            {searchQuery
              ? "Try adjusting your search query"
              : "Create your first TikTok challenge to engage potential recruits!"}
          </p>

          {searchQuery && (
            <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          )}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => (
          <Card key={challenge.id} className="overflow-hidden">
            <div className="h-40 bg-gray-100 relative">
              {challenge.thumbnailUrl && (
                <img
                  src={challenge.thumbnailUrl || "/placeholder.svg"}
                  alt={challenge.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-2 right-2">
                <Badge className={getChallengeStatusBadgeStyle(challenge.status)}>
                  {getChallengeStatusLabel(challenge.status)}
                </Badge>
              </div>

              <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
                {challenge.hashtags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-black/50">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{challenge.title}</span>
                <TikTokIcon className="h-5 w-5 flex-shrink-0" />
              </CardTitle>
              <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Start Date:</span>
                  <span>{format(new Date(challenge.startDate), "MMM d, yyyy")}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">End Date:</span>
                  <span>{format(new Date(challenge.endDate), "MMM d, yyyy")}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Reward:</span>
                  <span>{challenge.pointsReward} points</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/admin/tiktok-challenges/${challenge.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Link>
              </Button>

              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/admin/tiktok-challenges/${challenge.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  const renderSubmissionsContent = () => {
    if (pendingSubmissions.length === 0) {
      return (
        <div className="text-center py-12">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-400" />
          <h3 className="text-lg font-medium text-gray-900">No pending submissions</h3>
          <p className="text-gray-500 mt-1">You're all caught up! Check back later for new submissions.</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {pendingSubmissions.map((submission) => {
          const challenge = challenges.find((c) => c.id === submission.challengeId)

          return (
            <Card key={submission.id}>
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                      <span>Pending Submission #{submission.id}</span>
                    </div>
                    <Badge>{format(new Date(submission.submittedAt), "MMM d, yyyy")}</Badge>
                  </div>
                </CardTitle>
                <CardDescription>
                  For challenge: {challenge?.title || `Challenge #${submission.challengeId}`}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-lg overflow-hidden border">
                    <video src={submission.videoUrl} className="w-full h-auto" controls poster="/video-preview.png" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded-full overflow-hidden">
                        <img
                          src={submission.user?.avatarUrl || "/placeholder.svg?height=40&width=40&query=user"}
                          alt={submission.user?.displayName || "User"}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <h3 className="font-medium">{submission.user?.displayName || "Anonymous User"}</h3>
                        <p className="text-sm text-gray-500">User ID: {submission.userId}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Submission Details</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Submitted on: {format(new Date(submission.submittedAt), "MMM d, yyyy 'at' h:mm a")}</p>
                        <p>
                          Status: <span className="font-medium text-yellow-500">Pending Review</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="default"
                        className="flex-1"
                        onClick={() => handleReviewSubmission(submission.id, true)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Approve
                      </Button>

                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleReviewSubmission(submission.id, false)}
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">TikTok Challenges Admin</h1>
          <p className="text-gray-600 mt-1">Manage TikTok challenges and review submissions</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search challenges..."
            className="px-3 py-2 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={fetchChallenges}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button className="flex items-center gap-1">
            <TikTokIcon className="h-4 w-4" />
            New Challenge
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">All Challenges</h2>
          {renderChallengesContent()}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            Pending Submissions
            {pendingSubmissions.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingSubmissions.length}
              </span>
            )}
          </h2>
          {renderSubmissionsContent()}
        </div>
      </div>
    </div>
  )
}

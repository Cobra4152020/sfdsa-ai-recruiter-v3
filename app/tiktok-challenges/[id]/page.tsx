"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/context/user-context"
import { useParams } from "next/navigation"
import { PageWrapper } from "@/components/page-wrapper"
import { TikTokChallengeModal } from "@/components/tiktok-challenge-modal"
import { TikTokChallengeSubmissionViewer } from "@/components/tiktok-challenge-submission-viewer"
import { TikTokIcon } from "@/components/tiktok-icon"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  Award,
  Share,
  ArrowLeft,
  Info,
  CheckCircle,
  Video,
  AlertCircle,
  Users,
  Trophy,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

interface Challenge {
  id: number
  title: string
  description: string
  instructions: string
  hashtags: string[]
  startDate: Date
  endDate: Date
  pointsReward: number
  badgeReward?: string
  exampleVideoUrl?: string
  thumbnailUrl?: string
  requirements?: {
    minDuration?: number
    maxDuration?: number
    requiredElements?: string[]
  }
  status: string
  completed?: boolean
  submissionId?: number
  submissionStatus?: string
}

export default function ChallengePage() {
  const params = useParams()
  const { currentUser } = useUser()
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewingSubmissionId, setViewingSubmissionId] = useState<number | null>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    if (params.id) {
      fetchChallenge()
    }
  }, [params.id])

  const fetchChallenge = async () => {
    try {
      setIsLoading(true)

      // Fetch challenge details
      const challengeResponse = await fetch(`/api/tiktok-challenges/${params.id}?userId=${currentUser?.id}`)

      if (!challengeResponse.ok) {
        throw new Error("Failed to fetch challenge")
      }

      const challengeData = await challengeResponse.json()
      setChallenge(challengeData.challenge)

      // Fetch leaderboard for this challenge
      const leaderboardResponse = await fetch(`/api/tiktok-challenges/leaderboard?challengeId=${params.id}`)

      if (leaderboardResponse.ok) {
        const leaderboardData = await leaderboardResponse.json()
        setLeaderboard(leaderboardData.leaderboard || [])
      }
    } catch (error) {
      console.error("Error fetching challenge:", error)
      toast({
        title: "Error",
        description: "Failed to load challenge details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isActive = challenge && new Date(challenge.endDate) > new Date()
  const canParticipate = isActive && !challenge?.completed

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `TikTok Challenge: ${challenge?.title}`,
          text: `Check out this TikTok recruitment challenge for the SF Sheriff's Department! ${challenge?.description}`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err)
        })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Share this challenge with your friends.",
      })
    }
  }

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="container py-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-80 w-full rounded-lg" />

              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            <div>
              <Card>
                <CardContent className="p-6 space-y-6">
                  <Skeleton className="h-6 w-40" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!challenge) {
    return (
      <PageWrapper>
        <div className="container py-16">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Challenge Not Found</h1>
            <p className="text-gray-600 mb-6">
              The challenge you're looking for could not be found or has been removed.
            </p>
            <Button asChild>
              <Link href="/tiktok-challenges">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Challenges
              </Link>
            </Button>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="container py-8">
        <div className="mb-6">
          <Link href="/tiktok-challenges" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Challenges</span>
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-3xl font-bold flex items-center">
              <TikTokIcon className="h-8 w-8 mr-2" />
              {challenge.title}
            </h1>

            <div className="flex items-center gap-2">
              {challenge.completed && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}

              {challenge.submissionStatus === "pending" && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending Review
                </Badge>
              )}

              {challenge.submissionStatus === "rejected" && (
                <Badge className="bg-red-100 text-red-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Needs Revision
                </Badge>
              )}

              <Badge className="bg-gray-100 text-gray-800">
                <Award className="h-3 w-3 mr-1" />
                {challenge.pointsReward} points
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-lg overflow-hidden border">
              <div className="aspect-video">
                <Image
                  src={challenge.thumbnailUrl || "/placeholder.svg?height=400&width=800&query=TikTok+Challenge"}
                  alt={challenge.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="flex flex-wrap gap-1">
                  {challenge.hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-black/50 hover:bg-black/70">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="details">
                  <Info className="h-4 w-4 mr-2" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="participants">
                  <Users className="h-4 w-4 mr-2" />
                  Participants
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div>
                  <h2 className="text-xl font-medium mb-2">Challenge Description</h2>
                  <p className="text-gray-700">{challenge.description}</p>
                </div>

                <div>
                  <h2 className="text-xl font-medium mb-2">Instructions</h2>
                  <p className="text-gray-700">{challenge.instructions}</p>

                  {challenge.requirements && (
                    <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h3 className="font-medium text-gray-900 mb-2">Requirements:</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {challenge.requirements.minDuration && (
                          <li>Minimum Duration: {challenge.requirements.minDuration} seconds</li>
                        )}
                        {challenge.requirements.maxDuration && (
                          <li>Maximum Duration: {challenge.requirements.maxDuration} seconds</li>
                        )}
                        {challenge.requirements.requiredElements?.map((element, index) => (
                          <li key={index}>{element}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {challenge.exampleVideoUrl && (
                  <div>
                    <h2 className="text-xl font-medium mb-2">Example Video</h2>
                    <div className="rounded-lg overflow-hidden border">
                      <video
                        src={challenge.exampleVideoUrl}
                        className="w-full"
                        controls
                        poster="/placeholder.svg?key=26ksj"
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="participants">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-medium">Top Participants</h2>
                    <Badge variant="outline" className="flex items-center">
                      <Trophy className="h-3 w-3 mr-1" />
                      {leaderboard.length} participants
                    </Badge>
                  </div>

                  {leaderboard.length === 0 ? (
                    <div className="text-center py-8 border border-dashed rounded-lg">
                      <Video className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-gray-500 font-medium">No participants yet</h3>
                      <p className="text-gray-400 text-sm mt-1">Be the first to complete this challenge!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {leaderboard.map((entry, index) => (
                        <div
                          key={entry.userId}
                          className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border"
                        >
                          <div className="flex-shrink-0 w-6 text-center">
                            <span className="font-medium text-gray-600">{index + 1}</span>
                          </div>

                          <div className="ml-3 relative h-10 w-10">
                            <Image
                              src={entry.avatarUrl || "/placeholder.svg?height=40&width=40&query=avatar"}
                              alt={entry.displayName}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>

                          <div className="ml-3 flex-1">
                            <p className="font-medium">{entry.displayName}</p>
                            <p className="text-sm text-gray-500">
                              Submitted {format(new Date(entry.submittedAt), "MMM d, yyyy")}
                            </p>
                          </div>

                          {entry.verified && (
                            <Badge variant="outline" className="flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Challenge Information</h2>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>End Date</span>
                      </div>
                      <span className={`font-medium ${!isActive ? "text-red-600" : ""}`}>
                        {format(new Date(challenge.endDate), "MMM d, yyyy")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Award className="h-4 w-4 mr-2" />
                        <span>Points Reward</span>
                      </div>
                      <span className="font-medium">{challenge.pointsReward}</span>
                    </div>

                    {challenge.badgeReward && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Trophy className="h-4 w-4 mr-2" />
                          <span>Badge Reward</span>
                        </div>
                        <Badge>{challenge.badgeReward}</Badge>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Participants</span>
                      </div>
                      <span className="font-medium">{leaderboard.length}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {challenge.completed ? (
                    <Button onClick={handleShare}>
                      <Share className="h-4 w-4 mr-2" />
                      Share Achievement
                    </Button>
                  ) : challenge.submissionId && challenge.submissionStatus !== "approved" ? (
                    <Button variant="outline" onClick={() => setViewingSubmissionId(challenge.submissionId!)}>
                      <Video className="h-4 w-4 mr-2" />
                      View Submission
                    </Button>
                  ) : canParticipate ? (
                    <Button className="bg-black hover:bg-black/80 text-white" onClick={() => setIsModalOpen(true)}>
                      <TikTokIcon className="h-4 w-4 mr-2" />
                      Participate Now
                    </Button>
                  ) : (
                    <Button disabled>Challenge {challenge.status === "active" ? "Ended" : "Unavailable"}</Button>
                  )}

                  <Button variant="outline" onClick={handleShare}>
                    <Share className="h-4 w-4 mr-2" />
                    Share Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {isModalOpen && currentUser && (
        <TikTokChallengeModal
          challenge={challenge}
          userId={currentUser.id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {viewingSubmissionId && (
        <TikTokChallengeSubmissionViewer
          submissionId={viewingSubmissionId}
          isOpen={!!viewingSubmissionId}
          onClose={() => setViewingSubmissionId(null)}
        />
      )}
    </PageWrapper>
  )
}

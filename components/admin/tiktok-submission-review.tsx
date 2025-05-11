"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, XCircle, User, Calendar, Award } from "lucide-react"
import { TikTokIcon } from "@/components/tiktok-icon"

interface Submission {
  id: number
  challengeId: number
  userId: string
  videoUrl: string
  tiktokUrl?: string
  status: string
  submittedAt: string
  challenge: {
    title: string
    pointsReward: number
  }
  user: {
    name: string
    avatarUrl?: string
    email: string
  }
}

export function TikTokSubmissionReview({ onReviewComplete }: { onReviewComplete?: () => void }) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")
  const [feedback, setFeedback] = useState("")
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchSubmissions(activeTab)
  }, [activeTab])

  const fetchSubmissions = async (status: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/tiktok-challenges/submissions?status=${status}`)

      if (!response.ok) {
        throw new Error("Failed to fetch submissions")
      }

      const data = await response.json()
      setSubmissions(data.submissions || [])
    } catch (error) {
      console.error("Error fetching submissions:", error)
      toast({
        title: "Error",
        description: "Failed to load submissions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReview = async (submissionId: number, status: "approved" | "rejected") => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/tiktok-challenges/submissions/${submissionId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          feedback: status === "rejected" ? feedback : undefined,
          adminId: "current-admin-id", // This would be the actual admin ID in a real implementation
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to review submission")
      }

      // Remove from current list
      setSubmissions(submissions.filter((s) => s.id !== submissionId))
      setCurrentSubmission(null)
      setFeedback("")

      toast({
        title: status === "approved" ? "Submission approved" : "Submission rejected",
        description:
          status === "approved"
            ? "The user will receive points for their submission"
            : "Feedback has been sent to the user",
      })

      if (onReviewComplete) {
        onReviewComplete()
      }
    } catch (error) {
      console.error("Error reviewing submission:", error)
      toast({
        title: "Error",
        description: "Failed to review submission",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full mb-4" />
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-full" />
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

    if (submissions.length === 0) {
      return (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TikTokIcon className="h-12 w-12 mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-900 mb-1">No {activeTab} submissions</h3>
            <p className="text-gray-500 text-center max-w-md">
              {activeTab === "pending"
                ? "All submissions have been reviewed. Check back later for new submissions."
                : activeTab === "approved"
                  ? "No approved submissions yet. Start reviewing pending submissions."
                  : "No rejected submissions yet."}
            </p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <CardTitle className="text-lg">{submission.challenge.title}</CardTitle>
              <div className="text-sm text-gray-500 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Submitted {format(new Date(submission.submittedAt), "MMM d, yyyy")}
              </div>
            </CardHeader>

            <CardContent>
              <div className="rounded-md overflow-hidden mb-4 bg-gray-100 aspect-video flex items-center justify-center">
                {submission.videoUrl ? (
                  <video
                    src={submission.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                    poster="/tiktok-video-preview.png"
                  />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center justify-center h-full">
                    <TikTokIcon className="h-8 w-8 mb-2" />
                    <span>Video preview not available</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mb-3">
                <Avatar>
                  <AvatarImage src={submission.user.avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{submission.user.name}</div>
                  <div className="text-xs text-gray-500">{submission.user.email}</div>
                </div>
              </div>

              {submission.tiktokUrl && (
                <div className="mb-3">
                  <div className="text-sm font-medium">TikTok URL:</div>
                  <a
                    href={submission.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {submission.tiktokUrl}
                  </a>
                </div>
              )}

              <div className="flex items-center text-sm">
                <Award className="h-4 w-4 mr-1 text-amber-500" />
                <span>Reward: {submission.challenge.pointsReward} points</span>
              </div>
            </CardContent>

            <CardFooter>
              {activeTab === "pending" ? (
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-1"
                    onClick={() => {
                      setCurrentSubmission(submission)
                      setFeedback("")
                    }}
                  >
                    <XCircle className="h-4 w-4 text-red-500" />
                    Reject
                  </Button>
                  <Button
                    className="w-full flex items-center gap-1"
                    onClick={() => handleReview(submission.id, "approved")}
                    disabled={isSubmitting}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                </div>
              ) : (
                <div className="w-full">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => (window.location.href = `/admin/tiktok-challenges/submissions/${submission.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {renderContent()}

      {currentSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Reject Submission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Please provide feedback to explain why this submission is being rejected:</p>
              <Textarea
                placeholder="Feedback for the user..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentSubmission(null)
                  setFeedback("")
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReview(currentSubmission.id, "rejected")}
                disabled={isSubmitting || !feedback.trim()}
              >
                {isSubmitting ? "Submitting..." : "Reject Submission"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}

"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TikTokIcon } from "@/components/tiktok-icon"
import { AlertCircle, Calendar, Clock, Loader2, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"

interface TikTokChallengeSubmissionViewerProps {
  submissionId: number
  isOpen: boolean
  onClose: () => void
}

interface Submission {
  id: number
  challengeId: number
  userId: string
  videoUrl: string
  tiktokUrl?: string
  status: string
  adminFeedback?: string
  verificationCode?: string
  submittedAt: Date
  verifiedAt?: Date
  challenge?: {
    title: string
    description: string
    pointsReward: number
    hashtags: string[]
  }
}

export function TikTokChallengeSubmissionViewer({
  submissionId,
  isOpen,
  onClose,
}: TikTokChallengeSubmissionViewerProps) {
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isResubmitting, setIsResubmitting] = useState(false)

  useEffect(() => {
    if (isOpen && submissionId) {
      fetchSubmission()
    }
  }, [isOpen, submissionId])

  const fetchSubmission = async () => {
    try {
      setIsLoading(true)

      const response = await fetch(`/api/tiktok-challenges/submissions/${submissionId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch submission")
      }

      const data = await response.json()
      setSubmission(data.submission)
    } catch (error) {
      console.error("Error fetching submission:", error)
      toast({
        title: "Error",
        description: "Failed to load submission details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResubmit = () => {
    // Open the challenge modal with pre-filled data
    setIsResubmitting(true)

    // In a real implementation, this would re-open the challenge submission modal
    // For this example, we'll just simulate resubmission
    setTimeout(() => {
      toast({
        title: "Redirecting to resubmission",
        description: "You'll be able to update your submission for this challenge.",
      })
      onClose()
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <TikTokIcon className="h-5 w-5 mr-2" />
            Challenge Submission
          </DialogTitle>
          <DialogDescription>
            {isLoading ? "Loading submission details..." : `Your submission for "${submission?.challenge?.title}"`}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : submission ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{submission.challenge?.title}</h3>
                  <p className="text-sm text-gray-600">{submission.challenge?.description}</p>
                </div>

                <div>
                  <Badge className={getStatusBadgeStyle(submission.status, false)}>{getStatusLabel(submission.status)}</Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                {submission.challenge?.hashtags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border">
              <video src={submission.videoUrl} className="w-full" controls poster="/placeholder.svg?key=xjplh" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Submitted: {format(new Date(submission.submittedAt), "MMM d, yyyy")}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Time: {format(new Date(submission.submittedAt), "h:mm a")}</span>
                </div>
              </div>

              {submission.tiktokUrl && (
                <div className="text-sm">
                  <span className="text-gray-600">TikTok URL: </span>
                  <a
                    href={submission.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    {submission.tiktokUrl}
                  </a>
                </div>
              )}

              {submission.status === "rejected" && submission.adminFeedback && (
                <div className="mt-4 border border-yellow-200 bg-yellow-50 rounded-md p-3">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Feedback from Reviewer</h4>
                      <p className="text-sm text-yellow-700 mt-1">{submission.adminFeedback}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Potential Reward</p>
                <p className="font-medium">{submission.challenge?.pointsReward} points</p>
              </div>

              {submission.status === "rejected" && (
                <Button onClick={handleResubmit} disabled={isResubmitting}>
                  {isResubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Update Submission
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium">Submission Not Found</h3>
            <p className="text-sm text-gray-600 mt-1">The submission you're looking for could not be loaded.</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "pending":
      return "Pending Review"
    case "approved":
      return "Approved"
    case "rejected":
      return "Needs Revision"
    default:
      return status.charAt(0).toUpperCase() + status.slice(1)
  }
}

function getStatusBadgeStyle(status: string, isDark: boolean = false): string {
  if (isDark) {
    switch (status) {
      case "pending":
        return "bg-yellow-900/30 text-yellow-300 hover:bg-yellow-900/40"
      case "approved":
        return "bg-green-900/30 text-green-300 hover:bg-green-900/40"
      case "rejected":
        return "bg-red-900/30 text-red-300 hover:bg-red-900/40"
      default:
        return "bg-gray-900/30 text-gray-300 hover:bg-gray-900/40"
    }
  } else {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }
}

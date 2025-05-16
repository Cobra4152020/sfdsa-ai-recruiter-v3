"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, Award, CheckCircle, AlertCircle, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { TikTokIcon } from "@/components/tiktok-icon"
import { TikTokChallengeModal } from "@/components/tiktok-challenge-modal"
import { formatDistance } from "date-fns"

interface TikTokChallengeCardProps {
  challenge: {
    id: number
    title: string
    description: string
    startDate: Date
    endDate: Date
    pointsReward: number
    badgeReward?: string
    thumbnailUrl?: string
    hashtags: string[]
    status: string
    completed?: boolean
    submissionId?: number
    submissionStatus?: string
  }
  userId?: string
  onShowSubmission?: (submissionId: number) => void
}

export function TikTokChallengeCard({ challenge, userId, onShowSubmission }: TikTokChallengeCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const timeRemaining = formatDistance(new Date(challenge.endDate), new Date(), { addSuffix: true })
  const isActive = new Date(challenge.endDate) > new Date()

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="relative h-48 w-full">
          <Image
            src={challenge.thumbnailUrl || "/placeholder.svg?height=250&width=500&query=TikTok+Challenge"}
            alt={challenge.title}
            fill
            className="object-cover"
          />
          {challenge.completed && (
            <div className="absolute top-0 right-0 bg-green-500 text-white py-1 px-3 rounded-bl-md flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" /> Completed
            </div>
          )}
          {challenge.submissionStatus === "pending" && (
            <div className="absolute top-0 right-0 bg-yellow-500 text-white py-1 px-3 rounded-bl-md flex items-center">
              <Clock className="h-4 w-4 mr-1" /> Pending Review
            </div>
          )}
          {challenge.submissionStatus === "rejected" && (
            <div className="absolute top-0 right-0 bg-red-500 text-white py-1 px-3 rounded-bl-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" /> Needs Revision
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <div className="flex flex-wrap gap-1">
              {challenge.hashtags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-black/50 hover:bg-black/70">
                  #{tag}
                </Badge>
              ))}
              {challenge.hashtags.length > 3 && (
                <Badge variant="secondary" className="bg-black/50 hover:bg-black/70">
                  +{challenge.hashtags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{challenge.title}</CardTitle>
            <TikTokIcon className="h-6 w-6 text-black" />
          </div>
          <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <CalendarDays className="h-4 w-4 mr-2" />
              {isActive ? <span>Ends {timeRemaining}</span> : <span className="text-red-500">Challenge ended</span>}
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Award className="h-4 w-4 mr-2" />
              <span>Reward: {challenge.pointsReward} points</span>
              {challenge.badgeReward && <span className="ml-2">+ Special Badge</span>}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2">
          {challenge.submissionId && challenge.submissionStatus !== "approved" && (
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onShowSubmission && onShowSubmission(challenge.submissionId!)}
            >
              View Submission
            </Button>
          )}

          {challenge.completed ? (
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href={`/tiktok-challenges/${challenge.id}`}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Achievement
              </Link>
            </Button>
          ) : isActive ? (
            <Button
              className="w-full sm:w-auto bg-black hover:bg-black/80 flex items-center"
              onClick={() => setIsModalOpen(true)}
            >
              <TikTokIcon className="h-4 w-4 mr-2 text-white" />
              {challenge.submissionStatus === "rejected" ? "Try Again" : "Participate Now"}
            </Button>
          ) : (
            <Button disabled className="w-full sm:w-auto">
              Challenge Ended
            </Button>
          )}

          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href={`/tiktok-challenges/${challenge.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>

      {isModalOpen && userId && (
        <TikTokChallengeModal
          challenge={challenge}
          userId={userId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}

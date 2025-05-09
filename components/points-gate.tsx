"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useUser } from "@/context/user-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Lock, Trophy, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface PointsGateProps {
  children: React.ReactNode
  requiredPoints: number
  pageName: string
  pageDescription: string
  imageUrl?: string
}

export function PointsGate({ children, requiredPoints, pageName, pageDescription, imageUrl }: PointsGateProps) {
  const { currentUser, isLoggedIn } = useUser()
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user has enough points
    if (isLoggedIn && currentUser) {
      const userPoints = currentUser.participation_count || 0
      setHasAccess(userPoints >= requiredPoints)
    }
    setLoading(false)
  }, [isLoggedIn, currentUser, requiredPoints])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <Card className="w-full max-w-3xl mx-auto my-12">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#0A3C1F]">Sign In Required</CardTitle>
          <CardDescription>Please sign in to access the {pageName} page.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="relative w-full h-[200px] rounded-lg overflow-hidden mb-6">
            {imageUrl ? (
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={pageName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Lock className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Lock className="h-16 w-16 text-white" />
            </div>
          </div>
          <p className="text-center mb-6">Sign in to track your progress and unlock exclusive content.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90" onClick={() => router.push("/")}>
            Sign In
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (!hasAccess) {
    const userPoints = currentUser?.participation_count || 0
    const percentComplete = Math.min(100, Math.round((userPoints / requiredPoints) * 100))

    return (
      <Card className="w-full max-w-3xl mx-auto my-12">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#0A3C1F]">Content Locked</CardTitle>
          <CardDescription>
            You need {requiredPoints} points to access the {pageName} page.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="relative w-full h-[200px] rounded-lg overflow-hidden mb-6">
            {imageUrl ? (
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={pageName}
                fill
                className="object-cover filter blur-sm"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Lock className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <Lock className="h-16 w-16 mx-auto mb-2" />
                <p className="text-xl font-bold">{requiredPoints} Points Required</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">
                Your progress: {userPoints}/{requiredPoints} points
              </span>
              <span className="text-sm font-medium">{percentComplete}%</span>
            </div>
            <Progress value={percentComplete} className="h-2" />
          </div>

          <div className="bg-[#0A3C1F]/10 p-4 rounded-lg text-[#0A3C1F] mb-6">
            <h3 className="font-semibold flex items-center mb-2">
              <Trophy className="h-5 w-5 text-[#FFD700] mr-2" />
              How to earn more points:
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Complete the SF Trivia game</li>
              <li>Refer other potential recruits</li>
              <li>Engage with content on the platform</li>
              <li>Share recruitment content on social media</li>
              <li>Complete application steps</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/awards">
            <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
              View Leaderboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  // User has access, show the content
  return <>{children}</>
}

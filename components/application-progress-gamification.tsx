"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Award, Trophy, Share2, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/context/user-context"
import confetti from "canvas-confetti"

interface ApplicationStep {
  id: string
  title: string
  description: string
  points: number
  badgeAwarded?: string
  completed: boolean
}

export function ApplicationProgressGamification() {
  const { toast } = useToast()
  const { currentUser, incrementParticipation } = useUser()
  const [showConfetti, setShowConfetti] = useState(false)
  const [applicationSteps, setApplicationSteps] = useState<ApplicationStep[]>([
    {
      id: "profile",
      title: "Complete Your Profile",
      description: "Fill out your basic information and upload a photo",
      points: 50,
      completed: false,
    },
    {
      id: "documents",
      title: "Upload Required Documents",
      description: "Submit your ID, education certificates, and references",
      points: 100,
      badgeAwarded: "Documentation Pro",
      completed: false,
    },
    {
      id: "assessment",
      title: "Take Initial Assessment",
      description: "Complete the preliminary skills and aptitude assessment",
      points: 150,
      completed: false,
    },
    {
      id: "interview",
      title: "Schedule Interview",
      description: "Book your initial interview with a recruitment officer",
      points: 200,
      badgeAwarded: "Interview Ready",
      completed: false,
    },
    {
      id: "physical",
      title: "Physical Fitness Test",
      description: "Schedule and prepare for your physical fitness assessment",
      points: 250,
      completed: false,
    },
    {
      id: "background",
      title: "Background Check",
      description: "Submit information for your background check",
      points: 300,
      badgeAwarded: "Background Verified",
      completed: false,
    },
    {
      id: "final",
      title: "Final Application Review",
      description: "Your application is being reviewed by the recruitment team",
      points: 500,
      badgeAwarded: "Application Champion",
      completed: false,
    },
  ])

  // Calculate progress percentage
  const totalSteps = applicationSteps.length
  const completedSteps = applicationSteps.filter((step) => step.completed).length
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100)

  // Calculate total points earned
  const totalPointsEarned = applicationSteps
    .filter((step) => step.completed)
    .reduce((sum, step) => sum + step.points, 0)

  // Simulate completing a step
  const completeStep = async (stepId: string) => {
    // Find the step
    const stepIndex = applicationSteps.findIndex((step) => step.id === stepId)
    if (stepIndex === -1 || applicationSteps[stepIndex].completed) return

    // Update the step
    const updatedSteps = [...applicationSteps]
    updatedSteps[stepIndex].completed = true
    setApplicationSteps(updatedSteps)

    // Show confetti for celebration
    setShowConfetti(true)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#0A3C1F", "#FFFFFF"],
    })

    // Award points
    await incrementParticipation(applicationSteps[stepIndex].points)

    // Show toast notification
    toast({
      title: `Step Completed: ${applicationSteps[stepIndex].title}`,
      description: `You earned ${applicationSteps[stepIndex].points} points!${
        applicationSteps[stepIndex].badgeAwarded
          ? ` And unlocked the "${applicationSteps[stepIndex].badgeAwarded}" badge!`
          : ""
      }`,
      duration: 5000,
    })

    // Reset confetti after a delay
    setTimeout(() => setShowConfetti(false), 2000)
  }

  // For demo purposes, let's simulate some completed steps
  useEffect(() => {
    const simulateProgress = () => {
      const updatedSteps = [...applicationSteps]
      // Mark first two steps as completed for demonstration
      if (updatedSteps[0]) updatedSteps[0].completed = true
      if (updatedSteps[1]) updatedSteps[1].completed = true
      setApplicationSteps(updatedSteps)
    }

    simulateProgress()
  }, [])

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/80 text-white">
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-[#FFD700]" />
          Your Application Journey
        </CardTitle>
        <CardDescription className="text-gray-200">Complete each step to earn points and badges</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Application Progress</span>
            <span className="text-sm font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />

          <div className="mt-4 flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500">Points Earned</span>
              <div className="text-2xl font-bold text-[#0A3C1F]">{totalPointsEarned}</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Badges Earned</span>
              <div className="text-2xl font-bold text-[#0A3C1F]">
                {applicationSteps.filter((step) => step.completed && step.badgeAwarded).length}
              </div>
            </div>
            <Button
              variant="outline"
              className="text-[#0A3C1F] border-[#0A3C1F]"
              onClick={() => {
                toast({
                  title: "Share Your Progress",
                  description: "Share your application journey with friends and earn referral points!",
                })
              }}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Progress
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {applicationSteps.map((step, index) => (
            <div
              key={step.id}
              className={`p-4 border rounded-lg transition-all ${
                step.completed ? "bg-[#0A3C1F]/5 border-[#0A3C1F]/20" : "hover:border-[#0A3C1F]/20"
              }`}
            >
              <div className="flex items-start">
                <div
                  className={`p-2 rounded-full ${
                    step.completed ? "bg-[#0A3C1F] text-white" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="h-5 w-5 flex items-center justify-center font-medium">{index + 1}</span>
                  )}
                </div>

                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{step.title}</h3>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-[#0A3C1F] mr-2">+{step.points} pts</span>
                      {step.badgeAwarded && (
                        <Badge
                          className={`${step.completed ? "bg-[#FFD700] text-[#0A3C1F]" : "bg-gray-100 text-gray-500"}`}
                        >
                          <Award className="h-3 w-3 mr-1" />
                          {step.badgeAwarded}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{step.description}</p>

                  {!step.completed && (
                    <Button
                      variant="link"
                      className="text-[#0A3C1F] p-0 h-auto mt-2"
                      onClick={() => completeStep(step.id)}
                    >
                      Complete this step <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

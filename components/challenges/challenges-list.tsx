"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, CheckCircle, Clock, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type Challenge = {
  id: string
  title: string
  description: string
  points: number
  difficulty: "easy" | "medium" | "hard"
  category: "knowledge" | "social" | "recruitment" | "training"
  completed: boolean
  progress?: number
}

export function ChallengesList() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // In a real app, you would fetch challenges from your API
    // For now, we'll use dummy data
    setTimeout(() => {
      setChallenges([
        {
          id: "1",
          title: "Complete Your Profile",
          description: "Fill out all fields in your profile to earn points.",
          points: 25,
          difficulty: "easy",
          category: "knowledge",
          completed: true,
        },
        {
          id: "2",
          title: "Share on Social Media",
          description: "Share your recruiter link on social media platforms.",
          points: 50,
          difficulty: "easy",
          category: "social",
          completed: false,
        },
        {
          id: "3",
          title: "Refer a Friend",
          description: "Refer someone to join the SFDSA.",
          points: 100,
          difficulty: "medium",
          category: "recruitment",
          completed: false,
        },
        {
          id: "4",
          title: "Complete Training Module",
          description: "Complete the 'Introduction to SFDSA' training module.",
          points: 75,
          difficulty: "medium",
          category: "training",
          completed: false,
          progress: 60,
        },
        {
          id: "5",
          title: "Attend Virtual Info Session",
          description: "Attend a virtual information session about the SFDSA.",
          points: 150,
          difficulty: "hard",
          category: "knowledge",
          completed: false,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredChallenges = challenges.filter((challenge) => {
    if (activeTab === "all") return true
    if (activeTab === "completed") return challenge.completed
    if (activeTab === "in-progress") return !challenge.completed && challenge.progress !== undefined
    if (activeTab === "not-started") return !challenge.completed && challenge.progress === undefined
    return true
  })

  const getDifficultyColor = (difficulty: Challenge["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
    }
  }

  const getCategoryColor = (category: Challenge["category"]) => {
    switch (category) {
      case "knowledge":
        return "bg-blue-100 text-blue-800"
      case "social":
        return "bg-purple-100 text-purple-800"
      case "recruitment":
        return "bg-indigo-100 text-indigo-800"
      case "training":
        return "bg-amber-100 text-amber-800"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div>
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="all">All Challenges</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="not-started">Not Started</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {filteredChallenges.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No challenges found in this category.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredChallenges.map((challenge) => (
                <Card key={challenge.id} className={challenge.completed ? "border-green-200 bg-green-50" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      {challenge.completed && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                      </Badge>
                      <Badge variant="outline" className={getCategoryColor(challenge.category)}>
                        {challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        <Award className="h-3 w-3 mr-1" />
                        {challenge.points} pts
                      </Badge>
                    </div>

                    {challenge.progress !== undefined && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{challenge.progress}%</span>
                        </div>
                        <Progress value={challenge.progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant={challenge.completed ? "outline" : "default"}
                      className="w-full"
                      disabled={challenge.completed}
                    >
                      {challenge.completed ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Completed
                        </>
                      ) : challenge.progress !== undefined ? (
                        <>
                          <Clock className="mr-2 h-4 w-4" />
                          Continue
                        </>
                      ) : (
                        "Start Challenge"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

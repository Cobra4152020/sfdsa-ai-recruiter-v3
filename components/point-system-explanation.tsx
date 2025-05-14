"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, MessageSquare, FileText, CheckCircle, Award, Download, Clock } from "lucide-react"
import { useUserPoints } from "@/hooks/use-user-points"
import { Button } from "@/components/ui/button"

interface PointSystemExplanationProps {
  userId?: string
  isLoggedIn?: boolean
  onLoginClick?: () => void
}

export function PointSystemExplanation({ userId, isLoggedIn = false, onLoginClick }: PointSystemExplanationProps) {
  const { points, nextTier, isLoading, error, refetch } = useUserPoints(userId)

  const pointTiers = [
    {
      name: "Bronze Recruit",
      points: 1000,
      rewards: ["Bronze Badge", "Leaderboard Recognition"],
      icon: <Award className="h-8 w-8 text-amber-600" />,
      color: "from-amber-200/20 to-amber-200/5",
    },
    {
      name: "Silver Recruit",
      points: 2500,
      rewards: ["Silver Badge", "Priority Application Review"],
      icon: <Award className="h-8 w-8 text-gray-400" />,
      color: "from-gray-200/20 to-gray-200/5",
    },
    {
      name: "Gold Recruit",
      points: 5000,
      rewards: ["Gold Badge", "Exclusive Resources"],
      icon: <Award className="h-8 w-8 text-yellow-400" />,
      color: "from-yellow-200/20 to-yellow-200/5",
    },
    {
      name: "Platinum Recruit",
      points: 10000,
      rewards: ["Platinum Badge", "Direct Contact with Recruiters"],
      icon: <Award className="h-8 w-8 text-gray-300" />,
      color: "from-gray-100/20 to-gray-100/5",
    },
  ]

  const pointActivities = [
    {
      name: "Chat with Sgt. Ken",
      points: 5,
      description: "Earn points for each meaningful interaction with our AI assistant",
      icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
    },
    {
      name: "Complete Practice Tests",
      points: 20,
      description: "Earn points for each practice test you complete",
      icon: <FileText className="h-8 w-8 text-green-500" />,
    },
    {
      name: "Review Application Materials",
      points: 10,
      description: "Earn points for reviewing application documents and resources",
      icon: <FileText className="h-8 w-8 text-purple-500" />,
    },
    {
      name: "Submit Application",
      points: 100,
      description: "Earn a significant point bonus when you submit your application",
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    },
  ]

  const pointCategories = [
    {
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
      title: "Chat Interactions",
      description: "Earn points by chatting with our AI assistant and asking questions about the recruitment process.",
      points: "5-20 points per meaningful interaction",
    },
    {
      icon: <Download className="h-5 w-5 text-green-500" />,
      title: "Resource Downloads",
      description: "Download study materials, application guides, and other resources to prepare for the process.",
      points: "10 points per resource",
    },
    {
      icon: <Clock className="h-5 w-5 text-purple-500" />,
      title: "Time Spent",
      description: "Points awarded based on time spent engaging with our recruitment platform.",
      points: "1 point per minute (up to 30 points per day)",
    },
    {
      icon: <Award className="h-5 w-5 text-yellow-500" />,
      title: "Badge Achievements",
      description: "Earn badges by completing specific actions and milestones in the recruitment process.",
      points: "25-100 points per badge",
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-red-500" />,
      title: "Application Progress",
      description: "Advance through the application process to earn substantial points.",
      points: "50-200 points per stage completed",
    },
  ]

  if (!isLoggedIn) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl flex items-center">
            <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
            Track Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300">
              Sign up or log in to track your points and progress through the recruitment process.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Earn Points By:</h3>
                <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-300">
                  <li>Engaging with our AI assistant</li>
                  <li>Completing application steps</li>
                  <li>Downloading resources</li>
                  <li>Attending virtual events</li>
                  <li>Referring other potential candidates</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Benefits Include:</h3>
                <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-300">
                  <li>Recognition on the leaderboard</li>
                  <li>Earning special badges</li>
                  <li>Exclusive NFT awards</li>
                  <li>Priority application processing</li>
                  <li>Access to special resources</li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-6">
              <Button className="bg-green-600 hover:bg-green-700">Start Now</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              <p>Failed to load your points data. Please try again.</p>
              <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <div>
                    <span className="text-lg font-bold">{points.toLocaleString()}</span>
                    <span className="text-muted-foreground"> points earned</span>
                  </div>
                  {nextTier && (
                    <div className="text-right">
                      <span className="text-muted-foreground">Next tier: </span>
                      <span className="font-medium">{nextTier.name}</span>
                    </div>
                  )}
                </div>

                {nextTier && (
                  <>
                    <Progress value={(points / nextTier.points) * 100} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {nextTier.points - points} more points needed to reach {nextTier.name}
                    </p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pointTiers.map((tier, index) => {
                  const isCompleted = points >= tier.points
                  const isNext = nextTier?.name === tier.name

                  return (
                    <div
                      key={tier.name}
                      className={`p-4 rounded-lg border ${
                        isCompleted
                          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                          : isNext
                            ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                            : "bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`rounded-full p-2 mr-3 bg-gradient-to-b ${tier.color}`}>{tier.icon}</div>
                        <div>
                          <h3 className="font-bold">{tier.name}</h3>
                          <p className="text-sm text-muted-foreground">{tier.points.toLocaleString()} points</p>
                          <ul className="mt-2 text-sm">
                            {tier.rewards.map((reward, i) => (
                              <li key={i} className="flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                {reward}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
            How Points Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Earning Points</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pointActivities.map((activity) => (
                  <div
                    key={activity.name}
                    className="flex items-start p-4 rounded-lg border bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="rounded-full p-2 mr-3 bg-white dark:bg-gray-800 shadow-sm">{activity.icon}</div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">{activity.name}</h4>
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-white text-xs">
                          +{activity.points} pts
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Point Tiers and Rewards</h3>
              <p className="text-muted-foreground mb-4">
                As you accumulate points, you'll progress through different tiers, each with its own rewards and
                recognition.
              </p>

              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                {pointTiers.map((tier, index) => (
                  <div key={tier.name} className="relative pl-10 pb-8">
                    <div className="absolute left-0 top-0 rounded-full bg-white dark:bg-gray-800 p-1 border-2 border-primary">
                      {tier.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{tier.name}</h4>
                      <p className="text-muted-foreground">{tier.points.toLocaleString()} points</p>
                      <div className="mt-2 space-y-1">
                        {tier.rewards.map((reward, i) => (
                          <div key={i} className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            <span>{reward}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-lg mb-2 text-primary">Points and Leaderboard</h3>
              <p className="text-sm">
                Your points determine your position on our leaderboard. The leaderboard is updated in real-time,
                allowing you to see how you stack up against other recruits. Top performers are recognized and may
                receive special opportunities in the recruitment process.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

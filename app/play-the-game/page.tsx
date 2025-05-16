import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Trophy, Gamepad2, Award, Star, Users, ArrowRight } from "lucide-react"
import type { Route } from "next"

export default function PlayTheGamePage() {
  const games = [
    {
      title: "Daily Trivia",
      description: "Test your knowledge about San Francisco and law enforcement.",
      icon: Trophy,
      link: "/trivia" as Route,
      points: "Up to 50 points daily"
    },
    {
      title: "TikTok Challenges",
      description: "Create engaging content and showcase your skills.",
      icon: Gamepad2,
      link: "/tiktok-challenges" as Route,
      points: "100-150 points per challenge"
    },
    {
      title: "Special Missions",
      description: "Complete unique tasks and earn exclusive badges.",
      icon: Star,
      link: "/games" as Route,
      points: "Varies by mission"
    }
  ]

  return (
    <PageWrapper>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#0A3C1F] mb-4">Play & Earn</h1>
            <p className="text-xl text-gray-600">
              Engage in fun activities, earn points, and progress in your journey to become a San Francisco Deputy Sheriff.
            </p>
          </div>

          <div className="grid gap-6 mb-12">
            {games.map((game) => {
              const Icon = game.icon
              return (
                <Card key={game.title} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-[#0A3C1F]/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-[#0A3C1F] p-2 rounded-lg mr-4">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle>{game.title}</CardTitle>
                          <CardDescription>{game.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-[#0A3C1F]/10">
                        {game.points}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Button asChild className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
                      <Link href={game.link}>
                        Play Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-[#0A3C1F]" />
                  Points System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="rounded-full bg-[#0A3C1F]/10 p-1 mr-3 mt-0.5">
                      <Star className="h-4 w-4 text-[#0A3C1F]" />
                    </div>
                    <span>Earn points through active participation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-[#0A3C1F]/10 p-1 mr-3 mt-0.5">
                      <Star className="h-4 w-4 text-[#0A3C1F]" />
                    </div>
                    <span>Higher scores mean more points</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-[#0A3C1F]/10 p-1 mr-3 mt-0.5">
                      <Star className="h-4 w-4 text-[#0A3C1F]" />
                    </div>
                    <span>Share achievements for bonus points</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-[#0A3C1F]" />
                  Rewards & Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="rounded-full bg-[#0A3C1F]/10 p-1 mr-3 mt-0.5">
                      <Award className="h-4 w-4 text-[#0A3C1F]" />
                    </div>
                    <span>Unlock achievement badges</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-[#0A3C1F]/10 p-1 mr-3 mt-0.5">
                      <Award className="h-4 w-4 text-[#0A3C1F]" />
                    </div>
                    <span>Climb the recruitment leaderboard</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-[#0A3C1F]/10 p-1 mr-3 mt-0.5">
                      <Award className="h-4 w-4 text-[#0A3C1F]" />
                    </div>
                    <span>Earn special recognition</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
} 
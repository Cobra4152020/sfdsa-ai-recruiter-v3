import { PageWrapper } from "@/components/page-wrapper";
import { AuthRequiredWrapper } from "@/components/auth-required-wrapper";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Trophy, 
  Gamepad2, 
  Award, 
  Star, 
  ArrowRight, 
  Brain, 
  Target, 
  Users, 
  Clock,
  Video,
  Shield,
  TrendingUp
} from "lucide-react";
import type { Route } from "next";

export default function PlayTheGamePage() {
  const games = [
    {
      title: "SF Trivia Hub",
      description: "Test your knowledge about San Francisco with 6 exciting trivia categories covering sports, districts, tourist spots, and more.",
      icon: Brain,
      link: "/trivia" as Route,
      points: "60-120 points per game",
      category: "Knowledge",
      difficulty: "Medium",
      estimatedTime: "5-10 min",
      color: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600"
    },
    {
      title: "TikTok Challenges",
      description: "Create engaging recruitment content and showcase your passion for law enforcement through creative TikTok videos.",
      icon: Video,
      link: "/tiktok-challenges" as Route,
      points: "125-200 points per challenge",
      category: "Creative",
      difficulty: "Easy",
      estimatedTime: "10-30 min",
      color: "from-purple-50 to-purple-100", 
      borderColor: "border-purple-200",
      iconColor: "text-purple-600"
    },
    {
      title: "Sgt. Ken Says",
      description: "Daily law enforcement word puzzle game! Crack the 5-letter code and show your investigative skills.",
      icon: Target,
      link: "/sgt-ken-says" as Route,
      points: "100-220 points daily",
      category: "Puzzle",
      difficulty: "Medium",
      estimatedTime: "5-15 min",
      color: "from-green-50 to-green-100",
      borderColor: "border-green-200", 
      iconColor: "text-green-600"
    },
    {
      title: "Could You Make the Cut?",
      description: "Face real deputy scenarios and test your law enforcement decision-making skills under pressure.",
      icon: Shield,
      link: "/could-you-make-the-cut" as Route,
      points: "100-220 points per test",
      category: "Simulation",
      difficulty: "Hard",
      estimatedTime: "10-15 min",
      color: "from-red-50 to-red-100",
      borderColor: "border-red-200",
      iconColor: "text-red-600"
    },
    {
      title: "Special Missions",
      description: "Complete unique recruitment tasks and earn exclusive badges while helping us find top candidates.",
      icon: Star,
      link: "/games" as Route,
      points: "Varies by mission",
      category: "Various",
      difficulty: "Varies",
      estimatedTime: "5-20 min",
      color: "from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600"
    },
  ];

  return (
    <PageWrapper>
      <AuthRequiredWrapper
        requiredFeature="games"
        title="Gaming Hub Access"
        description="Play interactive games to test your skills and earn points"
      >
        <div className="container py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/80 bg-clip-text text-transparent mb-6">
              🎮 Play & Earn Points
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Engage in fun, interactive games designed to test your skills and passion for law enforcement. 
              Every game you play brings you closer to becoming a San Francisco Deputy Sheriff!
            </p>
            
            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-[#0A3C1F]/10 to-transparent border border-[#0A3C1F]/20 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#0A3C1F]">5</div>
                  <div className="text-sm text-gray-600 font-medium">Games Available</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0A3C1F]">60-220</div>
                  <div className="text-sm text-gray-600 font-medium">Points Per Game</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0A3C1F]">🏆</div>
                  <div className="text-sm text-gray-600 font-medium">Achievement Badges</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0A3C1F]">∞</div>
                  <div className="text-sm text-gray-600 font-medium">Replay Value</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 mb-12">
            {games.map((game) => {
              const Icon = game.icon;
              return (
                <Card
                  key={game.title}
                  className={`overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r ${game.color} border-l-4 ${game.borderColor}`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-[#0A3C1F] p-3 rounded-xl mr-4 shadow-md">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-[#0A3C1F] mb-1">
                            {game.title}
                          </CardTitle>
                          <CardDescription className="text-gray-700 max-w-2xl">
                            {game.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="hidden md:flex flex-col items-end gap-2">
                        <Badge variant="outline" className="bg-white/50 font-semibold">
                          {game.points}
                        </Badge>
                        <div className="flex gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {game.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {game.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{game.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className={`h-4 w-4 ${game.iconColor}`} />
                          <span>{game.category}</span>
                        </div>
                      </div>
                      <Button
                        asChild
                        className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 shadow-md hover:shadow-lg transition-all"
                      >
                        <Link href={game.link}>
                          Play Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Enhanced Info Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Trophy className="h-5 w-5 mr-2 text-blue-600" />
                  Points System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="rounded-full bg-blue-200 p-1 mr-3 mt-0.5">
                      <Star className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-blue-800">Earn 60-220 points per game based on performance</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-blue-200 p-1 mr-3 mt-0.5">
                      <Star className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-blue-800">Bonus points for perfect scores and sharing</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-blue-200 p-1 mr-3 mt-0.5">
                      <Star className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-blue-800">Easily surpass mock leaderboard data</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-900">
                  <Award className="h-5 w-5 mr-2 text-green-600" />
                  Achievement Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="rounded-full bg-green-200 p-1 mr-3 mt-0.5">
                      <Award className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-green-800">Earn unique badges for each game type</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-green-200 p-1 mr-3 mt-0.5">
                      <Award className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-green-800">Special badges for streak achievements</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-green-200 p-1 mr-3 mt-0.5">
                      <Award className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-green-800">Showcase your dedication and skills</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-900">
                  <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                  Leaderboard Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="rounded-full bg-purple-200 p-1 mr-3 mt-0.5">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-purple-800">Climb recruitment leaderboards</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-purple-200 p-1 mr-3 mt-0.5">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-purple-800">Compete with other candidates</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-purple-200 p-1 mr-3 mt-0.5">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-purple-800">Get recognized by recruiters</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/90 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Show Your Potential?</h2>
            <p className="text-lg mb-6 opacity-90">
              Every game you play demonstrates your commitment to becoming a SF Deputy Sheriff. 
              Start earning points today and climb the recruitment leaderboard!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                variant="secondary" 
                className="bg-white text-[#0A3C1F] hover:bg-gray-100 font-semibold"
              >
                <Link href="/trivia">
                  <Brain className="h-4 w-4 mr-2" />
                  Start with Trivia
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-[#0A3C1F]"
              >
                <Link href="/leaderboard">
                  <Trophy className="h-4 w-4 mr-2" />
                  View Leaderboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </AuthRequiredWrapper>
    </PageWrapper>
  );
}

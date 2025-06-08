"use client";

import { PageWrapper } from "@/components/page-wrapper";
import { AuthRequiredWrapper } from "@/components/auth-required-wrapper";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import {
  Trophy,
  ClubIcon as Football,
  BeerIcon as Baseball,
  ShoppingBasketIcon as Basketball,
  MapPin,
  Landmark,
  Compass,
  Flame,
  MessageSquare,
  Building2,
  Castle,
  Trees,
  CheckCircle2,
  Info,
  Medal,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useTriviaHistory } from "@/hooks/use-trivia-history";
import { useUser } from "@/context/user-context";
import { formatDistanceToNow } from "date-fns";

type Category = {
  name: string;
  icon: JSX.Element;
  bgColor: string;
  textColor: string;
};

const categories: Record<string, Category> = {
  sports: {
    name: "Sports",
    icon: <Flame className="h-3 w-3" />,
    bgColor: "bg-red-500",
    textColor: "text-white",
  },
  geography: {
    name: "Geography",
    icon: <MapPin className="h-3 w-3" />,
    bgColor: "bg-purple-500",
    textColor: "text-white",
  },
  landmarks: {
    name: "Landmarks",
    icon: <Castle className="h-3 w-3" />,
    bgColor: "bg-green-500",
    textColor: "text-white",
  },
  culture: {
    name: "Culture",
    icon: <MessageSquare className="h-3 w-3" />,
    bgColor: "bg-blue-500",
    textColor: "text-white",
  },
  urban: {
    name: "Urban",
    icon: <Building2 className="h-3 w-3" />,
    bgColor: "bg-slate-500",
    textColor: "text-white",
  },
  nature: {
    name: "Nature",
    icon: <Trees className="h-3 w-3" />,
    bgColor: "bg-emerald-500",
    textColor: "text-white",
  },
};

const triviaGames = [
  {
    id: "sf-football",
    name: "SF Football Trivia",
    description:
      "Test your knowledge about San Francisco football history and the 49ers.",
    icon: <Football className="h-6 w-6 text-[#0A3C1F]" />,
    image: "/levis-stadium-49ers.png",
    color: "bg-red-50 border-red-200",
    textColor: "text-red-800",
    hoverColor: "shadow-red-300/50",
    categories: ["sports"],
  },
  {
    id: "sf-baseball",
    name: "SF Baseball Trivia",
    description:
      "How much do you know about the San Francisco Giants and baseball in the Bay Area?",
    icon: <Baseball className="h-6 w-6 text-[#0A3C1F]" />,
    image: "/oracle-park-giants.png",
    color: "bg-orange-50 border-orange-200",
    textColor: "text-orange-800",
    hoverColor: "shadow-orange-300/50",
    categories: ["sports"],
  },
  {
    id: "sf-basketball",
    name: "SF Basketball Trivia",
    description:
      "Challenge yourself with questions about the Golden State Warriors and basketball in San Francisco.",
    icon: <Basketball className="h-6 w-6 text-[#0A3C1F]" />,
    image: "/chase-center-gsw.png",
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-800",
    hoverColor: "shadow-blue-300/50",
    categories: ["sports"],
  },
  {
    id: "sf-districts",
    name: "SF District Trivia",
    description:
      "Test your knowledge of San Francisco&apos;s unique and diverse neighborhoods and districts.",
    icon: <MapPin className="h-6 w-6 text-[#0A3C1F]" />,
    image: "/mission-district-sf.png",
    color: "bg-purple-50 border-purple-200",
    textColor: "text-purple-800",
    hoverColor: "shadow-purple-300/50",
    categories: ["geography", "urban"],
  },
  {
    id: "sf-tourist-spots",
    name: "SF Most Popular Tourist Spots",
    description:
      "How well do you know San Francisco&apos;s famous landmarks and tourist attractions?",
    icon: <Landmark className="h-6 w-6 text-[#0A3C1F]" />,
    image: "/golden-gate-bridge.png",
    color: "bg-green-50 border-green-200",
    textColor: "text-green-800",
    hoverColor: "shadow-green-300/50",
    categories: ["landmarks", "culture"],
  },
  {
    id: "sf-day-trips",
    name: "SF Best Places to Visit",
    description:
      "Test your knowledge about the best day trips and places to visit around San Francisco.",
    icon: <Compass className="h-6 w-6 text-[#0A3C1F]" />,
    image: "/muir-woods-day-trip.png",
    color: "bg-amber-50 border-amber-200",
    textColor: "text-amber-800",
    hoverColor: "shadow-amber-300/50",
    categories: ["geography", "nature", "landmarks"],
  },
];

export default function TriviaHubPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { gameHistory } = useTriviaHistory();
  const { isLoggedIn } = useUser();

  // Function to get score percentage
  const getScorePercentage = (score: number, total: number) => {
    return Math.round((score / total) * 100);
  };

  // Function to get appropriate badge color based on score percentage
  const getScoreBadgeColor = (percentage: number) => {
    if (percentage >= 90) return "bg-yellow-500 text-white"; // Gold
    if (percentage >= 70) return "bg-gray-400 text-white"; // Silver
    if (percentage >= 50) return "bg-amber-700 text-white"; // Bronze
    return "bg-blue-500 text-white"; // Default blue
  };

  return (
    <PageWrapper>
      <AuthRequiredWrapper
        requiredFeature="practice_tests"
        title="San Francisco Trivia Games"
        description="Test your knowledge of San Francisco and earn points"
      >
        <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-[#0A3C1F] mb-2 md:mb-0">
              San Francisco Trivia Games
            </h1>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      <Info className="h-4 w-4" />
                      <span>Categories</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="p-4 max-w-xs">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Trivia Categories</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(categories).map(([id, category]) => (
                          <div key={id} className="flex items-center gap-1">
                            <div
                              className={`p-1 rounded-full ${category.bgColor}`}
                            >
                              {category.icon}
                            </div>
                            <span>{category.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {isLoggedIn && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        <Medal className="h-4 w-4" />
                        <span>Your Progress</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="p-4 max-w-xs">
                      <div className="space-y-2">
                        <h3 className="font-semibold">Your Trivia Progress</h3>
                        <p className="text-sm text-gray-500">
                          {Object.keys(gameHistory).length > 0
                            ? `You've played ${Object.keys(gameHistory).length} out of ${triviaGames.length} games.`
                            : "You haven't played any games yet. Start playing to track your progress!"}
                        </p>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0A3C1F]"
                            style={{
                              width: `${(Object.keys(gameHistory).length / triviaGames.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-[#0A3C1F]/10 to-transparent border border-[#0A3C1F]/20 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#0A3C1F]">{triviaGames.length}</div>
                <div className="text-sm text-gray-600">Games Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0A3C1F]">
                  {triviaGames.reduce((total, game) => total + 8, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0A3C1F]">60-120</div>
                <div className="text-sm text-gray-600">Points Per Game</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0A3C1F]">🏆</div>
                <div className="text-sm text-gray-600">Badges Available</div>
              </div>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center">
            Test your knowledge about San Francisco with these fun trivia games
            hosted by Sgt. Ken. Earn points, badges, and climb the leaderboard!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {triviaGames.map((game) => {
            const gameResult = gameHistory[game.id];
            const hasPlayed = !!gameResult;
            const scorePercentage = hasPlayed
              ? getScorePercentage(
                  gameResult.bestScore,
                  gameResult.totalQuestions,
                )
              : 0;

            return (
              <Card
                key={game.id}
                className={`overflow-hidden border ${game.color} transition-all duration-300 ease-in-out
                  ${hoveredCard === game.id ? `shadow-lg ${game.hoverColor} scale-[1.02] z-10` : "hover:shadow-md"}`}
                onMouseEnter={() => setHoveredCard(game.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={game.image || "/placeholder.svg"}
                    alt={game.name}
                    fill
                    className={`object-cover transition-transform duration-500 ease-in-out
                      ${hoveredCard === game.id ? "scale-110" : ""}`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={
                      game.id === "sf-football" || game.id === "sf-baseball"
                    }
                  />
                  <div
                    className={`absolute inset-0 bg-black opacity-0 transition-opacity duration-300
                    ${hoveredCard === game.id ? "opacity-10" : ""}`}
                  ></div>

                  {/* Category Badges */}
                  <div className="absolute top-2 right-2 flex flex-wrap justify-end gap-1 max-w-[70%]">
                    {game.categories.map((categoryId) => {
                      const category = categories[categoryId];
                      return (
                        <div
                          key={categoryId}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${category.bgColor} ${category.textColor} 
                            shadow-sm transition-transform duration-300 ${hoveredCard === game.id ? "scale-110" : ""}`}
                          title={`Category: ${category.name}`}
                        >
                          {category.icon}
                          <span>{category.name}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Played Badge */}
                  {hasPlayed && (
                    <div className="absolute top-2 left-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shadow-sm transition-transform duration-300 ${getScoreBadgeColor(
                                scorePercentage,
                              )} ${hoveredCard === game.id ? "scale-110" : ""}`}
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              <span>
                                {gameResult.bestScore}/
                                {gameResult.totalQuestions}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="font-medium">
                                Best Score: {gameResult.bestScore}/
                                {gameResult.totalQuestions} ({scorePercentage}%)
                              </p>
                              <p className="text-xs text-gray-500">
                                Played {gameResult.timesPlayed} time
                                {gameResult.timesPlayed !== 1 ? "s" : ""}
                              </p>
                              <p className="text-xs text-gray-500">
                                Last played:{" "}
                                {formatDistanceToNow(
                                  new Date(gameResult.lastPlayed),
                                )}{" "}
                                ago
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`transition-transform duration-300 ${hoveredCard === game.id ? "scale-110" : ""}`}
                    >
                      {game.icon}
                    </div>
                    <CardTitle
                      className={`text-xl ${game.textColor} transition-all duration-300
                      ${hoveredCard === game.id ? "font-bold" : ""}`}
                    >
                      {game.name}
                    </CardTitle>
                  </div>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <Link href={`/trivia/${game.id}`} className="w-full">
                    <Button
                      className={`w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 transition-all duration-300
                        ${hoveredCard === game.id ? "shadow-md" : ""}`}
                    >
                      <Trophy
                        className={`h-4 w-4 mr-2 transition-transform duration-300
                        ${hoveredCard === game.id ? "scale-125" : ""}`}
                      />
                      {hasPlayed ? "Play Again" : "Play Now"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>
      </AuthRequiredWrapper>
    </PageWrapper>
  );
}

"use client"

import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Trophy,
  ClubIcon as Football,
  BeerIcon as Baseball,
  ShoppingBasketIcon as Basketball,
  MapPin,
  Landmark,
  Compass,
} from "lucide-react"
import Image from "next/image"

const triviaGames = [
  {
    id: "sf-football",
    name: "SF Football Trivia",
    description: "Test your knowledge about San Francisco football history and the 49ers.",
    icon: <Football className="h-6 w-6 text-[#0A3C1F]" />,
    image: "/levis-stadium-49ers.png",
    color: "bg-red-50 border-red-200",
    textColor: "text-red-800",
  },
  {
    id: "sf-baseball",
    name: "SF Baseball Trivia",
    description: "How much do you know about the San Francisco Giants and baseball in the Bay Area?",
    icon: <Baseball className="h-6 w-6 text-[#0A3C1F]" />,
    image: "/oracle-park-giants.png",
    color: "bg-orange-50 border-orange-200",
    textColor: "text-orange-800",
  },
  {
    id: "sf-basketball",
    name: "SF Basketball Trivia",
    description: "Challenge yourself with questions about the Golden State Warriors and basketball in San Francisco.",
    icon: <Basketball className="h-6 w-6 text-[#0A3C1F]" />,
    image: "/chase-center-gsw.png",
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-800",
  },
  {
    id: "sf-districts",
    name: "SF District Trivia",
    description: "Test your knowledge of San Francisco's unique and diverse neighborhoods and districts.",
    icon: <MapPin className="h-6 w-6 text-[#0A3C1F]" />,
    image: "/mission-district-sf.png",
    color: "bg-purple-50 border-purple-200",
    textColor: "text-purple-800",
  },
  {
    id: "sf-tourist-spots",
    name: "SF Most Popular Tourist Spots",
    description: "How well do you know San Francisco's famous landmarks and tourist attractions?",
    icon: <Landmark className="h-6 w-6 text-[#0A3C1F]" />,
    image: "/golden-gate-bridge.png",
    color: "bg-green-50 border-green-200",
    textColor: "text-green-800",
  },
  {
    id: "sf-day-trips",
    name: "SF Best Places to Visit",
    description: "Test your knowledge about the best day trips and places to visit around San Francisco.",
    icon: <Compass className="h-6 w-6 text-[#0A3C1F]" />,
    image: "/muir-woods-day-trip.png",
    color: "bg-amber-50 border-amber-200",
    textColor: "text-amber-800",
  },
]

export default function TriviaHubPage() {
  return (
    <>
      <ImprovedHeader showOptInForm={() => {}} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0A3C1F] mb-2">San Francisco Trivia Games</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Test your knowledge about San Francisco with these fun trivia games hosted by Sgt. Ken. Earn points, badges,
            and climb the leaderboard!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {triviaGames.map((game) => (
            <Card key={game.id} className={`overflow-hidden border ${game.color} hover:shadow-md transition-shadow`}>
              <div className="relative h-48">
                <Image
                  src={game.image || "/placeholder.svg"}
                  alt={game.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={game.id === "sf-football" || game.id === "sf-baseball"}
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {game.icon}
                  <CardTitle className={`text-xl ${game.textColor}`}>{game.name}</CardTitle>
                </div>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <Link href={`/trivia/${game.id}`} className="w-full">
                  <Button className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
                    <Trophy className="h-4 w-4 mr-2" />
                    Play Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <ImprovedFooter />
    </>
  )
}

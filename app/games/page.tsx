import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GameLayout } from "@/components/game-layout"
import { ArrowRight } from "lucide-react"

export default function GamesPage() {
  const games = [
    // Word Constructor game removed
    // Future games can be added here
  ]

  return (
    <GameLayout
      title="Recruitment Games"
      description="Play games to earn participation points and climb the recruitment leaderboard. Share your scores on social media for bonus points!"
    >
      {games.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game, i) => (
            <Card
              key={i}
              className="h-full flex flex-col border-t-4 border-t-[#0A3C1F] hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="text-4xl mb-2">{game.emoji}</div>
                <CardTitle>{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-4">
                <Button asChild className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
                  <Link href={game.href}>
                    Play Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-2">New Games Coming Soon!</h3>
          <p className="text-gray-600 mb-6">
            We're developing exciting new games to help you earn participation points.
            <br />
            Check back soon or try our trivia games in the meantime!
          </p>
          <Button asChild className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
            <Link href="/trivia">
              Play Trivia
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      <div className="mt-8 p-4 bg-[#0A3C1F]/5 rounded-lg border border-[#0A3C1F]/20">
        <h3 className="text-lg font-semibold mb-2">Earning Points</h3>
        <p className="mb-4">
          Playing games is a great way to earn participation points and increase your standing in the recruitment
          process. Here's how game points work:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Game scores are converted to participation points</li>
          <li>Higher scores earn more participation points</li>
          <li>
            Share your scores on social media for <strong>bonus points</strong>
          </li>
          <li>Daily participation helps you earn badges</li>
          <li>Climb the leaderboard to showcase your dedication</li>
        </ul>
      </div>
    </GameLayout>
  )
}

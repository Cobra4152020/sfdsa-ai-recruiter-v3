"use client"

import { useState } from "react"
import { PageWrapper } from "@/components/page-wrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Award } from "lucide-react"
import { EnhancedTriviaGame } from "@/components/trivia/enhanced-trivia-game"
import { TriviaLeaderboard } from "@/components/trivia/trivia-leaderboard"
import { TriviaBadges } from "@/components/trivia/trivia-badges"
import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper"

const gameId = "sf-day-trips"
const gameName = "San Francisco Day Trips Trivia"
const gameDescription = "Test your knowledge of the best day trips and places to visit around San Francisco."
const badgeTypes = {
  participant: "sf-day-trips-participant",
  enthusiast: "sf-day-trips-enthusiast",
  master: "sf-day-trips-master",
}

export default function SFDayTripsTriviaPage() {
  const [activeTab, setActiveTab] = useState("play")

  return (
    <PageWrapper>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0A3C1F] mb-2">{gameName}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{gameDescription}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="play" className="flex items-center">
              <Trophy className="h-4 w-4 mr-2" />
              Play Trivia
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center">
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="play">
            <ErrorBoundaryWrapper>
              <EnhancedTriviaGame
                gameId={gameId}
                gameName={gameName}
                gameDescription={gameDescription}
                fetchQuestionsEndpoint="/api/trivia/games/questions"
                submitEndpoint="/api/trivia/games/submit"
                shareEndpoint="/api/trivia/games/share"
                badgeTypes={badgeTypes}
              />
            </ErrorBoundaryWrapper>
          </TabsContent>

          <TabsContent value="leaderboard">
            <ErrorBoundaryWrapper>
              <TriviaLeaderboard gameId={gameId} gameName={gameName} />
            </ErrorBoundaryWrapper>
          </TabsContent>

          <TabsContent value="badges">
            <ErrorBoundaryWrapper>
              <TriviaBadges gameId={gameId} gameName={gameName} badgeTypes={badgeTypes} />
            </ErrorBoundaryWrapper>
          </TabsContent>
        </Tabs>
      </main>
    </PageWrapper>
  )
}

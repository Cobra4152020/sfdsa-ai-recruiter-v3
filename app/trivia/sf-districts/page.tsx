"use client"

import { useState } from "react"
import { EnhancedTriviaGame } from "@/components/trivia/enhanced-trivia-game"
import { TriviaBadges } from "@/components/trivia/trivia-badges"
import { TriviaLeaderboard } from "@/components/trivia/trivia-leaderboard"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper"
import { Trophy, Award } from "lucide-react"

export default function SFDistrictsTriviaPage() {
  const [activeTab, setActiveTab] = useState("play")
  const gameId = "sf-districts"
  const gameName = "SF District Trivia"
  const gameDescription = "Test your knowledge of San Francisco's unique and diverse neighborhoods and districts."

  const badgeTypes = {
    participant: "sf-districts-participant",
    enthusiast: "sf-districts-enthusiast",
    master: "sf-districts-master",
  }

  // Create a dummy function for showOptInForm since we're using the auth modal context instead
  const showOptInForm = () => {}

  return (
    <>
      <ImprovedHeader showOptInForm={showOptInForm} />
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
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 ${activeTab !== "play" ? "hidden lg:block" : ""}`}>
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
          </div>

          <div className={`${activeTab !== "leaderboard" ? "hidden lg:block" : ""}`}>
            <ErrorBoundaryWrapper>
              <TriviaLeaderboard gameId={gameId} gameName={gameName} />
            </ErrorBoundaryWrapper>
          </div>

          <div className={`${activeTab !== "badges" ? "hidden lg:block" : ""}`}>
            <ErrorBoundaryWrapper>
              <TriviaBadges gameId={gameId} gameName={gameName} badgeTypes={badgeTypes} />
            </ErrorBoundaryWrapper>
          </div>
        </div>
      </main>
      <ImprovedFooter />
    </>
  )
}

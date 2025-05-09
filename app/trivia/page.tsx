"use client"

import { useState } from "react"
import { TriviaGame } from "@/components/trivia-game"
import { TriviaLeaderboardRobust } from "@/components/trivia-leaderboard-robust"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper"
import { Trophy, HelpCircle, Award } from "lucide-react"

export default function TriviaPage() {
  const [activeTab, setActiveTab] = useState("play")

  return (
    <>
      <ImprovedHeader showOptInForm={() => {}} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0A3C1F] mb-2">San Francisco Trivia Game</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Test your knowledge about San Francisco, earn points, and unlock special badges!
          </p>
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
            <TabsTrigger value="rules" className="flex items-center">
              <HelpCircle className="h-4 w-4 mr-2" />
              How to Play
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 ${activeTab !== "play" ? "hidden lg:block" : ""}`}>
            <ErrorBoundaryWrapper>
              <TriviaGame />
            </ErrorBoundaryWrapper>
          </div>

          <div className={`${activeTab !== "leaderboard" ? "hidden lg:block" : ""}`}>
            <ErrorBoundaryWrapper>
              <TriviaLeaderboardRobust />
            </ErrorBoundaryWrapper>

            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Award className="h-5 w-5 mr-2 text-[#FFD700]" />
                  Trivia Badges
                </CardTitle>
                <CardDescription>Earn special badges by playing trivia</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center flex-shrink-0">
                      <Trophy className="h-5 w-5 text-[#0A3C1F]" />
                    </div>
                    <div>
                      <h4 className="font-medium">Trivia Participant</h4>
                      <p className="text-sm text-gray-500">Complete your first trivia game</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center flex-shrink-0">
                      <Trophy className="h-5 w-5 text-[#0A3C1F]" />
                    </div>
                    <div>
                      <h4 className="font-medium">Trivia Enthusiast</h4>
                      <p className="text-sm text-gray-500">Complete 5 trivia games</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center flex-shrink-0">
                      <Trophy className="h-5 w-5 text-[#0A3C1F]" />
                    </div>
                    <div>
                      <h4 className="font-medium">Trivia Master</h4>
                      <p className="text-sm text-gray-500">Get a perfect score on 3 trivia games</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className={`lg:col-span-3 ${activeTab !== "rules" ? "hidden lg:hidden" : ""}`}>
            <Card>
              <CardHeader>
                <CardTitle>How to Play</CardTitle>
                <CardDescription>Learn how to play the San Francisco Trivia Game</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Game Rules</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Each game consists of 5 questions about San Francisco.</li>
                      <li>You have 30 seconds to answer each question.</li>
                      <li>Select the correct answer from the multiple-choice options.</li>
                      <li>
                        After submitting your answer, you'll see if you were correct and learn more about the topic.
                      </li>
                      <li>Your final score will be displayed at the end of the game.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Earning Points</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Each correct answer earns you points.</li>
                      <li>Harder questions are worth more points.</li>
                      <li>Answering quickly gives you bonus points.</li>
                      <li>Completing a full game gives you completion points.</li>
                      <li>Points contribute to your position on the leaderboard.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Earning Badges</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Trivia Participant:</strong> Awarded for completing your first trivia game.
                      </li>
                      <li>
                        <strong>Trivia Enthusiast:</strong> Awarded for completing 5 trivia games.
                      </li>
                      <li>
                        <strong>Trivia Master:</strong> Awarded for achieving 3 perfect scores.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tips for Success</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Read each question carefully before selecting an answer.</li>
                      <li>Pay attention to the explanations to learn more about San Francisco.</li>
                      <li>Try to answer quickly for bonus points, but accuracy is more important.</li>
                      <li>Play regularly to improve your knowledge and earn more badges.</li>
                      <li>Share your achievements to earn additional points and badges.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <ImprovedFooter />
    </>
  )
}

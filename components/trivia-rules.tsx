import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Clock, Award, Trophy, Brain, Zap, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TriviaRules() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Info className="h-5 w-5 mr-2 text-blue-500" />
          How to Play
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4 text-sm">
          {/* Game Modes */}
          <div className="flex items-start">
            <Brain className="h-4 w-4 mr-2 mt-0.5 text-[#0A3C1F]" />
            <div>
              <p className="font-medium">Game Modes</p>
              <div className="space-y-2 mt-2">
                <div>
                  <Badge variant="outline" className="mb-1">
                    Normal Mode
                  </Badge>
                  <p className="text-gray-600">
                    Standard gameplay with 30 seconds per question.
                  </p>
                </div>
                <div>
                  <Badge variant="destructive" className="mb-1">
                    Challenge Mode
                  </Badge>
                  <p className="text-gray-600">
                    15 seconds per question with 2x points multiplier!
                  </p>
                </div>
                <div>
                  <Badge variant="default" className="mb-1">
                    Study Mode
                  </Badge>
                  <p className="text-gray-600">
                    No time pressure, detailed explanations, and review cards
                    for incorrect answers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Time Limit */}
          <div className="flex items-start">
            <Clock className="h-4 w-4 mr-2 mt-0.5 text-[#0A3C1F]" />
            <div>
              <p className="font-medium">Time Limit</p>
              <p className="text-gray-600">
                Normal Mode: 30 seconds per question
                <br />
                Challenge Mode: 15 seconds per question
                <br />
                Study Mode: No time limit
              </p>
            </div>
          </div>

          {/* Scoring System */}
          <div className="flex items-start">
            <Star className="h-4 w-4 mr-2 mt-0.5 text-[#0A3C1F]" />
            <div>
              <p className="font-medium">Scoring System</p>
              <p className="text-gray-600">
                Base points are multiplied by various bonuses:
              </p>
              <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
                <li>Difficulty: Easy (1x), Medium (1.5x), Hard (2x)</li>
                <li>Streak: 3+ correct (1.5x), 5+ correct (2x)</li>
                <li>Time Bonus: Up to 1x extra based on speed</li>
                <li>Challenge Mode: 2x all points</li>
              </ul>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-start">
            <Trophy className="h-4 w-4 mr-2 mt-0.5 text-[#0A3C1F]" />
            <div>
              <p className="font-medium">Earning Badges</p>
              <p className="text-gray-600">
                Complete achievements to earn special badges:
              </p>
              <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
                <li>Trivia Participant: Complete your first trivia round</li>
                <li>Trivia Enthusiast: Complete 5 trivia rounds</li>
                <li>Trivia Master: Achieve 3 perfect scores</li>
                <li>
                  Speed Demon: Answer 10 questions in under 5 seconds each
                </li>
                <li>
                  Challenge Champion: Complete a perfect round in Challenge Mode
                </li>
              </ul>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="flex items-start">
            <Award className="h-4 w-4 mr-2 mt-0.5 text-[#0A3C1F]" />
            <div>
              <p className="font-medium">Bonus Points</p>
              <p className="text-gray-600">
                Share your achievements to earn extra points:
              </p>
              <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
                <li>+15 points for sharing mid-game</li>
                <li>+25 points for sharing a perfect score</li>
                <li>+20 points for sharing a new badge</li>
              </ul>
            </div>
          </div>

          <div className="bg-[#0A3C1F]/10 p-3 rounded-lg mt-4">
            <p className="font-medium text-[#0A3C1F] flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Pro Tips
            </p>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>• Use Study Mode to learn and practice without pressure</li>
              <li>• Build streaks in Normal Mode to maximize points</li>
              <li>
                • Try Challenge Mode once you&apos;re confident for double
                points!
              </li>
              <li>
                • Share your achievements to help spread the word about SFSO
                recruitment
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

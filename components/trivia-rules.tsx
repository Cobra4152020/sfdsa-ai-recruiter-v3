import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, Clock, Award, Trophy } from "lucide-react"

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
          <div className="flex items-start">
            <Clock className="h-4 w-4 mr-2 mt-0.5 text-[#0A3C1F]" />
            <div>
              <p className="font-medium">Time Limit</p>
              <p className="text-gray-600">You have 30 seconds to answer each question.</p>
            </div>
          </div>

          <div className="flex items-start">
            <Award className="h-4 w-4 mr-2 mt-0.5 text-[#0A3C1F]" />
            <div>
              <p className="font-medium">Earning Points</p>
              <p className="text-gray-600">
                Earn 10 base points for participating, plus bonus points for good performance:
              </p>
              <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
                <li>+5 points for scoring over 50%</li>
                <li>+10 points for scoring over 80%</li>
                <li>+15 points for a perfect score</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start">
            <Trophy className="h-4 w-4 mr-2 mt-0.5 text-[#0A3C1F]" />
            <div>
              <p className="font-medium">Earning Badges</p>
              <p className="text-gray-600">Complete achievements to earn special badges:</p>
              <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
                <li>Trivia Participant: Complete your first trivia round</li>
                <li>Trivia Enthusiast: Complete 5 trivia rounds</li>
                <li>Trivia Master: Achieve 3 perfect scores</li>
              </ul>
            </div>
          </div>

          <div className="bg-[#0A3C1F]/10 p-3 rounded-lg mt-4">
            <p className="font-medium text-[#0A3C1F]">Pro Tip</p>
            <p className="text-sm text-gray-600">
              Share your badges and scores on social media to help spread the word about the San Francisco Sheriff's
              Office recruitment program!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

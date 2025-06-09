"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Clock, Star, Trophy, Award } from "lucide-react";

export function TriviaRules() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-foreground">How to Play Trivia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Brain className="h-4 w-4 mr-2 mt-0.5 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Question Types</h3>
              <p className="text-sm text-muted-foreground">
                Answer questions about law enforcement, San Francisco history, 
                and deputy sheriff responsibilities. Each question has multiple 
                choice answers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 mr-2 mt-0.5 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Time Limits</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• <strong>Easy questions:</strong> 15 seconds</p>
                <p>• <strong>Medium questions:</strong> 20 seconds</p>
                <p>• <strong>Hard questions:</strong> 30 seconds</p>
                <p className="mt-2">Answer quickly for bonus points!</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Star className="h-4 w-4 mr-2 mt-0.5 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Scoring System</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• <strong>Easy questions:</strong> 10 points</p>
                <p>• <strong>Medium questions:</strong> 20 points</p>
                <p>• <strong>Hard questions:</strong> 30 points</p>
                <p>• <strong>Speed bonus:</strong> Up to 10 extra points</p>
                <p>• <strong>Streak bonus:</strong> 5 points per consecutive correct answer</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Trophy className="h-4 w-4 mr-2 mt-0.5 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Competition</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Compete with other recruits on the leaderboard</p>
                <p>• Top performers earn special recognition</p>
                <p>• Leaderboard resets weekly for fair competition</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Award className="h-4 w-4 mr-2 mt-0.5 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Rewards</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Earn points that count toward your total score</p>
                <p>• Unlock achievement badges for milestones</p>
                <p>• Points help you access exclusive content</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/40">
          <p className="font-medium text-foreground flex items-center">
            <Star className="h-4 w-4 mr-2 text-primary" />
            Pro Tip
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Study the Deputy Sheriff handbook and practice regularly to improve 
            your scores. The questions are based on real scenarios you&apos;ll 
            encounter as a deputy!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

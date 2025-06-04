"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BadgeChallenge, UserChallengeProgress } from "@/types/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Flame, Share2 } from "lucide-react";

interface BadgeChallengesProps {
  activeChallenges: BadgeChallenge[];
  userProgress: UserChallengeProgress[];
  streakCount: number;
  onShare?: (challenge: BadgeChallenge) => void;
}

export function BadgeChallenges({
  activeChallenges,
  userProgress,
  streakCount,
  onShare,
}: BadgeChallengesProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Calculate time left until daily reset
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Streak Counter */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="h-8 w-8" />
              <div>
                <h3 className="text-xl font-bold">Daily Streak</h3>
                <p className="text-sm opacity-90">Keep it going!</p>
              </div>
            </div>
            <div className="text-3xl font-bold">{streakCount} days</div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Reset Timer */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-blue-500" />
              <div>
                <h3 className="font-medium">Daily Reset In</h3>
                <p className="text-sm text-gray-500">
                  New challenges coming soon
                </p>
              </div>
            </div>
            <div className="text-xl font-semibold text-blue-500">
              {timeLeft}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Challenges */}
      <div className="grid gap-4">
        {activeChallenges.map((challenge) => {
          const progress = userProgress.find(
            (p) => p.challengeId === challenge.id,
          );
          const progressValue = progress
            ? calculateProgress(progress.progress)
            : 0;

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{challenge.name}</CardTitle>
                    {progressValue === 100 && (
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    {challenge.description}
                  </p>
                  <div className="space-y-4">
                    <Progress value={progressValue} />
                    <div className="flex items-center justify-between text-sm">
                      <span>{progressValue}% Complete</span>
                      <span className="text-blue-500">
                        {challenge.xpReward} XP
                      </span>
                    </div>
                    {progressValue === 100 && onShare && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => onShare(challenge)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Achievement
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function calculateProgress(progress: Record<string, number>): number {
  const total = Object.keys(progress).length;
  const completed = Object.values(progress).filter(Boolean).length;
  return Math.round((completed / total) * 100);
}

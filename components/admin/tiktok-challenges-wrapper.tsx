"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, Users, Video } from "lucide-react";

interface TikTokChallenge {
  id: string;
  title: string;
  participants: number;
  views: number;
  status: "active" | "completed";
  hashtag: string;
  endDate: string;
}

interface TikTokChallengesWrapperProps {
  challenges: TikTokChallenge[];
}

export function TikTokChallengesWrapper({
  challenges,
}: TikTokChallengesWrapperProps) {
  const activeChallenges = challenges.filter(
    (challenge) => challenge.status === "active",
  );
  const completedChallenges = challenges.filter(
    (challenge) => challenge.status === "completed",
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Active Challenges */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-primary">
              Active Challenges
            </CardTitle>
            <Badge variant="outline" className="bg-green-50 text-primary">
              {activeChallenges.length} Active
            </Badge>
          </div>
          <CardDescription>
            Currently running TikTok recruitment challenges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {activeChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-primary" />
                      <p className="font-medium">{challenge.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      #{challenge.hashtag}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ends: {challenge.endDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm">{challenge.participants}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm">{challenge.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Completed Challenges */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-primary">
              Completed Challenges
            </CardTitle>
            <Badge variant="outline" className="bg-muted">
              {completedChallenges.length} Completed
            </Badge>
          </div>
          <CardDescription>Past TikTok recruitment challenges</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {completedChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-gray-500" />
                      <p className="font-medium">{challenge.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      #{challenge.hashtag}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ended: {challenge.endDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{challenge.participants}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{challenge.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

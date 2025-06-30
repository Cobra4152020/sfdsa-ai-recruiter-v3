"use client";

import { Card, CardContent } from "@/components/ui/card";
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

interface TikTokChallengesAdminProps {
  challenges?: TikTokChallenge[];
}

const defaultChallenges: TikTokChallenge[] = [
  {
    id: "1",
    title: "Day in the Life",
    participants: 156,
    views: 12500,
    status: "active" as const,
    hashtag: "SFDeputyLife",
    endDate: "2024-04-01",
  },
  {
    id: "2",
    title: "Training Academy",
    participants: 89,
    views: 8200,
    status: "active" as const,
    hashtag: "SFDeputyTraining",
    endDate: "2024-04-15",
  },
  {
    id: "3",
    title: "Community Service",
    participants: 245,
    views: 18900,
    status: "completed" as const,
    hashtag: "SFDeputyCommunity",
    endDate: "2024-03-15",
  },
];

export function TikTokChallengesAdmin({
  challenges = defaultChallenges,
}: TikTokChallengesAdminProps) {
  const activeChallenges = challenges.filter(
    (challenge) => challenge.status === "active",
  );
  const completedChallenges = challenges.filter(
    (challenge) => challenge.status === "completed",
  );

  return (
    <div className="space-y-4">
      {/* Active Challenges */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-primary">Active Challenges</h3>
          <Badge variant="outline" className="bg-green-50 text-primary">
            {activeChallenges.length} Active
          </Badge>
        </div>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {activeChallenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-primary" />
                        <span className="font-medium">{challenge.title}</span>
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
                        <span className="text-sm">
                          {challenge.participants}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm">{challenge.views}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Completed Challenges */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-600">Completed Challenges</h3>
          <Badge variant="outline" className="bg-muted">
            {completedChallenges.length} Completed
          </Badge>
        </div>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {completedChallenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{challenge.title}</span>
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
                        <span className="text-sm">
                          {challenge.participants}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{challenge.views}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

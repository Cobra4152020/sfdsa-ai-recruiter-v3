"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TimelineEvent, BadgeWithProgress } from "@/types/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Trophy, Share2, Flag, Target, Award } from "lucide-react";

interface BadgeTimelineProps {
  userId?: string;
  limit?: number;
  events?: TimelineEvent[];
  badges?: BadgeWithProgress[];
}

export function BadgeTimeline({
  userId,
  limit = 10,
  events = [],
  badges = [],
}: BadgeTimelineProps) {
  const sortedEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }, [events, limit]);

  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "start":
        return <Flag className="h-5 w-5 text-blue-500" />;
      case "progress":
        return <Target className="h-5 w-5 text-green-500" />;
      case "milestone":
        return <Star className="h-5 w-5 text-yellow-500" />;
      case "completion":
        return <Trophy className="h-5 w-5 text-purple-500" />;
      case "unlock":
        return <Award className="h-5 w-5 text-indigo-500" />;
      case "share":
        return <Share2 className="h-5 w-5 text-pink-500" />;
      default:
        return null;
    }
  };

  const formatDate = (date: string) => {
    const eventDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - eventDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return eventDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const getBadgeName = (badgeId: string) => {
    const badge = badges.find((b) => b.id === badgeId);
    return badge?.name || "Unknown Badge";
  };

  if (!userId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Achievement Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            Sign in to view your achievement timeline
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sortedEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Achievement Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            No achievements yet. Start earning badges to see your progress!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievement Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-8">
            {sortedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8"
              >
                {/* Timeline line */}
                {index !== sortedEvents.length - 1 && (
                  <div className="absolute left-[14px] top-8 w-px h-full bg-gray-200" />
                )}

                {/* Event dot and icon */}
                <div className="absolute left-0 p-1 bg-white rounded-full">
                  {getEventIcon(event.type)}
                </div>

                {/* Event content */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {getBadgeName(event.badgeId)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{event.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

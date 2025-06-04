"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedItem = {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string;
  content: string;
  badgeEarned?: {
    name: string;
    type: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
};

// Sample data with avatar URLs
const sampleFeedData: FeedItem[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Michael Chen",
    userAvatarUrl: "/asian-male-officer-headshot.png",
    content:
      "Just completed my physical fitness test for the SFDSA recruitment process! One step closer to joining the team. 💪",
    badgeEarned: {
      name: "Fitness Champion",
      type: "fitness",
    },
    timestamp: "2 hours ago",
    likes: 24,
    comments: 5,
    shares: 2,
  },
  {
    id: "2",
    userId: "user2",
    userName: "Sarah Johnson",
    userAvatarUrl: "/female-law-enforcement-headshot.png",
    content:
      "Excited to share that I've passed the written exam for the Sheriff's Department! The study guides were incredibly helpful.",
    badgeEarned: {
      name: "Academic Excellence",
      type: "academic",
    },
    timestamp: "5 hours ago",
    likes: 32,
    comments: 8,
    shares: 3,
  },
  {
    id: "3",
    userId: "user3",
    userName: "David Rodriguez",
    userAvatarUrl: "/male-law-enforcement-headshot.png",
    content:
      "Just referred my friend to the SFDSA recruitment program. Looking forward to potentially working together!",
    timestamp: "1 day ago",
    likes: 18,
    comments: 2,
    shares: 1,
  },
  {
    id: "4",
    userId: "user4",
    userName: "Jessica Williams",
    userAvatarUrl: "/female-law-enforcement-headshot.png",
    content:
      "Attended the SFDSA information session today. Impressed by the career opportunities and benefits. Looking forward to applying!",
    timestamp: "2 days ago",
    likes: 27,
    comments: 6,
    shares: 4,
  },
];

interface SocialFeedProps {
  className?: string;
  limit?: number;
}

export function SocialFeed({ className, limit = 4 }: SocialFeedProps) {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    setFeedItems(sampleFeedData.slice(0, limit));
    setLoading(false);
  }, [limit]);

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>Community Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p>Loading feed...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Community Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {feedItems.map((item) => (
            <div
              key={item.id}
              className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-10 w-10 border border-gray-200">
                  <AvatarImage
                    src={item.userAvatarUrl || "/placeholder.svg"}
                    alt={item.userName}
                  />
                  <AvatarFallback>
                    {item.userName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{item.userName}</p>
                  <p className="text-xs text-gray-500">{item.timestamp}</p>
                </div>
              </div>

              <p className="text-sm mb-3">{item.content}</p>

              {item.badgeEarned && (
                <div className="bg-[#F0F7F2] p-3 rounded-lg mb-3">
                  <p className="text-sm font-medium text-[#0A3C1F]">
                    🏆 Earned the {item.badgeEarned.name} badge!
                  </p>
                </div>
              )}

              <div className="flex gap-4 mt-3">
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0A3C1F]">
                  <Heart className="h-4 w-4" />
                  <span>{item.likes}</span>
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0A3C1F]">
                  <MessageCircle className="h-4 w-4" />
                  <span>{item.comments}</span>
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0A3C1F]">
                  <Share2 className="h-4 w-4" />
                  <span>{item.shares}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

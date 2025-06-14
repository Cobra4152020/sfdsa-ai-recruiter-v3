"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/user-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Award, Star, Target } from "lucide-react";

interface StatCard {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function BadgeStats(): JSX.Element {
  const { currentUser } = useUser();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!currentUser?.id) {
          // Show default stats for non-logged in users
          setStats([
            {
              title: "Total Badges",
              value: 25,
              description: "Available to earn",
              icon: <Award className="h-5 w-5" />,
              color: "text-blue-600"
            },
            {
              title: "Badge Categories",
              value: 6,
              description: "Different types",
              icon: <Star className="h-5 w-5" />,
              color: "text-purple-600"
            },
            {
              title: "Active Users",
              value: "150+",
              description: "Earning badges",
              icon: <Target className="h-5 w-5" />,
              color: "text-green-600"
            },
            {
              title: "Top Achiever",
              value: "12",
              description: "Badges earned",
              icon: <Trophy className="h-5 w-5" />,
              color: "text-yellow-600"
            }
          ]);
          setIsLoading(false);
          return;
        }

        // Try to fetch user's badge data
        const response = await fetch(`/api/users/${currentUser.id}/badges`);
        if (response.ok) {
          const badgeData = await response.json();
          const userBadges = badgeData.badges || [];
          
          setStats([
            {
              title: "Badges Earned",
              value: userBadges.length,
              description: "Your achievements",
              icon: <Trophy className="h-5 w-5" />,
              color: "text-yellow-600"
            },
            {
              title: "Total Points",
              value: userBadges.reduce((sum: number, badge: any) => sum + (badge.points || 0), 0),
              description: "From badges",
              icon: <Star className="h-5 w-5" />,
              color: "text-purple-600"
            },
            {
              title: "Completion Rate",
              value: `${Math.round((userBadges.length / 25) * 100)}%`,
              description: "Progress made",
              icon: <Target className="h-5 w-5" />,
              color: "text-green-600"
            },
            {
              title: "Latest Badge",
              value: userBadges.length > 0 ? "Recent" : "None",
              description: userBadges.length > 0 ? "Keep it up!" : "Start earning!",
              icon: <Award className="h-5 w-5" />,
              color: "text-blue-600"
            }
          ]);
        } else {
          // Fallback stats if API fails
          setStats([
            {
              title: "Your Progress",
              value: "Getting Started",
              description: "Begin your journey",
              icon: <Target className="h-5 w-5" />,
              color: "text-green-600"
            },
            {
              title: "Available Badges",
              value: 25,
              description: "Ready to earn",
              icon: <Award className="h-5 w-5" />,
              color: "text-blue-600"
            },
            {
              title: "Categories",
              value: 6,
              description: "Different types",
              icon: <Star className="h-5 w-5" />,
              color: "text-purple-600"
            },
            {
              title: "Community",
              value: "Active",
              description: "Join the challenge",
              icon: <Trophy className="h-5 w-5" />,
              color: "text-yellow-600"
            }
          ]);
        }
      } catch (err) {
        console.error("Error loading badge stats:", err);
        setError("Failed to load statistics");
        // Show fallback stats even on error
        setStats([
          {
            title: "Badge System",
            value: "Available",
            description: "Ready to use",
            icon: <Award className="h-5 w-5" />,
            color: "text-blue-600"
          },
          {
            title: "Categories",
            value: 6,
            description: "Different types",
            icon: <Star className="h-5 w-5" />,
            color: "text-purple-600"
          },
          {
            title: "Community",
            value: "Growing",
            description: "Join us today",
            icon: <Target className="h-5 w-5" />,
            color: "text-green-600"
          },
          {
            title: "Achievements",
            value: "Waiting",
            description: "For you to earn",
            icon: <Trophy className="h-5 w-5" />,
            color: "text-yellow-600"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [currentUser?.id]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.title}</h3>
              <p className="text-xs text-gray-400">{stat.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

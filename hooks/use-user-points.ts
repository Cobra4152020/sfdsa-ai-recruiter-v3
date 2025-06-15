"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface PointTier {
  name: string;
  points: number;
  rewards: string[];
}

export function useUserPoints(userId?: string) {
  const [points, setPoints] = useState(0);
  const [nextTier, setNextTier] = useState<PointTier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const pointTiers: PointTier[] = [
    {
      name: "Bronze Recruit",
      points: 1000,
      rewards: ["Bronze Badge", "Leaderboard Recognition"],
    },
    {
      name: "Silver Recruit",
      points: 2500,
      rewards: ["Silver Badge", "Priority Application Review"],
    },
    {
      name: "Gold Recruit",
      points: 5000,
      rewards: ["Gold Badge", "Exclusive Resources"],
    },
    {
      name: "Platinum Recruit",
      points: 10000,
      rewards: ["Platinum Badge", "Direct Contact with Recruiters"],
    },
  ];

  const fetchUserPoints = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!userId) {
        setPoints(0);
        setNextTier(pointTiers[0]);
        return;
      }

      // Fetch real user points from the API
      const response = await fetch(`/api/user/points?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user points');
      }
      const data = await response.json();
      const realPoints = data.totalPoints || 0;
      setPoints(realPoints);

      // Determine next tier
      const currentTierIndex = pointTiers.findIndex(
        (tier) => tier.points > realPoints,
      );
      if (currentTierIndex !== -1) {
        setNextTier(pointTiers[currentTierIndex]);
      } else {
        setNextTier(null); // User has reached the highest tier
      }
    } catch (err) {
      console.error("Error fetching user points:", err);
      setError("Failed to load points data");
      toast({
        title: "Error",
        description: "Failed to load your points data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPoints();
  }, [userId]);

  return {
    points,
    nextTier,
    isLoading,
    error,
    refetch: fetchUserPoints,
  };
}

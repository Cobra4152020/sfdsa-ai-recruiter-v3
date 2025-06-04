"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { getClientSideSupabase } from "@/lib/supabase";
import { Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@supabase/supabase-js";

interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  created_at: string;
  badges?: {
    id: string;
    name: string;
    description: string;
    image_url: string;
    points_required: number;
  } | null;
}

interface BadgeCollectionProps {
  user: User | null;
}

export default function BadgeCollection({ user }: BadgeCollectionProps) {
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBadges = useCallback(async () => {
    if (!user) {
      setLoading(false); // Ensure loading stops if there's no user
      return;
    }
    setLoading(true);
    const supabase = getClientSideSupabase();
    const { data, error } = await supabase
      .from("user_badges")
      .select("*, badges(*)")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching user badges:", error);
      setUserBadges([]); // Set to empty array on error
    } else {
      setUserBadges(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchUserBadges();
  }, [fetchUserBadges]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <Skeleton className="h-20 w-20 rounded-md" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userBadges || userBadges.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <Award className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">
              No badges earned yet
            </h3>
            <p className="text-sm text-gray-500">
              Complete activities to earn your first badge!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Badges ({userBadges.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {userBadges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center text-center p-2 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="relative w-20 h-20 mb-2">
                <Image
                  src={badge.badges?.image_url || "/default-badge.png"}
                  alt={badge.badges?.name || "Badge image"}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-md"
                />
              </div>
              <h3 className="text-sm font-medium">
                {badge.badges?.name || "Unknown Badge"}
              </h3>
              <p className="text-xs text-gray-500">
                {badge.badges?.description || "No description"}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { getClientSideSupabase } from "@/lib/supabase";
import { Award, Star, Trophy, Target, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AchievementBadge } from "@/components/achievement-badge";
import type { User } from "@supabase/supabase-js";
import type { BadgeType } from "@/types/badge";

interface UserBadge {
  id: string;
  user_id: string;
  badge_type: string;
  badge_name: string;
  badge_description: string;
  points_awarded: number;
  source: string;
  created_at: string;
}

interface BadgeCollectionProps {
  user: User | null;
}

interface AvailableBadge {
  id: string;
  badge_type: BadgeType;
  name: string;
  description: string;
  points?: number;
  difficulty?: string;
  category?: string;
}

export default function BadgeCollection({ user }: BadgeCollectionProps) {
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [availableBadges, setAvailableBadges] = useState<AvailableBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("earned");
  const [stats, setStats] = useState({
    total_badges: 0,
    total_points: 0,
    recent_badges: 0,
    badges_by_source: {} as Record<string, number>,
  });

  const fetchUserBadges = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const supabase = getClientSideSupabase();
    
    try {
      // Fetch user's earned badges
      const { data: userBadgeData, error: userError } = await supabase
        .from("user_badges")
        .select("*")
        .eq("user_id", user.id)
        .order('created_at', { ascending: false });

      if (userError) {
        console.error("Error fetching user badges:", userError);
      } else {
        setUserBadges(userBadgeData || []);
        
        // Calculate statistics
        const totalBadges = userBadgeData?.length || 0;
        const totalPoints = userBadgeData?.reduce((sum, badge) => sum + (badge.points_awarded || 0), 0) || 0;
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentBadges = userBadgeData?.filter(badge => 
          new Date(badge.created_at) > sevenDaysAgo
        ).length || 0;

        const badgesBySource = userBadgeData?.reduce((acc, badge) => {
          const source = badge.source || 'manual';
          acc[source] = (acc[source] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        setStats({
          total_badges: totalBadges,
          total_points: totalPoints,
          recent_badges: recentBadges,
          badges_by_source: badgesBySource,
        });
      }

      // Fetch all available badges
      const response = await fetch('/api/badges');
      const badgeData = await response.json();
      
      if (badgeData.success) {
        setAvailableBadges(badgeData.badges || []);
      }

    } catch (error) {
      console.error("Error in fetchUserBadges:", error);
    } finally {
      setLoading(false);
    }
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

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign In Required</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <Award className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">
              Sign in to view your badges
            </h3>
            <p className="text-sm text-gray-500">
              Track your achievements and earn badges by completing activities!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const earnedBadgeTypes = new Set(userBadges.map(b => b.badge_type));
  const unEarnedBadges = availableBadges.filter(b => !earnedBadgeTypes.has(b.badge_type));

  return (
    <div className="space-y-6">
      {/* Statistics Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{stats.total_badges}</div>
            <div className="text-sm text-gray-600">Total Badges</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{stats.total_points}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.recent_badges}</div>
            <div className="text-sm text-gray-600">This Week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{unEarnedBadges.length}</div>
            <div className="text-sm text-gray-600">To Earn</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="earned" className="flex items-center">
            <Trophy className="h-4 w-4 mr-2" />
            Earned ({userBadges.length})
          </TabsTrigger>
          <TabsTrigger value="available" className="flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Available ({unEarnedBadges.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="earned">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                My Earned Badges ({userBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userBadges.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Award className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">
                    No badges earned yet
                  </h3>
                  <p className="text-sm text-gray-500">
                    Complete activities to earn your first badge!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {userBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex flex-col items-center text-center p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-yellow-50 to-amber-50"
                    >
                      <div className="relative mb-3">
                        <AchievementBadge
                          type={badge.badge_type as BadgeType}
                          size="lg"
                          earned={true}
                        />
                        {badge.points_awarded > 0 && (
                          <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1">
                            +{badge.points_awarded}
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1">
                        {badge.badge_name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {badge.badge_description}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Zap className="h-3 w-3 text-yellow-500" />
                        <span>{new Date(badge.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-blue-500" />
                Available Badges ({unEarnedBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {unEarnedBadges.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Trophy className="h-12 w-12 text-yellow-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">
                    Amazing! You've earned all available badges!
                  </h3>
                  <p className="text-sm text-gray-500">
                    Check back later for new badges to earn.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {unEarnedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex flex-col items-center text-center p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-gray-50 to-gray-100"
                    >
                      <div className="relative mb-3 opacity-60">
                        <AchievementBadge
                          type={badge.badge_type}
                          size="lg"
                          earned={false}
                        />
                        {badge.points && (
                          <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1">
                            {badge.points}pt
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-gray-700 mb-1">
                        {badge.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {badge.description}
                      </p>
                      {badge.difficulty && (
                        <Badge variant="outline" className="text-xs">
                          {badge.difficulty}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

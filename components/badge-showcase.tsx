"use client";

import { useState, useEffect } from "react";
import type { BadgeType } from "@/types/badge";
import { AchievementBadge } from "./achievement-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Use the badge types from your AchievementBadge component
interface Badge {
  id: string;
  badge_type: BadgeType;
  name: string;
  description: string;
  created_at: string;
}

export function BadgeShowcase() {
  const [category, setCategory] = useState<string>("all");
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBadges = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to fetch from API first
      const response = await fetch("/api/badges");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch badges: ${response.status}`);
      }
      
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch badges");
      }

      setBadges(data.badges || []);
    } catch (err) {
      console.error("Error fetching badges:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");

      // Fallback to static data if API fails
      const staticBadges: Badge[] = [
        {
          id: "written",
          badge_type: "written" as BadgeType,
          name: "Written Test",
          description: "Completed written test preparation",
          created_at: new Date().toISOString(),
        },
        {
          id: "oral",
          badge_type: "oral" as BadgeType,
          name: "Oral Board",
          description: "Prepared for oral board interviews",
          created_at: new Date().toISOString(),
        },
        {
          id: "physical",
          badge_type: "physical" as BadgeType,
          name: "Physical Test",
          description: "Completed physical test preparation",
          created_at: new Date().toISOString(),
        },
        {
          id: "polygraph",
          badge_type: "polygraph" as BadgeType,
          name: "Polygraph",
          description: "Learned about the polygraph process",
          created_at: new Date().toISOString(),
        },
        {
          id: "psychological",
          badge_type: "psychological" as BadgeType,
          name: "Psychological",
          description: "Prepared for psychological evaluation",
          created_at: new Date().toISOString(),
        },
        {
          id: "full",
          badge_type: "full" as BadgeType,
          name: "Full Process",
          description: "Completed all preparation areas",
          created_at: new Date().toISOString(),
        },
        {
          id: "chat-participation",
          badge_type: "chat-participation" as BadgeType,
          name: "Chat Participation",
          description: "Engaged with Sgt. Ken",
          created_at: new Date().toISOString(),
        },
        {
          id: "first-response",
          badge_type: "first-response" as BadgeType,
          name: "First Response",
          description: "Received first response from Sgt. Ken",
          created_at: new Date().toISOString(),
        },
        {
          id: "application-started",
          badge_type: "application-started" as BadgeType,
          name: "Application Started",
          description: "Started the application process",
          created_at: new Date().toISOString(),
        },
        {
          id: "application-completed",
          badge_type: "application-completed" as BadgeType,
          name: "Application Completed",
          description: "Completed the application process",
          created_at: new Date().toISOString(),
        },
        {
          id: "frequent-user",
          badge_type: "frequent-user" as BadgeType,
          name: "Frequent User",
          description: "Regularly engages with the recruitment platform",
          created_at: new Date().toISOString(),
        },
        {
          id: "resource-downloader",
          badge_type: "resource-downloader" as BadgeType,
          name: "Resource Downloader",
          description: "Downloaded recruitment resources and materials",
          created_at: new Date().toISOString(),
        },
      ];

      setBadges(staticBadges);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const applicationBadgeTypes: string[] = [
    "written",
    "oral",
    "physical",
    "polygraph",
    "psychological",
    "full",
    "application-started",
    "application-completed",
  ];

  const filteredBadges = badges.filter((badge) => {
    if (category === "all") return true;
    if (category === "application")
      return applicationBadgeTypes.includes(badge.badge_type);
    return !applicationBadgeTypes.includes(badge.badge_type);
  });

  if (error && badges.length === 0) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="mr-2 h-5 w-5" />
            Error Loading Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            onClick={fetchBadges} 
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-100"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-primary/20 dark:border-accent/20 shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground dark:from-primary dark:to-primary/90 dark:text-accent">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center text-white">
            <span className="mr-2">🏅</span> Badge Legend
          </CardTitle>
          <Tabs
            defaultValue="all"
            value={category}
            onValueChange={(value: string) => setCategory(value)}
          >
            <TabsList className="bg-white/10 border-white/20">
              <TabsTrigger value="all" className="text-white data-[state=active]:bg-white data-[state=active]:text-primary">
                All Badges
              </TabsTrigger>
              <TabsTrigger value="application" className="text-white data-[state=active]:bg-white data-[state=active]:text-primary">
                Application
              </TabsTrigger>
              <TabsTrigger value="participation" className="text-white data-[state=active]:bg-white data-[state=active]:text-primary">
                Participation
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {error && (
          <div className="mt-2 text-amber-200 text-sm">
            ⚠️ Using cached data due to API issues
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="space-y-6">
            {["application", "participation"].map((sectionCategory) => (
              <div key={sectionCategory} className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-96" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center space-y-2">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {(category === "all" || category === "application") && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 text-primary dark:text-accent">
                  🎯 Achievement Badges
                </h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Earn these badges by completing specific milestones in your
                  recruitment journey. Each badge represents a crucial step toward becoming
                  a San Francisco Deputy Sheriff.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-4">
                  {filteredBadges
                    .filter((badge) =>
                      [
                        "written",
                        "oral",
                        "physical",
                        "polygraph",
                        "psychological",
                      ].includes(badge.badge_type),
                    )
                    .map((badge) => (
                      <TooltipProvider key={badge.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer">
                              <div className="relative">
                                <AchievementBadge
                                  type={badge.badge_type}
                                  size="lg"
                                  earned={false}
                                />
                              </div>
                              <h4 className="font-medium mt-3 text-sm text-gray-900 dark:text-gray-100">
                                {badge.name}
                              </h4>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="font-medium">{badge.name}</p>
                            <p className="text-sm mt-1">{badge.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                </div>
              </div>
            )}

            {(category === "all" || category === "application") && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 text-primary dark:text-accent">
                  📋 Process Badges
                </h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Track your progress through the application process with these
                  badges. Stay motivated as you advance through each phase.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-4">
                  {filteredBadges
                    .filter((badge) =>
                      [
                        "chat-participation",
                        "first-response",
                        "application-started",
                        "application-completed",
                        "full",
                      ].includes(badge.badge_type),
                    )
                    .map((badge) => (
                      <TooltipProvider key={badge.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer">
                              <div className="relative">
                                <AchievementBadge
                                  type={badge.badge_type}
                                  size="lg"
                                  earned={false}
                                />
                              </div>
                              <h4 className="font-medium mt-3 text-sm text-gray-900 dark:text-gray-100">
                                {badge.name}
                              </h4>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="font-medium">{badge.name}</p>
                            <p className="text-sm mt-1">{badge.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                </div>
              </div>
            )}

            {(category === "all" || category === "participation") && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary dark:text-accent">
                  👥 Engagement Badges
                </h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  These badges recognize your engagement style and participation
                  patterns. Show your dedication to the recruitment community.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-4">
                  {filteredBadges
                    .filter((badge) =>
                      ["frequent-user", "resource-downloader"].includes(
                        badge.badge_type,
                      ),
                    )
                    .map((badge) => (
                      <TooltipProvider key={badge.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer">
                              <div className="relative">
                                <AchievementBadge
                                  type={badge.badge_type}
                                  size="lg"
                                  earned={false}
                                />
                              </div>
                              <h4 className="font-medium mt-3 text-sm text-gray-900 dark:text-gray-100">
                                {badge.name}
                              </h4>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="font-medium">{badge.name}</p>
                            <p className="text-sm mt-1">{badge.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                </div>
              </div>
            )}

            {filteredBadges.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏅</div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No badges found</h3>
                <p className="text-sm text-gray-500">
                  Try selecting a different category or check back later.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

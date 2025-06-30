"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AchievementBadge } from "@/components/achievement-badge";
import { Button } from "@/components/ui/button";
import { Info, Award, Trophy, Users, Target } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { BadgeType } from "@/types/badge";

export function BadgeDisplay() {
  const [activeTab, setActiveTab] = useState("all");

  const badges = [
    {
      type: "written" as BadgeType,
      name: "Written Exam",
      description: "Complete the written examination with excellence. This comprehensive test covers law enforcement knowledge, reading comprehension, and critical thinking skills.",
      category: "application",
      difficulty: "Medium",
      points: 100,
    },
    {
      type: "oral" as BadgeType,
      name: "Oral Interview",
      description: "Successfully complete the oral interview board. Demonstrate your communication skills, judgment, and motivation to serve.",
      category: "application", 
      difficulty: "Hard",
      points: 150,
    },
    {
      type: "physical" as BadgeType,
      name: "Physical Test",
      description: "Pass the physical agility test demonstrating your fitness and physical capabilities required for law enforcement.",
      category: "application",
      difficulty: "Medium",
      points: 125,
    },
    {
      type: "polygraph" as BadgeType,
      name: "Polygraph",
      description: "Complete the polygraph examination as part of the background investigation process.",
      category: "application",
      difficulty: "Easy",
      points: 75,
    },
    {
      type: "psychological" as BadgeType,
      name: "Psychological",
      description: "Successfully complete the psychological evaluation to assess suitability for law enforcement work.",
      category: "application",
      difficulty: "Medium",
      points: 100,
    },
    {
      type: "full" as BadgeType,
      name: "Full Process",
      description: "Complete the entire application process from start to finish. The ultimate achievement for dedicated candidates.",
      category: "achievement",
      difficulty: "Expert",
      points: 500,
    },
    {
      type: "chat-participation" as BadgeType,
      name: "Chat Participation",
      description: "Actively engage with our AI assistant Sgt. Ken. Learn about the recruitment process through interactive conversations.",
      category: "engagement",
      difficulty: "Easy",
      points: 25,
    },
    {
      type: "application-started" as BadgeType,
      name: "Application Started",
      description: "Take the first step in your law enforcement career by starting the official application process.",
      category: "application",
      difficulty: "Easy",
      points: 50,
    },
    {
      type: "first-response" as BadgeType,
      name: "First Response",
      description: "Receive your first personalized response from our recruitment platform. Welcome to the SFDSA family!",
      category: "engagement",
      difficulty: "Easy",
      points: 10,
    },
    {
      type: "frequent-user" as BadgeType,
      name: "Frequent User",
      description: "Demonstrate consistent engagement by regularly visiting and interacting with the recruitment platform.",
      category: "engagement",
      difficulty: "Medium",
      points: 75,
    },
    {
      type: "resource-downloader" as BadgeType,
      name: "Resource Explorer",
      description: "Download and explore recruitment resources, study materials, and preparation guides.",
      category: "engagement",
      difficulty: "Easy",
      points: 30,
    },
    {
      type: "hard-charger" as BadgeType,
      name: "Hard Charger",
      description: "Show exceptional dedication and enthusiasm throughout your recruitment journey.",
      category: "achievement",
      difficulty: "Hard",
      points: 200,
    },
  ];

  const categories = [
    { 
      id: "all", 
      name: "All Badges", 
      icon: Award,
      description: "View all available badges"
    },
    { 
      id: "application", 
      name: "Application", 
      icon: Target,
      description: "Badges earned through the application process"
    },
    { 
      id: "engagement", 
      name: "Engagement", 
      icon: Users,
      description: "Badges for platform participation"
    },
    { 
      id: "achievement", 
      name: "Achievement", 
      icon: Trophy,
      description: "Special recognition badges"
    },
  ];

  const filteredBadges = badges.filter((badge) => {
    if (activeTab === "all") return true;
    return badge.category === activeTab;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-600 bg-green-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Hard": return "text-orange-600 bg-orange-50";
      case "Expert": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-muted";
    }
  };

  const getPointsColor = (points: number) => {
    if (points >= 200) return "text-purple-600";
    if (points >= 100) return "text-blue-600";
    if (points >= 50) return "text-green-600";
    return "text-gray-600";
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Award className="mr-2 h-6 w-6" />
            Available Badges ({filteredBadges.length})
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Badges are earned by completing various activities and milestones in your recruitment journey. Each badge comes with points that contribute to your overall ranking.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <p className="text-white/90 text-sm mt-2">
          Discover all available badges and learn how to earn them. Each badge represents a milestone in your law enforcement career journey.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-8 h-auto p-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const categoryBadges = badges.filter(b => category.id === "all" ? true : b.category === category.id);
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex flex-col items-center p-3 h-auto">
                  <IconComponent className="h-4 w-4 mb-1" />
                  <span className="text-xs font-medium">{category.name}</span>
                  <span className="text-xs text-muted-foreground">({categoryBadges.length})</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredBadges.length === 0 ? (
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No badges found</h3>
                <p className="text-sm text-gray-500">
                  Try selecting a different category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBadges.map((badge) => (
                  <div
                    key={badge.type}
                    className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/30"
                  >
                    {/* Badge Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <AchievementBadge
                          type={badge.type}
                          size="xl"
                          earned={false}
                        />
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-primary/10 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
                      </div>
                    </div>

                    {/* Badge Info */}
                    <div className="text-center space-y-3">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {badge.name}
                      </h3>
                      
                      {/* Stats */}
                      <div className="flex justify-center items-center space-x-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(badge.difficulty)}`}>
                          {badge.difficulty}
                        </span>
                        <span className={`font-semibold ${getPointsColor(badge.points)}`}>
                          {badge.points} pts
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed">
                        {badge.description}
                      </p>

                      {/* Progress hint */}
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <span>Not earned yet</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary Stats */}
            {filteredBadges.length > 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-3">Category Summary</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{filteredBadges.length}</div>
                    <div className="text-gray-600">Total Badges</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {filteredBadges.reduce((sum, b) => sum + b.points, 0)}
                    </div>
                    <div className="text-gray-600">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(filteredBadges.reduce((sum, b) => sum + b.points, 0) / filteredBadges.length)}
                    </div>
                    <div className="text-gray-600">Avg Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {filteredBadges.filter(b => b.difficulty === "Hard" || b.difficulty === "Expert").length}
                    </div>
                    <div className="text-gray-600">Challenging</div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

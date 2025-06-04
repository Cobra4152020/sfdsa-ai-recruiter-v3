"use client";

import { useState } from "react";
import { AchievementBadge } from "./achievement-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BadgeInfo {
  type: string;
  name: string;
  description: string;
  category: "achievement" | "process" | "participation";
}

export function BadgeLegend() {
  const [category, setCategory] = useState<string>("all");

  const badges: BadgeInfo[] = [
    // Achievement Badges
    {
      type: "written",
      name: "Written Test",
      description: "Completed written test preparation",
      category: "achievement",
    },
    {
      type: "oral",
      name: "Oral Board",
      description: "Prepared for oral board interviews",
      category: "achievement",
    },
    {
      type: "physical",
      name: "Physical Test",
      description: "Completed physical test preparation",
      category: "achievement",
    },
    {
      type: "polygraph",
      name: "Polygraph",
      description: "Learned about the polygraph process",
      category: "achievement",
    },
    {
      type: "psychological",
      name: "Psychological",
      description: "Prepared for psychological evaluation",
      category: "achievement",
    },

    // Process Badges
    {
      type: "chat-participation",
      name: "Chat Participation",
      description: "Engaged with Sgt. Ken",
      category: "process",
    },
    {
      type: "first-response",
      name: "First Response",
      description: "Received first response from Sgt. Ken",
      category: "process",
    },
    {
      type: "application-started",
      name: "Application Started",
      description: "Started the application process",
      category: "process",
    },
    {
      type: "application-completed",
      name: "Application Completed",
      description: "Completed the application process",
      category: "process",
    },
    {
      type: "full",
      name: "Full Process",
      description: "Completed all preparation areas",
      category: "process",
    },

    // Participation Badges
    {
      type: "frequent-user",
      name: "Frequent User",
      description: "Regularly engages with the recruitment platform",
      category: "participation",
    },
    {
      type: "resource-downloader",
      name: "Resource Downloader",
      description: "Downloaded recruitment resources and materials",
      category: "participation",
    },
  ];

  const filteredBadges = badges.filter((badge) => {
    if (category === "all") return true;
    return badge.category === category;
  });

  return (
    <Card className="border border-[#0A3C1F]/20 dark:border-[#FFD700]/20">
      <CardHeader className="pb-2 bg-[#0A3C1F] text-white dark:bg-[#0A3C1F] dark:text-[#FFD700]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center">
            <span className="mr-2">🏅</span> Badge Legend
          </CardTitle>
          <Tabs
            defaultValue="all"
            value={category}
            onValueChange={(value: string) => setCategory(value)}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="achievement">Achievement</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="participation">Participation</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
          {filteredBadges.map((badge) => (
            <TooltipProvider key={badge.type}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center text-center p-2">
                    <AchievementBadge
                      type={badge.type}
                      size="md"
                      earned={false}
                    />
                    <h3 className="font-medium mt-2 text-sm">{badge.name}</h3>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{badge.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

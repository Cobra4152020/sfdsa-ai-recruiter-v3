"use client";

import React from "react";
import { PageWrapper } from "@/components/page-wrapper";
import { BadgeShowcase } from "@/components/badge-showcase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Trophy, Star, Shield } from "lucide-react";

export default function BadgesPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced header section */}
        <div className="text-center mb-12 mt-8">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 relative z-10">
              Badge Gallery
            </h1>
            {/* Decorative underline */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary via-[#FFD700] to-primary rounded-full"></div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-8">
            Earn badges by completing challenges, participating in events, and
            contributing to the SFDSA community. Track your progress and
            compete with other recruits.
          </p>
        </div>

        {/* Main Badge Showcase */}
        <div className="mb-12">
          <BadgeShowcase />
        </div>

        {/* Additional Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <Card className="border-primary/20">
            <CardHeader className="bg-primary text-white">
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-[#FFD700]" />
                Achievement Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                Complete specific milestones in your recruitment journey to earn these prestigious badges.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Physical Fitness Test</li>
                <li>• Written Examination</li>
                <li>• Oral Interview</li>
                <li>• Polygraph Test</li>
                <li>• Psychological Evaluation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="bg-primary text-white">
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-[#FFD700]" />
                Process Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                Track your progress through the application process with these milestone badges.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Application Started</li>
                <li>• First Response</li>
                <li>• Chat Participation</li>
                <li>• Application Completed</li>
                <li>• Full Process</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="bg-primary text-white">
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-[#FFD700]" />
                Participation Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                Engage with the community and platform to unlock these special recognition badges.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Frequent User</li>
                <li>• Resource Downloader</li>
                <li>• Hard Charger</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* How to Earn Badges */}
        <Card className="mt-12 border-primary/20">
          <CardHeader className="bg-primary text-white">
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              How to Earn Badges
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Complete Activities</h3>
                <p className="text-muted-foreground">
                  Participate in daily briefings, complete challenges, and engage with the community to earn points and unlock badges.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
                <p className="text-muted-foreground">
                  Monitor your achievements and see your progress toward earning new badges in your profile dashboard.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}

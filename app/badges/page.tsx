"use client";

import { PageWrapper } from "@/components/page-wrapper";
import { BadgeShowcase } from "@/components/badge-showcase";
import { BadgeDisplay } from "@/components/badge-display";
import BadgeCollection from "@/components/badge-collection";
import BadgeStats from "@/components/badges/badge-stats";
import { BadgeCollectionGrid } from "@/components/badges/badge-collection-grid";
import { BadgeLeaderboard } from "@/components/badges/badge-leaderboard";
import { BadgeErrorBoundary } from "@/components/badges/badge-error-boundary";
import { useUser } from "@/context/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Trophy, Star, Shield } from "lucide-react";
import { useState } from "react";

export default function BadgesPage() {
  const { currentUser } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: 'all',
    rarity: 'all', 
    status: 'all'
  });

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#0A3C1F] mb-4">
              Badge Gallery
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Earn badges by completing challenges, participating in events, and
              contributing to the SFDSA community. Track your progress and
              compete with other recruits.
            </p>
          </div>

          {/* Badge Stats */}
          <BadgeErrorBoundary>
            <div className="mb-8">
              <BadgeStats />
            </div>
          </BadgeErrorBoundary>

          <Tabs defaultValue="showcase" className="space-y-6">
            <TabsList className="grid grid-cols-4 gap-4">
              <TabsTrigger value="showcase" className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Showcase
              </TabsTrigger>
              <TabsTrigger value="collection" className="flex items-center">
                <Trophy className="h-4 w-4 mr-2" />
                My Collection
              </TabsTrigger>
              <TabsTrigger value="available" className="flex items-center">
                <Star className="h-4 w-4 mr-2" />
                Available
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Leaderboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="showcase" className="space-y-6">
              <BadgeErrorBoundary>
                <BadgeShowcase />
              </BadgeErrorBoundary>
            </TabsContent>

            <TabsContent value="collection" className="space-y-6">
              <BadgeErrorBoundary>
                {currentUser ? (
                  <BadgeCollection user={currentUser as any} />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Sign In Required</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Please sign in to view your badge collection.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </BadgeErrorBoundary>
            </TabsContent>

            <TabsContent value="available" className="space-y-6">
              <BadgeErrorBoundary>
                <BadgeDisplay />
              </BadgeErrorBoundary>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <BadgeErrorBoundary>
                <BadgeLeaderboard />
              </BadgeErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageWrapper>
  );
}

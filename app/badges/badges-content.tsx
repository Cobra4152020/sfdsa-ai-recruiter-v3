"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeCollectionGrid } from "@/components/badges/badge-collection-grid";
import { BadgeLeaderboard } from "@/components/badges/badge-leaderboard";
import { BadgeStats } from "@/components/badges/badge-stats";
import { BadgeTimeline } from "@/components/badges/badge-timeline";
import {
  BadgeFilter,
  type BadgeFilters,
} from "@/components/badges/badge-filter";
import { BadgeSearch } from "@/components/badges/badge-search";
import { useUser } from "@/context/user-context";

export function BadgesContent() {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<BadgeFilters>({
    type: "all",
    rarity: "all",
    status: "all",
    sortBy: "newest",
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Badge Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Earn badges by completing challenges, participating in events, and
            contributing to the SFDSA community. Track your progress and compete
            with other recruits.
          </p>
        </div>

        <div className="mb-8">
          <BadgeStats userId={currentUser?.id} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Your Badges</CardTitle>
                <CardDescription>
                  View and track your badge collection
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <BadgeSearch value={searchQuery} onChange={setSearchQuery} />
                <BadgeFilter
                  onFilterChange={setFilters}
                  defaultFilters={filters}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Badges</TabsTrigger>
                <TabsTrigger value="earned">Earned</TabsTrigger>
                <TabsTrigger value="progress">In Progress</TabsTrigger>
                <TabsTrigger value="locked">Locked</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <BadgeCollectionGrid
                  userId={currentUser?.id}
                  searchQuery={searchQuery}
                  filters={filters}
                  showAll
                />
              </TabsContent>

              <TabsContent value="earned">
                <BadgeCollectionGrid
                  userId={currentUser?.id}
                  searchQuery={searchQuery}
                  filters={filters}
                  status="earned"
                />
              </TabsContent>

              <TabsContent value="progress">
                <BadgeCollectionGrid
                  userId={currentUser?.id}
                  searchQuery={searchQuery}
                  filters={filters}
                  status="progress"
                />
              </TabsContent>

              <TabsContent value="locked">
                <BadgeCollectionGrid
                  userId={currentUser?.id}
                  searchQuery={searchQuery}
                  filters={filters}
                  status="locked"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Badge Leaderboard</CardTitle>
              <CardDescription>
                Top badge collectors in the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BadgeLeaderboard />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest badge achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <BadgeTimeline userId={currentUser?.id} limit={10} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

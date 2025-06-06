"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { BadgeStatus, BadgeWithProgress } from "@/types/badge";
import { AchievementBadge } from "@/components/achievement-badge";
import { Button } from "@/components/ui/button";
import { useEnhancedBadges } from "@/hooks/use-enhanced-badges";
import { BadgeFilters } from "@/components/badges/badge-filter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface BadgeCollectionGridProps {
  searchQuery?: string;
  filters?: BadgeFilters;
  status?: BadgeStatus;
}

export function BadgeCollectionGrid({
  searchQuery,
  filters,
  status,
}: BadgeCollectionGridProps) {
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(
    new Set(),
  );
  const { collections = [], isLoading, error } = useEnhancedBadges();

  const toggleCollection = (collectionId: string) => {
    const newExpanded = new Set(expandedCollections);
    if (newExpanded.has(collectionId)) {
      newExpanded.delete(collectionId);
    } else {
      newExpanded.add(collectionId);
    }
    setExpandedCollections(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading badges...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          Error loading badges. Please try again later.
        </p>
      </div>
    );
  }

  // Ensure collections is an array and has items
  if (!Array.isArray(collections) || collections.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No badges found. Check back later for new badges!
        </p>
      </div>
    );
  }

  // Filter collections based on search query and filters
  const filteredCollections = collections
    .filter((collection) => {
      // Ensure collection exists and has a valid badges array
      return (
        collection &&
        typeof collection === "object" &&
        Array.isArray(collection.badges) &&
        collection.badges.length > 0
      );
    })
    .map((collection) => ({
      ...collection,
      badges: collection.badges.filter((badge) => {
        // Ensure badge exists and has required properties
        if (!badge || typeof badge !== "object") return false;

        const matchesSearch =
          !searchQuery ||
          (badge.name &&
            badge.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (badge.description &&
            badge.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()));

        const matchesType =
          !filters?.type ||
          filters.type === "all" ||
          badge.type === filters.type;
        const matchesRarity =
          !filters?.rarity ||
          filters.rarity === "all" ||
          badge.rarity === filters.rarity;

        const badgeWithProgress = badge as BadgeWithProgress;
        const matchesStatus =
          !status ||
          (status === "earned" && badgeWithProgress.earned) ||
          (status === "progress" &&
            !badgeWithProgress.earned &&
            badgeWithProgress.progress > 0) ||
          (status === "locked" &&
            !badgeWithProgress.earned &&
            (!badgeWithProgress.progress || badgeWithProgress.progress === 0));

        return matchesSearch && matchesType && matchesRarity && matchesStatus;
      }),
    }))
    .filter((collection) => collection.badges.length > 0);

  if (filteredCollections.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No badges match your filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6")}>
      {filteredCollections.map((collection) => (
        <Collapsible
          key={collection.id}
          open={expandedCollections.has(collection.id)}
          onOpenChange={() => toggleCollection(collection.id)}
        >
          <Card>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {collection.name || "Unnamed Collection"}
                  </CardTitle>
                  <CardDescription>
                    {collection.description || "No description available"}
                  </CardDescription>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {expandedCollections.has(collection.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
              {collection.specialReward && (
                <div className="absolute top-4 right-16 flex items-center gap-2 text-yellow-500">
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Special Reward: {collection.specialReward}
                  </span>
                </div>
              )}

              <div className="mt-2 flex flex-wrap gap-2">
                <div className="text-sm text-muted-foreground">
                  {collection.badges.length}{" "}
                  {collection.badges.length === 1 ? "Badge" : "Badges"}
                </div>
                {typeof collection.progress === "number" && (
                  <div className="text-sm text-muted-foreground">
                    {Math.round(collection.progress * 100)}% Complete
                  </div>
                )}
                {collection.isComplete && (
                  <div className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
                    Completed
                  </div>
                )}
              </div>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                >
                  {collection.badges.map((badge) => {
                    if (!badge || typeof badge !== "object") return null;
                    const badgeWithProgress = badge as BadgeWithProgress;
                    return (
                      <motion.div
                        key={badge.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <AchievementBadge
                          type={badge.type}
                          earned={badgeWithProgress.earned || false}
                          size="md"
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  );
}

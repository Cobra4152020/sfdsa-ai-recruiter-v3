"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgeWithProgress } from "@/types/badge";
import { useEnhancedBadges } from "@/hooks/use-enhanced-badges";
import { AchievementBadge } from "@/components/achievement-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2 } from "lucide-react";
import { BadgeShareDialog } from "@/components/badges/badge-share-dialog";

interface BadgeGridProps {
  searchQuery: string;
  filters: {
    category: string;
    difficulty: string;
    status: string;
  };
  status?: "earned" | "progress" | "locked";
  showAll?: boolean;
}

export function BadgeGrid({
  searchQuery,
  filters,
  status,
  showAll = false,
}: BadgeGridProps) {
  const { collections, isLoading, error } = useEnhancedBadges();
  const [selectedBadge, setSelectedBadge] = useState<BadgeWithProgress | null>(
    null,
  );
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const filteredBadges = useMemo(() => {
    if (!collections || !Array.isArray(collections)) return [];

    // Flatten all badges from collections and ensure they exist
    let badges = collections
      .filter((c) => c && Array.isArray(c.badges))
      .flatMap((c) => c.badges)
      .filter(
        (badge): badge is BadgeWithProgress =>
          !!badge &&
          typeof badge === "object" &&
          typeof badge.name === "string",
      );

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      badges = badges.filter(
        (badge) =>
          badge.name.toLowerCase().includes(query) ||
          (badge.description || "").toLowerCase().includes(query),
      );
    }

    // Apply category filter
    if (filters.category !== "all") {
      badges = badges.filter((badge) => badge.type === filters.category);
    }

    // Apply difficulty filter
    if (filters.difficulty !== "all") {
      badges = badges.filter((badge) => badge.rarity === filters.difficulty);
    }

    // Apply status filter if not showing all
    if (!showAll && status) {
      badges = badges.filter((badge) => {
        switch (status) {
          case "earned":
            return badge.earned;
          case "progress":
            return !badge.earned && (badge.progress || 0) > 0;
          case "locked":
            return !badge.earned && (!badge.progress || badge.progress === 0);
          default:
            return true;
        }
      });
    }

    return badges;
  }, [collections, searchQuery, filters, status, showAll]);

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load badges. Please try again.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  const handleBadgeClick = (badge: BadgeWithProgress) => {
    setSelectedBadge(badge);
    setIsShareDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-4 shadow-sm relative"
          >
            <div className="flex justify-center">
              <AchievementBadge
                type={badge.type}
                earned={badge.earned || false}
                size="lg"
              />
              {badge.earned && (
                <button
                  onClick={() => handleBadgeClick(badge)}
                  className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="text-center">
              <h3 className="mt-2 font-medium text-sm">{badge.name}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {badge.points} points
              </p>
              {badge.progress !== undefined &&
                badge.progress > 0 &&
                !badge.earned && (
                  <p className="text-xs text-blue-500 mt-1">
                    {Math.round(badge.progress * 100)}% complete
                  </p>
                )}
            </div>
          </motion.div>
        ))}
      </div>
      <BadgeShareDialog
        badge={selectedBadge}
        isOpen={isShareDialogOpen}
        onClose={() => {
          setIsShareDialogOpen(false);
          setSelectedBadge(null);
        }}
      />
    </>
  );
}

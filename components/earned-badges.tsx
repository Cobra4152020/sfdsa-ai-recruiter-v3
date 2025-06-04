"use client";

import { useState, useEffect } from "react";
import { AchievementBadge } from "./achievement-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Trophy } from "lucide-react";
import { BadgeSharingDialog } from "./badge-sharing-dialog";
import { useUser } from "@/context/user-context";

type BadgeType =
  | "written"
  | "oral"
  | "physical"
  | "polygraph"
  | "psychological"
  | "full"
  | "chat-participation"
  | "application-started"
  | "application-completed"
  | "first-response"
  | "frequent-user"
  | "resource-downloader";

interface UserBadge {
  id: string;
  badge_type: BadgeType;
  name: string;
  description: string;
  earned_at: string;
}

export function EarnedBadges() {
  const { currentUser, isLoggedIn } = useUser();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSharingOpen, setIsSharingOpen] = useState(false);

  useEffect(() => {
    const fetchUserBadges = async () => {
      if (!currentUser?.id) {
        setBadges([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/users/${currentUser.id}/badges`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch badges");
        }

        setBadges(data.badges);
      } catch (err) {
        console.error("Error fetching user badges:", err);
        setError("Failed to load your badges. Please try again later.");

        // For demo purposes, show some sample badges
        if (process.env.NODE_ENV === "development") {
          setBadges([
            {
              id: "chat-participation-1",
              badge_type: "chat-participation",
              name: "Chat Participation",
              description: "Engaged with Sgt. Ken",
              earned_at: new Date().toISOString(),
            },
            {
              id: "first-response-1",
              badge_type: "first-response",
              name: "First Response",
              description: "Received first response from Sgt. Ken",
              earned_at: new Date().toISOString(),
            },
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBadges();
  }, [currentUser?.id]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <Card className="border border-primary/20 dark:border-accent/20">
        <CardHeader className="pb-2 bg-primary text-primary-foreground dark:bg-primary dark:text-accent">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Earned Badges
            </div>
            {badges.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground/20 dark:text-accent dark:border-accent dark:hover:bg-accent/20"
                onClick={() => setIsSharingOpen(true)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : badges.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              You haven&apos;t earned any badges yet. Start participating to
              earn your first badge!
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center text-center p-2"
                >
                  <AchievementBadge
                    type={badge.badge_type}
                    size="md"
                    earned={true}
                  />
                  <h3 className="font-medium mt-2 text-sm">{badge.name}</h3>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <BadgeSharingDialog
        isOpen={isSharingOpen}
        onClose={() => setIsSharingOpen(false)}
        badges={badges}
        userName={currentUser?.name || "Recruit"}
      />
    </>
  );
}

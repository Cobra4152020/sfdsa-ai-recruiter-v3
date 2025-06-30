"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Trophy, Medal, Award, Calendar } from "lucide-react";
import Image from "next/image";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  has_applied: boolean;
  badge_count: number;
  nft_count: number;
  created_at: string;
  bio?: string;
  badges: {
    id: string;
    name: string;
    badge_type: string;
    color: string;
    icon: string;
  }[];
  nft_awards: {
    id: string;
    name: string;
    image_url: string;
    description: string;
  }[];
  metadata?: Record<string, unknown>;
}

interface UserStats {
  totalPoints: number;
  rank: number;
  achievements: number;
  metadata?: Record<string, unknown>;
}

interface UserProfileDialogProps {
  userId: string;
  isOpen?: boolean;
  onClose?: () => void;
  currentUserId?: string;
}

export function UserProfileDialog({
  userId,
  isOpen: externalIsOpen,
  onClose,
  currentUserId,
}: UserProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync with external open state if provided
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

  // Handle dialog close
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && onClose) {
      onClose();
    }
  };

  // Fetch user profile when dialog opens
  useEffect(() => {
    if (isOpen && userId) {
      setIsLoading(true);
      setError(null);

      // Simulate API call with mock data
      setTimeout(() => {
        try {
          const mockProfile = generateMockProfile(userId, currentUserId);
          setUserProfile(mockProfile.userProfile);
          setUserStats(mockProfile.userStats);
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching profile:", err);
          setError("Failed to load user profile");
          setIsLoading(false);
        }
      }, 1000);
    }
  }, [isOpen, userId, currentUserId]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <User className="h-4 w-4" />
          View Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-200 h-16 w-16"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-[200px]"></div>
                <div className="h-4 bg-gray-200 rounded w-[150px]"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            <p>Failed to load user profile. Please try again.</p>
          </div>
        ) : (
          userProfile && (
            <div className="space-y-4">
              <div className="flex items-center">
                {userProfile.avatar && (
                  <Image
                    src={userProfile.avatar}
                    alt={`${userProfile.name}'s avatar`}
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <Trophy className="h-4 w-4 mr-1" />
                    <span>Rank #{userStats?.rank || "N/A"}</span>
                    {userProfile.has_applied && (
                      <Badge
                        variant="outline"
                        className="ml-2 bg-green-50 text-green-700 border-green-200"
                      >
                        Applied
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1 flex items-center">
                    <Trophy className="h-4 w-4 mr-1" />
                    Points
                  </div>
                  <div className="text-2xl font-bold">
                    {userStats?.totalPoints?.toLocaleString() || 0}
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1 flex items-center">
                    <Medal className="h-4 w-4 mr-1" />
                    Badges
                  </div>
                  <div className="text-2xl font-bold">
                    {userProfile.badge_count || 0}
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1 flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    NFT Awards
                  </div>
                  <div className="text-2xl font-bold">
                    {userProfile.nft_count || 0}
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined
                  </div>
                  <div className="text-sm font-medium">
                    {userProfile.created_at
                      ? new Date(userProfile.created_at).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>

              {userProfile.bio && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground">{userProfile.bio}</p>
                </div>
              )}

              <Tabs defaultValue="badges">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="badges">
                    Badges ({userProfile.badge_count || 0})
                  </TabsTrigger>
                  <TabsTrigger value="nfts">
                    NFT Awards ({userProfile.nft_count || 0})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="badges" className="mt-4">
                  {userProfile.badges && userProfile.badges.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {userProfile.badges.map((badge) => (
                        <div
                          key={badge.id}
                          className="flex flex-col items-center text-center"
                        >
                          <div
                            className={`rounded-full w-12 h-12 flex items-center justify-center mb-2 ${badge.color || "bg-blue-500"}`}
                          >
                            <Image
                              src={
                                badge.icon ||
                                "/placeholder.svg?height=32&width=32&query=badge"
                              }
                              alt={badge.name}
                              width={32}
                              height={32}
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                          <h4 className="text-sm font-medium">{badge.name}</h4>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No badges earned yet.</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="nfts" className="mt-4">
                  {userProfile.nft_awards &&
                  userProfile.nft_awards.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {userProfile.nft_awards.map((award) => (
                        <div
                          key={award.id}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="aspect-square relative">
                            <Image
                              src={
                                award.image_url ||
                                "/placeholder.svg?height=200&width=200&query=nft award"
                              }
                              alt={award.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium">{award.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {award.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No NFT awards earned yet.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}

// Helper function to generate mock profile data
function generateMockProfile(
  userId: string,
  currentUserId: string | undefined,
) {
  const isCurrentUser = userId === currentUserId;
  const userProfile: UserProfile = {
    id: userId,
    name: isCurrentUser ? "You" : `User ${userId}`,
    email: `user${userId}@example.com`,
    avatar: `/placeholder.svg?height=64&width=64&query=user-${userId}`,
    role: "Candidate",
    has_applied: Math.random() > 0.5,
    badge_count: Math.floor(Math.random() * 10),
    nft_count: Math.floor(Math.random() * 5),
    created_at: new Date(
      Date.now() - Math.random() * 10000000000,
    ).toISOString(),
    bio: "Passionate about technology and innovation. Always eager to learn and grow.",
    badges: Array.from({ length: 5 }, (_, i) => ({
      id: `badge-${i + 1}`,
      name: ["Gold Recruit", "Silver Explorer", "Bronze Participant"][i % 3],
      badge_type: ["recruitment", "engagement", "participation"][i % 3],
      color: ["#FFD700", "#C0C0C0", "#CD7F32"][i % 3],
      icon: ["trophy", "star", "medal"][i % 3],
    })),
    nft_awards: Array.from({ length: 3 }, (_, i) => ({
      id: `nft-${i + 1}`,
      name: ["Gold Recruit", "Silver Explorer", "Bronze Participant"][i % 3],
      image_url: `/placeholder.svg?height=200&width=200&query=nft award ${i + 1}`,
      description:
        "Awarded for exceptional engagement with the recruitment platform.",
    })),
  };

  const userStats: UserStats = {
    totalPoints: Math.floor(Math.random() * 1000),
    rank: Math.floor(Math.random() * 100),
    achievements: Math.floor(Math.random() * 20),
  };

  return { userProfile, userStats };
}

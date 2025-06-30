"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, CheckCircle } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatar_url: string | null;
  has_approved_photo: boolean;
}

export function ProfilePhotoLeaderboardDemo() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading leaderboard data with profile photos
    setTimeout(() => {
      setLeaderboard([
        {
          id: "1",
          name: "Sarah Johnson",
          points: 2500,
          rank: 1,
          avatar_url: "/female-law-enforcement-headshot.png", // Approved photo
          has_approved_photo: true,
        },
        {
          id: "2", 
          name: "Michael Chen",
          points: 2200,
          rank: 2,
          avatar_url: "/asian-male-officer-headshot.png", // Approved photo
          has_approved_photo: true,
        },
        {
          id: "3",
          name: "David Rodriguez", 
          points: 1800,
          rank: 3,
          avatar_url: null, // No approved photo yet
          has_approved_photo: false,
        },
        {
          id: "4",
          name: "Jennifer Wilson",
          points: 1500,
          rank: 4,
          avatar_url: "/female-law-enforcement-headshot.png", // Approved photo
          has_approved_photo: true,
        },
        {
          id: "5",
          name: "Robert Kim",
          points: 1200,
          rank: 5,
          avatar_url: null, // No approved photo yet
          has_approved_photo: false,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <Award className="h-5 w-5 text-gray-300" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Profile Photo Integration Demo
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Shows how approved profile photos appear in leaderboards
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center space-x-4 p-3 rounded-lg border transition-all ${
                  entry.rank <= 3 ? "bg-gradient-to-r from-yellow-50 to-transparent border-yellow-200" : "hover:bg-accent/10"
                }`}
              >
                {/* Rank Icon */}
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Avatar with Approval Status */}
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-primary">
                    <AvatarImage
                      src={entry.avatar_url || "/placeholder.svg"}
                      alt={entry.name}
                    />
                    <AvatarFallback>
                      {entry.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Approval Status Indicator */}
                  {entry.has_approved_photo && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{entry.name}</h3>
                    
                    {/* Photo Status Badge */}
                    {entry.has_approved_photo ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Approved Photo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        Default Avatar
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Rank #{entry.rank} • {entry.points.toLocaleString()} points
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Integration Explanation */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">How It Works:</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Users upload photos through the profile edit page</li>
            <li>• Photos are submitted for admin approval</li>
            <li>• Once approved, photos automatically appear in all leaderboards</li>
            <li>• Leaderboard APIs fetch avatar_url from user_profiles table</li>
            <li>• Fallback to default avatars if no approved photo exists</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 
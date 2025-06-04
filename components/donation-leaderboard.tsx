"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, ChevronRight, ChevronLeft, Trophy } from "lucide-react";
import Link from "next/link";

interface DonationLeaderboardProps {
  limit?: number;
  showViewAll?: boolean;
}

interface LeaderboardEntry {
  user_id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  donation_points: number;
  donation_count: number;
  last_donation_date: string;
  rank: number;
}

export function DonationLeaderboard({
  limit = 5,
  showViewAll = true,
}: DonationLeaderboardProps) {
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/donations/leaderboard?limit=${limit}&offset=${page * limit}`,
      );
      const data = await response.json();

      if (data.success) {
        setLeaderboard(data.leaderboard || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching donation leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [page, limit]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Trophy className="h-5 w-5 text-amber-700" />;
      default:
        return (
          <span className="text-sm font-medium text-gray-500">#{rank}</span>
        );
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Donation Leaderboard</CardTitle>
          <DollarSign className="h-5 w-5 text-[#0A3C1F]" />
        </div>
        <CardDescription>Top contributors making a difference</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {leaderboard.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  No donation data available yet.
                </p>
              ) : (
                leaderboard.map((entry) => (
                  <div
                    key={entry.user_id}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex-shrink-0">
                      {getRankIcon(entry.rank)}
                    </div>
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarImage
                        src={entry.avatar_url || "/placeholder.svg"}
                        alt={entry.name}
                      />
                      <AvatarFallback>{getInitials(entry.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/profile/${entry.user_id}`}
                        className="hover:underline"
                      >
                        <p className="text-sm font-medium truncate">
                          {entry.name}
                        </p>
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {entry.donation_count} donation
                        {entry.donation_count !== 1 ? "s" : ""}
                        {entry.last_donation_date &&
                          ` • Last: ${formatDate(entry.last_donation_date)}`}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {entry.donation_points.toLocaleString()} pts
                    </Badge>
                  </div>
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((p) => (p + 1 < totalPages ? p + 1 : p))
                  }
                  disabled={page + 1 >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}

            {showViewAll && (
              <div className="mt-4 text-center">
                <Link href="/donations/leaderboard">
                  <Button variant="outline" size="sm">
                    View Full Leaderboard
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

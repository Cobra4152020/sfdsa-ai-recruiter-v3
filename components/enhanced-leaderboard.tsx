"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { UserProfileCard, UserProfileDialog } from "@/components/user-profile-card"
import { useEnhancedLeaderboard } from "@/hooks/use-enhanced-leaderboard"
import { useUser } from "@/context/user-context"
import { Trophy, Medal, Award, Search, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

interface EnhancedLeaderboardProps {
  className?: string
}

export function EnhancedLeaderboard({ className }: EnhancedLeaderboardProps) {
  const { currentUser } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [showCurrentUser, setShowCurrentUser] = useState(false)
  const [highlightedUserId, setHighlightedUserId] = useState<string | null>(null)

  const {
    leaderboard,
    isLoading,
    error,
    filters,
    setTimeframe,
    setCategory,
    setLimit,
    setSearch,
    refreshLeaderboard,
    isRealTimeEnabled,
    setIsRealTimeEnabled,
  } = useEnhancedLeaderboard()

  // Handle search input with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setSearch(searchQuery)
    }, 500)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery, setSearch])

  // Highlight current user when they appear in the leaderboard
  useEffect(() => {
    if (currentUser?.id && leaderboard.some((user) => user.id === currentUser.id)) {
      setHighlightedUserId(currentUser.id)

      // Trigger confetti for top 3 positions
      const currentUserRank = leaderboard.find((user) => user.id === currentUser.id)?.rank
      if (currentUserRank && currentUserRank <= 3) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FFD700", "#0A3C1F", "#FFFFFF"],
        })
      }

      // Clear highlight after 3 seconds
      const timer = setTimeout(() => {
        setHighlightedUserId(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [leaderboard, currentUser?.id])

  // Find current user in leaderboard
  const currentUserInLeaderboard = currentUser?.id ? leaderboard.find((user) => user.id === currentUser.id) : null

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 text-[#FFD700] mr-2" />
            Leaderboard
          </CardTitle>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Switch id="real-time" checked={isRealTimeEnabled} onCheckedChange={setIsRealTimeEnabled} />
              <Label htmlFor="real-time" className="flex items-center">
                {isRealTimeEnabled ? (
                  <Wifi className="h-4 w-4 mr-1 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 mr-1 text-gray-400" />
                )}
                <span className="text-sm">Real-time</span>
              </Label>
            </div>

            <Button variant="outline" size="sm" onClick={refreshLeaderboard}>
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Tabs
              defaultValue={filters.category}
              value={filters.category}
              onValueChange={(value) => setCategory(value as any)}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
                <TabsTrigger value="participation">
                  <Trophy className="h-4 w-4 mr-1 hidden sm:inline" />
                  Points
                </TabsTrigger>
                <TabsTrigger value="badges">
                  <Medal className="h-4 w-4 mr-1 hidden sm:inline" />
                  Badges
                </TabsTrigger>
                <TabsTrigger value="nfts">
                  <Award className="h-4 w-4 mr-1 hidden sm:inline" />
                  NFTs
                </TabsTrigger>
                <TabsTrigger value="application">
                  <span className="hidden sm:inline">🚀</span>
                  <span className="ml-1">Applied</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2 sm:ml-auto">
              <Select value={filters.timeframe} onValueChange={(value) => setTimeframe(value as any)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.limit.toString()} onValueChange={(value) => setLimit(Number.parseInt(value))}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Top 5</SelectItem>
                  <SelectItem value="10">Top 10</SelectItem>
                  <SelectItem value="25">Top 25</SelectItem>
                  <SelectItem value="50">Top 50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Current user toggle */}
          {currentUser && currentUserInLeaderboard && (
            <div className="flex items-center space-x-2">
              <Switch id="show-current-user" checked={showCurrentUser} onCheckedChange={setShowCurrentUser} />
              <Label htmlFor="show-current-user">Show only my position</Label>
            </div>
          )}

          {/* Leaderboard content */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={refreshLeaderboard}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No users found for the selected filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Top 3 users with special styling */}
              {!showCurrentUser && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {leaderboard
                    .filter((user) => user.rank && user.rank <= 3)
                    .sort((a, b) => (a.rank || 999) - (b.rank || 999))
                    .map((user) => (
                      <AnimatePresence key={user.id}>
                        <motion.div
                          initial={{ scale: 0.95 }}
                          animate={{
                            scale: highlightedUserId === user.id ? [1, 1.05, 1] : 1,
                            boxShadow:
                              highlightedUserId === user.id
                                ? [
                                    "0 0 0 rgba(255, 215, 0, 0)",
                                    "0 0 20px rgba(255, 215, 0, 0.5)",
                                    "0 0 0 rgba(255, 215, 0, 0)",
                                  ]
                                : "none",
                          }}
                          transition={{ duration: 0.5 }}
                          className={`relative ${
                            user.rank === 1
                              ? "bg-gradient-to-b from-[#FFD700]/10 to-transparent border-[#FFD700]"
                              : user.rank === 2
                                ? "bg-gradient-to-b from-[#C0C0C0]/10 to-transparent border-[#C0C0C0]"
                                : "bg-gradient-to-b from-[#CD7F32]/10 to-transparent border-[#CD7F32]"
                          } border rounded-lg p-4`}
                        >
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
                            <div
                              className={`flex items-center justify-center rounded-full w-8 h-8 ${
                                user.rank === 1
                                  ? "bg-[#FFD700] text-black"
                                  : user.rank === 2
                                    ? "bg-[#C0C0C0] text-black"
                                    : "bg-[#CD7F32] text-white"
                              }`}
                            >
                              {user.rank}
                            </div>
                          </div>
                          <UserProfileCard userId={user.id} className="border-0 shadow-none" />
                        </motion.div>
                      </AnimatePresence>
                    ))}
                </div>
              )}

              {/* Rest of the leaderboard */}
              <div className="space-y-3">
                {(showCurrentUser && currentUserInLeaderboard
                  ? [currentUserInLeaderboard]
                  : leaderboard.filter((user) => !showCurrentUser || (user.rank && user.rank > 3))
                ).map((user) => (
                  <AnimatePresence key={user.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        boxShadow:
                          highlightedUserId === user.id
                            ? [
                                "0 0 0 rgba(255, 215, 0, 0)",
                                "0 0 20px rgba(255, 215, 0, 0.5)",
                                "0 0 0 rgba(255, 215, 0, 0)",
                              ]
                            : "none",
                      }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center p-3 rounded-lg border ${
                        user.is_current_user
                          ? "bg-[#0A3C1F]/5 border-[#0A3C1F]"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-center rounded-full w-8 h-8 bg-gray-100 dark:bg-gray-700 mr-3">
                        {user.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <h3 className="text-base font-medium truncate">{user.name}</h3>
                          {user.is_current_user && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-[#0A3C1F]/10 text-[#0A3C1F] border-[#0A3C1F]/20"
                            >
                              You
                            </Badge>
                          )}
                          {user.has_applied && (
                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                              Applied
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="flex items-center mr-3">
                            <Trophy className="h-3 w-3 mr-1 text-[#FFD700]" />
                            {user.participation_count.toLocaleString()} pts
                          </span>
                          <span className="flex items-center mr-3">
                            <Medal className="h-3 w-3 mr-1 text-[#C0C0C0]" />
                            {user.badge_count} badges
                          </span>
                          <span className="flex items-center">
                            <Award className="h-3 w-3 mr-1 text-[#CD7F32]" />
                            {user.nft_count} NFTs
                          </span>
                        </div>
                      </div>
                      <UserProfileDialog userId={user.id} />
                    </motion.div>
                  </AnimatePresence>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

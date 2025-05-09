"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Trophy,
  Medal,
  Award,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Heart,
  Share2,
  Eye,
  Star,
  TrendingUp,
} from "lucide-react"
import { AuthForm } from "@/components/auth-form"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useUser } from "@/context/user-context"
import { useToast } from "@/components/ui/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import confetti from "canvas-confetti"

interface LeaderboardUser {
  id: string
  name: string
  avatar_url?: string
  participation_count: number
  badge_count: number
  nft_count: number
  has_applied: boolean
  rank?: number
  is_current_user?: boolean
  likes?: number
  shares?: number
  liked_by_user?: boolean
  shared_by_user?: boolean
  progress?: {
    total: number
    current: number
    label: string
  }
  trending?: boolean
  spotlight?: boolean
  referrals?: number
}

interface AdvancedLeaderboardProps {
  currentUserId?: string
  useMockData?: boolean
  className?: string
}

export function AdvancedLeaderboard({ currentUserId, useMockData = false, className }: AdvancedLeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<string>("participation")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([])
  const [spotlightUser, setSpotlightUser] = useState<LeaderboardUser | null>(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [timeframe, setTimeframe] = useState<string>("all-time")
  const [offset, setOffset] = useState(0)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ type: "like" | "share"; userId: string } | null>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [shareForUnlock, setShareForUnlock] = useState<{ badge: string; description: string } | null>(null)
  const limit = 10

  const { isLoggedIn } = useUser()
  const { toast } = useToast()
  const spotlightRef = useRef<HTMLDivElement>(null)

  // Define avatar mapping for consistent images
  const avatarMapping: Record<number, string> = {
    0: "/male-law-enforcement-headshot.png",
    1: "/female-law-enforcement-headshot.png",
    2: "/asian-male-officer-headshot.png",
    3: "/female-law-enforcement-headshot.png",
    4: "/male-law-enforcement-headshot.png",
  }

  // Generate mock data
  const generateMockData = () => {
    const names = [
      "John Smith",
      "Maria Garcia",
      "James Johnson",
      "David Williams",
      "Sarah Brown",
      "Michael Jones",
      "Jessica Miller",
      "Robert Davis",
      "Jennifer Wilson",
      "Thomas Moore",
      "Lisa Taylor",
      "Daniel Anderson",
      "Patricia Thomas",
      "Christopher Jackson",
      "Margaret White",
    ]

    const mockData = Array.from({ length: Math.min(limit, names.length) }, (_, i) => {
      const isCurrentUser = currentUserId && i === 2 // Make the 3rd user the current user if currentUserId is provided
      const randomLikes = Math.floor(Math.random() * 50) + 5
      const randomShares = Math.floor(Math.random() * 20) + 2
      const randomReferrals = Math.floor(Math.random() * 10)
      const randomProgress = {
        total: 100,
        current: Math.floor(Math.random() * 100) + 1,
        label: ["Next Rank", "Next Badge", "Level Up"][Math.floor(Math.random() * 3)],
      }
      const isTrending = Math.random() > 0.8
      const isSpotlight = i === 0 // First user is spotlight

      // Use consistent avatar images
      const avatarUrl = avatarMapping[i % 5]

      return {
        id: `user-${i + 1}`,
        name: names[i],
        participation_count: Math.floor(Math.random() * 1000) + 100,
        badge_count: Math.floor(Math.random() * 5),
        nft_count: Math.floor(Math.random() * 3),
        has_applied: Math.random() > 0.7,
        avatar_url: avatarUrl,
        is_current_user: isCurrentUser,
        rank: i + 1 + offset,
        likes: randomLikes,
        shares: randomShares,
        liked_by_user: Math.random() > 0.7,
        shared_by_user: Math.random() > 0.8,
        progress: randomProgress,
        trending: isTrending,
        spotlight: isSpotlight,
        referrals: randomReferrals,
      }
    })

    return mockData
  }

  // Set the spotlight user
  useEffect(() => {
    if (leaderboardData.length > 0) {
      const spotlight = leaderboardData.find((user) => user.spotlight) || leaderboardData[0]
      setSpotlightUser(spotlight)
    }
  }, [leaderboardData])

  // Animate spotlight when it changes
  useEffect(() => {
    if (spotlightUser && spotlightRef.current) {
      // Add a subtle pulse animation
      spotlightRef.current.animate(
        [
          { transform: "scale(1)", boxShadow: "0 0 0 rgba(10, 60, 31, 0)" },
          { transform: "scale(1.02)", boxShadow: "0 0 10px rgba(10, 60, 31, 0.2)" },
          { transform: "scale(1)", boxShadow: "0 0 0 rgba(10, 60, 31, 0)" },
        ],
        {
          duration: 2000,
          iterations: 1,
        },
      )
    }
  }, [spotlightUser])

  // Fetch data or use mock data
  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (useMockData) {
        // Use mock data directly
        const mockData = generateMockData()
        setLeaderboardData(mockData)
        setTotalUsers(50) // Simulate 50 total users
        setIsLoading(false)
        return
      }

      // Build query parameters for real API call
      const params = new URLSearchParams({
        timeframe,
        category: activeTab,
        limit: limit.toString(),
        offset: offset.toString(),
        search: searchQuery,
      })

      if (currentUserId) {
        params.append("currentUserId", currentUserId)
      }

      // Add cache busting parameter
      const cacheBuster = `_cb=${Date.now()}`
      const url = `/api/leaderboard?${params.toString()}&${cacheBuster}`

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Invalid content type: ${contentType}`)
      }

      const result = await response.json()

      if (!result || typeof result !== "object") {
        throw new Error("Invalid response format")
      }

      const data = result.leaderboard?.users || result.leaderboard || result.users || []
      const total = result.leaderboard?.total || result.total || data.length || 0

      if (Array.isArray(data) && data.length > 0) {
        // Enhance the data with mock social stats and consistent avatars
        const enhancedData = data.map((user, index) => ({
          ...user,
          likes: Math.floor(Math.random() * 50) + 5,
          shares: Math.floor(Math.random() * 20) + 2,
          liked_by_user: Math.random() > 0.7,
          shared_by_user: Math.random() > 0.8,
          progress: {
            total: 100,
            current: Math.floor(Math.random() * 100) + 1,
            label: ["Next Rank", "Next Badge", "Level Up"][Math.floor(Math.random() * 3)],
          },
          trending: index === 0 || index === 2, // First and third users are trending
          spotlight: index === 0, // First user is spotlight
          referrals: Math.floor(Math.random() * 10),
          avatar_url: avatarMapping[index % 5], // Use consistent avatar images
        }))

        setLeaderboardData(enhancedData)
        setTotalUsers(total)
      } else {
        // Fall back to mock data if no results
        const mockData = generateMockData()
        setLeaderboardData(mockData)
        setTotalUsers(50)
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err)
      setError(err instanceof Error ? err : new Error(String(err)))

      // Fall back to mock data on error
      const mockData = generateMockData()
      setLeaderboardData(mockData)
      setTotalUsers(50)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data on initial load and when filters change
  useEffect(() => {
    fetchData()
  }, [activeTab, timeframe, offset, searchQuery, currentUserId, useMockData])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setOffset(0) // Reset pagination when changing tabs
  }

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value)
    setOffset(0) // Reset pagination when changing timeframe
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setOffset(0) // Reset pagination when searching
    fetchData()
  }

  const handlePrevPage = () => {
    if (offset - limit >= 0) {
      setOffset(offset - limit)
    }
  }

  const handleNextPage = () => {
    if (offset + limit < totalUsers) {
      setOffset(offset + limit)
    }
  }

  const handleLike = (userId: string) => {
    if (!isLoggedIn) {
      setPendingAction({ type: "like", userId })
      setShowAuthDialog(true)
      return
    }

    // Update the liked status
    setLeaderboardData((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          const isNowLiked = !user.liked_by_user

          // Show confetti for first like
          if (isNowLiked) {
            confetti({
              particleCount: 30,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#FFD700", "#0A3C1F"],
            })
          }

          return {
            ...user,
            likes: isNowLiked ? (user.likes || 0) + 1 : Math.max(0, (user.likes || 0) - 1),
            liked_by_user: isNowLiked,
          }
        }
        return user
      }),
    )

    toast({
      title: "Thanks for your support!",
      description: "Your like has been recorded.",
      duration: 3000,
    })
  }

  const handleShare = (userId: string) => {
    if (!isLoggedIn) {
      setPendingAction({ type: "share", userId })
      setShowAuthDialog(true)
      return
    }

    // Show share dialog
    setShowShareDialog(true)

    // Update the shared status after a delay (simulating a share)
    setTimeout(() => {
      setLeaderboardData((prev) =>
        prev.map((user) => {
          if (user.id === userId && !user.shared_by_user) {
            return {
              ...user,
              shares: (user.shares || 0) + 1,
              shared_by_user: true,
            }
          }
          return user
        }),
      )

      // 25% chance to trigger a "share to unlock" opportunity
      if (Math.random() > 0.75) {
        const badges = [
          { badge: "Social Advocate", description: "Share content to earn this exclusive badge!" },
          { badge: "Community Builder", description: "Help grow our community by sharing!" },
          { badge: "Recruitment Champion", description: "Share to earn recruitment points and this special badge!" },
        ]
        setShareForUnlock(badges[Math.floor(Math.random() * badges.length)])
      }

      toast({
        title: "Content shared!",
        description: "Thanks for spreading the word about our recruitment program.",
        duration: 3000,
      })
    }, 1000)
  }

  const handleAuthSuccess = () => {
    setShowAuthDialog(false)

    // Process the pending action
    if (pendingAction) {
      if (pendingAction.type === "like") {
        handleLike(pendingAction.userId)
      } else if (pendingAction.type === "share") {
        handleShare(pendingAction.userId)
      }
      setPendingAction(null)
    }
  }

  const handleReferRecruit = () => {
    if (!isLoggedIn) {
      setShowAuthDialog(true)
      return
    }

    // Show share dialog
    setShowShareDialog(true)

    toast({
      title: "Refer a Recruiter",
      description: "Share this link with potential recruits to earn referral bonuses!",
      duration: 5000,
    })
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-700" />
    return <span className="text-gray-500 font-medium">{rank}</span>
  }

  // Get profile image based on user ID
  const getProfileImage = (userId: number) => {
    // Map user IDs to specific profile images
    const imageMap: Record<number, string> = {
      1: "/male-law-enforcement-headshot.png",
      2: "/female-law-enforcement-headshot.png",
      3: "/asian-male-officer-headshot.png",
      4: "/san-francisco-deputy-sheriff.png",
    }

    // Use the mapped image or fall back to a default based on user ID modulo
    return imageMap[userId] || `/placeholder.svg?height=40&width=40&query=avatar ${userId}`
  }

  // Filter users based on active tab - removed dependency on topUsers
  const getFilteredUsers = () => {
    // We're now using leaderboardData directly instead of topUsers
    switch (activeTab) {
      case "badges":
        return [...leaderboardData].sort((a, b) => (b.badge_count || 0) - (a.badge_count || 0)).slice(0, 10)
      case "nfts":
        return [...leaderboardData].sort((a, b) => (b.nft_count || 0) - (a.nft_count || 0)).slice(0, 10)
      case "application":
        return [...leaderboardData].filter((user) => user.has_applied).slice(0, 10)
      case "participation":
      default:
        return leaderboardData.slice(0, 10)
    }
  }

  const filteredUsers = getFilteredUsers()

  return (
    <>
      <Card className={`w-full shadow-md ${className}`}>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-[#0A3C1F]">Leaderboard</h2>

              <div className="flex items-center gap-2">
                <Select value={timeframe} onValueChange={handleTimeframeChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="all-time">All Time</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchData}
                  title="Refresh leaderboard"
                  className="text-[#0A3C1F]"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Recruiter Spotlight */}
            {spotlightUser && (
              <div
                ref={spotlightRef}
                className="bg-gradient-to-r from-[#0A3C1F]/5 to-transparent border border-[#0A3C1F]/20 rounded-lg p-4 mb-4"
              >
                <div className="flex items-center mb-3">
                  <Star className="h-5 w-5 text-[#FFD700] mr-2" />
                  <h3 className="font-semibold text-lg text-[#0A3C1F]">Recruiter Spotlight</h3>
                </div>
                <div className="flex items-center">
                  <Avatar className="h-16 w-16 mr-4 border-2 border-[#FFD700]">
                    <AvatarImage
                      src={spotlightUser.avatar_url || "/placeholder.svg?height=64&width=64&query=avatar"}
                      alt={spotlightUser.name}
                    />
                    <AvatarFallback>{spotlightUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-bold text-lg">{spotlightUser.name}</span>
                      {spotlightUser.trending && (
                        <Badge className="ml-2 bg-[#0A3C1F] text-white">
                          <TrendingUp className="h-3 w-3 mr-1" /> Trending
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-1 text-sm">
                      <span className="flex items-center mr-3">
                        <Trophy className="h-4 w-4 text-[#FFD700] mr-1" />
                        {spotlightUser.participation_count} points
                      </span>
                      <span className="flex items-center mr-3">
                        <Medal className="h-4 w-4 text-gray-400 mr-1" />
                        {spotlightUser.badge_count} badges
                      </span>
                      <span className="flex items-center mr-3">
                        <Award className="h-4 w-4 text-amber-700 mr-1" />
                        {spotlightUser.nft_count} NFTs
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 text-blue-500 mr-1" />
                        {spotlightUser.referrals} referrals
                      </span>
                    </div>

                    <div className="mt-2">
                      <div className="flex justify-between mb-1 text-xs">
                        <span>
                          {spotlightUser.progress?.label}: {spotlightUser.progress?.current}/
                          {spotlightUser.progress?.total}
                        </span>
                        <span>
                          {Math.floor(
                            ((spotlightUser.progress?.current || 0) / (spotlightUser.progress?.total || 1)) * 100,
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={((spotlightUser.progress?.current || 0) / (spotlightUser.progress?.total || 1)) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 ml-4">
                    <Button
                      size="sm"
                      variant={spotlightUser.liked_by_user ? "default" : "outline"}
                      className={
                        spotlightUser.liked_by_user ? "bg-[#0A3C1F] text-white" : "border-[#0A3C1F] text-[#0A3C1F]"
                      }
                      onClick={() => handleLike(spotlightUser.id)}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${spotlightUser.liked_by_user ? "fill-white" : ""}`} />
                      <span>{spotlightUser.likes}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant={spotlightUser.shared_by_user ? "default" : "outline"}
                      className={
                        spotlightUser.shared_by_user ? "bg-[#0A3C1F] text-white" : "border-[#0A3C1F] text-[#0A3C1F]"
                      }
                      onClick={() => handleShare(spotlightUser.id)}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      <span>{spotlightUser.shares}</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar and Refer Recruiter Button */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm" className="bg-[#0A3C1F] text-white hover:bg-[#0A3C1F]/90">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>

              <Button onClick={handleReferRecruit} className="bg-[#FFD700] text-[#0A3C1F] hover:bg-[#FFD700]/90">
                <Eye className="h-4 w-4 mr-2" />
                Refer a Recruit
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="participation">Points</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="nfts">NFTs</TabsTrigger>
                <TabsTrigger value="application">Applied</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                {isLoading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 py-3 border-b">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                    </div>
                  ))
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    <p>Error loading leaderboard data.</p>
                    <Button variant="outline" onClick={fetchData} className="mt-2">
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboardData.map((user, index) => (
                      <AnimatePresence key={user.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`flex flex-col p-3 rounded-lg transition-all ${
                            user.is_current_user
                              ? "bg-[#0A3C1F]/5 border border-[#0A3C1F]/20"
                              : "border hover:border-[#0A3C1F]/20 hover:bg-[#0A3C1F]/5"
                          } ${index < 3 ? "border-[#FFD700]/30" : "border-gray-200"}`}
                        >
                          <div className="flex items-center">
                            <div className="flex items-center justify-center w-8 mr-3">
                              {getRankIcon(user.rank || index + 1 + offset)}
                            </div>

                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage
                                src={user.avatar_url || "/placeholder.svg?height=40&width=40&query=avatar"}
                                alt={user.name}
                              />
                              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className="font-medium">{user.name}</span>
                                {user.is_current_user && (
                                  <Badge variant="outline" className="ml-2 bg-[#0A3C1F]/10 text-[#0A3C1F]">
                                    You
                                  </Badge>
                                )}
                                {user.trending && (
                                  <Badge variant="outline" className="ml-2 bg-[#FFD700]/10 text-[#0A3C1F]">
                                    <TrendingUp className="h-3 w-3 mr-1" /> Trending
                                  </Badge>
                                )}
                                {user.has_applied && (
                                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                                    Applied
                                  </Badge>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-1 mt-1 text-xs text-gray-500">
                                <span className="flex items-center mr-2">
                                  <Trophy className="h-3 w-3 text-[#FFD700] mr-1" />
                                  {user.participation_count} pts
                                </span>
                                <span className="flex items-center mr-2">
                                  <Medal className="h-3 w-3 text-gray-400 mr-1" />
                                  {user.badge_count} badges
                                </span>
                                <span className="flex items-center mr-2">
                                  <Award className="h-3 w-3 text-amber-700 mr-1" />
                                  {user.nft_count} NFTs
                                </span>
                                <span className="flex items-center">
                                  <Eye className="h-3 w-3 text-blue-500 mr-1" />
                                  {user.referrals} referrals
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={user.liked_by_user ? "default" : "outline"}
                                className={`${user.liked_by_user ? "bg-[#0A3C1F] text-white" : "border-[#0A3C1F] text-[#0A3C1F]"} transition-all`}
                                onClick={() => handleLike(user.id)}
                              >
                                <Heart className={`h-4 w-4 mr-1 ${user.liked_by_user ? "fill-white" : ""}`} />
                                <span>{user.likes}</span>
                              </Button>
                              <Button
                                size="sm"
                                variant={user.shared_by_user ? "default" : "outline"}
                                className={`${user.shared_by_user ? "bg-[#0A3C1F] text-white" : "border-[#0A3C1F] text-[#0A3C1F]"} transition-all`}
                                onClick={() => handleShare(user.id)}
                              >
                                <Share2 className="h-4 w-4 mr-1" />
                                <span>{user.shares}</span>
                              </Button>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-2 px-2">
                            <div className="flex justify-between mb-1 text-xs">
                              <span>
                                {user.progress?.label}: {user.progress?.current}/{user.progress?.total}
                              </span>
                              <span>
                                {Math.floor(((user.progress?.current || 0) / (user.progress?.total || 1)) * 100)}%
                              </span>
                            </div>
                            <Progress
                              value={((user.progress?.current || 0) / (user.progress?.total || 1)) * 100}
                              className="h-2"
                            />
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    {!isLoading && !error && (
                      <>
                        Showing {offset + 1}-{Math.min(offset + leaderboardData.length, totalUsers)} of {totalUsers}
                      </>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={offset === 0 || isLoading}>
                      <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={offset + limit >= totalUsers || isLoading}
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Top Recruiters Section */}
      <Card className={`w-full shadow-md mt-6 ${className}`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#0A3C1F]">Top Referrers</h2>
            <Button variant="link" className="text-[#0A3C1F]">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center p-4 border rounded-lg">
                    <Skeleton className="h-10 w-10 rounded-full mr-3" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-[120px] mb-2" />
                      <Skeleton className="h-3 w-[80px]" />
                    </div>
                  </div>
                ))
              : leaderboardData.slice(0, 3).map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center p-4 border rounded-lg hover:border-[#0A3C1F]/20 hover:bg-[#0A3C1F]/5 transition-all"
                  >
                    <div className="mr-3 text-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          index === 0
                            ? "bg-[#FFD700]/20 text-[#FFD700]"
                            : index === 1
                              ? "bg-gray-200 text-gray-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </div>

                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage
                        src={user.avatar_url || "/placeholder.svg?height=40&width=40&query=avatar"}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 text-blue-500 mr-1" />
                          {user.referrals} recruits
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="bg-[#0A3C1F] text-white hover:bg-[#0A3C1F]/90"
                      onClick={() => handleShare(user.id)}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                ))}
          </div>
        </CardContent>
      </Card>

      {/* Login Modal */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>
            {pendingAction?.type === "like"
              ? "Sign in to like this recruiter's profile."
              : pendingAction?.type === "share"
                ? "Sign in to share this recruiter's profile."
                : "Sign in to access this feature."}
          </DialogDescription>
          <AuthForm onSuccess={handleAuthSuccess} />
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Share this profile</DialogTitle>
          <DialogDescription>
            {shareForUnlock ? (
              <div className="bg-[#FFD700]/10 border border-[#FFD700] rounded-lg p-4 my-4">
                <h4 className="font-bold text-[#0A3C1F] flex items-center">
                  <Trophy className="h-4 w-4 text-[#FFD700] mr-2" />
                  Share to Unlock: {shareForUnlock.badge}
                </h4>
                <p className="mt-2 text-sm">{shareForUnlock.description}</p>
              </div>
            ) : (
              <p>Choose how you want to share this profile:</p>
            )}
          </DialogDescription>

          <div className="grid grid-cols-2 gap-4 my-4">
            <Button className="bg-[#1877F2] hover:bg-[#1877F2]/90" onClick={() => setShowShareDialog(false)}>
              Facebook
            </Button>
            <Button className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90" onClick={() => setShowShareDialog(false)}>
              Twitter
            </Button>
            <Button className="bg-[#0A66C2] hover:bg-[#0A66C2]/90" onClick={() => setShowShareDialog(false)}>
              LinkedIn
            </Button>
            <Button className="bg-[#25D366] hover:bg-[#25D366]/90" onClick={() => setShowShareDialog(false)}>
              WhatsApp
            </Button>
          </div>

          <div className="relative mt-2">
            <Input value={`https://sfdsa-recruit.com/profile/${pendingAction?.userId || "share"}`} readOnly />
            <Button
              className="absolute right-1 top-1 h-7"
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(`https://sfdsa-recruit.com/profile/${pendingAction?.userId || "share"}`)
                toast({
                  title: "Link copied!",
                  description: "Share link copied to clipboard",
                  duration: 3000,
                })
              }}
            >
              Copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

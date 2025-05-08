"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Award, Search, Filter, Users, ChevronDown, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserProfileDialog } from "@/components/user-profile-dialog"
import { useLeaderboardData } from "@/hooks/use-leaderboard-data"
import { useToast } from "@/components/ui/use-toast"

interface EnhancementTrackerProps {
  currentUserId?: string
  showLoginPrompt?: boolean
  onLoginClick?: () => void
}

export function EnhancementTracker({ currentUserId, showLoginPrompt = false, onLoginClick }: EnhancementTrackerProps) {
  const [timeframe, setTimeframe] = useState("all-time")
  const [category, setCategory] = useState("participation")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { toast } = useToast()

  // Set up debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch leaderboard data
  const { data, isLoading, error, refetch, startRealTimeUpdates } = useLeaderboardData({
    timeframe,
    category,
    limit: 10,
    search: debouncedSearch,
    currentUserId,
  })

  // Start real-time updates when component mounts
  useEffect(() => {
    startRealTimeUpdates()
  }, [])

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load leaderboard data. Please try again later.",
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId)
    setIsProfileOpen(true)
  }

  const handleProfileClose = () => {
    setIsProfileOpen(false)
    setSelectedUserId(null)
  }

  const timeframeOptions = [
    { value: "daily", label: "Today" },
    { value: "weekly", label: "This Week" },
    { value: "monthly", label: "This Month" },
    { value: "all-time", label: "All Time" },
  ]

  const categoryOptions = [
    { value: "participation", label: "Participation" },
    { value: "badges", label: "Badges Earned" },
    { value: "nfts", label: "NFT Awards" },
    { value: "application", label: "Applicants" },
  ]

  const renderLeaderboardItem = (user, index) => {
    const isCurrentUser = user.is_current_user || user.id === currentUserId
    return (
      <div
        key={user.id}
        className={`flex items-center p-3 rounded-lg transition-colors ${
          index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : ""
        } ${isCurrentUser ? "bg-green-50 dark:bg-green-900/20" : ""} hover:bg-gray-100 dark:hover:bg-gray-800`}
        onClick={() => handleUserClick(user.id)}
      >
        <div className="flex-shrink-0 w-8 text-center font-semibold">{user.rank || index + 1}</div>
        <div className="flex-shrink-0 ml-2">
          <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
            <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <div className="ml-4 flex-grow">
          <div className="flex items-center">
            <span className="font-medium">{user.name}</span>
            {isCurrentUser && (
              <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                You
              </Badge>
            )}
            {user.has_applied && (
              <Badge className="ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200">Applicant</Badge>
            )}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {category === "participation" && `${user.participation_count || 0} points`}
            {category === "badges" && `${user.badge_count || 0} badges earned`}
            {category === "nfts" && `${user.nft_count || 0} NFT awards`}
            {category === "application" && `${user.participation_count || 0} points`}
          </div>
        </div>
        <div className="flex-shrink-0 flex space-x-1">
          {category === "badges" && user.badge_count > 0 && <Medal className="h-5 w-5 text-yellow-500" />}
          {category === "nfts" && user.nft_count > 0 && <Award className="h-5 w-5 text-purple-500" />}
          {user.has_applied && <Users className="h-5 w-5 text-blue-500" />}
        </div>
      </div>
    )
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl flex items-center">
            <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
            Top Recruits
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search recruits..."
                className="pl-8 w-full sm:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4 mr-1" />
                    {timeframeOptions.find((o) => o.value === timeframe)?.label}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={timeframe} onValueChange={setTimeframe}>
                    {timeframeOptions.map((option) => (
                      <DropdownMenuRadioItem key={option.value} value={option.value}>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 mr-1" />
                    {categoryOptions.find((o) => o.value === category)?.label}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
                    {categoryOptions.map((option) => (
                      <DropdownMenuRadioItem key={option.value} value={option.value}>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showLoginPrompt ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Join the Leaderboard</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
              Sign up or log in to track your progress, earn badges, and compete with other recruits.
            </p>
            <Button onClick={onLoginClick}>Sign Up Now</Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center p-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full ml-2" />
                <div className="ml-4 space-y-2 flex-grow">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.map((user, index) => renderLeaderboardItem(user, index))}
          </div>
        ) : (
          <div className="text-center py-8">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery ? "No recruits match your search criteria." : "There are no recruits in this category yet."}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* User profile dialog */}
        {selectedUserId && (
          <UserProfileDialog
            userId={selectedUserId}
            isOpen={isProfileOpen}
            onClose={handleProfileClose}
            currentUserId={currentUserId}
          />
        )}
      </CardContent>
    </Card>
  )
}

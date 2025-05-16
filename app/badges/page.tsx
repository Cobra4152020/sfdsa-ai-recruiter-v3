"use client"

import { useState, useEffect } from "react"
import { useBadgeGallery } from "@/hooks/use-badge-gallery"
import { BadgeDetailCard } from "@/components/badge-detail-card"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { useUser } from "@/context/user-context"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Award, Filter, BadgeCheck } from "lucide-react"

export default function BadgesGalleryPage() {
  const [mounted, setMounted] = useState(false)
  const { currentUser } = useUser()
  const {
    badges,
    userProgress,
    isLoading,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    handleShare,
  } = useBadgeGallery()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Calculate stats
  const totalBadges = badges.length
  const earnedBadges = Object.values(userProgress).filter((p) => p.earned).length
  const inProgressBadges = Object.values(userProgress).filter((p) => p.progress > 0 && !p.earned).length

  return (
    <>
      <ImprovedHeader showOptInForm={() => {}} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0A3C1F] mb-2">Badge Gallery</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore all available badges and their requirements. Share your progress to earn badges and climb the
            leaderboard.
          </p>
        </div>

        {currentUser && (
          <div className="bg-gradient-to-r from-[#0A3C1F]/10 to-[#0A3C1F]/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#0A3C1F] mb-4 flex items-center">
              <BadgeCheck className="h-6 w-6 mr-2" />
              Your Badge Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-[#0A3C1F]/20">
                <div className="text-3xl font-bold text-[#0A3C1F]">{earnedBadges}</div>
                <div className="text-sm text-gray-600">Badges Earned</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-[#0A3C1F]/20">
                <div className="text-3xl font-bold text-[#0A3C1F]">{inProgressBadges}</div>
                <div className="text-sm text-gray-600">Badges In Progress</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-[#0A3C1F]/20">
                <div className="text-3xl font-bold text-[#0A3C1F]">{totalBadges - earnedBadges - inProgressBadges}</div>
                <div className="text-sm text-gray-600">Badges to Discover</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <Tabs defaultValue="all" value={activeCategory} onValueChange={(value) => setActiveCategory(value as any)}>
            <TabsList>
              <TabsTrigger value="all">All Badges</TabsTrigger>
              <TabsTrigger value="application">Application</TabsTrigger>
              <TabsTrigger value="participation">Participation</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search badges..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={sortOption} onValueChange={(value) => setSortOption(value as any)}>
              <SelectTrigger className="w-full sm:w-40">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">By Category</SelectItem>
                <SelectItem value="name">By Name</SelectItem>
                <SelectItem value="progress">By Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 h-96">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : badges.length === 0 ? (
          <div className="text-center py-12">
            <Award className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Badges Found</h3>
            <p className="text-gray-500">There are no badges available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {badges.map((badge) => (
              <BadgeDetailCard
                key={badge.id}
                badge={badge}
                earned={userProgress[badge.id]?.earned || false}
                progress={userProgress[badge.id]?.progress || 0}
                currentUser={currentUser}
                onShare={() => handleShare(badge.id)}
              />
            ))}
          </div>
        )}
      </main>

      <ImprovedFooter />
    </>
  )
}

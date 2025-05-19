"use client"

import { useState, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BadgeCollectionGrid } from "@/components/badges/badge-collection-grid"
import { BadgeLeaderboard } from "@/components/badges/badge-leaderboard"
import { BadgeStats } from "@/components/badges/badge-stats"
import { BadgeTimeline } from "@/components/badges/badge-timeline"
import { BadgeFilter, type BadgeFilters } from "@/components/badges/badge-filter"
import { BadgeSearch } from "@/components/badges/badge-search"
import { useUser } from "@/context/user-context"
import { BadgesContent } from "./badges-content"

export default function BadgesPage() {
  const { currentUser } = useUser()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<BadgeFilters>({
    type: 'all',
    rarity: 'all',
    status: 'all',
    sortBy: 'newest'
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newFilters: BadgeFilters) => {
    setFilters(newFilters)
  }

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
              <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mx-auto" />
            </div>
            <Card>
              <div className="p-6">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      }
    >
      <BadgesContent />
    </Suspense>
  )
}

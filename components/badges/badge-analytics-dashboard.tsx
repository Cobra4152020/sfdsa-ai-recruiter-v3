"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BadgeWithProgress, BadgeType } from '@/types/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, BarChart, PieChart } from '@/components/ui/charts'

interface BadgeAnalyticsDashboardProps {
  badges: BadgeWithProgress[]
  userId?: string
  timeRange?: 'week' | 'month' | 'year' | 'all'
}

export function BadgeAnalyticsDashboard({
  badges,
  userId,
  timeRange = 'month'
}: BadgeAnalyticsDashboardProps) {
  const [selectedTab, setSelectedTab] = useState('overview')

  // Calculate analytics
  const totalBadges = badges.length
  const earnedBadges = badges.filter(b => b.earned).length
  const inProgressBadges = badges.filter(b => !b.earned && b.progress > 0).length
  const completionRate = (earnedBadges / totalBadges) * 100

  // Group badges by type
  const badgesByType = badges.reduce((acc, badge) => {
    acc[badge.type] = (acc[badge.type] || 0) + 1
    return acc
  }, {} as Record<BadgeType, number>)

  // Calculate progress over time
  const progressHistory = badges.flatMap(badge => 
    badge.progressDetails?.history.map(h => ({
      ...h,
      badgeId: badge.id,
      badgeName: badge.name
    })) || []
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalBadges}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Earned Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{earnedBadges}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{inProgressBadges}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {completionRate.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Badges by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={Object.entries(badgesByType).map(([type, count]) => ({
                    name: type,
                    value: count
                  }))}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={progressHistory.map(h => ({
                  date: new Date(h.timestamp).toLocaleDateString(),
                  progress: h.value,
                  badge: h.badgeName
                }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {badges
                  .filter(b => b.earned)
                  .map(badge => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{badge.name}</h3>
                          <p className="text-sm text-gray-500">
                            Earned on {new Date(badge.progressDetails.lastUpdated).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-green-600">
                          {badge.points} points
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 